-- 查看表结构的方法

-- 方法1: 查看第一个表的字段信息
DESCRIBE hive.dw_wps_weboffice.ai_illustration;

-- 方法2: 查看第二个表的字段信息
DESCRIBE hive.dw_wps_office_web_doc.ai_illustration;

-- 方法3: 查看详细格式化的表信息（包含分区、存储格式等）
-- DESCRIBE FORMATTED hive.dw_wps_weboffice.ai_illustration;
-- DESCRIBE FORMATTED hive.dw_wps_office_web_doc.ai_illustration;

-- 方法4: 查看表的前几条数据（了解数据格式）
-- SELECT * FROM hive.dw_wps_weboffice.ai_illustration LIMIT 5;
-- SELECT * FROM hive.dw_wps_office_web_doc.ai_illustration LIMIT 5;

