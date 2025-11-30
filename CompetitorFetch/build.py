"""
打包脚本 - 将项目打包为独立的exe文件
"""
import os
import sys
import shutil
import subprocess
from pathlib import Path


def clean_build_dirs():
    """清理旧的构建目录"""
    dirs_to_clean = ['build', 'dist']
    for dir_name in dirs_to_clean:
        if os.path.exists(dir_name):
            print(f"清理目录: {dir_name}")
            shutil.rmtree(dir_name)
    
    # 清理spec文件缓存
    if os.path.exists('__pycache__'):
        shutil.rmtree('__pycache__')


def check_dependencies():
    """检查必要的依赖是否已安装"""
    print("\n检查依赖...")
    try:
        import pyinstaller
        print("✓ PyInstaller 已安装")
    except ImportError:
        print("✗ PyInstaller 未安装")
        print("正在安装 PyInstaller...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller"])
    
    # 检查其他依赖
    try:
        with open('requirements.txt', 'r', encoding='utf-8') as f:
            packages = [line.strip().split('==')[0] for line in f if line.strip() and not line.startswith('#')]
        
        print("\n检查其他依赖包...")
        missing = []
        for package in packages:
            try:
                __import__(package.replace('-', '_'))
                print(f"✓ {package}")
            except ImportError:
                print(f"✗ {package} 未安装")
                missing.append(package)
        
        if missing:
            print(f"\n正在安装缺失的依赖: {', '.join(missing)}")
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
            print("✓ 所有依赖已安装")
    
    except Exception as e:
        print(f"依赖检查出错: {e}")


def create_spec_file():
    """创建PyInstaller配置文件"""
    spec_content = """# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

# 收集所有需要的数据文件
datas = [
    ('config', 'config'),
]

# 隐藏导入
hiddenimports = [
    'snownlp',
    'jieba',
    'pandas',
    'openpyxl',
    'matplotlib',
    'wordcloud',
    'PIL',
    'numpy'
]

a = Analysis(
    ['src/main.py'],
    pathex=[],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'tkinter',  # 如果不需要GUI，可以排除
    ],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='FeedbackAnalyzer',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,  # 设置为False可隐藏控制台窗口
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='FeedbackAnalyzer',
)
"""
    
    with open('build.spec', 'w', encoding='utf-8') as f:
        f.write(spec_content)
    
    print("✓ 已创建 build.spec 文件")


def build_exe():
    """执行打包"""
    print("\n" + "=" * 60)
    print("开始打包为EXE文件...")
    print("=" * 60)
    
    try:
        # 使用spec文件打包
        cmd = ['pyinstaller', '--clean', 'build.spec']
        subprocess.check_call(cmd)
        
        print("\n" + "=" * 60)
        print("✓ 打包完成!")
        print("=" * 60)
        print(f"\n可执行文件位置: {os.path.abspath('dist/FeedbackAnalyzer')}")
        print(f"主程序: dist/FeedbackAnalyzer/FeedbackAnalyzer.exe")
        
        # 创建使用说明
        create_usage_guide()
        
    except subprocess.CalledProcessError as e:
        print(f"\n✗ 打包失败: {e}")
        sys.exit(1)


def create_usage_guide():
    """创建使用说明文件"""
    guide_content = """用户反馈自动分析系统 - 使用说明
====================================

1. 准备数据
   准备一个Excel文件（.xlsx 或 .csv），包含用户反馈列

2. 运行程序
   方式1: 双击 FeedbackAnalyzer.exe 运行演示模式
   方式2: 在命令行中运行
   
   FeedbackAnalyzer.exe your_feedback.xlsx
   
   或指定更多选项:
   FeedbackAnalyzer.exe your_feedback.xlsx --column 反馈内容 --output 输出目录

3. 查看结果
   程序会在 output 目录生成以下文件:
   - Excel分析报告
   - 情感分布饼图
   - 痛点词云图
   - 痛点排行柱状图

4. 自定义配置
   编辑 config/config.json 文件可以自定义分析参数

更多信息请参考: README.md
"""
    
    dist_dir = 'dist/FeedbackAnalyzer'
    if os.path.exists(dist_dir):
        with open(os.path.join(dist_dir, '使用说明.txt'), 'w', encoding='utf-8') as f:
            f.write(guide_content)
        print("✓ 已创建使用说明.txt")


def main():
    """主函数"""
    print("=" * 60)
    print("用户反馈自动分析系统 - 打包脚本")
    print("=" * 60)
    
    # 步骤1: 清理旧文件
    print("\n[1/4] 清理旧的构建文件...")
    clean_build_dirs()
    
    # 步骤2: 检查依赖
    print("\n[2/4] 检查依赖...")
    check_dependencies()
    
    # 步骤3: 创建spec文件
    print("\n[3/4] 创建打包配置...")
    create_spec_file()
    
    # 步骤4: 执行打包
    print("\n[4/4] 执行打包...")
    build_exe()
    
    print("\n" + "=" * 60)
    print("全部完成！")
    print("=" * 60)
    print("\n提示:")
    print("  1. 可执行文件在 dist/FeedbackAnalyzer/ 目录")
    print("  2. 需要将整个 FeedbackAnalyzer 文件夹分发给用户")
    print("  3. 第一次运行可能需要几秒钟加载")
    print("=" * 60)


if __name__ == "__main__":
    main()

