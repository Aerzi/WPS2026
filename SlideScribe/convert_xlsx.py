import pandas as pd
import os

def convert_xlsx_to_csv(file_path):
    try:
        # 读取 Excel 文件
        df = pd.read_excel(file_path)
        # 生成 CSV 文件路径
        csv_path = file_path.replace('.xlsx', '.csv')
        # 保存为 CSV
        df.to_csv(csv_path, index=False, encoding='utf-8-sig')
        print(f"Successfully converted {file_path} to {csv_path}")
        return csv_path
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    xlsx_file = r"xlsx/AI生成演讲稿备注.xlsx"
    convert_xlsx_to_csv(xlsx_file)

