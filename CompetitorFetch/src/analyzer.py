"""
NLP分析核心模块
基于SnowNLP和jieba实现情感分析和关键词提取
"""
import jieba
import jieba.analyse
from snownlp import SnowNLP
from typing import List, Dict, Tuple
from collections import Counter
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FeedbackAnalyzer:
    """用户反馈分析器"""
    
    def __init__(self, custom_dict_path: str = None):
        """
        初始化分析器
        
        Args:
            custom_dict_path: 自定义词典路径
        """
        # 加载自定义词典（产品相关术语）
        if custom_dict_path and os.path.exists(custom_dict_path):
            jieba.load_userdict(custom_dict_path)
            logger.info(f"已加载自定义词典: {custom_dict_path}")
        
        # 添加常见产品反馈词汇
        self._add_product_keywords()
        
        logger.info("FeedbackAnalyzer 初始化完成")
    
    def _add_product_keywords(self):
        """添加产品相关关键词到jieba词典"""
        product_keywords = [
            '卡顿', '闪退', '崩溃', '加载慢', '响应慢',
            '功能缺失', '操作复杂', '界面混乱', '不好用',
            '性价比', '用户体验', '交互设计', '视觉设计',
            '易用性', '稳定性', '兼容性', '流畅度'
        ]
        
        for word in product_keywords:
            jieba.add_word(word, freq=10000)
    
    def analyze_sentiment(self, text: str) -> Dict:
        """
        分析单条文本的情感
        
        Args:
            text: 待分析文本
            
        Returns:
            情感分析结果字典
        """
        try:
            s = SnowNLP(text)
            sentiment_score = s.sentiments  # 0-1之间，越接近1越积极
            
            # 分类规则
            if sentiment_score >= 0.6:
                sentiment = "正面"
                emotion = "😊"
            elif sentiment_score >= 0.4:
                sentiment = "中性"
                emotion = "😐"
            else:
                sentiment = "负面"
                emotion = "😞"
            
            return {
                "text": text,
                "sentiment": sentiment,
                "sentiment_score": round(sentiment_score, 4),
                "emotion": emotion
            }
        except Exception as e:
            logger.error(f"情感分析失败: {str(e)}")
            return {
                "text": text,
                "sentiment": "未知",
                "sentiment_score": 0.5,
                "emotion": "❓"
            }
    
    def batch_analyze_sentiment(self, texts: List[str]) -> List[Dict]:
        """
        批量分析情感
        
        Args:
            texts: 文本列表
            
        Returns:
            分析结果列表
        """
        logger.info(f"开始批量情感分析，共 {len(texts)} 条")
        results = []
        
        for i, text in enumerate(texts, 1):
            if i % 100 == 0:
                logger.info(f"已处理 {i}/{len(texts)}")
            results.append(self.analyze_sentiment(text))
        
        logger.info("批量情感分析完成")
        return results
    
    def extract_keywords(self, text: str, topK: int = 10) -> List[Tuple[str, float]]:
        """
        从单条文本提取关键词
        
        Args:
            text: 待分析文本
            topK: 返回前K个关键词
            
        Returns:
            关键词及权重列表 [(词, 权重), ...]
        """
        try:
            # 使用TF-IDF提取关键词
            keywords = jieba.analyse.extract_tags(
                text, 
                topK=topK, 
                withWeight=True,
                allowPOS=('n', 'v', 'vn', 'a', 'an')  # 只保留名词、动词、形容词
            )
            return keywords
        except Exception as e:
            logger.error(f"关键词提取失败: {str(e)}")
            return []
    
    def extract_pain_points(self, texts: List[str], topK: int = 20) -> List[Tuple[str, int]]:
        """
        从所有反馈中提取高频痛点词汇
        
        Args:
            texts: 反馈文本列表
            topK: 返回前K个高频词
            
        Returns:
            痛点词及频次 [(词, 频次), ...]
        """
        logger.info(f"开始提取痛点词汇，共 {len(texts)} 条反馈")
        
        # 痛点相关的负面词汇
        pain_point_indicators = [
            '卡', '慢', '闪退', '崩溃', '失败', '错误', '问题',
            '缺少', '缺失', '没有', '不能', '无法', '难', '复杂',
            '差', '垃圾', '烂', 'bug', '故障', '卡顿', '延迟'
        ]
        
        all_words = []
        
        for text in texts:
            # 只分析负面或中性反馈
            sentiment = self.analyze_sentiment(text)
            if sentiment['sentiment_score'] < 0.6:  # 非正面反馈
                words = jieba.lcut(text)
                # 过滤长度和停用词
                words = [w for w in words if len(w) >= 2 and w not in self._get_stopwords()]
                all_words.extend(words)
        
        # 统计词频
        word_counter = Counter(all_words)
        
        # 优先提取包含痛点指示词的短语
        pain_points = []
        for word, count in word_counter.most_common(topK * 2):
            # 如果词语本身是痛点指示词，或包含痛点特征
            if any(indicator in word for indicator in pain_point_indicators):
                pain_points.append((word, count))
            elif count >= 2:  # 出现次数足够多
                pain_points.append((word, count))
        
        logger.info(f"提取到 {len(pain_points[:topK])} 个高频痛点")
        return pain_points[:topK]
    
    def _get_stopwords(self) -> set:
        """获取停用词列表"""
        stopwords = {
            '的', '了', '是', '在', '我', '有', '和', '就', '不', '人',
            '都', '一', '个', '上', '也', '很', '到', '说', '要', '去',
            '你', '会', '着', '没有', '看', '好', '自己', '这', '那'
        }
        return stopwords
    
    def generate_summary(self, analysis_results: List[Dict]) -> Dict:
        """
        生成分析摘要
        
        Args:
            analysis_results: 情感分析结果列表
            
        Returns:
            统计摘要
        """
        total = len(analysis_results)
        if total == 0:
            return {}
        
        sentiment_counter = Counter([r['sentiment'] for r in analysis_results])
        
        positive_count = sentiment_counter.get('正面', 0)
        neutral_count = sentiment_counter.get('中性', 0)
        negative_count = sentiment_counter.get('负面', 0)
        
        summary = {
            "total_feedback": total,
            "positive_count": positive_count,
            "neutral_count": neutral_count,
            "negative_count": negative_count,
            "positive_ratio": round(positive_count / total * 100, 2),
            "neutral_ratio": round(neutral_count / total * 100, 2),
            "negative_ratio": round(negative_count / total * 100, 2),
            "avg_sentiment_score": round(
                sum(r['sentiment_score'] for r in analysis_results) / total, 4
            )
        }
        
        logger.info(f"分析摘要: 正面{positive_count}, 中性{neutral_count}, 负面{negative_count}")
        return summary


if __name__ == "__main__":
    # 测试代码
    analyzer = FeedbackAnalyzer()
    
    test_feedbacks = [
        "这个软件太卡顿了，经常闪退，体验很差",
        "界面设计很美观，用起来很舒服，功能也很强大",
        "功能缺失，希望增加导出功能，操作有点复杂",
        "非常好用，推荐给朋友了，五星好评",
        "价格太贵，性价比不高，而且还经常崩溃"
    ]
    
    # 测试情感分析
    results = analyzer.batch_analyze_sentiment(test_feedbacks)
    for r in results:
        print(f"{r['emotion']} {r['sentiment']} ({r['sentiment_score']:.2f}): {r['text'][:30]}...")
    
    # 测试痛点提取
    pain_points = analyzer.extract_pain_points(test_feedbacks, topK=10)
    print(f"\n高频痛点词汇: {pain_points}")
    
    # 测试摘要
    summary = analyzer.generate_summary(results)
    print(f"\n分析摘要: {summary}")
