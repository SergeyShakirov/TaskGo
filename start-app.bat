@echo off
echo Starting TaskGo React Native App...
echo.

echo Step 1: Starting Metro Bundler...
start "Metro Bundler" cmd /k "cd /d %~dp0 && npm start"

echo.
echo Step 2: Wait for Metro to start, then choose your platform:
echo   For Android: npm run android
echo   For iOS: npm run ios
echo.

timeout /t 3 >nul

echo Metro bundler is starting in a separate window...
echo You can now run 'npm run android' or 'npm run ios' in another terminal.

pause
