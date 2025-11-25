-- 1. 创建一个 CTE (all_data) 来合并两个表的数据
WITH all_data AS 
    (SELECT id,
         strategy,
         behavior,
         _account_id,
         request_id
    FROM dw_wps_weboffice.ai_illustration
    WHERE dt = '2025-11-23'
    UNION ALL
     SELECT id,
         strategy,
         behavior,
         _account_id,
         request_id
    FROM dw_wps_office_web_doc.ai_illustration
    WHERE dt = '2025-11-23'),

-- 2. 在合并后的数据基础上进行分类
    dw_tb AS 
    (SELECT id,
        CASE
            WHEN strategy LIKE 'ai_%' THEN '生图配图'
            WHEN strategy LIKE 'auto_%' THEN '智能配图'
            WHEN strategy LIKE 'gallery_%' THEN '图库配图'
            -- 注意：这里没有 ELSE，会导致 NULL
        END AS picture_mode,
        CASE
            WHEN id LIKE '%/v3/%' OR id LIKE '%/doubao_v3/%' THEN 'v3'
            WHEN strategy LIKE '%3.0.2%' THEN 'v2'
            ELSE 'v1'
        END AS version,
        strategy,
        behavior,
        _account_id,
        request_id
    FROM all_data),

-- 3. 召回请求筛选：筛选有recall行为且request_id不为空的请求
    recall_tb AS 
    (SELECT request_id AS join_request_id
    FROM dw_tb
    WHERE behavior = 'recall'
        AND request_id <> ''
    GROUP BY request_id),

-- 4. 聚合 CTE：进行 CUBE 并只过滤聚合指标
    aggregated_data AS 
    (SELECT MIN(id) AS id,
             picture_mode,
             strategy,
             version,
             GROUPING(picture_mode) AS grp_picture_mode,
             -- 聚合指标
             COUNT(DISTINCT IF(behavior = 'change', _account_id, NULL)) AS change_uuv,
             COUNT(DISTINCT IF(behavior = 'recall', _account_id, NULL)) AS recall_uuv,
             COUNT(DISTINCT IF(behavior = 'delete', _account_id, NULL)) AS delete_uuv,
             SUM(IF(behavior = 'change', 1, 0)) AS change_pv,
             SUM(IF(behavior = 'recall', 1, 0)) AS recall_pv,
             SUM(IF(behavior = 'delete', 1, 0)) AS delete_pv
    FROM dw_tb a
    JOIN recall_tb b
        ON a.request_id = b.join_request_id
    WHERE a.picture_mode IS NOT NULL
    GROUP BY CUBE(picture_mode, strategy, version)
    HAVING COUNT(DISTINCT IF(behavior = 'recall', _account_id, NULL)) > 100),

-- 5. 过滤 CTE：保留汇总行和明细行
    filtered_data AS 
    (SELECT *
    FROM aggregated_data
    WHERE (grp_picture_mode = 1 OR picture_mode IS NOT NULL))

-- 6. 最终 SELECT：从 filtered_data 中选择和格式化
SELECT id AS `编号`,
     COALESCE(picture_mode, '总') AS `配图模式`,
     COALESCE(strategy, '总') AS `配图策略`,
     COALESCE(version, '总') AS `版本`,
     change_uuv AS `换图uv`,
     recall_uuv AS `召回uv`,
     delete_uuv AS `删图uv`,
     change_pv AS `换图pv`,
     recall_pv AS `召回pv`,
     delete_pv AS `删图pv`,
     -- 换图率(pv) = change_pv / recall_pv
     CASE 
         WHEN recall_pv > 0 THEN ROUND(change_pv * 1.0 / recall_pv, 4)
         ELSE NULL
     END AS `换图率(pv)`,
     -- 删图率(pv) = delete_pv / recall_pv
     CASE 
         WHEN recall_pv > 0 THEN ROUND(delete_pv * 1.0 / recall_pv, 4)
         ELSE NULL
     END AS `删图率(pv)`,
     -- 换图率(uv) = change_uuv / recall_uuv
     CASE 
         WHEN recall_uuv > 0 THEN ROUND(change_uuv * 1.0 / recall_uuv, 4)
         ELSE NULL
     END AS `换图率(uv)`,
     -- 删图率(uv) = delete_uuv / recall_uuv
     CASE 
         WHEN recall_uuv > 0 THEN ROUND(delete_uuv * 1.0 / recall_uuv, 4)
         ELSE NULL
     END AS `删图率(uv)`
FROM filtered_data
ORDER BY picture_mode DESC, version DESC;
