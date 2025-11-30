# 🚀 新手入门指南

> 5分钟快速上手用户反馈分析系统

## ⚡ 最快开始方式

### Windows用户

**双击运行 `启动.bat`** → 选择操作

```
[1] 安装依赖（首次使用）
[2] 运行演示
[3] 分析文件
[4] 打包为EXE
```

### 其他系统

```bash
# 安装依赖
pip install -r requirements.txt

# 运行演示
python src/main.py demo_data.xlsx

# 分析自己的数据
python src/main.py your_feedback.xlsx
```

---

## 📝 准备数据（3种方式）

### 方式1：使用模板（最简单）⭐

1. 打开 `feedback_template.xlsx`
2. 删除示例数据
3. 填写你的反馈内容
4. 保存并运行分析

```bash
python src/main.py feedback_template.xlsx
```

### 方式2：自己的Excel文件

只需要一列反馈文本：

| 反馈内容 |
|----------|
| 软件太卡顿了 |
| 界面很美观 |
| 功能缺失 |

**自动识别这些列名**：
- 反馈、feedback
- 评论、comment
- 内容、content
- 意见、建议、问题

### 方式3：手动指定列名

如果列名不在上面列表：

```bash
python src/main.py data.xlsx --column 你的列名
```

---

## 📊 查看结果

运行后打开 `output` 目录，会看到：

| 文件 | 说明 |
|------|------|
| `用户反馈分析报告_*.xlsx` | Excel报告（详细分析+统计+痛点） |
| `情感分布_*.png` | 正面/负面/中性占比饼图 |
| `痛点词云_*.png` | 高频问题词云图 |
| `痛点排行_*.png` | Top 15问题柱状图 |

---

## 🎯 常用命令

```bash
# 最简单
python src/main.py your_file.xlsx

# 指定反馈列
python src/main.py your_file.xlsx --column 用户评论

# 指定输出目录
python src/main.py your_file.xlsx --output 报告文件夹

# 完整命令
python src/main.py your_file.xlsx --column 反馈内容 --output reports
```

---

## ⚙️ 自定义配置

### 修改配置文件

编辑 `config/config.json`：

```json
{
  "output_dir": "output",        // 输出目录
  "top_pain_points": 20,         // 提取多少个痛点
  "sentiment_thresholds": {
    "positive_min": 0.6,         // 正面情感阈值
    "neutral_min": 0.4           // 中性情感阈值
  }
}
```

### 添加自定义词汇

编辑 `config/custom_dict.txt`，添加行业词汇：

```
产品名 10000 n
功能名 10000 n
```

---

## 💡 实用技巧

### 技巧1：批量分析

将多个Excel文件放在一个文件夹，批量分析：

```bash
# Windows
for %f in (data\*.xlsx) do python src/main.py "%f"

# Linux/Mac
for file in data/*.xlsx; do python src/main.py "$file"; done
```

### 技巧2：在Python代码中使用

```python
from src.main import FeedbackAnalysisSystem

system = FeedbackAnalysisSystem()
result = system.analyze_from_excel('data.xlsx')

print(result['summary'])      # 查看统计摘要
print(result['pain_points'])  # 查看痛点列表
```

### 技巧3：定期分析

创建定时任务，每周自动分析最新反馈：

```bash
# Windows: 任务计划程序
# Linux: crontab
0 9 * * 1 python /path/to/src/main.py /path/to/weekly_feedback.xlsx
```

---

## 🐛 常见问题速查

| 问题 | 解决方法 |
|------|----------|
| 提示找不到模块 | `pip install -r requirements.txt` |
| 找不到反馈列 | `--column 你的列名` |
| 中文乱码 | 用Excel另存为 `.xlsx` 格式 |
| 分析不准确 | 在 `custom_dict.txt` 添加词汇 |
| 处理速度慢 | 建议每批1000-2000条 |

---

## 📚 更多信息

- **完整文档**：查看 [README.md](README.md)
- **配置说明**：编辑 `config/config.json`
- **自定义词典**：编辑 `config/custom_dict.txt`
- **查看日志**：打开 `feedback_analysis.log`

---

## 📁 项目文件说明

```
CompetitorFetch/
├── 启动.bat                  ← Windows一键启动
├── START_HERE.md            ← 你在这里！
├── README.md                ← 完整文档
├── feedback_template.xlsx   ← 数据模板
├── demo_data.xlsx           ← 演示数据
├── src/                     ← 源代码
├── config/                  ← 配置文件
└── output/                  ← 输出目录
```

---

## ✅ 快速检查清单

开始前请确认：

- [ ] 已安装Python 3.10+
- [ ] 已运行 `pip install -r requirements.txt`
- [ ] 数据文件包含反馈文本列
- [ ] 文件格式为 .xlsx / .xls / .csv

---

## 🎉 立即开始

### 第1步：安装依赖
```bash
双击 启动.bat → 选择 [1]
```

### 第2步：查看演示
```bash
双击 启动.bat → 选择 [2]
```

### 第3步：分析自己的数据
```bash
python src/main.py your_feedback.xlsx
```

---

**🎯 就是这么简单！现在开始分析你的用户反馈吧！**

**遇到问题？** 查看 [README.md](README.md) 或检查 `feedback_analysis.log` 日志文件
