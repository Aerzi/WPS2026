# SQL 解析错误：缺少单引号

## 问题描述

**错误代码：** 21304  
**错误类型：** ParseException  
**错误信息：** `Error while compiling statement: FAILED: ParseException line 2:27 missing \' at ')' near '<EOF>'`

## 原始 SQL 代码

```sql
SELECT dt,model_type,
  COUNT(DISTINCT _device_id) AS uv
FROM dw_wps_pc_wpsoffice.ai_createrequest
WHERE dt >= '2025-08-23'
  AND ai_type = 'generate_ppt'
  AND is_new_interaction = 'true'
  AND upload_file_suffix = 'theme'
  AND model_type IN ('deepseek_model', 'default_model', 'deepresearch_model')
  AND websearch_status = 'websearch_close'
GROUP BY 
  dt, 
  model_type
ORDER BY model_type;
```

## 错误分析

### 错误信息翻译
- **ParseException** = 解析异常（SQL 语句在编译/解析阶段出错）
- **line 2:27** = 第2行第27个字符处
- **missing \'** = 缺少单引号
- **at ')'** = 在右括号处
- **near '<EOF>'** = 临近文件末尾（EOF = End Of File）

### 问题定位
错误发生在第2行：`COUNT(DISTINCT _device_id) AS uv`，第27个字符附近。

### 可能原因

1. **引号类型错误（最常见）**
   - 使用了中文全角引号：`'`、`'`
   - 应使用英文半角引号：`'`

2. **字段名需要转义**
   - 字段 `_device_id` 以下划线开头
   - 某些数据库引擎（如 Hive）可能要求特殊字段名用反引号包裹

3. **隐藏字符**
   - 复制粘贴可能带入不可见的特殊字符

## 解决方案

### 方案1：修正引号类型（推荐优先尝试）

确保所有单引号都是英文半角单引号：

```sql
SELECT dt, model_type,
  COUNT(DISTINCT _device_id) AS uv
FROM dw_wps_pc_wpsoffice.ai_createrequest
WHERE dt >= '2025-08-23'
  AND ai_type = 'generate_ppt'
  AND is_new_interaction = 'true'
  AND upload_file_suffix = 'theme'
  AND model_type IN ('deepseek_model', 'default_model', 'deepresearch_model')
  AND websearch_status = 'websearch_close'
GROUP BY 
  dt, 
  model_type
ORDER BY model_type;
```

### 方案2：转义特殊字段名

对以下划线开头的字段使用反引号：

```sql
SELECT dt, model_type,
  COUNT(DISTINCT `_device_id`) AS uv
FROM dw_wps_pc_wpsoffice.ai_createrequest
WHERE dt >= '2025-08-23'
  AND ai_type = 'generate_ppt'
  AND is_new_interaction = 'true'
  AND upload_file_suffix = 'theme'
  AND model_type IN ('deepseek_model', 'default_model', 'deepresearch_model')
  AND websearch_status = 'websearch_close'
GROUP BY 
  dt, 
  model_type
ORDER BY model_type;
```

### 方案3：重写代码避免隐藏字符

完全手动重写第一、二行：

```sql
SELECT dt, model_type, COUNT(DISTINCT _device_id) AS uv
FROM dw_wps_pc_wpsoffice.ai_createrequest
WHERE dt >= '2025-08-23'
  AND ai_type = 'generate_ppt'
  AND is_new_interaction = 'true'
  AND upload_file_suffix = 'theme'
  AND model_type IN ('deepseek_model', 'default_model', 'deepresearch_model')
  AND websearch_status = 'websearch_close'
GROUP BY dt, model_type
ORDER BY model_type;
```

## 预防措施

1. **输入法管理**
   - 编写 SQL 时切换到英文输入法
   - 避免使用中文输入法输入引号和标点

2. **代码编辑器设置**
   - 启用"显示不可见字符"功能
   - 可以看到空格、制表符等隐藏字符

3. **代码复制**
   - 从其他来源复制代码时，检查引号类型
   - 必要时手动重新输入特殊字符

## 适用数据库

- Hive SQL
- Spark SQL
- Presto
- 其他大数据查询引擎

## 标签

`#SQL` `#ParseException` `#Hive` `#引号错误` `#语法错误`

