"""
数据加载模块
支持Excel、CSV等格式的用户反馈数据读取
"""
import pandas as pd
import os
from typing import List, Dict
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class DataLoader:
    """数据加载器类"""
    
    def __init__(self):
        self.supported_formats = ['.xlsx', '.xls', '.csv']
    
    def load_from_excel(self, file_path: str, feedback_column: str = None) -> List[str]:
        """
        从Excel文件加载用户反馈数据
        
        Args:
            file_path: Excel文件路径
            feedback_column: 反馈内容列名，如果为None则自动检测
            
        Returns:
            反馈文本列表
        """
        try:
            logger.info(f"正在加载文件: {file_path}")
            
            # 检查文件是否存在
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"文件不存在: {file_path}")
            
            # 根据文件扩展名选择读取方式
            file_ext = os.path.splitext(file_path)[1].lower()
            
            if file_ext == '.csv':
                df = pd.read_csv(file_path, encoding='utf-8-sig')
            elif file_ext in ['.xlsx', '.xls']:
                df = pd.read_excel(file_path)
            else:
                raise ValueError(f"不支持的文件格式: {file_ext}")
            
            logger.info(f"成功读取 {len(df)} 行数据")
            
            # 如果未指定列名，尝试自动检测
            if feedback_column is None:
                feedback_column = self._detect_feedback_column(df)
                logger.info(f"自动检测到反馈列: {feedback_column}")
            
            # 提取反馈文本
            if feedback_column not in df.columns:
                raise ValueError(f"找不到指定的列: {feedback_column}")
            
            feedbacks = df[feedback_column].dropna().astype(str).tolist()
            
            # 过滤空白反馈
            feedbacks = [fb.strip() for fb in feedbacks if fb.strip()]
            
            logger.info(f"成功加载 {len(feedbacks)} 条有效反馈")
            return feedbacks
            
        except Exception as e:
            logger.error(f"加载数据失败: {str(e)}")
            raise
    
    def _detect_feedback_column(self, df: pd.DataFrame) -> str:
        """
        自动检测反馈内容列
        
        Args:
            df: DataFrame对象
            
        Returns:
            可能的反馈列名
        """
        # 常见的反馈列名关键词
        keywords = ['反馈', 'feedback', '评论', 'comment', '内容', 'content', 
                   '意见', '建议', '问题', 'issue', '描述', 'description']
        
        for col in df.columns:
            col_lower = str(col).lower()
            for keyword in keywords:
                if keyword in col_lower:
                    return col
        
        # 如果没有匹配，返回第一个文本列
        for col in df.columns:
            if df[col].dtype == 'object':
                return col
        
        # 如果都没有，返回第一列
        return df.columns[0]
    
    def load_from_list(self, feedbacks: List[str]) -> List[str]:
        """
        从列表加载反馈数据
        
        Args:
            feedbacks: 反馈文本列表
            
        Returns:
            处理后的反馈列表
        """
        return [fb.strip() for fb in feedbacks if fb and fb.strip()]
    
    def validate_data(self, feedbacks: List[str]) -> Dict:
        """
        验证数据质量
        
        Args:
            feedbacks: 反馈列表
            
        Returns:
            数据质量报告
        """
        total = len(feedbacks)
        avg_length = sum(len(fb) for fb in feedbacks) / total if total > 0 else 0
        
        report = {
            "total_count": total,
            "avg_length": round(avg_length, 2),
            "min_length": min(len(fb) for fb in feedbacks) if feedbacks else 0,
            "max_length": max(len(fb) for fb in feedbacks) if feedbacks else 0,
        }
        
        logger.info(f"数据验证完成: {report}")
        return report


if __name__ == "__main__":
    # 测试代码
    loader = DataLoader()
    
    # 测试数据
    test_data = [
        "这个软件太卡顿了，经常闪退",
        "界面设计很美观，用起来很舒服",
        "功能缺失，希望增加导出功能",
        "非常好用，推荐给朋友了",
        "价格太贵，性价比不高"
    ]
    
    feedbacks = loader.load_from_list(test_data)
    report = loader.validate_data(feedbacks)
    print(f"测试通过，加载了 {len(feedbacks)} 条反馈")
