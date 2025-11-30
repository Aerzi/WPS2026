@echo off
chcp 65001 >nul
echo ==========================================
echo 用户反馈自动分析系统
echo ==========================================
echo.
echo 请选择操作：
echo.
echo [1] 安装依赖（首次使用）
echo [2] 运行反馈分析演示
echo [3] 运行请求分析演示
echo [4] 分析文件（反馈内容）
echo [5] 分析文件（请求内容）
echo [6] 打包为EXE
echo [0] 退出
echo.
set /p choice=请输入选项 (0-6): 

if "%choice%"=="1" goto install
if "%choice%"=="2" goto demo_feedback
if "%choice%"=="3" goto demo_request
if "%choice%"=="4" goto analyze_feedback
if "%choice%"=="5" goto analyze_request
if "%choice%"=="6" goto build
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

:demo_feedback
echo.
echo 正在运行反馈分析演示...
python src/main.py demo_data.xlsx --type feedback
echo.
pause
exit /b 0

:demo_request
echo.
echo 正在运行请求分析演示...
echo [提示] 如需请求演示数据，请先运行：python create_demo_data.py
echo.
pause
exit /b 0

:analyze_feedback
if "%~1"=="" (
    set /p "filepath=请输入文件路径: "
) else (
    set "filepath=%~1"
)
echo.
echo 正在进行反馈分析: "%filepath%"
python src/main.py "%filepath%" --type feedback
echo.
pause
exit /b 0

:analyze_request
if "%~1"=="" (
    set /p "filepath=请输入文件路径: "
) else (
    set "filepath=%~1"
)
echo.
echo 正在进行请求分析: "%filepath%"
python src/main.py "%filepath%" --type request
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

