@echo off

SET BASE=%~dp0
SET TEMP_DIR=%BASE%node\temp\
SET TEMP_MSI=%TEMP_DIR%node%BIT%.msi
SET NODE_VERSION=6.5.0
REM http://nodejs.org/dist/npm stopped providing npm distributions at version 1.4.9. As a workaround, we first download this older 1.4.9 npm version, and then manually run a command to upgrade to the latest npm version
SET NPM_VERSION_OLD=1.4.9
SET NPM_VERSION=3.3.12
SET UNINSTALL=false
SET BIT_64=
SET BIT_32=32
If Defined ProgramFiles(x86) (
    set BIT=%BIT_64%
) Else (
    set BIT=%BIT_32%
)

if [%1]==[] goto print_help


REM ===========================================================================
REM gather arguments
:loop
IF "%~1"=="" GOTO start
IF /I "%~1"=="/i" SET UNINSTALL=N
IF /I "%~1"=="-i" SET UNINSTALL=N
IF /I "%~1"=="--install" SET UNINSTALL=N
IF /I "%~1"=="/u" SET UNINSTALL=Y
IF /I "%~1"=="-u" SET UNINSTALL=Y
IF /I "%~1"=="--uninstall" SET UNINSTALL=Y
SHIFT & GOTO loop

REM ===========================================================================
REM print help message
:print_help
echo Usage: ./node-install.sh [options...]
echo  -i, --install     Install node
echo  -u, --uninstall   Uninstall node
goto finish

REM ===========================================================================
:start

IF "%UNINSTALL%" == "false" (
    echo node-install: install or uninstall flag must be set.
    echo.
    goto print_help
)

IF /I "%UNINSTALL%"=="N" goto node_install
IF /I "%UNINSTALL%"=="Y" goto node_uninstall

goto finish

REM ===========================================================================
:node_install

echo :: INSTALLING NODE...

if "%BIT%" == "%BIT_32%" (
    set URL=http://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-x86.msi
) else (
    set URL=http://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-x64.msi
)

echo :: DOWNLOADING NODE v%NODE_VERSION% FROM %URL%

if not exist "%TEMP_DIR%" (
    md "%TEMP_DIR%"
)
cscript //Nologo "%BASE%tools\curl.vbs" "%URL%" "%TEMP_MSI%"
msiexec.exe /i "%TEMP_MSI%"

echo :: INSTALLING GLOBAL DEPENDENCIES...

SET PATH=%PATH%;%AppData%\npm;%ProgramFiles%\nodejs\
call rmdir /s /q node_modules
call npm cache clean
call npm install --global gulp-cli

goto finish

REM ===========================================================================
:node_uninstall

echo :: NOT SUPPORTED, PLEASE UNINSTALL NODE VIA WINDOWS CONTROL PANEL

goto finish

REM ===========================================================================
:finish

echo :: DONE
