"""
请求内容分析模块 V2.0 - 优化版
专门用于分析用户请求、需求建议等内容
增强功能：BM25算法、智能停用词、同义词合并、多层次关键词提取
"""
import jieba
import jieba.analyse
from typing import List, Dict, Tuple
from collections import Counter
import logging
import os
import re

try:
    from rank_bm25 import BM25Okapi
    BM25_AVAILABLE = True
except ImportError:
    BM25_AVAILABLE = False
    logging.warning("rank_bm25未安装，将使用TF-IDF作为备选方案")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RequestAnalyzerV2:
    """用户请求内容分析器 - V2.0优化版"""
    
    def __init__(self, custom_dict_path: str = None):
        """
        初始化请求分析器
        
        Args:
            custom_dict_path: 自定义jieba词典路径
        """
        # 配置文件目录
        self.config_dir = os.path.join(os.path.dirname(__file__), '..', 'config')
        
        # 加载自定义词典
        if custom_dict_path and os.path.exists(custom_dict_path):
            jieba.load_userdict(custom_dict_path)
            logger.info(f"已加载自定义词典: {custom_dict_path}")
        
        # 加载业务词典
        business_dict_path = os.path.join(self.config_dir, 'business_dict.txt')
        if os.path.exists(business_dict_path):
            jieba.load_userdict(business_dict_path)
            logger.info(f"已加载业务词典: {business_dict_path}")
        
        # 添加请求相关关键词
        self._add_request_keywords()
        
        # 加载停用词
        self.stopwords = self._load_stopwords()
        logger.info(f"已加载 {len(self.stopwords)} 个停用词")
        
        # 加载同义词词典
        self.synonym_map = self._load_synonym_dict()
        logger.info(f"已加载 {len(self.synonym_map)} 组同义词")
        
        # 高频词过滤阈值（动态计算）
        self.high_freq_threshold = 0.8  # 出现频率>80%的词将被过滤
        
        logger.info("RequestAnalyzerV2 初始化完成（优化版）")
    
    def _add_request_keywords(self):
        """添加请求相关关键词到jieba词典"""
        request_keywords = [
            '希望', '建议', '请求', '需要', '增加', '添加', '新增',
            '改进', '优化', '提升', '支持', '实现', '开发',
            '功能', '特性', '模块', '接口', '页面', '按钮',
            '导出', '导入', '搜索', '筛选', '排序', '统计',
            '权限', '设置', '配置', '自定义', '批量', '一键'
        ]
        
        for word in request_keywords:
            jieba.add_word(word, freq=10000)
    
    def _load_stopwords(self) -> set:
        """加载停用词（基础+自定义）"""
        stopwords = set()
        
        # 基础停用词
        basic_stopwords = {
            '的', '了', '是', '在', '我', '有', '和', '就', '不', '人',
            '都', '一', '个', '上', '也', '很', '到', '说', '要', '去',
            '你', '会', '着', '没有', '看', '好', '自己', '这', '那',
            '能', '能否', '可以', '希望', '建议', '请', '帮', '谢谢',
            '她', '他', '它', '我们', '你们', '他们', '什么', '怎么'
        }
        stopwords.update(basic_stopwords)
        
        # 加载自定义停用词
        custom_stopwords_path = os.path.join(self.config_dir, 'stopwords_custom.txt')
        if os.path.exists(custom_stopwords_path):
            try:
                with open(custom_stopwords_path, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#'):
                            stopwords.add(line)
                logger.info(f"已加载自定义停用词: {custom_stopwords_path}")
            except Exception as e:
                logger.warning(f"加载自定义停用词失败: {e}")
        
        return stopwords
    
    def _load_synonym_dict(self) -> dict:
        """加载同义词词典"""
        synonym_map = {}
        synonym_path = os.path.join(self.config_dir, 'synonym_dict.txt')
        
        if os.path.exists(synonym_path):
            try:
                with open(synonym_path, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#'):
                            words = [w.strip() for w in line.split(',')]
                            if len(words) > 1:
                                core_word = words[0]  # 第一个词为核心词
                                for word in words:
                                    synonym_map[word] = core_word
                logger.info(f"已加载同义词词典: {synonym_path}")
            except Exception as e:
                logger.warning(f"加载同义词词典失败: {e}")
        
        return synonym_map
    
    def _preprocess_text(self, text: str) -> str:
        """文本预处理：清洗噪音"""
        # 去除多余空格
        text = re.sub(r'\s+', '', text)
        # 保留中文、英文、数字和有意义的标点
        text = re.sub(r'[^\u4e00-\u9fa5a-zA-Z0-9！？。，、；：]', '', text)
        return text
    
    def _filter_high_frequency_words(self, texts: List[str]) -> set:
        """
        动态识别高频重复词（出现在>80%的文本中）
        这些词通常是模板字段，没有分析价值
        """
        if not texts:
            return set()
        
        word_doc_count = Counter()
        total_docs = len(texts)
        
        # 统计每个词出现在多少个文档中
        for text in texts:
            words = set(jieba.lcut(text))
            for word in words:
                if len(word) >= 2:  # 只统计>=2字的词
                    word_doc_count[word] += 1
        
        # 过滤出现频率过高的词
        high_freq_words = set()
        for word, count in word_doc_count.items():
            if count / total_docs > self.high_freq_threshold:
                high_freq_words.add(word)
                logger.debug(f"过滤高频词: {word} (出现在{count}/{total_docs}={count/total_docs:.1%}的文档中)")
        
        if high_freq_words:
            logger.info(f"识别到 {len(high_freq_words)} 个高频模板词，将被过滤")
        
        return high_freq_words
    
    def _tokenize(self, text: str, dynamic_stopwords: set = None) -> List[str]:
        """
        分词并过滤停用词
        
        Args:
            text: 待分词文本
            dynamic_stopwords: 动态停用词（高频模板词）
        """
        words = jieba.lcut(text)
        
        # 合并停用词集合
        all_stopwords = self.stopwords.copy()
        if dynamic_stopwords:
            all_stopwords.update(dynamic_stopwords)
        
        # 过滤
        filtered_words = [
            w for w in words
            if len(w) >= 2  # 至少2个字符
            and w not in all_stopwords  # 不在停用词中
            and not w.isdigit()  # 不是纯数字
        ]
        
        return filtered_words
    
    def _merge_synonyms(self, keywords: List[str]) -> List[str]:
        """合并同义词"""
        merged = []
        for word in keywords:
            core_word = self.synonym_map.get(word, word)
            merged.append(core_word)
        # 去重并保持顺序
        seen = set()
        result = []
        for word in merged:
            if word not in seen:
                seen.add(word)
                result.append(word)
        return result
    
    def classify_request(self, text: str) -> Dict:
        """
        分类单条请求
        
        Args:
            text: 待分析文本
            
        Returns:
            请求分类结果
        """
        # 请求类型关键词
        request_types = {
            '功能请求': ['希望', '新增', '添加', '增加', '需要', '想要', '能否', '可以', '支持'],
            '改进建议': ['改进', '优化', '提升', '完善', '调整', '修改', '建议'],
            'Bug修复': ['bug', 'Bug', 'BUG', '错误', '异常', '问题', '故障', '崩溃', '闪退'],
            '技术支持': ['如何', '怎么', '怎样', '请问', '咨询', '帮助', '教程', '使用'],
            '性能优化': ['慢', '卡', '延迟', '加载', '响应', '速度', '性能', '流畅'],
            '界面优化': ['界面', '页面', '布局', '设计', '美观', '样式', '显示'],
            '数据相关': ['导出', '导入', '数据', '报表', '统计', '分析', '查询'],
            '权限管理': ['权限', '角色', '访问', '控制', '授权', '管理员']
        }
        
        # 统计每种类型的关键词出现次数
        type_scores = {}
        for req_type, keywords in request_types.items():
            score = sum(1 for keyword in keywords if keyword in text)
            if score > 0:
                type_scores[req_type] = score
        
        # 确定主要类型
        if type_scores:
            primary_type = max(type_scores, key=type_scores.get)
            confidence = type_scores[primary_type] / sum(type_scores.values())
        else:
            primary_type = "其他请求"
            confidence = 0.5
        
        # 判断紧急程度
        urgent_keywords = ['紧急', '急', '尽快', '立即', '马上', '重要', '必须', '严重']
        urgency = "高" if any(k in text for k in urgent_keywords) else "中"
        
        return {
            "text": text,
            "type": primary_type,
            "confidence": round(confidence, 2),
            "urgency": urgency,
            "all_types": type_scores
        }
    
    def batch_classify_requests(self, texts: List[str]) -> List[Dict]:
        """
        批量分类请求
        
        Args:
            texts: 文本列表
            
        Returns:
            分类结果列表
        """
        logger.info(f"开始批量请求分类，共 {len(texts)} 条")
        results = []
        
        for i, text in enumerate(texts, 1):
            if i % 100 == 0:
                logger.info(f"已处理 {i}/{len(texts)}")
            results.append(self.classify_request(text))
        
        logger.info("批量请求分类完成")
        return results
    
    def extract_features_bm25(self, texts: List[str], topK: int = 20) -> List[Tuple[str, int]]:
        """
        使用BM25算法提取高频功能需求（V2.0优化版）
        
        Args:
            texts: 请求文本列表
            topK: 返回前K个高频词
            
        Returns:
            功能需求及频次 [(功能, 频次), ...]
        """
        logger.info(f"开始提取功能需求（BM25算法），共 {len(texts)} 条请求")
        
        # 第1步：识别高频模板词
        dynamic_stopwords = self._filter_high_frequency_words(texts)
        
        # 第2步：分词（过滤停用词+高频词）
        tokenized_texts = []
        for text in texts:
            clean_text = self._preprocess_text(text)
            words = self._tokenize(clean_text, dynamic_stopwords)
            if words:  # 只保留有效分词结果
                tokenized_texts.append(words)
        
        if not tokenized_texts:
            logger.warning("分词结果为空，无法提取关键词")
            return []
        
        # 第3步：使用BM25或TF-IDF提取关键词
        if BM25_AVAILABLE:
            # BM25算法（推荐）
            bm25 = BM25Okapi(tokenized_texts)
            
            # 计算每个词的平均BM25得分
            word_scores = Counter()
            for words in tokenized_texts:
                scores = bm25.get_scores(words)
                for word, score in zip(words, scores):
                    word_scores[word] += score
            
            # 归一化得分并取TOP K
            features = word_scores.most_common(topK)
            logger.info(f"BM25提取到 {len(features)} 个高频功能需求")
        else:
            # 备选：简单词频统计
            all_words = []
            for words in tokenized_texts:
                all_words.extend(words)
            
            word_counter = Counter(all_words)
            features = word_counter.most_common(topK)
            logger.info(f"词频统计提取到 {len(features)} 个高频功能需求")
        
        # 第4步：同义词合并
        merged_features = {}
        for word, count in features:
            core_word = self.synonym_map.get(word, word)
            merged_features[core_word] = merged_features.get(core_word, 0) + count
        
        # 按频次排序
        final_features = sorted(merged_features.items(), key=lambda x: x[1], reverse=True)[:topK]
        
        logger.info(f"同义词合并后，最终提取 {len(final_features)} 个核心功能需求")
        return final_features
    
    def extract_features(self, texts: List[str], topK: int = 20) -> List[Tuple[str, int]]:
        """
        提取高频功能需求（统一入口）
        优先使用BM25，备选TF-IDF
        """
        return self.extract_features_bm25(texts, topK)
    
    def generate_summary(self, analysis_results: List[Dict]) -> Dict:
        """
        生成请求分析摘要
        
        Args:
            analysis_results: 请求分类结果列表
            
        Returns:
            统计摘要
        """
        total = len(analysis_results)
        if total == 0:
            return {}
        
        # 统计各类型数量
        type_counter = Counter([r['type'] for r in analysis_results])
        
        # 统计紧急程度
        urgency_counter = Counter([r['urgency'] for r in analysis_results])
        
        summary = {
            "total_requests": total,
            "type_distribution": dict(type_counter),
            "urgency_distribution": dict(urgency_counter),
            "high_urgency_count": urgency_counter.get('高', 0),
            "high_urgency_ratio": round(urgency_counter.get('高', 0) / total * 100, 2)
        }
        
        logger.info(f"请求分析摘要: 总计{total}条，高紧急度{summary['high_urgency_count']}条")
        return summary


# 向后兼容：保持原有的类名
RequestAnalyzer = RequestAnalyzerV2


if __name__ == "__main__":
    # 测试代码
    analyzer = RequestAnalyzerV2()
    
    test_requests = [
        "希望增加导出Excel功能",
        "建议优化页面加载速度，现在太慢了",
        "发现一个严重bug，点击提交按钮会闪退",
        "请问如何设置用户权限？",
        "能否添加批量删除功能",
        "界面设计需要改进，太复杂了",
        "紧急！数据导出功能失败",
        "建议增加搜索筛选功能"
    ]
    
    # 测试分类
    results = analyzer.batch_classify_requests(test_requests)
    print("\n【分类结果】")
    for r in results:
        print(f"{r['type']:10s} ({r['urgency']}): {r['text'][:30]}...")
    
    # 测试功能提取
    features = analyzer.extract_features(test_requests, topK=10)
    print(f"\n【高频功能需求】")
    for word, freq in features:
        print(f"  {word:15s} - {freq} 次")
    
    # 测试摘要
    summary = analyzer.generate_summary(results)
    print(f"\n【请求摘要】")
    print(f"  总请求数: {summary['total_requests']}")
    print(f"  类型分布: {summary['type_distribution']}")
    print(f"  紧急度: {summary['urgency_distribution']}")
