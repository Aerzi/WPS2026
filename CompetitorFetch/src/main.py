"""
用户反馈自动分析系统 - 主程序入口
基于NLP的轻量级反馈分析工具
"""
import sys
import os
import json
import argparse
from pathlib import Path
import logging

# 添加当前目录到Python路径
sys.path.insert(0, os.path.dirname(__file__))

from data_loader import DataLoader
from analyzer import FeedbackAnalyzer
from report_generator import ReportGenerator

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('feedback_analysis.log', encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)


class FeedbackAnalysisSystem:
    """用户反馈分析系统主类"""
    
    def __init__(self, config_path: str = None):
        """
        初始化系统
        
        Args:
            config_path: 配置文件路径
        """
        self.config = self._load_config(config_path)
        self.data_loader = DataLoader()
        self.analyzer = FeedbackAnalyzer(
            custom_dict_path=self.config.get('custom_dict_path')
        )
        self.report_generator = ReportGenerator(
            output_dir=self.config.get('output_dir', 'output')
        )
        
        logger.info("系统初始化完成")
    
    def _load_config(self, config_path: str = None) -> dict:
        """加载配置文件"""
        default_config = {
            "custom_dict_path": None,
            "output_dir": "output",
            "feedback_column": None,
            "top_pain_points": 20
        }
        
        if config_path and os.path.exists(config_path):
            try:
                with open(config_path, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                default_config.update(config)
                logger.info(f"已加载配置文件: {config_path}")
            except Exception as e:
                logger.warning(f"配置文件加载失败，使用默认配置: {e}")
        
        return default_config
    
    def analyze_from_excel(self, file_path: str) -> dict:
        """
        从Excel文件分析用户反馈
        
        Args:
            file_path: Excel文件路径
            
        Returns:
            分析结果字典
        """
        logger.info("=" * 60)
        logger.info("开始用户反馈分析流程")
        logger.info("=" * 60)
        
        try:
            # 步骤1: 加载数据
            logger.info("步骤 1/4: 加载数据...")
            feedbacks = self.data_loader.load_from_excel(
                file_path,
                feedback_column=self.config.get('feedback_column')
            )
            data_report = self.data_loader.validate_data(feedbacks)
            
            if not feedbacks:
                raise ValueError("没有有效的反馈数据")
            
            # 步骤2: 情感分析
            logger.info("步骤 2/4: 进行情感分析...")
            analysis_results = self.analyzer.batch_analyze_sentiment(feedbacks)
            
            # 步骤3: 提取痛点
            logger.info("步骤 3/4: 提取高频痛点...")
            pain_points = self.analyzer.extract_pain_points(
                feedbacks,
                topK=self.config.get('top_pain_points', 20)
            )
            
            # 生成摘要
            summary = self.analyzer.generate_summary(analysis_results)
            
            # 步骤4: 生成报告
            logger.info("步骤 4/4: 生成分析报告...")
            report_files = self.report_generator.generate_full_report(
                analysis_results,
                summary,
                pain_points
            )
            
            # 打印结果
            self._print_summary(summary, pain_points, report_files)
            
            logger.info("=" * 60)
            logger.info("分析流程完成！")
            logger.info("=" * 60)
            
            return {
                'data_report': data_report,
                'analysis_results': analysis_results,
                'summary': summary,
                'pain_points': pain_points,
                'report_files': report_files
            }
            
        except Exception as e:
            logger.error(f"分析失败: {str(e)}", exc_info=True)
            raise
    
    def analyze_from_list(self, feedbacks: list) -> dict:
        """
        从反馈列表分析
        
        Args:
            feedbacks: 反馈文本列表
            
        Returns:
            分析结果字典
        """
        logger.info("从列表加载反馈数据")
        
        try:
            # 验证数据
            feedbacks = self.data_loader.load_from_list(feedbacks)
            data_report = self.data_loader.validate_data(feedbacks)
            
            # 情感分析
            analysis_results = self.analyzer.batch_analyze_sentiment(feedbacks)
            
            # 提取痛点
            pain_points = self.analyzer.extract_pain_points(
                feedbacks,
                topK=self.config.get('top_pain_points', 20)
            )
            
            # 生成摘要
            summary = self.analyzer.generate_summary(analysis_results)
            
            # 生成报告
            report_files = self.report_generator.generate_full_report(
                analysis_results,
                summary,
                pain_points
            )
            
            self._print_summary(summary, pain_points, report_files)
            
            return {
                'data_report': data_report,
                'analysis_results': analysis_results,
                'summary': summary,
                'pain_points': pain_points,
                'report_files': report_files
            }
            
        except Exception as e:
            logger.error(f"分析失败: {str(e)}", exc_info=True)
            raise
    
    def _print_summary(self, summary: dict, pain_points: list, report_files: dict):
        """打印分析摘要"""
        try:
            print("\n" + "=" * 60)
            print("[分析摘要]")
            print("=" * 60)
            print(f"总反馈数: {summary['total_feedback']}")
            print(f"正面反馈: {summary['positive_count']} ({summary['positive_ratio']}%)")
            print(f"中性反馈: {summary['neutral_count']} ({summary['neutral_ratio']}%)")
            print(f"负面反馈: {summary['negative_count']} ({summary['negative_ratio']}%)")
            print(f"平均情感得分: {summary['avg_sentiment_score']}")
            
            print("\n" + "=" * 60)
            print("[Top 10 高频痛点]")
            print("=" * 60)
            for i, (word, freq) in enumerate(pain_points[:10], 1):
                print(f"{i:2d}. {word:15s} - {freq} 次")
            
            print("\n" + "=" * 60)
            print("[生成的报告文件]")
            print("=" * 60)
            for key, path in report_files.items():
                if path:
                    print(f"  {key:15s}: {os.path.abspath(path)}")
            print("=" * 60 + "\n")
        except UnicodeEncodeError:
            # 如果遇到编码错误，输出简化版本
            logger.info("控制台输出完成（部分字符因编码问题未显示）")


def main():
    """命令行入口函数"""
    parser = argparse.ArgumentParser(
        description='用户反馈自动分析系统 - 基于NLP的轻量级分析工具'
    )
    parser.add_argument(
        'input_file',
        help='输入文件路径（支持 .xlsx, .xls, .csv）'
    )
    parser.add_argument(
        '-c', '--config',
        help='配置文件路径（JSON格式）',
        default=None
    )
    parser.add_argument(
        '-o', '--output',
        help='输出目录',
        default='output'
    )
    parser.add_argument(
        '--column',
        help='反馈内容列名（不指定则自动检测）',
        default=None
    )
    
    args = parser.parse_args()
    
    # 检查输入文件
    if not os.path.exists(args.input_file):
        print(f"错误: 文件不存在 - {args.input_file}")
        sys.exit(1)
    
    # 创建配置
    config = {
        'output_dir': args.output,
        'feedback_column': args.column
    }
    
    # 如果有配置文件，保存临时配置
    if args.config:
        config_path = args.config
    else:
        # 使用临时配置
        import tempfile
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', 
                                        delete=False, encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=2)
            config_path = f.name
    
    try:
        # 初始化系统
        system = FeedbackAnalysisSystem(config_path)
        
        # 执行分析
        result = system.analyze_from_excel(args.input_file)
        
        print("\n[OK] 分析完成！请查看输出目录中的报告文件。")
        
    except Exception as e:
        print(f"\n[ERROR] 分析失败: {str(e)}")
        sys.exit(1)
    finally:
        # 清理临时文件
        if not args.config and os.path.exists(config_path):
            os.unlink(config_path)


if __name__ == "__main__":
    # 如果没有命令行参数，运行演示模式
    if len(sys.argv) == 1:
        print("=" * 60)
        print("用户反馈自动分析系统 - 演示模式")
        print("=" * 60)
        print("\n正在使用示例数据进行演示...\n")
        
        # 示例数据
        demo_feedbacks = [
            "这个软件太卡顿了，经常闪退，用起来很不流畅",
            "界面设计很美观，用起来很舒服，功能也很强大",
            "功能缺失，希望增加导出PDF功能，操作有点复杂",
            "非常好用，推荐给朋友了，五星好评！",
            "价格太贵，性价比不高，而且还经常崩溃",
            "响应速度很快，交互设计也不错",
            "加载太慢了，等半天都打不开",
            "客服态度很好，问题解决及时",
            "bug太多了，建议好好测试再发布",
            "整体体验不错，就是有些功能找不到",
            "界面很混乱，不知道从哪里开始操作",
            "这是我用过最好的产品，强烈推荐",
            "经常崩溃，数据还会丢失，太糟糕了",
            "简单易用，上手很快",
            "兼容性有问题，在我的电脑上用不了"
        ] * 10  # 重复以生成更多数据
        
        # 运行分析
        system = FeedbackAnalysisSystem()
        result = system.analyze_from_list(demo_feedbacks)
        
        print("\n[提示] 要分析自己的Excel文件，请使用以下命令:")
        print("   python src/main.py your_feedback.xlsx")
        print("   python src/main.py your_feedback.xlsx --column 反馈内容 --output 输出目录")
    else:
        main()
