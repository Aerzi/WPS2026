"""
请求内容报表生成模块
生成请求分类和统计报表
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


class RequestReportGenerator:
    """请求报告生成器"""
    
    def __init__(self, output_dir: str):
        """
        初始化报告生成器
        
        Args:
            output_dir: 输出目录
        """
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        logger.info(f"请求报告输出目录: {output_dir}")
    
    def generate_excel_report(
        self,
        analysis_results: List[Dict],
        summary: Dict,
        features: List[tuple]
    ) -> str:
        """
        生成Excel格式的请求分析报表
        
        Args:
            analysis_results: 请求分类结果
            summary: 统计摘要
            features: 高频功能需求
            
        Returns:
            生成的文件路径
        """
        filepath = os.path.join(self.output_dir, "请求分析报告.xlsx")
        
        logger.info(f"开始生成Excel报告: {filepath}")
        
        with pd.ExcelWriter(filepath, engine='openpyxl') as writer:
            # Sheet 1: 详细分类结果
            df_details = pd.DataFrame(analysis_results)
            df_details = df_details[['text', 'type', 'urgency', 'confidence']]
            df_details.columns = ['请求内容', '类型', '紧急度', '置信度']
            df_details.index = range(1, len(df_details) + 1)
            df_details.to_excel(writer, sheet_name='详细分类', index_label='序号')
            
            # Sheet 2: 统计摘要
            summary_data = {
                '指标': ['总请求数', '高紧急度数量', '高紧急度占比(%)'],
                '数值': [
                    summary['total_requests'],
                    summary['high_urgency_count'],
                    summary['high_urgency_ratio']
                ]
            }
            
            # 添加类型分布
            for req_type, count in summary['type_distribution'].items():
                summary_data['指标'].append(f'{req_type}数量')
                summary_data['数值'].append(count)
            
            df_summary = pd.DataFrame(summary_data)
            df_summary.to_excel(writer, sheet_name='统计摘要', index=False)
            
            # Sheet 3: 高频功能需求
            if features:
                df_features = pd.DataFrame(features, columns=['功能需求', '请求次数'])
                df_features.index = range(1, len(df_features) + 1)
                df_features.to_excel(writer, sheet_name='高频功能需求', index_label='排名')
        
        logger.info(f"Excel报告生成成功: {filepath}")
        return filepath
    
    def generate_type_pie_chart(self, summary: Dict) -> str:
        """
        生成请求类型分布饼图
        
        Args:
            summary: 统计摘要
            
        Returns:
            图片文件路径
        """
        filepath = os.path.join(self.output_dir, "请求类型分布图.png")
        
        type_dist = summary['type_distribution']
        labels = list(type_dist.keys())
        sizes = list(type_dist.values())
        
        # 颜色方案
        colors = plt.cm.Set3(range(len(labels)))
        
        # 绘图
        plt.figure(figsize=(12, 8))
        plt.pie(
            sizes,
            labels=labels,
            colors=colors,
            autopct='%1.1f%%',
            startangle=90,
            textprops={'fontsize': 12}
        )
        plt.title(f'用户请求类型分布\n(总计: {summary["total_requests"]}条)',
                 fontsize=16, fontweight='bold', pad=20)
        plt.axis('equal')
        
        plt.tight_layout()
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        logger.info(f"请求类型饼图生成成功: {filepath}")
        return filepath
    
    def generate_urgency_chart(self, summary: Dict) -> str:
        """
        生成紧急度分布图
        
        Args:
            summary: 统计摘要
            
        Returns:
            图片文件路径
        """
        filepath = os.path.join(self.output_dir, "紧急度分布图.png")
        
        urgency_dist = summary['urgency_distribution']
        labels = list(urgency_dist.keys())
        sizes = list(urgency_dist.values())
        
        # 颜色：高-红色，中-黄色
        color_map = {'高': '#EF5350', '中': '#FFA726', '低': '#66BB6A'}
        colors = [color_map.get(label, '#999999') for label in labels]
        
        # 绘图
        plt.figure(figsize=(10, 7))
        plt.pie(
            sizes,
            labels=labels,
            colors=colors,
            autopct='%1.1f%%',
            startangle=90,
            textprops={'fontsize': 14}
        )
        plt.title(f'请求紧急度分布\n(总计: {summary["total_requests"]}条)',
                 fontsize=16, fontweight='bold', pad=20)
        plt.axis('equal')
        
        plt.tight_layout()
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        logger.info(f"紧急度分布图生成成功: {filepath}")
        return filepath
    
    def generate_feature_wordcloud(self, features: List[tuple]) -> str:
        """
        生成功能需求词云图
        
        Args:
            features: 功能需求列表
            
        Returns:
            图片文件路径
        """
        filepath = os.path.join(self.output_dir, "功能需求词云图.png")
        
        if not features:
            logger.warning("没有功能需求数据，跳过词云生成")
            return None
        
        # 准备词频字典
        word_freq = {word: freq for word, freq in features}
        
        # 生成词云
        wordcloud = WordCloud(
            font_path='C:/Windows/Fonts/simhei.ttf',
            width=1200,
            height=800,
            background_color='white',
            colormap='Blues',
            max_words=100,
            relative_scaling=0.5,
            min_font_size=10
        ).generate_from_frequencies(word_freq)
        
        # 绘图
        plt.figure(figsize=(15, 10))
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis('off')
        plt.title('用户功能需求词云', fontsize=20, fontweight='bold', pad=20)
        
        plt.tight_layout(pad=0)
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        logger.info(f"功能需求词云图生成成功: {filepath}")
        return filepath
    
    def generate_feature_bar_chart(self, features: List[tuple], top_n: int = 15) -> str:
        """
        生成功能需求Top N柱状图
        
        Args:
            features: 功能需求列表
            top_n: 显示前N个
            
        Returns:
            图片文件路径
        """
        filepath = os.path.join(self.output_dir, "功能需求排行图.png")
        
        if not features:
            logger.warning("没有功能需求数据，跳过柱状图生成")
            return None
        
        # 取前N个
        top_features = features[:top_n]
        words = [item[0] for item in top_features]
        freqs = [item[1] for item in top_features]
        
        # 绘图
        plt.figure(figsize=(12, 8))
        bars = plt.barh(range(len(words)), freqs, color='#42A5F5')
        plt.yticks(range(len(words)), words, fontsize=12)
        plt.xlabel('请求次数', fontsize=12, fontweight='bold')
        plt.title(f'用户功能需求 Top {len(words)}',
                 fontsize=16, fontweight='bold', pad=20)
        plt.gca().invert_yaxis()
        
        # 在柱子上显示数值
        for i, (bar, freq) in enumerate(zip(bars, freqs)):
            plt.text(freq, i, f' {freq}', va='center', fontsize=10)
        
        plt.tight_layout()
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        logger.info(f"功能需求柱状图生成成功: {filepath}")
        return filepath
    
    def generate_readme(self, summary: Dict, features: List[tuple]):
        """
        生成README说明文件
        
        Args:
            summary: 统计摘要
            features: 功能需求列表
        """
        readme_path = os.path.join(self.output_dir, "README.txt")
        
        content = f"""用户请求分析报告
{'=' * 50}

生成时间: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

{'=' * 50}
分析摘要
{'=' * 50}

总请求数: {summary['total_requests']}
高紧急度: {summary['high_urgency_count']} ({summary['high_urgency_ratio']}%)

{'=' * 50}
请求类型分布
{'=' * 50}

"""
        for req_type, count in summary['type_distribution'].items():
            ratio = count / summary['total_requests'] * 100
            content += f"{req_type}: {count} ({ratio:.1f}%)\n"
        
        content += f"""
{'=' * 50}
Top 10 高频功能需求
{'=' * 50}

"""
        for i, (feature, freq) in enumerate(features[:10], 1):
            content += f"{i:2d}. {feature:20s} - {freq} 次\n"
        
        content += f"""
{'=' * 50}
报告文件说明
{'=' * 50}

1. 请求分析报告.xlsx - 详细的Excel报表
   - Sheet 1: 详细分类（每条请求的类型和紧急度）
   - Sheet 2: 统计摘要（总体数据）
   - Sheet 3: 高频功能需求（需求排行）

2. 请求类型分布图.png - 各类型请求占比饼图

3. 紧急度分布图.png - 高/中/低紧急度占比图

4. 功能需求词云图.png - 高频需求词云可视化

5. 功能需求排行图.png - Top 15 功能需求柱状图

6. README.txt - 本说明文件

{'=' * 50}
使用建议
{'=' * 50}

1. 优先处理"高紧急度"的请求
2. 关注"功能请求"和"Bug修复"类别
3. 根据高频功能需求制定开发计划
4. 定期分析，了解用户需求趋势

{'=' * 50}
"""
        
        try:
            with open(readme_path, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(f"已生成说明文件: {readme_path}")
        except Exception as e:
            logger.warning(f"生成README失败: {e}")
    
    def generate_full_report(
        self,
        analysis_results: List[Dict],
        summary: Dict,
        features: List[tuple]
    ) -> Dict[str, str]:
        """
        生成完整报告
        
        Args:
            analysis_results: 分类结果
            summary: 统计摘要
            features: 功能需求
            
        Returns:
            所有生成文件的路径字典
        """
        logger.info("=" * 50)
        logger.info("开始生成完整请求分析报告")
        logger.info("=" * 50)
        
        files = {}
        
        # 生成Excel报告
        files['excel'] = self.generate_excel_report(
            analysis_results, summary, features
        )
        
        # 生成类型分布图
        files['type_chart'] = self.generate_type_pie_chart(summary)
        
        # 生成紧急度分布图
        files['urgency_chart'] = self.generate_urgency_chart(summary)
        
        # 生成词云
        files['wordcloud'] = self.generate_feature_wordcloud(features)
        
        # 生成柱状图
        files['bar_chart'] = self.generate_feature_bar_chart(features)
        
        # 生成README
        self.generate_readme(summary, features)
        
        logger.info("=" * 50)
        logger.info("完整报告生成完成！")
        logger.info(f"输出目录: {os.path.abspath(self.output_dir)}")
        logger.info("=" * 50)
        
        return files

