# Скрипты для комфортной работы с TaskGo и Copilot

## Как пользоваться

- **Открывайте отдельный терминал для каждого процесса** (backend, мобильное приложение, Metro bundler, эмулятор)
- Используйте готовые скрипты из папки `scripts/` для быстрого запуска и остановки сервисов

---

## Список скриптов

### 1. Запуск backend (DeepSeek API)

**Windows:**

```powershell
./scripts/start-backend.ps1
```

**bash (WSL/Linux/Mac):**

```bash
./scripts/start-backend.sh
```

### 2. Запуск Metro bundler (React Native)

**Windows:**

```powershell
./scripts/start-metro.ps1
```

**bash:**

```bash
./scripts/start-metro.sh
```

### 3. Запуск Android эмулятора (Windows)

```powershell
./scripts/start-emulator.ps1
```

### 4. Запуск приложения на Android

```powershell
./scripts/run-android.ps1
```

### 5. Остановка всех Node/Metro процессов

```powershell
./scripts/stop-all.ps1
```

---

## Рекомендации

- **Не запускайте несколько долгоживущих процессов в одном терминале**
- Если терминал "завис" — откройте новый или используйте stop-all.ps1
- Для CI/CD или автоматизации используйте bash-версии скриптов

---

**Copilot всегда готов помочь!**
