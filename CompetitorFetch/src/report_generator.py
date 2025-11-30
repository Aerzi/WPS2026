"""
报表生成模块
生成Excel报表和可视化图表
"""
import pandas as pd
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import os
from typing import List, Dict
from datetime import datetime
import logging

# 配置中文字体
plt.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei', 'Arial Unicode MS']
plt.rcParams['axes.unicode_minus'] = False

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ReportGenerator:
    """报表生成器"""
    
    def __init__(self, output_dir: str = "output", create_subdir: bool = True, input_filename: str = None):
        """
        初始化报表生成器
        
        Args:
            output_dir: 输出目录
            create_subdir: 是否为每次分析创建子目录
            input_filename: 输入文件名（用于命名子目录）
        """
        self.base_output_dir = output_dir
        self.create_subdir = create_subdir
        
        # 如果需要创建子目录，使用文件名_时间戳
        if create_subdir:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            # 清理文件名（移除特殊字符）
            if input_filename:
                # 移除不安全的文件名字符
                safe_filename = input_filename.replace('/', '_').replace('\\', '_')
                safe_filename = safe_filename.replace(':', '_').replace('*', '_')
                safe_filename = safe_filename.replace('?', '_').replace('"', '_')
                safe_filename = safe_filename.replace('<', '_').replace('>', '_')
                safe_filename = safe_filename.replace('|', '_')
                # 限制长度
                if len(safe_filename) > 50:
                    safe_filename = safe_filename[:50]
                folder_name = f"{safe_filename}_{timestamp}"
            else:
                folder_name = f"分析报告_{timestamp}"
                
            self.output_dir = os.path.join(output_dir, folder_name)
        else:
            self.output_dir = output_dir
            
        os.makedirs(self.output_dir, exist_ok=True)
        logger.info(f"报表输出目录: {self.output_dir}")
    
    def generate_excel_report(
        self, 
        analysis_results: List[Dict],
        summary: Dict,
        pain_points: List[tuple],
        filename: str = None
    ) -> str:
        """
        生成Excel格式的分析报表
        
        Args:
            analysis_results: 情感分析结果
            summary: 统计摘要
            pain_points: 痛点词汇
            filename: 输出文件名
            
        Returns:
            生成的文件路径
        """
        if filename is None:
            filename = "分析报告.xlsx"
        
        filepath = os.path.join(self.output_dir, filename)
        
        logger.info(f"开始生成Excel报告: {filepath}")
        
        with pd.ExcelWriter(filepath, engine='openpyxl') as writer:
            # Sheet 1: 详细分析结果
            df_details = pd.DataFrame(analysis_results)
            df_details.index = range(1, len(df_details) + 1)
            df_details.columns = ['反馈内容', '情感分类', '情感得分', '情感图标']
            df_details.to_excel(writer, sheet_name='详细分析', index_label='序号')
            
            # Sheet 2: 统计摘要
            summary_data = {
                '指标': [
                    '总反馈数',
                    '正面反馈数',
                    '中性反馈数',
                    '负面反馈数',
                    '正面占比(%)',
                    '中性占比(%)',
                    '负面占比(%)',
                    '平均情感得分'
                ],
                '数值': [
                    summary['total_feedback'],
                    summary['positive_count'],
                    summary['neutral_count'],
                    summary['negative_count'],
                    summary['positive_ratio'],
                    summary['neutral_ratio'],
                    summary['negative_ratio'],
                    summary['avg_sentiment_score']
                ]
            }
            df_summary = pd.DataFrame(summary_data)
            df_summary.to_excel(writer, sheet_name='统计摘要', index=False)
            
            # Sheet 3: 高频痛点
            if pain_points:
                df_pain = pd.DataFrame(pain_points, columns=['痛点词汇', '出现次数'])
                df_pain.index = range(1, len(df_pain) + 1)
                df_pain.to_excel(writer, sheet_name='高频痛点', index_label='排名')
        
        logger.info(f"Excel报告生成成功: {filepath}")
        return filepath
    
    def generate_sentiment_pie_chart(
        self, 
        summary: Dict,
        filename: str = None
    ) -> str:
        """
        生成情感分布饼图
        
        Args:
            summary: 统计摘要
            filename: 输出文件名
            
        Returns:
            图片文件路径
        """
        if filename is None:
            filename = "情感分布图.png"
        
        filepath = os.path.join(self.output_dir, filename)
        
        # 数据准备
        labels = ['正面 😊', '中性 😐', '负面 😞']
        sizes = [
            summary['positive_count'],
            summary['neutral_count'],
            summary['negative_count']
        ]
        colors = ['#66BB6A', '#FFA726', '#EF5350']
        explode = (0.1, 0, 0)  # 突出正面反馈
        
        # 绘图
        plt.figure(figsize=(10, 8))
        plt.pie(
            sizes, 
            explode=explode, 
            labels=labels, 
            colors=colors,
            autopct='%1.1f%%',
            shadow=True, 
            startangle=90,
            textprops={'fontsize': 14}
        )
        plt.title(f'用户反馈情感分布\n(总计: {summary["total_feedback"]}条)', 
                 fontsize=16, fontweight='bold', pad=20)
        plt.axis('equal')
        
        plt.tight_layout()
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        logger.info(f"情感分布饼图生成成功: {filepath}")
        return filepath
    
    def generate_wordcloud(
        self, 
        pain_points: List[tuple],
        filename: str = None
    ) -> str:
        """
        生成痛点词云图
        
        Args:
            pain_points: 痛点词汇列表 [(词, 频次), ...]
            filename: 输出文件名
            
        Returns:
            图片文件路径
        """
        if filename is None:
            filename = "痛点词云图.png"
        
        filepath = os.path.join(self.output_dir, filename)
        
        if not pain_points:
            logger.warning("没有痛点数据，跳过词云生成")
            return None
        
        # 准备词频字典
        word_freq = {word: freq for word, freq in pain_points}
        
        # 生成词云
        wordcloud = WordCloud(
            font_path='C:/Windows/Fonts/simhei.ttf',  # Windows系统中文字体
            width=1200,
            height=800,
            background_color='white',
            colormap='Reds',
            max_words=100,
            relative_scaling=0.5,
            min_font_size=10
        ).generate_from_frequencies(word_freq)
        
        # 绘图
        plt.figure(figsize=(15, 10))
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis('off')
        plt.title('用户反馈高频痛点词云', fontsize=20, fontweight='bold', pad=20)
        
        plt.tight_layout(pad=0)
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        logger.info(f"痛点词云图生成成功: {filepath}")
        return filepath
    
    def generate_bar_chart(
        self,
        pain_points: List[tuple],
        filename: str = None,
        top_n: int = 15
    ) -> str:
        """
        生成痛点Top N柱状图
        
        Args:
            pain_points: 痛点词汇列表
            filename: 输出文件名
            top_n: 显示前N个
            
        Returns:
            图片文件路径
        """
        if filename is None:
            filename = "痛点排行图.png"
        
        filepath = os.path.join(self.output_dir, filename)
        
        if not pain_points:
            logger.warning("没有痛点数据，跳过柱状图生成")
            return None
        
        # 取前N个
        top_pain_points = pain_points[:top_n]
        words = [item[0] for item in top_pain_points]
        freqs = [item[1] for item in top_pain_points]
        
        # 绘图
        plt.figure(figsize=(12, 8))
        bars = plt.barh(range(len(words)), freqs, color='#EF5350')
        plt.yticks(range(len(words)), words, fontsize=12)
        plt.xlabel('出现次数', fontsize=12, fontweight='bold')
        plt.title(f'用户反馈高频痛点 Top {len(words)}', 
                 fontsize=16, fontweight='bold', pad=20)
        plt.gca().invert_yaxis()  # 最高的在上面
        
        # 在柱子上显示数值
        for i, (bar, freq) in enumerate(zip(bars, freqs)):
            plt.text(freq, i, f' {freq}', va='center', fontsize=10)
        
        plt.tight_layout()
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        logger.info(f"痛点柱状图生成成功: {filepath}")
        return filepath
    
    def generate_full_report(
        self,
        analysis_results: List[Dict],
        summary: Dict,
        pain_points: List[tuple]
    ) -> Dict[str, str]:
        """
        生成完整报告（包括Excel和所有图表）
        
        Args:
            analysis_results: 分析结果
            summary: 统计摘要
            pain_points: 痛点词汇
            
        Returns:
            所有生成文件的路径字典
        """
        logger.info("=" * 50)
        logger.info("开始生成完整分析报告")
        logger.info("=" * 50)
        
        files = {}
        
        # 生成Excel报告
        files['excel'] = self.generate_excel_report(
            analysis_results, summary, pain_points
        )
        
        # 生成饼图
        files['pie_chart'] = self.generate_sentiment_pie_chart(summary)
        
        # 生成词云
        files['wordcloud'] = self.generate_wordcloud(pain_points)
        
        # 生成柱状图
        files['bar_chart'] = self.generate_bar_chart(pain_points)
        
        # 生成README说明文件
        self._generate_readme(summary, pain_points)
        
        logger.info("=" * 50)
        logger.info("完整报告生成完成！")
        logger.info(f"输出目录: {os.path.abspath(self.output_dir)}")
        logger.info("=" * 50)
        
        return files
    
    def _generate_readme(self, summary: Dict, pain_points: List[tuple]):
        """
        生成README说明文件
        
        Args:
            summary: 统计摘要
            pain_points: 痛点列表
        """
        readme_path = os.path.join(self.output_dir, "README.txt")
        
        content = f"""用户反馈分析报告
{'=' * 50}

生成时间: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

{'=' * 50}
分析摘要
{'=' * 50}

总反馈数: {summary['total_feedback']}
正面反馈: {summary['positive_count']} ({summary['positive_ratio']}%)
中性反馈: {summary['neutral_count']} ({summary['neutral_ratio']}%)
负面反馈: {summary['negative_count']} ({summary['negative_ratio']}%)
平均情感得分: {summary['avg_sentiment_score']}

{'=' * 50}
Top 10 高频痛点
{'=' * 50}

"""
        for i, (word, freq) in enumerate(pain_points[:10], 1):
            content += f"{i:2d}. {word:15s} - {freq} 次\n"
        
        content += f"""
{'=' * 50}
报告文件说明
{'=' * 50}

1. 分析报告.xlsx - 详细的Excel报表
   - Sheet 1: 详细分析（每条反馈的情感分类）
   - Sheet 2: 统计摘要（总体数据）
   - Sheet 3: 高频痛点（问题排行）

2. 情感分布图.png - 正面/负面/中性占比饼图

3. 痛点词云图.png - 高频问题词云可视化

4. 痛点排行图.png - Top 15 问题柱状图

5. README.txt - 本说明文件

{'=' * 50}
使用建议
{'=' * 50}

1. 重点关注"负面反馈"和"高频痛点"
2. 对比不同时期的报告，观察趋势变化
3. 结合业务场景，制定改进措施
4. 定期分析，持续优化产品体验

{'=' * 50}
"""
        
        try:
            with open(readme_path, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(f"已生成说明文件: {readme_path}")
        except Exception as e:
            logger.warning(f"生成README失败: {e}")


if __name__ == "__main__":
    # 测试代码
    from analyzer import FeedbackAnalyzer
    
    # 模拟数据
    test_feedbacks = [
        "这个软件太卡顿了，经常闪退",
        "界面设计很美观，用起来很舒服",
        "功能缺失，希望增加导出功能",
        "非常好用，推荐给朋友了",
        "价格太贵，性价比不高"
    ] * 20  # 重复以生成更多数据
    
    # 分析
    analyzer = FeedbackAnalyzer()
    results = analyzer.batch_analyze_sentiment(test_feedbacks)
    summary = analyzer.generate_summary(results)
    pain_points = analyzer.extract_pain_points(test_feedbacks, topK=10)
    
    # 生成报告
    generator = ReportGenerator()
    files = generator.generate_full_report(results, summary, pain_points)
    
    print("\n生成的文件:")
    for key, path in files.items():
        if path:
            print(f"  {key}: {path}")
