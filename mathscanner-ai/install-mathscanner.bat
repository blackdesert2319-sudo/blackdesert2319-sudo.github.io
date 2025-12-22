@echo off
REM ============================
REM  INSTALL MATHSCANNER (1 LAN)
REM ============================

REM Di chuyen den thu muc chua file .bat (thu muc du an)
cd /d "%~dp0"

echo.
echo ==== BUOC 1: KIEM TRA NODE.JS ====
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 GOTO INSTALL_NODE

echo Node.js da duoc cai tren may nay. OK.
GOTO NPM_INSTALL


:INSTALL_NODE
echo.
echo Chua tim thay Node.js tren may nay.

IF EXIST "node-v24.11.1-x64.msi" (
    echo Se mo trinh cai Node.js: node-v24.11.1-x64.msi
    echo Vui long cai dat Node.js (Next -> Next -> Install ...) roi quay lai cua so nay.
    echo.
    pause
    start "" "node-v24.11.1-x64.msi"
    echo.
    echo Sau khi cai xong Node.js, quay lai cua so nay va nhan phim bat ky de tiep tuc...
    pause
) ELSE (
    echo Khong tim thay file node-v24.11.1-x64.msi trong thu muc nay.
    echo Neu doi ten file .msi thi nho sua lai ten trong file install-mathscanner.bat.
    pause
    goto :EOF
)

echo.
echo Kiem tra lai Node.js...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js van chua cai thanh cong. Thoat chuong trinh.
    pause
    goto :EOF
)


:NPM_INSTALL
echo.
echo ==== BUOC 2: CAI CAC THU VIEN (npm install) ====
IF EXIST node_modules (
    echo Da co thu muc node_modules -> bo qua npm install.
) ELSE (
    echo Dang chay: npm install ...
    npm install
    IF %ERRORLEVEL% NEQ 0 (
        echo.
        echo Da xay ra loi khi chay npm install.
        echo Kiem tra lai ket noi Internet hoac thu lai sau.
        pause
        goto :EOF
    )
)

echo.
echo ============================
echo  CAI DAT HOAN TAT
echo  Lan sau CHI CAN dung: run-mathscanner.bat
echo ============================
pause
