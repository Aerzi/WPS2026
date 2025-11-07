package main

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/volcengine/volcengine-go-sdk/service/arkruntime"
	"github.com/volcengine/volcengine-go-sdk/service/arkruntime/model"
)

// OpenAlex API 响应结构
type OpenAlexResponse struct {
	Meta    OpenAlexMeta   `json:"meta"`
	Results []OpenAlexWork `json:"results"`
}

type OpenAlexMeta struct {
	Count   int `json:"count"`
	Page    int `json:"page"`
	PerPage int `json:"per_page"`
}

type OpenAlexWork struct {
	ID              string               `json:"id"`
	Title           string               `json:"title"`
	DisplayName     string               `json:"display_name"`
	Abstract        string               `json:"abstract"`
	PublicationDate string               `json:"publication_date"`
	Authorships     []OpenAlexAuthorship `json:"authorships"`
	PrimaryLocation *OpenAlexLocation    `json:"primary_location"`
	OpenAccessURL   *OpenAlexOpenAccess  `json:"open_access"`
	DOI             string               `json:"doi"`
	CitedByCount    int                  `json:"cited_by_count"`
}

type OpenAlexAuthorship struct {
	Author OpenAlexAuthor `json:"author"`
}

type OpenAlexAuthor struct {
	DisplayName string `json:"display_name"`
}

type OpenAlexLocation struct {
	LandingPageURL string `json:"landing_page_url"`
}

type OpenAlexOpenAccess struct {
	OAUrl string `json:"oa_url"`
}

// API 请求/响应结构
type SearchRequest struct {
	Query      string `json:"query" binding:"required"`
	StartYear  int    `json:"startYear"`
	EndYear    int    `json:"endYear"`
	MaxResults int    `json:"maxResults"`
}

type SearchResult struct {
	Title     string   `json:"title"`
	Summary   string   `json:"summary"`
	Link      string   `json:"link"`
	Authors   []string `json:"authors"`
	Published string   `json:"published"`
}

type SearchResponse struct {
	Results []SearchResult `json:"results"`
}

type GenerateRequest struct {
	Topic   string         `json:"topic" binding:"required"`
	Results []SearchResult `json:"results" binding:"required"`
}

type ExportRequest struct {
	Topic   string `json:"topic" binding:"required"`
	Content string `json:"content" binding:"required"`
}

var arkClient *arkruntime.Client

func main() {
	// 初始化豆包客户端
	apiKey := os.Getenv("ARK_API_KEY")
	if apiKey == "" {
		apiKey = "a4e439ac-f5b9-4deb-a4e0-2e1d3bb40db8" // 使用提供的API Key
	}

	arkClient = arkruntime.NewClientWithApiKey(
		apiKey,
		arkruntime.WithBaseUrl("https://ark.cn-beijing.volces.com/api/v3"),
	)

	// 创建 Gin 路由
	r := gin.Default()

	// CORS 配置
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 路由
	r.POST("/search", handleSearch)
	r.POST("/generate", handleGenerate)
	r.POST("/export-docx", handleExportDocx)

	// 启动服务器
	log.Println("服务器启动在 :3001")
	if err := r.Run(":3001"); err != nil {
		log.Fatal("服务器启动失败:", err)
	}
}

// 处理搜索请求
func handleSearch(c *gin.Context) {
	var req SearchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	// 设置默认值
	if req.MaxResults == 0 {
		req.MaxResults = 10
	}
	if req.StartYear == 0 {
		req.StartYear = 2020
	}
	if req.EndYear == 0 {
		req.EndYear = time.Now().Year()
	}

	// 调用 arXiv API
	results, err := searchArxiv(req)
	if err != nil {
		log.Printf("搜索失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "搜索失败，请稍后重试"})
		return
	}

	c.JSON(http.StatusOK, SearchResponse{Results: results})
}

// 搜索 OpenAlex
func searchArxiv(req SearchRequest) ([]SearchResult, error) {
	// 构建查询参数
	params := url.Values{}
	params.Add("search", req.Query)
	params.Add("per_page", fmt.Sprintf("%d", req.MaxResults))

	// 添加年份过滤
	if req.StartYear > 0 && req.EndYear > 0 {
		params.Add("filter", fmt.Sprintf("publication_year:%d-%d", req.StartYear, req.EndYear))
	}

	// 按引用次数排序
	params.Add("sort", "cited_by_count:desc")

	// 构建 OpenAlex API URL
	apiURL := fmt.Sprintf("https://api.openalex.org/works?%s", params.Encode())

	log.Printf("请求 OpenAlex API: %s", apiURL)

	// 创建请求
	client := &http.Client{Timeout: 30 * time.Second}
	req2, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, fmt.Errorf("创建请求失败: %w", err)
	}

	// 设置User-Agent（OpenAlex推荐）
	req2.Header.Set("User-Agent", "AI-Paper-Assistant/1.0 (mailto:your-email@example.com)")

	// 发送请求
	resp, err := client.Do(req2)
	if err != nil {
		return nil, fmt.Errorf("请求失败: %w", err)
	}
	defer resp.Body.Close()

	// 读取响应
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取响应失败: %w", err)
	}

	log.Printf("OpenAlex 响应状态: %d, 长度: %d bytes", resp.StatusCode, len(body))

	if resp.StatusCode != http.StatusOK {
		log.Printf("响应内容: %s", string(body[:min(500, len(body))]))
		return nil, fmt.Errorf("API 返回错误状态码: %d", resp.StatusCode)
	}

	// 解析 JSON
	var openAlexResp OpenAlexResponse
	if err := json.Unmarshal(body, &openAlexResp); err != nil {
		log.Printf("JSON 解析错误: %v", err)
		log.Printf("响应内容: %s", string(body[:min(500, len(body))]))
		return nil, fmt.Errorf("解析 JSON 失败: %w", err)
	}

	log.Printf("找到 %d 篇文献（总数: %d）", len(openAlexResp.Results), openAlexResp.Meta.Count)

	// 转换结果
	var results []SearchResult
	for _, work := range openAlexResp.Results {
		// 使用display_name或title
		title := work.Title
		if title == "" {
			title = work.DisplayName
		}
		title = strings.TrimSpace(strings.ReplaceAll(title, "\n", " "))

		// 获取摘要（如果有）
		summary := work.Abstract
		if summary == "" {
			summary = "暂无摘要"
		} else {
			// 清理摘要中的换行和多余空格
			summary = strings.TrimSpace(strings.ReplaceAll(summary, "\n", " "))
			summary = strings.Join(strings.Fields(summary), " ") // 移除多余空格
			// 限制摘要长度到150字符以减少数据传输
			if len(summary) > 150 {
				// 尝试在句子结束处截断
				cutoff := 150
				if idx := strings.LastIndex(summary[:cutoff], "."); idx > 100 {
					cutoff = idx + 1
				} else if idx := strings.LastIndex(summary[:cutoff], "。"); idx > 100 {
					cutoff = idx + 1
				}
				summary = summary[:cutoff] + "..."
			}
		}

		// 提取作者（最多5位以减少数据量）
		var authors []string
		maxAuthors := 5
		for i, authorship := range work.Authorships {
			if i >= maxAuthors {
				break
			}
			if authorship.Author.DisplayName != "" {
				authors = append(authors, authorship.Author.DisplayName)
			}
		}
		if len(authors) == 0 {
			authors = []string{"未知作者"}
		}

		// 获取链接（优先使用DOI，其次是primary location，最后是OpenAlex ID）
		link := work.ID
		if work.PrimaryLocation != nil && work.PrimaryLocation.LandingPageURL != "" {
			link = work.PrimaryLocation.LandingPageURL
		} else if work.DOI != "" {
			link = "https://doi.org/" + strings.TrimPrefix(work.DOI, "https://doi.org/")
		} else if work.OpenAccessURL != nil && work.OpenAccessURL.OAUrl != "" {
			link = work.OpenAccessURL.OAUrl
		}

		// 解析发布日期
		published := work.PublicationDate
		if published == "" {
			published = "未知日期"
		} else {
			// 只取年月日部分
			if len(published) > 10 {
				published = published[:10]
			}
		}

		results = append(results, SearchResult{
			Title:     title,
			Summary:   summary,
			Link:      link,
			Authors:   authors,
			Published: published,
		})
	}

	log.Printf("返回 %d 篇文献", len(results))

	return results, nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// 处理生成报告请求（流式）
func handleGenerate(c *gin.Context) {
	var req GenerateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	// 设置SSE响应头
	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("X-Accel-Buffering", "no")

	// 构建提示词
	prompt := buildPrompt(req.Topic, req.Results)

	// 调用豆包流式API
	if err := generateReportStream(c, prompt); err != nil {
		log.Printf("生成报告失败: %v", err)
		c.SSEvent("error", gin.H{"message": "生成报告失败"})
	}
}

// 构建提示词
func buildPrompt(topic string, results []SearchResult) string {
	var sb strings.Builder

	sb.WriteString(fmt.Sprintf("# 研究主题：%s\n\n", topic))
	sb.WriteString("## 参考文献资料\n\n")

	for i, result := range results {
		sb.WriteString(fmt.Sprintf("### 文献 %d\n\n", i+1))
		sb.WriteString(fmt.Sprintf("**标题**: %s\n\n", result.Title))
		sb.WriteString(fmt.Sprintf("**作者**: %s\n\n", strings.Join(result.Authors, ", ")))
		sb.WriteString(fmt.Sprintf("**发布日期**: %s\n\n", result.Published))
		sb.WriteString(fmt.Sprintf("**摘要**: %s\n\n", result.Summary))
	}

	sb.WriteString("\n---\n\n")
	sb.WriteString("## 任务要求\n\n")
	sb.WriteString("请基于以上文献资料，生成一份**完整规范的学术开题报告**。\n\n")
	sb.WriteString("### 报告结构（必须严格按照以下章节编写）\n\n")

	sb.WriteString("**## 一、基本信息**\n\n")
	sb.WriteString("使用Markdown表格格式，包含以下字段（内容可留空待填写）：\n")
	sb.WriteString("- 课题名称\n- 学院\n- 专业/年级\n- 学生姓名\n- 指导教师\n- 开题日期\n\n")

	sb.WriteString("**## 二、课题研究背景与意义**\n\n")
	sb.WriteString("### （一）研究背景\n")
	sb.WriteString("说明课题所属领域的发展现状、存在的问题或待解决的需求，结合政策、行业实际或学术热点阐述研究的必要性。（约200-250字）\n\n")
	sb.WriteString("### （二）研究意义\n")
	sb.WriteString("1. 理论意义：说明研究对相关学科理论的补充、完善或创新价值\n")
	sb.WriteString("2. 实践意义：说明研究成果在实际工作、行业应用或社会层面的实用价值\n\n")

	sb.WriteString("**## 三、国内外研究现状**\n\n")
	sb.WriteString("### （一）国外研究现状\n")
	sb.WriteString("梳理国外相关领域的研究成果、核心观点、技术方法，分析现有研究的优势与不足。引用上述参考文献。（约150-200字）\n\n")
	sb.WriteString("### （二）国内研究现状\n")
	sb.WriteString("梳理国内相关研究的进展、主要成果、应用情况，明确当前研究的空白或待深化方向。引用上述参考文献。（约150-200字）\n\n")
	sb.WriteString("### （三）研究述评\n")
	sb.WriteString("总结国内外研究现状，提出本课题的研究切入点与差异化价值。（约100字）\n\n")

	sb.WriteString("**## 四、研究目标与研究内容**\n\n")
	sb.WriteString("### （一）研究目标\n")
	sb.WriteString("明确本课题要达成的具体目标，需清晰、可衡量，避免模糊表述。\n\n")
	sb.WriteString("### （二）研究内容\n")
	sb.WriteString("围绕研究目标，分点列出3-4项具体研究内容，逻辑连贯、层次清晰。\n\n")

	sb.WriteString("**## 五、研究方法与技术路线**\n\n")
	sb.WriteString("### （一）研究方法\n")
	sb.WriteString("列举课题采用的主要研究方法（如文献研究法、实证研究法、案例分析法等），简要说明每种方法的应用场景。\n\n")
	sb.WriteString("### （二）技术路线\n")
	sb.WriteString("按研究流程说明实施步骤，可采用文字描述形式，明确各阶段的核心任务。\n\n")

	sb.WriteString("**## 六、研究进度安排**\n\n")
	sb.WriteString("使用Markdown表格，分5个阶段列出时间范围和核心任务（时间可填\"年月-年月\"的占位符）。\n\n")

	sb.WriteString("**## 七、预期成果与创新点**\n\n")
	sb.WriteString("### （一）预期成果\n")
	sb.WriteString("说明研究完成后将形成的成果形式（如学术论文、研究报告、软件原型等）。\n\n")
	sb.WriteString("### （二）创新点\n")
	sb.WriteString("突出研究的创新性，如理论创新、方法创新、应用创新等，需具体且有说服力。\n\n")

	sb.WriteString("**## 八、参考文献**\n\n")
	sb.WriteString("按学术规范格式列出上述提供的核心参考文献，格式示例：\n")
	sb.WriteString("[1] 作者. 文献题名[J]. 刊名, 年份, 卷(期): 页码.\n\n")

	sb.WriteString("\n\n🚨🚨🚨 【换行符绝对规则】🚨🚨🚨\n")
	sb.WriteString("❌ 绝对禁止: \\n\n")
	sb.WriteString("❌ 绝对禁止: 真实换行\n")
	sb.WriteString("✅ 必须使用: <BR> 表示换行\n")
	sb.WriteString("✅ 必须使用: <BR><BR> 表示段落分隔\n\n")

	sb.WriteString("### 输出格式规范（100%严格执行）\n\n")
	sb.WriteString("**1. 标题格式：**\n")
	sb.WriteString("   - 一级标题: # 标题<BR><BR>（文档总标题）\n")
	sb.WriteString("   - 二级标题: ## 标题<BR><BR>（主要章节，如：## 一、基本信息）\n")
	sb.WriteString("   - 三级标题: ### 标题<BR><BR>（小节，如：### （一）研究背景）\n")
	sb.WriteString("   - # 后必须有空格\n\n")

	sb.WriteString("**2. 换行规则（核心重点）：**\n")
	sb.WriteString("   - 每个标题后面: <BR><BR>\n")
	sb.WriteString("   - 每个段落后面: <BR><BR>\n")
	sb.WriteString("   - 表格前后: <BR><BR>\n")
	sb.WriteString("   - 列表后面: <BR><BR>\n")
	sb.WriteString("   - 禁止使用: \\n 或真实换行\n\n")

	sb.WriteString("**3. 完整示例（请严格模仿此格式）：**\n\n")
	sb.WriteString("# 开题报告<BR><BR>## 一、基本信息<BR><BR>| 项目 | 内容 |<BR>| --- | --- |<BR>| 课题名称 | xxx |<BR>| 学生姓名 | xxx |<BR><BR>## 二、研究背景<BR><BR>### （一）研究意义<BR><BR>这是第一段。<BR><BR>这是第二段。<BR><BR>### （二）研究现状<BR><BR>内容继续。\n\n")

	sb.WriteString("**4. 错误对照：**\n")
	sb.WriteString("   ❌ ## 标题\\n\\n内容 → ✅ ## 标题<BR><BR>内容\n")
	sb.WriteString("   ❌ 段落1\\n\\n段落2 → ✅ 段落1<BR><BR>段落2\n")
	sb.WriteString("   ❌ ##标题 → ✅ ## 标题\n\n")

	sb.WriteString("**5. 其他要求：**\n")
	sb.WriteString("   - 总字数: 1500字左右\n")
	sb.WriteString("   - 引用文献时标注序号\n")
	sb.WriteString("   - 语言学术规范\n\n")

	sb.WriteString("🚨 最后强调：输出时每次想换行就写 <BR>，想空一行就写 <BR><BR>，绝对不要用 \\n！\n\n")
	sb.WriteString("**现在请严格按照上述格式生成开题报告：**\n")

	return sb.String()
}

// 生成报告（流式）
func generateReportStream(c *gin.Context, prompt string) error {
	ctx := context.Background()

	req := model.ChatCompletionRequest{
		Model: "ep-20251106234440-sm864",
		Messages: []*model.ChatCompletionMessage{
			{
				Role: model.ChatMessageRoleSystem,
				Content: &model.ChatCompletionMessageContent{
					StringValue: stringPtr(`你是一位专业的学术研究助手，擅长撰写规范的学术开题报告。

🚨 【换行符绝对规则 - 必须100%遵守】🚨
1. 绝对禁止使用 \n 作为换行符
2. 绝对禁止使用真实的回车换行
3. 必须且只能使用 <BR> 字符串来表示换行
4. 段落之间用 <BR><BR> (两次<BR>)
5. 标题后面必须用 <BR><BR>

换行符对照表：
❌ 错误: \n          → 改用: <BR>
❌ 错误: \n\n        → 改用: <BR><BR>
❌ 错误: 真实换行    → 改用: <BR>
✅ 正确: <BR>        → 表示一个换行
✅ 正确: <BR><BR>    → 表示两个换行（段落分隔）

【完整输出示例】
# 开题报告<BR><BR>## 一、基本信息<BR><BR>| 项目 | 内容 |<BR>| --- | --- |<BR>| 研究课题 | 人工智能应用研究 |<BR>| 学生姓名 | 张三 |<BR><BR>## 二、研究背景<BR><BR>### （一）研究意义<BR><BR>这是第一段内容，说明研究的重要性。<BR><BR>这是第二段内容，进一步阐述。<BR><BR>### （二）国内外研究现状<BR><BR>当前研究现状如下：<BR><BR>1. 国内研究进展<BR>2. 国外研究进展<BR><BR>综上所述，本研究具有重要意义。

【Markdown格式规范】
- 一级标题: # 标题<BR><BR>（最顶级标题，用于文档标题）
- 二级标题: ## 标题<BR><BR>（主要章节）
- 三级标题: ### 标题<BR><BR>（小节）
- 段落分隔: 内容。<BR><BR>内容。
- 表格格式: <BR><BR>| 列1 | 列2 |<BR>| --- | --- |<BR>| 内容 | 内容 |<BR><BR>
- # 和标题之间必须有空格

【再次强调】
输出时，每当你想要换行，就写 <BR>
每当你想要空一行（段落分隔），就写 <BR><BR>
绝对不要使用 \n 字符！`),
				},
			},
			{
				Role: model.ChatMessageRoleUser,
				Content: &model.ChatCompletionMessageContent{
					StringValue: stringPtr(prompt),
				},
			},
		},
	}

	stream, err := arkClient.CreateChatCompletionStream(ctx, req)
	if err != nil {
		return fmt.Errorf("创建流失败: %w", err)
	}
	defer stream.Close()

	log.Println("开始流式生成报告...")

	for {
		recv, err := stream.Recv()
		if err == io.EOF {
			// 发送完成事件
			fmt.Fprintf(c.Writer, "event: done\ndata: \n\n")
			c.Writer.Flush()
			log.Println("报告生成完成")
			return nil
		}
		if err != nil {
			return fmt.Errorf("接收流数据失败: %w", err)
		}

		if len(recv.Choices) > 0 && recv.Choices[0].Delta.Content != "" {
			// 发送数据块 - 使用 event: data 格式
			fmt.Fprintf(c.Writer, "event: data\ndata: %s\n\n", recv.Choices[0].Delta.Content)
			c.Writer.Flush()
			log.Printf("发送数据块，长度: %d", len(recv.Choices[0].Delta.Content))
		}
	}
}

// 辅助函数：字符串指针
func stringPtr(s string) *string {
	return &s
}

// 处理导出DOCX请求
func handleExportDocx(c *gin.Context) {
	var req ExportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	// 将Markdown转换为DOCX
	docxData, err := generateDocx(req.Topic, req.Content)
	if err != nil {
		log.Printf("生成DOCX失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "生成文档失败"})
		return
	}

	// 设置响应头
	filename := fmt.Sprintf("开题报告_%s_%s.docx",
		sanitizeFilename(req.Topic),
		time.Now().Format("20060102_150405"))

	// 使用RFC 2231编码支持中文文件名
	encodedFilename := url.QueryEscape(filename)

	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
	// 同时设置filename和filename*以兼容不同浏览器
	c.Header("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"; filename*=UTF-8''%s`, filename, encodedFilename))
	c.Data(http.StatusOK, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", docxData)
}

// 清理文件名
func sanitizeFilename(s string) string {
	// 移除非法字符
	reg := regexp.MustCompile(`[<>:"/\\|?*\x00-\x1f]`)
	s = reg.ReplaceAllString(s, "")
	// 限制长度
	if len(s) > 50 {
		s = s[:50]
	}
	if s == "" {
		s = "报告"
	}
	return s
}

// 生成DOCX文件
func generateDocx(topic, markdownContent string) ([]byte, error) {
	// 创建一个新的字节缓冲区来存储ZIP数据
	buf := new(bytes.Buffer)
	zipWriter := zip.NewWriter(buf)

	// 1. 创建 [Content_Types].xml
	contentTypes := `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`

	if err := addFileToZip(zipWriter, "[Content_Types].xml", []byte(contentTypes)); err != nil {
		return nil, err
	}

	// 2. 创建 _rels/.rels
	rels := `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`

	if err := addFileToZip(zipWriter, "_rels/.rels", []byte(rels)); err != nil {
		return nil, err
	}

	// 3. 创建 word/_rels/document.xml.rels
	docRels := `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`

	if err := addFileToZip(zipWriter, "word/_rels/document.xml.rels", []byte(docRels)); err != nil {
		return nil, err
	}

	// 4. 创建 word/styles.xml（基本样式，添加中文字体支持）
	styles := `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:eastAsia="SimSun" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:eastAsia="SimSun" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
      <w:sz w:val="22"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:basedOn w:val="Normal"/>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:eastAsia="SimSun" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
      <w:sz w:val="32"/>
      <w:b/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="Heading 1"/>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:eastAsia="SimSun" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
      <w:sz w:val="28"/>
      <w:b/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="Heading 2"/>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:eastAsia="SimSun" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
      <w:sz w:val="24"/>
      <w:b/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="Heading 3"/>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:eastAsia="SimSun" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
      <w:sz w:val="22"/>
      <w:b/>
    </w:rPr>
  </w:style>
</w:styles>`

	if err := addFileToZip(zipWriter, "word/styles.xml", []byte(styles)); err != nil {
		return nil, err
	}

	// 5. 创建 word/document.xml（主文档内容）
	documentXML, err := markdownToWordXML(topic, markdownContent)
	if err != nil {
		return nil, err
	}

	if err := addFileToZip(zipWriter, "word/document.xml", []byte(documentXML)); err != nil {
		return nil, err
	}

	// 关闭ZIP写入器
	if err := zipWriter.Close(); err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

// 添加文件到ZIP
func addFileToZip(zipWriter *zip.Writer, filename string, data []byte) error {
	writer, err := zipWriter.Create(filename)
	if err != nil {
		return err
	}
	_, err = writer.Write(data)
	return err
}

// 将Markdown转换为Word XML
func markdownToWordXML(topic, markdown string) (string, error) {
	var xmlParts []string

	xmlParts = append(xmlParts, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`)
	xmlParts = append(xmlParts, `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">`)
	xmlParts = append(xmlParts, `<w:body>`)

	// 首先清理所有 <BR> 标签，替换为真正的换行符
	markdown = strings.ReplaceAll(markdown, "<BR>", "\n")
	markdown = strings.ReplaceAll(markdown, "<br>", "\n")
	markdown = strings.ReplaceAll(markdown, "&lt;BR&gt;", "\n")
	markdown = strings.ReplaceAll(markdown, "&lt;br&gt;", "\n")

	// 分割内容为行
	lines := strings.Split(markdown, "\n")

	for i := 0; i < len(lines); i++ {
		line := strings.TrimSpace(lines[i])

		// 跳过空行
		if line == "" {
			continue
		}

		// 处理表格
		if strings.HasPrefix(line, "|") && strings.HasSuffix(line, "|") {
			// 收集整个表格的所有行
			var tableLines []string
			for i < len(lines) {
				currentLine := strings.TrimSpace(lines[i])
				if !strings.HasPrefix(currentLine, "|") || !strings.HasSuffix(currentLine, "|") {
					break
				}
				tableLines = append(tableLines, currentLine)
				i++
			}
			i-- // 回退一行，因为外层循环会 i++

			// 生成表格 XML
			if len(tableLines) > 0 {
				xmlParts = append(xmlParts, createTable(tableLines))
			}
			continue
		}

		// 处理标题
		if strings.HasPrefix(line, "# ") {
			text := xmlEscape(strings.TrimPrefix(line, "# "))
			xmlParts = append(xmlParts, createParagraph(text, "Title", true, 32))
		} else if strings.HasPrefix(line, "## ") {
			text := xmlEscape(strings.TrimPrefix(line, "## "))
			xmlParts = append(xmlParts, createParagraph(text, "Heading1", true, 28))
		} else if strings.HasPrefix(line, "### ") {
			text := xmlEscape(strings.TrimPrefix(line, "### "))
			xmlParts = append(xmlParts, createParagraph(text, "Heading2", true, 24))
		} else if strings.HasPrefix(line, "#### ") {
			text := xmlEscape(strings.TrimPrefix(line, "#### "))
			xmlParts = append(xmlParts, createParagraph(text, "Heading3", true, 22))
		} else if strings.HasPrefix(line, "- ") || strings.HasPrefix(line, "* ") {
			// 列表项
			text := xmlEscape(line[2:])
			xmlParts = append(xmlParts, createListItem(text))
		} else if matched, _ := regexp.MatchString(`^\d+\.\s`, line); matched {
			// 数字列表
			re := regexp.MustCompile(`^\d+\.\s`)
			text := xmlEscape(re.ReplaceAllString(line, ""))
			xmlParts = append(xmlParts, createListItem(text))
		} else {
			// 普通段落，处理粗体和斜体
			text := processBoldItalic(line)
			xmlParts = append(xmlParts, createParagraph(text, "", false, 22))
		}
	}

	xmlParts = append(xmlParts, `</w:body>`)
	xmlParts = append(xmlParts, `</w:document>`)

	return strings.Join(xmlParts, ""), nil
}

// 处理粗体和斜体
func processBoldItalic(text string) string {
	// 简单处理：移除Markdown标记并转义
	text = strings.ReplaceAll(text, "**", "")
	text = strings.ReplaceAll(text, "*", "")
	text = strings.ReplaceAll(text, "__", "")
	text = strings.ReplaceAll(text, "_", "")
	return xmlEscape(text)
}

// XML转义
func xmlEscape(s string) string {
	s = strings.ReplaceAll(s, "&", "&amp;")
	s = strings.ReplaceAll(s, "<", "&lt;")
	s = strings.ReplaceAll(s, ">", "&gt;")
	s = strings.ReplaceAll(s, "\"", "&quot;")
	s = strings.ReplaceAll(s, "'", "&apos;")
	return s
}

// 创建段落
func createParagraph(text, style string, bold bool, fontSize int) string {
	var parts []string
	parts = append(parts, `<w:p>`)

	if style != "" {
		parts = append(parts, fmt.Sprintf(`<w:pPr><w:pStyle w:val="%s"/></w:pPr>`, style))
	}

	parts = append(parts, `<w:r>`)

	// 添加运行属性（必须包含字体设置以支持中文）
	parts = append(parts, `<w:rPr>`)

	// 添加字体设置，支持中文显示
	parts = append(parts, `<w:rFonts w:ascii="Times New Roman" w:eastAsia="SimSun" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>`)

	if bold {
		parts = append(parts, `<w:b/>`)
	}
	if fontSize > 0 {
		parts = append(parts, fmt.Sprintf(`<w:sz w:val="%d"/>`, fontSize))
		parts = append(parts, fmt.Sprintf(`<w:szCs w:val="%d"/>`, fontSize))
	}
	parts = append(parts, `</w:rPr>`)

	parts = append(parts, fmt.Sprintf(`<w:t xml:space="preserve">%s</w:t>`, text))
	parts = append(parts, `</w:r>`)
	parts = append(parts, `</w:p>`)

	return strings.Join(parts, "")
}

// 创建列表项
func createListItem(text string) string {
	return fmt.Sprintf(`<w:p>
  <w:pPr>
    <w:numPr>
      <w:ilvl w:val="0"/>
      <w:numId w:val="1"/>
    </w:numPr>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:eastAsia="SimSun" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
    </w:rPr>
    <w:t xml:space="preserve">• %s</w:t>
  </w:r>
</w:p>`, text)
}

// 创建表格
func createTable(tableLines []string) string {
	var parts []string
	parts = append(parts, `<w:tbl>`)

	// 表格属性
	parts = append(parts, `<w:tblPr>`)
	parts = append(parts, `<w:tblW w:w="5000" w:type="pct"/>`)
	parts = append(parts, `<w:tblBorders>`)
	parts = append(parts, `<w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/>`)
	parts = append(parts, `<w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/>`)
	parts = append(parts, `<w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/>`)
	parts = append(parts, `<w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/>`)
	parts = append(parts, `<w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000"/>`)
	parts = append(parts, `<w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000"/>`)
	parts = append(parts, `</w:tblBorders>`)
	parts = append(parts, `</w:tblPr>`)

	// 处理每一行
	for i, line := range tableLines {
		// 跳过分隔符行（| --- | --- |）
		if strings.Contains(line, "---") {
			continue
		}

		// 分割单元格
		cells := strings.Split(line, "|")
		var validCells []string
		for _, cell := range cells {
			trimmed := strings.TrimSpace(cell)
			if trimmed != "" {
				validCells = append(validCells, trimmed)
			}
		}

		if len(validCells) == 0 {
			continue
		}

		// 创建行
		parts = append(parts, `<w:tr>`)

		// 表头行（第一行）使用加粗
		isHeader := (i == 0)

		for _, cellText := range validCells {
			parts = append(parts, `<w:tc>`)
			parts = append(parts, `<w:tcPr><w:tcW w:w="2500" w:type="pct"/></w:tcPr>`)

			// 创建单元格内容
			escapedText := xmlEscape(cellText)
			parts = append(parts, `<w:p>`)
			parts = append(parts, `<w:r>`)
			parts = append(parts, `<w:rPr>`)
			parts = append(parts, `<w:rFonts w:ascii="Times New Roman" w:eastAsia="SimSun" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>`)
			if isHeader {
				parts = append(parts, `<w:b/>`)
			}
			parts = append(parts, `<w:sz w:val="22"/>`)
			parts = append(parts, `</w:rPr>`)
			parts = append(parts, fmt.Sprintf(`<w:t xml:space="preserve">%s</w:t>`, escapedText))
			parts = append(parts, `</w:r>`)
			parts = append(parts, `</w:p>`)
			parts = append(parts, `</w:tc>`)
		}

		parts = append(parts, `</w:tr>`)
	}

	parts = append(parts, `</w:tbl>`)
	return strings.Join(parts, "")
}
