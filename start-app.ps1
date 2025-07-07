Write-Host "Starting TaskGo React Native App..." -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Starting Metro Bundler..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm start"

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Step 2: Metro bundler is starting in a separate window..." -ForegroundColor Yellow
Write-Host "You can now run one of the following commands in another terminal:" -ForegroundColor Cyan
Write-Host "  npm run android  (for Android device/emulator)" -ForegroundColor White
Write-Host "  npm run ios      (for iOS simulator)" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
