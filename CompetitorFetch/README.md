# 用户反馈自动分析系统

> 基于NLP的轻量级反馈分析工具，自动提取情感和痛点

## 🚀 快速开始

### Windows用户（推荐）

**双击运行 `启动.bat`**，选择操作：
- [1] 安装依赖（首次使用）
- [2] 运行反馈分析演示
- [3] 运行请求分析演示
- [4] 分析文件（反馈内容）
- [5] 分析文件（请求内容）
- [6] 打包为EXE

### 其他系统

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 运行演示
python src/main.py demo_data.xlsx

# 3. 分析自己的数据
python src/main.py your_feedback.xlsx
```

## ✨ 功能特性

### 双模式分析 ⭐

**模式1：反馈内容分析（默认）**
- ✅ **情感分析**：自动判断正面/负面/中性
- ✅ **痛点提取**：识别高频问题词汇
- ✅ **满意度评估**：量化用户体验

**模式2：请求内容分析** ⭐ 新功能
- ✅ **智能分类**：8种请求类型自动识别
- ✅ **紧急度评估**：高/中/低优先级判断
- ✅ **需求统计**：高频功能需求排行

### 通用特性
- ✅ **自动报表**：生成Excel报告和可视化图表
- ✅ **轻量快速**：无需GPU，3秒分析175条数据
- ✅ **中文优化**：专门针对中文文本
- ✅ **大数据支持**：轻松处理1000+条数据

## 📊 数据格式

### 方式1：使用模板（推荐）

我们提供了2个模板文件：
- `feedback_template.xlsx` - 反馈内容模板（用户评价、意见）
- `request_template.xlsx` - 请求内容模板（功能需求、建议）⭐

打开对应模板，填写数据即可开始分析。

### 方式2：自己的Excel文件

**反馈数据示例**：
| 反馈内容 |
|----------|
| 这个软件太卡顿了 |
| 界面设计很美观 |

**请求数据示例**：
| 请求内容 |
|----------|
| 希望增加批量导出功能 |
| 建议优化页面加载速度 |

**支持的格式**：`.xlsx`、`.xls`、`.csv`（多种编码自动识别）

**自动识别列名**：
- 反馈类：反馈、feedback、评论、comment、意见
- 请求类：请求、request、需求、requirement、建议
- 通用：内容、content

**手动指定列名**：
```bash
python src/main.py data.xlsx --type request --column 你的列名
```

## 📈 输出结果

运行后在 `output` 目录自动创建**以文件名命名的分析文件夹**：

### 反馈分析输出

```
output/
└── 文件名_时间戳/              ← 使用原文件名，一眼看出是哪个文件
    ├── README.txt            ← 分析摘要说明 ⭐
    ├── 分析报告.xlsx          ← Excel详细报告
    ├── 情感分布图.png         ← 饼图（正面/负面/中性）
    ├── 痛点词云图.png         ← 词云
    └── 痛点排行图.png         ← 柱状图（Top 15）
```

**文件说明**：
1. **README.txt** - 快速查看分析摘要和Top 10痛点 ⭐
2. **分析报告.xlsx** - 详细分析、统计摘要、高频痛点（3个Sheet）
3. **情感分布图.png** - 正面/负面/中性占比饼图
4. **痛点词云图.png** - 高频问题词云可视化
5. **痛点排行图.png** - Top 15问题柱状图

### 请求分析输出 ⭐

```
output/
└── 文件名_时间戳/              
    ├── README.txt            ← 分析摘要说明
    ├── 请求分析报告.xlsx      ← Excel详细报告
    ├── 请求类型分布图.png     ← 饼图（8种类型）
    ├── 紧急度分布图.png       ← 饼图（高/中紧急度）
    ├── 功能需求词云图.png     ← 词云
    └── 功能需求排行图.png     ← 柱状图（Top 15）
```

**文件说明**：
1. **README.txt** - 快速查看分析摘要和高频需求 ⭐
2. **请求分析报告.xlsx** - 详细分类、统计摘要、高频功能需求（3个Sheet）
3. **请求类型分布图.png** - 8种请求类型占比饼图
4. **紧急度分布图.png** - 高/中紧急度占比饼图
5. **功能需求词云图.png** - 高频需求词云可视化
6. **功能需求排行图.png** - Top 15功能需求柱状图

**文件夹命名示例**：
- `demo_data_20251201_100000/` ← 分析demo_data.xlsx
- `product_feedback_20251201_143000/` ← 分析product_feedback.csv
- `week1_反馈_20251201_160000/` ← 分析week1_反馈.xlsx

## 🔧 命令行参数

```bash
# 反馈内容分析（默认模式）
python src/main.py feedback.xlsx
python src/main.py feedback.csv

# 请求内容分析 ⭐ 新功能
python src/main.py requests.xlsx --type request

# 指定反馈列
python src/main.py feedback.csv --column 用户评论

# 指定输出目录
python src/main.py feedback.csv --output reports

# 使用配置文件
python src/main.py feedback.xlsx --config config/config.json

# CSV大数据示例（1000+条）
python src/main.py large_feedback.csv

# 完整命令示例
python src/main.py data.csv --type request --column 请求内容 --output 分析结果
```

## ⚙️ 配置

编辑 `config/config.json` 自定义参数：

```json
{
  "output_dir": "output",           // 输出目录
  "feedback_column": null,          // 反馈列名（null=自动）
  "top_pain_points": 20,            // 提取痛点数量
  "sentiment_thresholds": {
    "positive_min": 0.6,            // 正面阈值
    "neutral_min": 0.4              // 中性阈值
  }
}
```

编辑 `config/custom_dict.txt` 添加行业词汇：

```
产品名称 10000 n
特定功能 10000 n
```

## 📦 打包为EXE

```bash
# 方式1：使用启动脚本
双击 启动.bat → 选择 [6] 打包为EXE

# 方式2：命令行
python build.py
```

打包后的文件在 `dist/FeedbackAnalyzer/` 目录，可分发给其他用户使用。

## 📁 项目结构

```
CompetitorFetch/
├── 启动.bat                      # Windows启动脚本（6个选项）
├── START_HERE.md                # 新手入门指南
├── README.md                    # 本文档
├── requirements.txt             # 依赖列表
├── feedback_template.xlsx       # 反馈内容模板
├── request_template.xlsx        # 请求内容模板 ⭐
├── demo_data.xlsx               # 演示数据
├── src/                         # 源代码
│   ├── main.py                 # 主程序（双模式支持）
│   ├── analyzer.py             # 反馈分析引擎
│   ├── request_analyzer.py     # 请求分析引擎 ⭐
│   ├── data_loader.py          # 数据加载（多编码支持）
│   ├── report_generator.py     # 反馈报告生成
│   └── request_report_generator.py  # 请求报告生成 ⭐
├── config/                      # 配置文件
│   ├── config.json             # 系统配置
│   └── custom_dict.txt         # 自定义词典
└── output/                      # 输出目录（自动创建）
    └── 文件名_时间戳/           # 每次分析独立文件夹
```

## 🎯 两种分析模式详解

### 模式1：反馈内容分析（feedback）

**适用场景**：用户评价、满意度调查、产品评论

```bash
python src/main.py feedback.xlsx --type feedback
```

**分析维度**：
- 情感分类：正面/负面/中性
- 痛点提取：识别问题词汇
- 满意度评估：量化用户体验

**示例数据**：
- "这个软件很好用，推荐！"
- "界面太丑，经常卡顿"
- "整体还可以，有些功能需要改进"

---

### 模式2：请求内容分析（request）⭐

**适用场景**：功能需求、改进建议、Bug报告

```bash
python src/main.py requests.xlsx --type request
```

**分析维度**：
- 请求类型：8种智能分类
  - 功能请求、改进建议、Bug修复、技术支持
  - 性能优化、界面优化、数据相关、权限管理
- 紧急度：高/中/低优先级
- 需求统计：高频功能排行

**示例数据**：
- "希望增加批量导出Excel功能"
- "建议优化页面加载速度"
- "发现bug：点击提交会崩溃"

---

## 🔧 技术栈

- Python 3.10+
- SnowNLP（中文情感分析）
- jieba（中文分词）
- pandas（数据处理）
- matplotlib（图表）
- wordcloud（词云）
- PyInstaller（打包）

## 💡 使用技巧

### 批量处理

```bash
# 分析多个文件
for file in data/*.xlsx; do
    python src/main.py "$file" --output "output/$(basename $file .xlsx)"
done
```

### Python脚本调用

```python
from src.main import FeedbackAnalysisSystem

# 反馈分析（默认）
system = FeedbackAnalysisSystem(analysis_type='feedback')
result = system.analyze_from_excel('feedback.xlsx')
print(result['summary'])      # 情感统计
print(result['pain_points'])  # 痛点列表

# 请求分析 ⭐
system = FeedbackAnalysisSystem(analysis_type='request')
result = system.analyze_from_excel('requests.xlsx')
print(result['summary'])      # 请求统计
print(result['features'])     # 高频需求
```

## 🐛 常见问题

**Q: 提示找不到模块**  
A: 运行 `pip install -r requirements.txt`

**Q: 找不到反馈列**  
A: 使用 `--column` 参数指定列名

**Q: CSV文件中文显示乱码**  
A: 
- ✅ 系统已支持自动编码识别（UTF-8/GBK/GB2312/GB18030/Latin1）
- 如仍有问题：用Excel打开CSV → 另存为 → 选择 "CSV UTF-8"
- 或直接另存为 `.xlsx` 格式（推荐）

**Q: 能处理多大的数据量？**  
A: 
- ✅ 推荐：50-5000条
- ✅ 实测：1000条 <5秒
- ⚠️ 10000+条：建议分批处理（每批2000-3000条）

**Q: 情感分析不准确**  
A: 在 `config/custom_dict.txt` 中添加行业专有词汇

**Q: 如何分批处理大文件？**  
A: 
```python
import pandas as pd

# 读取大文件
df = pd.read_csv('large.csv')

# 分批处理（每批2000条）
batch_size = 2000
for i in range(0, len(df), batch_size):
    batch = df[i:i+batch_size]
    batch.to_csv(f'batch_{i//batch_size}.csv', index=False)
    # 然后分析: python src/main.py batch_0.csv
```

## 📝 开发路线

- [x] 情感分析（反馈模式）
- [x] 关键词提取  
- [x] Excel报表
- [x] 可视化图表
- [x] PyInstaller打包
- [x] 请求分析（请求模式）⭐
- [x] 智能分类（8种请求类型）⭐
- [x] 紧急度评估 ⭐
- [x] 多编码支持（UTF-8/GBK等）⭐
- [x] 独立文件夹输出 ⭐
- [ ] GUI图形界面
- [ ] API接口
- [ ] 英文支持

## 📄 许可证

MIT License

---

**🎯 现在就开始使用！**

1. 双击 `启动.bat` 安装依赖
2. 查看 `START_HERE.md` 了解更多
3. 选择模板文件准备数据：
   - `feedback_template.xlsx` - 分析用户反馈
   - `request_template.xlsx` - 分析功能请求 ⭐
4. 运行分析并查看报告

**需要帮助？** 查看 [START_HERE.md](START_HERE.md)
