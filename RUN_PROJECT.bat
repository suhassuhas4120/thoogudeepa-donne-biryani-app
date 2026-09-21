@echo off
title Thoogudeepa Donne Biryani Mane - Full Restaurant Suite
echo =====================================================================
echo    THOOGUDEEPA DONNE BIRYANI MANE - ALL-IN-ONE RESTAURANT SUITE
echo =====================================================================
echo.
echo Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not found on your system!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found:
node -v
echo.

cd /d "%~dp0customer-next"

if not exist "node_modules" (
    echo First time run detected. Installing dependencies (this may take a minute)...
    call npm install
)

echo.
echo Starting Next.js Development Server on Port 3001...
echo.
echo Available Portals:
echo   - Customer App:    http://localhost:3001/
echo   - Kitchen KDS:     http://localhost:3001/kitchen/
echo   - Waiter Suite:    http://localhost:3001/waiter/
echo   - Manager HQ:      http://localhost:3001/manager/
echo.
start http://localhost:3001/
call npm run dev
pause
