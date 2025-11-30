@echo off
chcp 65001 >nul
echo ==========================================
echo 用户反馈自动分析系统
echo ==========================================
echo.
echo 请选择操作：
echo.
echo [1] 安装依赖（首次使用）
echo [2] 运行演示
echo [3] 分析文件（拖动Excel到此脚本）
echo [4] 打包为EXE
echo [0] 退出
echo.
set /p choice=请输入选项 (0-4): 

if "%choice%"=="1" goto install
if "%choice%"=="2" goto demo
if "%choice%"=="3" goto analyze
if "%choice%"=="4" goto build
if "%choice%"=="0" goto end
goto menu

:install
echo.
echo [1/2] 检查Python环境...
python --version
if errorlevel 1 (
    echo [错误] 未检测到Python
    echo 请先安装 Python 3.10+
    pause
    exit /b 1
)
echo.
echo [2/2] 安装依赖包...
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
echo.
echo [完成] 依赖安装完成！
pause
exit /b 0

:demo
echo.
echo 正在运行演示...
python src/main.py demo_data.xlsx
echo.
pause
exit /b 0

:analyze
if "%~1"=="" (
    set /p filepath=请输入Excel文件路径: 
) else (
    set filepath=%~1
)
echo.
echo 正在分析: %filepath%
python src/main.py "%filepath%"
echo.
pause
exit /b 0

:build
echo.
echo 正在打包为EXE...
python build.py
echo.
pause
exit /b 0

:end
exit /b 0

