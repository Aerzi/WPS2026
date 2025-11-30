"""
创建演示数据文件
"""
import pandas as pd
from datetime import datetime, timedelta
import random

# 示例反馈数据
feedbacks = [
    # 正面反馈
    "这个软件非常好用，界面设计很美观，功能也很强大",
    "用起来很流畅，没有卡顿，体验非常好",
    "客服态度很好，问题解决及时，五星好评",
    "功能很实用，完全满足我的需求",
    "简单易用，上手很快，推荐给朋友了",
    "性价比很高，值得购买",
    "更新很及时，bug修复很快",
    "界面设计很人性化，交互很舒服",
    "响应速度很快，加载迅速",
    "这是我用过最好的产品，强烈推荐",
    
    # 负面反馈
    "这个软件太卡顿了，经常闪退，体验很差",
    "加载太慢了，等半天都打不开",
    "经常崩溃，数据还会丢失，太糟糕了",
    "功能缺失，连基本的导出功能都没有",
    "界面很混乱，不知道从哪里开始操作",
    "操作太复杂，学习成本太高",
    "价格太贵，性价比不高",
    "bug太多了，建议好好测试再发布",
    "兼容性有问题，在我的电脑上用不了",
    "启动太慢，要等好几分钟",
    "占用内存太大，电脑都卡死了",
    "广告太多，影响使用体验",
    "响应太慢，点击半天没反应",
    "闪退太频繁，工作都做不了",
    "设计不合理，很多功能找不到",
    
    # 中性反馈
    "整体还行，但有些功能需要改进",
    "基本满足需求，希望增加更多功能",
    "还可以，就是有些地方不太习惯",
    "功能比较齐全，但操作有点复杂",
    "用了一段时间，感觉一般般",
    "有好有坏，看个人需求吧",
    "基本功能都有，但细节需要优化",
    "还在熟悉中，暂时没什么感觉",
    "跟其他产品比起来中规中矩",
    "可以用，但没有特别惊艳",
]

# 生成更多数据
extended_feedbacks = []
for _ in range(5):  # 重复5次
    extended_feedbacks.extend(feedbacks)

# 添加一些随机变化
random.shuffle(extended_feedbacks)

# 生成用户ID和时间
start_date = datetime.now() - timedelta(days=30)
data = {
    '序号': list(range(1, len(extended_feedbacks) + 1)),
    '反馈内容': extended_feedbacks,
    '用户ID': [f'USER{str(i).zfill(4)}' for i in range(1, len(extended_feedbacks) + 1)],
    '提交时间': [(start_date + timedelta(days=random.randint(0, 30), 
                                        hours=random.randint(0, 23),
                                        minutes=random.randint(0, 59))).strftime('%Y-%m-%d %H:%M:%S') 
                 for _ in extended_feedbacks],
    '平台': [random.choice(['iOS', 'Android', 'Web', 'Windows', 'Mac']) 
            for _ in extended_feedbacks],
}

# 创建DataFrame
df = pd.DataFrame(data)

# 保存为Excel
output_file = 'demo_data.xlsx'
df.to_excel(output_file, index=False, sheet_name='用户反馈')

print(f"[OK] 演示数据已创建: {output_file}")
print(f"  总计 {len(df)} 条反馈")
print(f"  列名: {', '.join(df.columns)}")

