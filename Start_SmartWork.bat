@echo off
TITLE Smart Work - Local Launcher
cd /d "%~dp0"

echo [1/3] Kiem tra Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Vui long cai dat Node.js tai https://nodejs.org/
    pause
    exit /b
)

echo [2/3] Dang cai dat thu vien (Neu can)...
call npm install --no-fund --no-audit

echo [3/3] Dang khoi chay ung dung...
echo ---
echo Ung dung se duoc mo tai: http://localhost:5173/SmartWorkApp/
echo ---

start http://localhost:5173/SmartWorkApp/
call npm run dev

pause
