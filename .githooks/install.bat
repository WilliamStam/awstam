@echo off
setlocal enabledelayedexpansion

set "SOURCE_DIR=%~dp0"
set "TARGET_DIR=%~dp0..\.git\hooks"

pushd "%SOURCE_DIR%" >nul
set "SOURCE_DIR_RESOLVED=%CD%"
popd >nul

if not exist "%TARGET_DIR%" (
    mkdir "%TARGET_DIR%"
)

pushd "%TARGET_DIR%" >nul
set "TARGET_DIR_RESOLVED=%CD%"
popd >nul

echo Source path: "%SOURCE_DIR_RESOLVED%"
echo Target path: "%TARGET_DIR_RESOLVED%"
echo.

for %%F in ("%SOURCE_DIR%*") do (
    if /I not "%%~nxF"=="install.bat" (
        set "SOURCE_FILE=%%~fF"
        set "TARGET_FILE=%TARGET_DIR_RESOLVED%\%%~nxF"

@REM         echo Source file: "!SOURCE_FILE!"
@REM         echo Target file: "!TARGET_FILE!"

        if exist "!TARGET_FILE!" (
            fc /b "!SOURCE_FILE!" "!TARGET_FILE!" >nul
            if not errorlevel 1 (
                echo Skipped %%~nxF - already up to date
            ) else (
                choice /M "File %%~nxF already exists and is different. Overwrite"
                if errorlevel 2 (
                    echo Skipped %%~nxF
                ) else (
                    copy /Y "!SOURCE_FILE!" "!TARGET_FILE!" >nul
                    echo Copied %%~nxF
                )
            )
        ) else (
            copy "!SOURCE_FILE!" "!TARGET_FILE!" >nul
            echo Copied %%~nxF
        )

        echo.
    )
)

endlocal