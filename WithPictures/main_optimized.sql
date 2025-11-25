-- 优化版本：提升性能的关键改进
-- 1. 提前过滤数据，减少处理量
-- 2. 优化JOIN顺序
-- 3. 减少CUBE计算量

-- 1. 创建一个 CTE (all_data) 来合并两个表的数据，并提前过滤
WITH all_data AS 
    (SELECT id,
         strategy,
         behavior,
         _account_id,
         request_id
    FROM hive.dw_wps_weboffice.ai_illustration
    WHERE dt >= '2025-11-22' 
        AND dt <= '2025-11-23'
        AND (strategy LIKE 'ai_%' OR strategy LIKE 'auto_%' OR strategy LIKE 'gallery_%')  -- 提前过滤配图模式
        AND request_id <> ''  -- 提前过滤空request_id
    UNION ALL
     SELECT id,
         strategy,
         behavior,
         _account_id,
         request_id
    FROM hive.dw_wps_office_web_doc.ai_illustration
    WHERE dt >= '2025-11-22' 
        AND dt <= '2025-11-23'
        AND (strategy LIKE 'ai_%' OR strategy LIKE 'auto_%' OR strategy LIKE 'gallery_%')  -- 提前过滤配图模式
        AND request_id <> ''),  -- 提前过滤空request_id
         dw_tb AS ( -- 2. 在合并后的数据基础上进行分类
        SELECT
        id,
        CASE
        WHEN strategy LIKE 'ai_%' THEN
        '生图配图'
        WHEN strategy LIKE 'auto_%' THEN
        '智能配图'
        WHEN strategy LIKE 'gallery_%' THEN
        '图库配图'
        END AS picture_mode,
    
        CASE
        WHEN id LIKE '%/v3/%' OR id LIKE '%/doubao_v3/%' THEN
        'v3'
        WHEN strategy LIKE '%3.0.2%' THEN
        'v2'
        ELSE 'v1'
        END AS version,
     strategy,
     behavior,
     _account_id,
     request_id
    FROM all_data 
    WHERE (strategy LIKE 'ai_%' OR strategy LIKE 'auto_%' OR strategy LIKE 'gallery_%')),  -- 确保picture_mode不为NULL
    recall_tb AS 
    (SELECT request_id AS join_request_id
    FROM dw_tb
    WHERE behavior = 'recall'
    GROUP BY  request_id ), -- 3. 召回请求筛选（已提前过滤空request_id）
    aggregated_data AS 
    (SELECT MIN(id) AS id,
             picture_mode,
             strategy,
             version,
             GROUPING(picture_mode) AS grp_picture_mode,
             COUNT(DISTINCT IF(behavior = 'change', _account_id, NULL)) AS change_uuv,
             COUNT(DISTINCT IF(behavior = 'recall', _account_id, NULL)) AS recall_uuv,
             COUNT(DISTINCT IF(behavior = 'delete', _account_id, NULL)) AS delete_uuv,
             COUNT(1) AS pv,
             SUM(IF(behavior = 'change', 1, 0)) AS change_pv,
             SUM(IF(behavior = 'recall', 1, 0)) AS recall_pv,
             SUM(IF(behavior = 'delete', 1, 0)) AS delete_pv
    FROM dw_tb a
    INNER JOIN recall_tb b
        ON a.request_id = b.join_request_id
    WHERE a.picture_mode IS NOT NULL
    GROUP BY  CUBE(picture_mode, strategy, version)
    HAVING COUNT(DISTINCT IF(behavior = 'recall', _account_id, NULL)) > 100 ), -- 4. 聚合 CTE
    filtered_data AS 
    (SELECT *
    FROM aggregated_data
    WHERE (grp_picture_mode = 1 OR picture_mode IS NOT NULL) ) -- 5. 过滤 CTE
SELECT id,
     COALESCE(picture_mode, '总') AS picture_mode,
     COALESCE(strategy, '总') AS strategy,
     COALESCE(version, '总') AS version,
     change_uuv,
     recall_uuv,
     delete_uuv,
     pv,
     change_pv,
     recall_pv,
     delete_pv
FROM filtered_data
ORDER BY  picture_mode DESC, version DESC


