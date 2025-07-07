@echo off
echo Запуск Android эмулятора для TaskGo...

REM Проверяем различные пути к Android SDK
set ANDROID_SDK_PATHS="%LOCALAPPDATA%\Android\Sdk" "%PROGRAMFILES%\Android\Android Studio\sdk" "%PROGRAMFILES(X86)%\Android\Android Studio\sdk" "C:\Android\Sdk"

for %%i in (%ANDROID_SDK_PATHS%) do (
    if exist %%i\emulator\emulator.exe (
        echo Найден Android SDK в %%i
        set ANDROID_HOME=%%i
        goto :found_sdk
    )
)

echo Android SDK не найден. Пожалуйста, установите Android Studio или настройте ANDROID_HOME
goto :end

:found_sdk
echo Используем Android SDK: %ANDROID_HOME%

REM Проверяем доступные AVD
echo Доступные эмуляторы:
"%ANDROID_HOME%\emulator\emulator.exe" -list-avds

REM Пытаемся запустить первый доступный эмулятор
for /f "delims=" %%a in ('"%ANDROID_HOME%\emulator\emulator.exe" -list-avds') do (
    echo Запускаем эмулятор: %%a
    start "Android Emulator" "%ANDROID_HOME%\emulator\emulator.exe" -avd "%%a"
    goto :launched
)

echo Не найдено ни одного AVD. Создайте эмулятор в Android Studio.
goto :end

:launched
echo Эмулятор запускается...
echo Подождите несколько секунд, затем запустите: npx react-native run-android

:end
pause
