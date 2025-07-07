# Диагностика TaskGo

Write-Host "🔍 Диагностика проекта TaskGo..." -ForegroundColor Green

# Проверяем Node.js
Write-Host "`n📦 Версия Node.js:" -ForegroundColor Cyan
node --version

# Проверяем npm
Write-Host "`n📦 Версия npm:" -ForegroundColor Cyan  
npm --version

# Проверяем React Native CLI
Write-Host "`n⚛️ React Native CLI:" -ForegroundColor Cyan
npx react-native --version

# Проверяем зависимости
Write-Host "`n📋 Проверяем зависимости..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules существует" -ForegroundColor Green
} else {
    Write-Host "❌ node_modules отсутствует - нужно запустить npm install" -ForegroundColor Red
}

# Проверяем Android SDK
Write-Host "`n🤖 Android SDK:" -ForegroundColor Cyan
if ($env:ANDROID_HOME) {
    Write-Host "✅ ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor Green
} else {
    Write-Host "❌ ANDROID_HOME не установлена" -ForegroundColor Red
}

# Проверяем Java
Write-Host "`n☕ Java:" -ForegroundColor Cyan
try {
    java -version 2>&1 | Select-Object -First 1
} catch {
    Write-Host "❌ Java не найдена" -ForegroundColor Red
}

# Проверяем подключенные устройства
Write-Host "`n📱 Android устройства:" -ForegroundColor Cyan
try {
    adb devices
} catch {
    Write-Host "❌ adb недоступен" -ForegroundColor Red
}

# Проверяем Gradle
Write-Host "`n🔧 Gradle:" -ForegroundColor Cyan
if (Test-Path "android\gradlew.bat") {
    Write-Host "✅ Gradle wrapper найден" -ForegroundColor Green
} else {
    Write-Host "❌ Gradle wrapper отсутствует" -ForegroundColor Red
}

Write-Host "`n🚀 Попытка запуска Metro bundler..." -ForegroundColor Green
try {
    Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "react-native", "start" -PassThru
    Write-Host "✅ Metro bundler запущен в фоне" -ForegroundColor Green
} catch {
    Write-Host "❌ Ошибка запуска Metro bundler: $_" -ForegroundColor Red
}

Write-Host "`n🎯 Попытка сборки Android..." -ForegroundColor Green
Set-Location android
try {
    .\gradlew assembleDebug --console=plain
} catch {
    Write-Host "❌ Ошибка сборки Android: $_" -ForegroundColor Red
}

Write-Host "`n✅ Диагностика завершена" -ForegroundColor Green
