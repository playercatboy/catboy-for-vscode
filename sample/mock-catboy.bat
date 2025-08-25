@echo off
echo Mock Catboy Build System v1.0.0
echo.
echo Command: %1
echo Options: %2 %3 %4 %5 %6 %7 %8 %9
echo.

if "%1"=="build" (
    echo [INFO] Starting build...
    echo [INFO] Compiling sources...
    timeout /t 2 /nobreak >nul
    echo [INFO] Linking...
    timeout /t 1 /nobreak >nul
    echo [SUCCESS] Build completed successfully!
) else if "%1"=="clean" (
    echo [INFO] Cleaning build artifacts...
    timeout /t 1 /nobreak >nul
    echo [SUCCESS] Clean completed!
) else if "%1"=="rebuild" (
    echo [INFO] Starting rebuild...
    echo [INFO] Cleaning...
    timeout /t 1 /nobreak >nul
    echo [INFO] Building...
    timeout /t 2 /nobreak >nul
    echo [SUCCESS] Rebuild completed successfully!
) else (
    echo [ERROR] Unknown command: %1
    exit /b 1
)