# 🚀 Настройка PostgreSQL на VPS Hostinger для TaskGo

## 📋 Что нужно сделать

### 1. 🔧 Подготовка VPS

```bash
# Подключение к VPS
ssh root@your-vps-ip

# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
sudo apt install curl wget git nginx -y
```

### 2. 🗄️ Установка PostgreSQL

```bash
# Установка PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Запуск и автозапуск PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Проверка статуса
sudo systemctl status postgresql
```

### 3. 👤 Настройка пользователя БД

```bash
# Переключение на пользователя postgres
sudo -u postgres psql

# В консоли PostgreSQL:
CREATE DATABASE taskgo;
CREATE USER taskgo_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE taskgo TO taskgo_user;
\q
```

### 4. 🔐 Настройка безопасности

```bash
# Редактирование pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Добавить строку (заменить your-app-ip на IP вашего приложения):
host    taskgo          taskgo_user     your-app-ip/32         md5

# Редактирование postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf

# Раскомментировать и изменить:
listen_addresses = '*'
port = 5432

# Перезапуск PostgreSQL
sudo systemctl restart postgresql
```

### 5. 🔥 Настройка Firewall

```bash
# Разрешить подключения к PostgreSQL
sudo ufw allow 5432/tcp

# Проверить статус
sudo ufw status
```

### 6. 🌐 Установка Node.js

```bash
# Установка Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка версии
node --version
npm --version
```

### 7. 📂 Развертывание приложения

```bash
# Создание директории для приложения
sudo mkdir -p /var/www/taskgo
sudo chown $USER:$USER /var/www/taskgo

# Клонирование проекта (или загрузка через FTP)
cd /var/www/taskgo
git clone your-repository-url .

# Установка зависимостей
cd backend
npm install

# Сборка проекта
npm run build
```

### 8. ⚙️ Настройка переменных окружения

```bash
# Создание production .env файла
cd /var/www/taskgo/backend
cp .env.example .env.production

# Редактирование
nano .env.production
```

Содержимое `.env.production`:
```env
# Backend Configuration
PORT=3001
NODE_ENV=production

# PostgreSQL Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=taskgo
DATABASE_USER=taskgo_user
DATABASE_PASSWORD=your_secure_password_here

# AI Configuration
OPENAI_API_KEY=your_openai_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
```

### 9. 🔄 Настройка PM2 для автозапуска

```bash
# Установка PM2
sudo npm install -g pm2

# Создание ecosystem файла
nano ecosystem.config.js
```

Содержимое `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'taskgo-backend',
    script: './dist/server.js',
    cwd: '/var/www/taskgo/backend',
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    instances: 1,
    exec_mode: 'cluster'
  }]
};
```

```bash
# Создание директории для логов
mkdir -p /var/www/taskgo/backend/logs

# Запуск приложения
cd /var/www/taskgo/backend
pm2 start ecosystem.config.js --env production

# Автозапуск PM2
pm2 startup
pm2 save
```

### 10. 🌐 Настройка Nginx

```bash
# Создание конфигурации Nginx
sudo nano /etc/nginx/sites-available/taskgo
```

Содержимое конфигурации:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Активация сайта
sudo ln -s /etc/nginx/sites-available/taskgo /etc/nginx/sites-enabled/

# Проверка конфигурации
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx
```

### 11. 📊 Инициализация БД

```bash
# Запуск миграций и seed данных
cd /var/www/taskgo/backend
npm run seed  # Если у вас есть такой скрипт
```

### 12. 🔐 SSL сертификат (опционально)

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx -y

# Получение SSL сертификата
sudo certbot --nginx -d your-domain.com
```

## 🎯 Финальные настройки в приложении

Обновите в вашем React Native приложении адрес API:

```javascript
// src/services/ApiService.ts
const baseURL = 'https://your-domain.com/api';
// или
const baseURL = 'http://your-vps-ip/api';
```

## ✅ Проверка работоспособности

```bash
# Проверка статуса сервисов
sudo systemctl status postgresql
pm2 status
sudo systemctl status nginx

# Проверка логов
pm2 logs taskgo-backend

# Тестирование API
curl http://your-domain.com/api/tasks
```

## 🚨 Важные моменты безопасности

1. **Пароли**: Используйте сложные пароли для БД
2. **Firewall**: Настройте UFW для ограничения доступа
3. **SSL**: Обязательно используйте HTTPS в production
4. **Резервные копии**: Настройте автоматические бэкапы БД
5. **Мониторинг**: Установите мониторинг сервера

## 📞 Поддержка

Если возникнут проблемы:
1. Проверьте логи: `pm2 logs`
2. Проверьте статус БД: `sudo systemctl status postgresql`
3. Проверьте подключение к БД: `psql -h localhost -U taskgo_user -d taskgo`

---

**Готово!** 🎉 Ваш TaskGo backend теперь работает на VPS с PostgreSQL базой данных!
