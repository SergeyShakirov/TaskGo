# БЫСТРАЯ НАСТРОЙКА PostgreSQL ДЛЯ TASKGO

## 🚀 Рекомендуемый способ: Установка PostgreSQL для Windows

### 1. Скачивание и установка
1. Перейдите на https://www.postgresql.org/download/windows/
2. Скачайте PostgreSQL 15.x для Windows
3. Запустите установщик
4. Следуйте инструкциям:
   - Выберите все компоненты (PostgreSQL Server, pgAdmin 4, Command Line Tools)
   - Порт: 5432 (по умолчанию)
   - Суперпользователь: postgres
   - Пароль: запомните его (например, 'postgres')

### 2. Настройка базы данных
После установки откройте Command Prompt или PowerShell как администратор:

```bash
# Подключитесь к PostgreSQL
psql -U postgres

# Создайте пользователя и базу данных
CREATE USER taskgo_user WITH PASSWORD 'taskgo_dev_password';
CREATE DATABASE taskgo OWNER taskgo_user;
GRANT ALL PRIVILEGES ON DATABASE taskgo TO taskgo_user;

# Подключитесь к базе taskgo
\c taskgo

# Создайте расширение для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# Выйдите из psql
\q
```

### 3. Проверка подключения
```bash
psql -h localhost -p 5432 -U taskgo_user -d taskgo
```

### 4. Запуск приложения
```bash
cd backend
npm run db:setup  # Создание таблиц и тестовых данных
npm run build
npm start
```

## 🐳 Альтернативный способ: Docker (если установлен)

```bash
# В папке backend
docker-compose up -d
npm run db:setup
```

## 📝 Файлы для копирования

### Команды для создания БД (Windows):
```cmd
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "CREATE USER taskgo_user WITH PASSWORD 'taskgo_dev_password';"
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "CREATE DATABASE taskgo OWNER taskgo_user;"
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE taskgo TO taskgo_user;"
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U taskgo_user -d taskgo -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
```

### Команды для создания БД (PowerShell):
```powershell
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "CREATE USER taskgo_user WITH PASSWORD 'taskgo_dev_password';"
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "CREATE DATABASE taskgo OWNER taskgo_user;"
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE taskgo TO taskgo_user;"
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U taskgo_user -d taskgo -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
```

## 🔧 Устранение неполадок

### PostgreSQL не запускается
- Проверьте Windows Services: `services.msc`
- Найдите "postgresql-x64-15" и запустите

### Ошибка подключения
- Убедитесь, что PostgreSQL запущен
- Проверьте порт 5432: `netstat -an | findstr :5432`
- Проверьте файл pg_hba.conf для настройки аутентификации

### Пользователь не может подключиться
- Убедитесь, что пользователь создан правильно
- Проверьте права доступа к базе данных

## 🎯 После установки

1. Откройте pgAdmin 4 для управления БД
2. Подключитесь к серверу localhost:5432
3. Проверьте наличие базы данных taskgo

## ⚡ Готовые скрипты

После установки PostgreSQL вы можете использовать:
- `npm run db:setup` - Создание таблиц и тестовых данных
- `npm run db:reset` - Сброс базы данных
- `npm run db:seed` - Добавление тестовых данных
