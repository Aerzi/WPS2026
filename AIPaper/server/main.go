package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
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
	ID               string                `json:"id"`
	Title            string                `json:"title"`
	DisplayName      string                `json:"display_name"`
	Abstract         string                `json:"abstract"`
	PublicationDate  string                `json:"publication_date"`
	Authorships      []OpenAlexAuthorship  `json:"authorships"`
	PrimaryLocation  *OpenAlexLocation     `json:"primary_location"`
	OpenAccessURL    *OpenAlexOpenAccess   `json:"open_access"`
	DOI              string                `json:"doi"`
	CitedByCount     int                   `json:"cited_by_count"`
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
	sb.WriteString("## 参考文献\n\n")

	for i, result := range results {
		sb.WriteString(fmt.Sprintf("### 文献 %d\n", i+1))
		sb.WriteString(fmt.Sprintf("**标题**: %s\n", result.Title))
		sb.WriteString(fmt.Sprintf("**作者**: %s\n", strings.Join(result.Authors, ", ")))
		sb.WriteString(fmt.Sprintf("**发布日期**: %s\n", result.Published))
		sb.WriteString(fmt.Sprintf("**摘要**: %s\n\n", result.Summary))
	}

	sb.WriteString("\n## 任务要求\n\n")
	sb.WriteString("请基于以上文献资料，生成一份完整的学术开题报告，要求：\n\n")
	sb.WriteString("1. **研究背景**（200字左右）：阐述该研究领域的重要性和现状\n")
	sb.WriteString("2. **文献综述**（300字左右）：总结上述文献的主要研究内容和发现\n")
	sb.WriteString("3. **研究问题**（150字左右）：明确提出本研究要解决的核心问题\n")
	sb.WriteString("4. **研究意义**（150字左右）：说明本研究的理论和实践价值\n")
	sb.WriteString("5. **研究方法**（150字左右）：简述可能采用的研究方法\n")
	sb.WriteString("6. **预期成果**（50字左右）：描述研究可能达到的目标\n\n")
	sb.WriteString("请以学术规范的语言撰写，使用markdown格式，总字数严格控制在1000字左右。\n")

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
					StringValue: stringPtr("你是一位专业的学术研究助手，擅长撰写学术论文和开题报告。你的写作风格严谨、客观，符合学术规范。请使用markdown格式输出。"),
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

