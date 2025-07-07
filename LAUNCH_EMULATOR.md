# 🚀 Инструкция по запуску Android эмулятора для TaskGo

## Автоматический запуск (рекомендуется)

1. **Откройте новый терминал PowerShell**
2. **Перейдите в папку проекта:**
   ```powershell
   cd C:\Projects\TaskGo
   ```
3. **Запустите React Native приложение:**

   ```powershell
   npx react-native run-android
   ```

   Эта команда автоматически:

   - Найдет доступный эмулятор или запустит новый
   - Скомпилирует и установит приложение
   - Запустит Metro bundler
   - Откроет приложение на эмуляторе

## Ручной запуск эмулятора

### Вариант 1: Через Android Studio (самый простой)

1. Откройте Android Studio
2. В меню выберите **Tools → AVD Manager**
3. Нажмите ▶️ рядом с любым эмулятором
4. Дождитесь полной загрузки эмулятора
5. Вернитесь в терминал и запустите:
   ```powershell
   npx react-native run-android
   ```

### Вариант 2: Через командную строку

1. Найдите папку Android SDK (обычно `C:\Users\[Username]\AppData\Local\Android\Sdk`)
2. Откройте терминал в этой папке
3. Выполните команды:
   ```powershell
   .\emulator\emulator.exe -list-avds
   .\emulator\emulator.exe -avd [ИМЯ_ЭМУЛЯТОРА]
   ```

## Проверка состояния

### Проверить подключенные устройства:

```powershell
adb devices
```

### Проверить процессы эмулятора:

```powershell
Get-Process | Where-Object {$_.ProcessName -like "*emulator*" -or $_.ProcessName -like "*qemu*"}
```

## Статус проекта TaskGo

✅ **Android приложение** - скомпилировано и готово к запуску
✅ **Backend с DeepSeek AI** - запущен на порту 3001
✅ **Gradle сборка** - настроена и работает
✅ **React Native** - настроено для Android

## Быстрый запуск одной командой

```powershell
npx react-native run-android
```

Если эмулятор не запускается автоматически, сначала запустите его через Android Studio, а затем выполните команду выше.

## Полезные команды

```powershell
# Очистить кеш Metro
npx react-native start --reset-cache

# Пересобрать и запустить
npx react-native run-android --reset-cache

# Проверить конфигурацию
npx react-native doctor
```

## Если возникают проблемы

1. **Эмулятор не найден**: Запустите эмулятор через Android Studio
2. **Приложение не устанавливается**: Проверьте `adb devices`
3. **Ошибки сборки**: Выполните `cd android && .\gradlew clean`
4. **Проблемы с Metro**: Перезапустите с флагом `--reset-cache`

Проект готов к работе! 🎉
