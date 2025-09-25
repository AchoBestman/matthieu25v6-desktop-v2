@echo off
title Tauri Build Manager
color 0A

:menu
echo.
echo ================================
echo      Tauri Build Manager
echo ================================
echo.
echo   1 - Compiler pour Windows 32 bits (i686-pc-windows-msvc)
echo   2 - Compiler pour Windows 64 bits (x86_64-pc-windows-msvc)
echo   3 - Compiler pour Windows 64 bits ARM (aarch64-pc-windows-msvc)
echo   4 - Compiler pour toutes les plateformes (32/64 bits + ARM)
echo   5 - Annuler
echo.
set /p choice=Choisissez une option [1-5] : 

if "%choice%"=="1" goto build32
if "%choice%"=="2" goto build64
if "%choice%"=="3" goto buildarm
if "%choice%"=="4" goto buildall
if "%choice%"=="5" goto cancel

echo.
echo Option invalide, veuillez reessayer.
echo.
goto menu

:build32
echo.
echo Compilation Windows 32 bits (i686-pc-windows-msvc)...
pnpm tauri build --target i686-pc-windows-msvc
goto end

:build64
echo.
echo Compilation Windows 64 bits (x86_64-pc-windows-msvc)...
pnpm tauri build --target x86_64-pc-windows-msvc
goto end

:buildarm
echo.
echo Compilation Windows 64 bits ARM (aarch64-pc-windows-msvc)...
pnpm tauri build --target aarch64-pc-windows-msvc
goto end

:buildall
echo.
echo Compilation pour toutes les plateformes...
echo.
echo -> Windows 32 bits
pnpm tauri build --target i686-pc-windows-msvc
echo.
echo -> Windows 64 bits
pnpm tauri build --target x86_64-pc-windows-msvc
echo.
echo -> Windows 64 bits ARM
pnpm tauri build --target aarch64-pc-windows-msvc
goto end

:cancel
echo.
echo Operation annulee par l'utilisateur.
goto end

:end
echo.
pause
