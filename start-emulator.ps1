# PowerShell скрипт для запуска Android эмулятора
Write-Host "🤖 Запуск Android эмулятора для TaskGo..." -ForegroundColor Green

# Возможные пути к Android SDK
$androidSdkPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "$env:PROGRAMFILES\Android\Android Studio\sdk",
    "${env:PROGRAMFILES(X86)}\Android\Android Studio\sdk",
    "C:\Android\Sdk",
    "$env:ANDROID_HOME"
)

$androidHome = $null

foreach ($path in $androidSdkPaths) {
    if ($path -and (Test-Path "$path\emulator\emulator.exe")) {
        Write-Host "✅ Найден Android SDK: $path" -ForegroundColor Green
        $androidHome = $path
        break
    }
}

if (-not $androidHome) {
    Write-Host "❌ Android SDK не найден!" -ForegroundColor Red
    Write-Host "📋 Возможные решения:" -ForegroundColor Yellow
    Write-Host "1. Установите Android Studio" -ForegroundColor White
    Write-Host "2. Настройте переменную окружения ANDROID_HOME" -ForegroundColor White
    Write-Host "3. Убедитесь, что Android SDK установлен" -ForegroundColor White
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

# Устанавливаем ANDROID_HOME если не установлена
if (-not $env:ANDROID_HOME) {
    $env:ANDROID_HOME = $androidHome
    Write-Host "🔧 Установлена ANDROID_HOME: $androidHome" -ForegroundColor Cyan
}

# Проверяем доступные AVD
Write-Host "📱 Проверяем доступные эмуляторы..." -ForegroundColor Cyan
$emulatorPath = "$androidHome\emulator\emulator.exe"
$avdList = & $emulatorPath -list-avds 2>$null

if ($avdList) {
    Write-Host "📋 Доступные эмуляторы:" -ForegroundColor Yellow
    $avdList | ForEach-Object { Write-Host "  • $_" -ForegroundColor White }
    
    # Запускаем первый доступный эмулятор
    $firstAvd = $avdList[0]
    Write-Host "🚀 Запускаем эмулятор: $firstAvd" -ForegroundColor Green
    
    Start-Process -FilePath $emulatorPath -ArgumentList "-avd", $firstAvd -WindowStyle Normal
    Write-Host "⏳ Эмулятор запускается... Подождите 30-60 секунд" -ForegroundColor Cyan
    Write-Host "🎯 Затем запустите: npx react-native run-android" -ForegroundColor Green
} else {
    Write-Host "❌ Не найдено ни одного AVD!" -ForegroundColor Red
    Write-Host "📋 Создайте эмулятор в Android Studio:" -ForegroundColor Yellow
    Write-Host "1. Откройте Android Studio" -ForegroundColor White
    Write-Host "2. Tools → AVD Manager" -ForegroundColor White
    Write-Host "3. Create Virtual Device" -ForegroundColor White
}

Read-Host "Нажмите Enter для завершения"
