# 用户反馈自动分析系统

> 基于NLP的轻量级反馈分析工具，自动提取情感和痛点

## 🚀 快速开始

### Windows用户（推荐）

**双击运行 `启动.bat`**，选择操作：
- [1] 安装依赖（首次使用）
- [2] 运行演示
- [3] 分析文件
- [4] 打包为EXE

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

- ✅ **情感分析**：自动判断正面/负面/中性
- ✅ **痛点提取**：识别高频问题词汇
- ✅ **自动报表**：生成Excel报告和可视化图表
- ✅ **轻量快速**：无需GPU，3秒分析175条反馈
- ✅ **中文优化**：专门针对中文文本

## 📊 数据格式

### 方式1：使用模板（推荐）

打开 `feedback_template.xlsx`，填写反馈内容即可。

### 方式2：自己的Excel文件

只需包含一列反馈文本：

| 反馈内容 |
|----------|
| 这个软件太卡顿了 |
| 界面设计很美观 |
| 功能缺失，希望增加导出 |

**支持的格式**：`.xlsx`、`.xls`、`.csv`（UTF-8编码）

**自动识别列名**：反馈、feedback、评论、comment、内容、content等

**手动指定列名**：
```bash
python src/main.py data.xlsx --column 你的列名
```

## 📈 输出结果

运行后在 `output` 目录生成：

1. **Excel报告** - 详细分析、统计摘要、高频痛点
2. **情感分布饼图** - 正面/负面/中性占比
3. **痛点词云图** - 高频问题可视化
4. **痛点排行图** - Top 15问题柱状图

## 🔧 命令行参数

```bash
# 基本用法
python src/main.py feedback.xlsx

# 指定反馈列
python src/main.py feedback.xlsx --column 用户评论

# 指定输出目录
python src/main.py feedback.xlsx --output reports

# 使用配置文件
python src/main.py feedback.xlsx --config config/config.json
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
双击 启动.bat → 选择 [4] 打包为EXE

# 方式2：命令行
python build.py
```

打包后的文件在 `dist/FeedbackAnalyzer/` 目录，可分发给其他用户使用。

## 📁 项目结构

```
CompetitorFetch/
├── 启动.bat                  # Windows启动脚本
├── START_HERE.md            # 新手入门指南
├── README.md                # 本文档
├── requirements.txt         # 依赖列表
├── feedback_template.xlsx   # 数据模板
├── demo_data.xlsx           # 演示数据
├── src/                     # 源代码
│   ├── main.py             # 主程序
│   ├── analyzer.py         # 分析引擎
│   ├── data_loader.py      # 数据加载
│   └── report_generator.py # 报表生成
├── config/                  # 配置文件
│   ├── config.json         # 系统配置
│   └── custom_dict.txt     # 自定义词典
└── output/                  # 输出目录（自动创建）
```

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

# 初始化系统
system = FeedbackAnalysisSystem()

# 分析Excel文件
result = system.analyze_from_excel('data.xlsx')

# 查看结果
print(result['summary'])
print(result['pain_points'])
```

## 🐛 常见问题

**Q: 提示找不到模块**  
A: 运行 `pip install -r requirements.txt`

**Q: 找不到反馈列**  
A: 使用 `--column` 参数指定列名

**Q: 中文显示乱码**  
A: 确保文件使用UTF-8编码，或用Excel另存为 `.xlsx` 格式

**Q: 情感分析不准确**  
A: 在 `config/custom_dict.txt` 中添加行业专有词汇

**Q: 分析速度慢**  
A: 建议每批处理1000-2000条数据

## 📝 开发路线

- [x] 情感分析
- [x] 关键词提取  
- [x] Excel报表
- [x] 可视化图表
- [x] PyInstaller打包
- [ ] GUI图形界面
- [ ] API接口
- [ ] 英文支持

## 📄 许可证

MIT License

---

**🎯 现在就开始使用！**

1. 双击 `启动.bat` 安装依赖
2. 查看 `START_HERE.md` 了解更多
3. 使用 `feedback_template.xlsx` 准备数据
4. 运行分析并查看报告

**需要帮助？** 查看 [START_HERE.md](START_HERE.md)
