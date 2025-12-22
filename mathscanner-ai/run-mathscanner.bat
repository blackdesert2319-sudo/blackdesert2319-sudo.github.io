@echo off
REM ============================
REM  RUN MATHSCANNER (MO SERVER + MO TRINH DUYET)
REM ============================

cd /d "%~dp0"

echo.
echo ==== KIEM TRA NODE.JS ====
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Khong tim thay Node.js.
    echo Vui long chay file: install-mathscanner.bat de cai dat truoc.
    pause
    goto :EOF
) ELSE (
    echo Node.js OK.
)

echo.
echo ==== CHAY SERVER (npm run dev) TRONG CUA SO RIENG ====
start "MathScanner Dev Server" cmd /k "cd /d ""%~dp0"" && npm run dev"

echo.
echo Doi server khoi dong trong giay lat...
timeout /t 5 /nobreak >nul

echo.
echo ==== MO TRINH DUYET TOI http://localhost:3000/ ====
start "" "http://localhost:3000/"

echo.
echo Da bat server va mo trinh duyet.
echo Neu khong vao duoc ngay, doi vai giay roi bam F5 de reload.
pause
