# 📦 测试数据集完整包

> 一站式测试数据解决方案，支持CSV和Excel格式，涵盖小数据到大数据多种场景

---

## 🎯 核心特性

✨ **多种规模**: 从7条到200条，满足不同测试需求  
✨ **真实场景**: 模拟实际业务数据，包含UV统计、用户、产品、订单  
✨ **完整字段**: 每个数据集包含10+个有意义的字段  
✨ **中文支持**: UTF-8编码，完美支持中文内容  
✨ **易于转换**: 提供3种工具，一键转CSV为Excel  
✨ **详细文档**: 5份文档，从快速开始到深入分析

---

## 📂 快速导航

### 🚀 新手入门
**→ 先看这个**: [`快速开始.md`](快速开始.md)
- 3步快速开始
- 5种常见测试场景
- 数据字段速查表
- 常见问题解答

### 📊 数据文件

#### 小数据集（快速测试）
| 文件 | 记录数 | 用途 |
|------|--------|------|
| `test_data_uv_stats.csv` | 7条 | UV/PV基础测试 |
| `test_data_users.csv` | 15条 | 用户信息测试 |
| `test_data_products.csv` | 15条 | 产品数据测试 |
| `test_data_large.csv` | 30条 | 订单批量测试 |
| `test_data_special.csv` | 10条 | 特殊字符测试 |
| `test_data_empty.csv` | 0条 | 空文件测试 |

#### 扩展数据集（真实场景）
| 文件 | 记录数 | 用途 |
|------|--------|------|
| `test_data_uv_stats_extended.csv` | 90条 | 3个月UV趋势分析 |
| `test_data_users_extended.csv` | 100条 | 用户画像和会员分析 |
| `test_data_products_extended.csv` | 70条 | 产品目录和库存管理 |
| `test_data_orders_extended.csv` | 200条 | 订单数据和销售分析 |

**总计**: 10个测试文件，涵盖**542条记录**，约**69KB**

### 🔧 转换工具

需要Excel格式？选择一个工具：

| 工具 | 平台 | 特点 | 使用 |
|------|------|------|------|
| `convert_to_excel.vbs` | Windows | ⭐推荐，无需安装 | 双击运行 |
| `convert_to_excel.ps1` | Windows | 更详细输出 | PowerShell运行 |
| `convert_csv_to_excel.py` | 跨平台 | 速度快 | Python运行 |

### 📖 文档指南

| 文档 | 适合人群 | 内容 |
|------|---------|------|
| [`快速开始.md`](快速开始.md) | 🆕新手 | 3步上手，5种场景 |
| [`README_扩展数据说明.md`](README_扩展数据说明.md) | 📊分析师 | 字段详解，SQL示例 |
| [`数据对比说明.md`](数据对比说明.md) | 🔍测试人员 | 数据对比，性能参考 |
| `00_README_总览.md` | 👀所有人 | 全局导航（本文件） |

---

## 💼 使用场景矩阵

### 按测试类型选择

| 测试类型 | 推荐数据集 | 文件数量 | 说明 |
|---------|-----------|---------|------|
| **单元测试** | 小数据集 | 1-2个 | 快速，确定性强 |
| **功能测试** | 小数据集 | 2-4个 | 覆盖主要功能 |
| **性能测试** | 扩展数据集 | 1-2个 | 测试加载和查询 |
| **压力测试** | 扩展数据集×N | 复制多份 | 模拟高并发 |
| **边界测试** | 特殊+空数据 | 2个 | 测试健壮性 |
| **演示展示** | 小数据集 | 1-2个 | 简洁清晰 |

### 按业务场景选择

| 业务场景 | 数据组合 | 分析重点 |
|---------|---------|---------|
| **用户分析** | 用户信息 + 订单 | RFM模型，用户画像 |
| **销售分析** | 产品 + 订单 | 销售排行，收入统计 |
| **趋势分析** | UV统计（扩展） | 时间序列，趋势预测 |
| **库存管理** | 产品（扩展） | 库存预警，补货建议 |
| **地域分析** | 用户 + 订单 | 地域分布，热力图 |

### 按工具选择

| 工具类型 | 推荐格式 | 操作 |
|---------|---------|------|
| **Excel/WPS** | CSV或XLSX | 直接打开 |
| **数据库** | CSV | 导入向导 |
| **Python** | CSV | pandas读取 |
| **BI工具** | XLSX | 数据源连接 |
| **Web前端** | CSV | Ajax加载 |

---

## 🎓 学习路径

### 路径1: 快速上手（15分钟）
```
1. 阅读"快速开始.md" (5分钟)
   ↓
2. 打开test_data_users.csv (2分钟)
   ↓
3. 尝试筛选和排序 (5分钟)
   ↓
4. 运行转换工具生成Excel (3分钟)
```

### 路径2: 数据分析（30分钟）
```
1. 阅读"扩展数据说明" (10分钟)
   ↓
2. 导入orders_extended.csv到数据库 (5分钟)
   ↓
3. 运行SQL示例查询 (10分钟)
   ↓
4. 创建数据可视化图表 (5分钟)
```

### 路径3: 深度测试（1小时）
```
1. 阅读所有文档 (20分钟)
   ↓
2. 设计测试用例 (15分钟)
   ↓
3. 执行功能测试 (15分钟)
   ↓
4. 执行性能测试 (10分钟)
```

---

## 📈 数据统计总览

### 数据规模对比

```
小数据集总计:    77条记录   (~5KB)
扩展数据集总计:  460条记录  (~64KB)
全部数据:        542条记录  (~69KB)
```

### 字段统计

```
基础字段:   5-7个/表
扩展字段:   9-12个/表
数据类型:   字符串、数字、日期、枚举
中文内容:   用户名、城市、产品名、地址等
```

### 时间跨度

```
UV统计:     2025-08-01 ~ 2025-10-29 (90天)
订单数据:   2025-01-01 ~ 2025-04-10 (100天)
用户注册:   2023-01-15 ~ 2024-10-27 (23个月)
```

### 数据分布

```
地域:      覆盖中国100+城市，30+省份
价格:      29.90元 ~ 8999.00元
品类:      电子产品、服装、食品、图书、家居
会员等级:  Bronze、Silver、Gold、Platinum、Diamond
```

---

## 🔥 热门使用案例

### 案例1: SQL练习
```sql
-- 使用orders_extended.csv练习复杂查询
SELECT 
    province,
    COUNT(*) as order_count,
    SUM(total_amount) as revenue,
    AVG(total_amount) as avg_order_value
FROM orders
WHERE status = '已完成'
GROUP BY province
HAVING revenue > 10000
ORDER BY revenue DESC;
```

### 案例2: Excel数据透视表
```
1. 打开orders_extended.csv
2. 插入 → 数据透视表
3. 行：payment_method
4. 列：status
5. 值：total_amount (求和)
```

### 案例3: Python数据分析
```python
import pandas as pd
import matplotlib.pyplot as plt

# 读取UV数据
df = pd.read_csv('test_data_uv_stats_extended.csv')
df['dt'] = pd.to_datetime(df['dt'])

# 绘制趋势图
plt.figure(figsize=(12, 6))
plt.plot(df['dt'], df['uv'], label='UV')
plt.plot(df['dt'], df['pv'], label='PV')
plt.legend()
plt.title('UV/PV Trend')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

### 案例4: 数据库导入
```sql
-- MySQL导入示例
CREATE TABLE users (
    user_id VARCHAR(10),
    username VARCHAR(50),
    age INT,
    city VARCHAR(50),
    register_date DATE,
    email VARCHAR(100),
    vip_level VARCHAR(20)
);

LOAD DATA LOCAL INFILE 'test_data_users_extended.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

---

## ⚙️ 技术规格

### 文件规格
- **编码**: UTF-8 (支持中文)
- **格式**: CSV (Comma-Separated Values)
- **分隔符**: 逗号 `,`
- **引号**: 双引号 `"` (包含特殊字符时)
- **行尾**: LF (`\n`) 或 CRLF (`\r\n`)

### 数据质量
- ✅ 无重复主键
- ✅ 关联关系一致
- ✅ 数据类型正确
- ✅ 少量NULL值（用于测试）
- ✅ 真实的数据分布

### 兼容性
- ✅ Excel 2010+
- ✅ WPS表格
- ✅ Google Sheets
- ✅ MySQL/PostgreSQL/SQLite
- ✅ Python pandas
- ✅ R语言
- ✅ Tableau/Power BI

---

## 🛠️ 常用命令速查

### Windows命令提示符
```cmd
# 查看文件前5行
type test_data_users.csv | more

# 统计文件行数
find /c /v "" test_data_users.csv

# 批量转换（运行VBS脚本）
cscript convert_to_excel.vbs
```

### PowerShell
```powershell
# 查看CSV内容
Import-Csv test_data_users.csv | Format-Table

# 统计记录数
(Import-Csv test_data_users.csv).Count

# 筛选数据
Import-Csv test_data_users.csv | Where-Object {$_.city -eq "北京"}
```

### Linux/Mac
```bash
# 查看前5行
head -n 5 test_data_users.csv

# 统计行数（不含表头）
tail -n +2 test_data_users.csv | wc -l

# 按字段筛选（第4列是城市）
awk -F',' '$4=="北京"' test_data_users.csv
```

### Python
```python
import pandas as pd

# 读取
df = pd.read_csv('test_data_users.csv')

# 查看基本信息
print(df.info())
print(df.describe())

# 筛选
beijing_users = df[df['city'] == '北京']
print(beijing_users)
```

---

## 📊 性能基准测试

基于扩展数据集的参考性能（实际性能取决于硬件配置）：

| 操作 | 数据量 | 预期时间 | 工具 |
|------|--------|---------|------|
| CSV加载 | 200条 | <50ms | pandas |
| Excel转换 | 1个文件 | <1s | VBScript |
| 数据库导入 | 500条 | <500ms | MySQL |
| 全表查询 | 200条 | <10ms | SQL |
| 聚合查询 | 200条 | <50ms | SQL |
| 数据透视 | 200条 | <200ms | Excel |
| 可视化 | 90个点 | <500ms | matplotlib |

---

## 🎁 额外资源

### 在线工具推荐
- **CSV查看**: [CSVLint](https://csvlint.io/)
- **数据可视化**: [RAWGraphs](https://rawgraphs.io/)
- **SQL练习**: [SQL Fiddle](http://sqlfiddle.com/)
- **正则测试**: [Regex101](https://regex101.com/)

### 学习资源
- **SQL教程**: [SQL Tutorial - W3Schools](https://www.w3schools.com/sql/)
- **Pandas文档**: [Pandas Documentation](https://pandas.pydata.org/docs/)
- **Excel技巧**: [Excel Easy](https://www.excel-easy.com/)

---

## 🤝 贡献与反馈

### 发现问题？
- 数据错误
- 文档不清楚
- 工具有bug

### 需要更多？
- 其他业务场景数据
- 更大规模数据集
- 其他格式支持

### 建议改进？
- 优化数据质量
- 增加文档说明
- 改进转换工具

---

## 📋 更新日志

### v2.0 (2025-10-29)
- ✨ 新增4个扩展数据集（90-200条记录）
- ✨ 新增3种格式转换工具
- ✨ 新增5份详细文档
- ✨ 数据字段从5-7个扩展到9-12个
- 🐛 修复CSV编码问题
- 📝 完善使用说明

### v1.0 (2025-10-26)
- 🎉 初始版本
- 📁 6个基础CSV测试文件
- 📖 基础使用说明

---

## 📞 快速帮助

### ❓ 我该从哪里开始？
👉 看 [`快速开始.md`](快速开始.md)

### ❓ 如何转换为Excel？
👉 双击运行 `convert_to_excel.vbs`

### ❓ 数据字段是什么意思？
👉 看 [`README_扩展数据说明.md`](README_扩展数据说明.md)

### ❓ 如何选择合适的数据集？
👉 看 [`数据对比说明.md`](数据对比说明.md)

### ❓ 如何进行数据分析？
👉 看 [`README_扩展数据说明.md`](README_扩展数据说明.md) 的分析示例

---

## 🎉 开始使用

**新手？** → 阅读 [`快速开始.md`](快速开始.md)，3步上手

**开发者？** → 选择数据集，开始测试你的功能

**分析师？** → 导入数据，运行SQL查询和可视化

**测试人员？** → 设计用例，执行全面测试

---

<div align="center">

**祝你测试顺利！** 🚀

*最后更新: 2025-10-29 | 版本: v2.0*

</div>

