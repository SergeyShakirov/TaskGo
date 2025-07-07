# Настройка PostgreSQL для TaskGo

## Вариант 1: Docker (Рекомендуется для разработки)

### Требования
- Docker Desktop для Windows

### Запуск
```bash
# В папке backend
docker-compose up -d

# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs postgres

# Остановка
docker-compose down
```

### Доступ
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:8080
  - Email: admin@taskgo.local
  - Password: admin123

### Подключение к БД через pgAdmin
1. Открыть http://localhost:8080
2. Войти с указанными выше учетными данными
3. Add New Server:
   - Name: TaskGo Local
   - Host: postgres (или localhost)
   - Port: 5432
   - Database: taskgo
   - Username: taskgo_user
   - Password: taskgo_dev_password

## Вариант 2: Установка PostgreSQL напрямую

### Windows
1. Скачать с https://www.postgresql.org/download/windows/
2. Запустить установщик
3. Выбрать компоненты: PostgreSQL Server, pgAdmin 4, Command Line Tools
4. Задать пароль для пользователя postgres
5. Порт: 5432 (по умолчанию)

### Создание базы данных
```sql
-- Подключиться как postgres
CREATE USER taskgo_user WITH PASSWORD 'taskgo_dev_password';
CREATE DATABASE taskgo OWNER taskgo_user;
GRANT ALL PRIVILEGES ON DATABASE taskgo TO taskgo_user;

-- Подключиться к базе taskgo
\c taskgo
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Добавить PostgreSQL в PATH
Добавить в переменную PATH:
```
C:\Program Files\PostgreSQL\15\bin
```

## Вариант 3: Chocolatey (если установлен)
```powershell
# Установка Chocolatey (если не установлен)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Установка PostgreSQL
choco install postgresql --params '/Password:postgres'
```

## После установки

### Проверка подключения
```bash
psql -h localhost -p 5432 -U taskgo_user -d taskgo
```

### Запуск приложения
```bash
cd backend
npm run db:setup  # Создание таблиц и тестовых данных
npm run build
npm start         # Запуск сервера
```

## Настройки для production

Для production на VPS измените в .env:
```env
DATABASE_HOST=your_vps_ip
DATABASE_PASSWORD=secure_production_password
```

## Полезные команды

```bash
# Сброс базы данных
npm run db:reset

# Добавление тестовых данных
npm run db:seed

# Подключение к БД
psql -h localhost -U taskgo_user -d taskgo

# Бэкап БД
pg_dump -h localhost -U taskgo_user taskgo > backup.sql

# Восстановление БД
psql -h localhost -U taskgo_user taskgo < backup.sql
```

## Миграции

В будущем можно добавить Sequelize миграции:
```bash
npx sequelize-cli migration:generate --name create-users-table
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
```
