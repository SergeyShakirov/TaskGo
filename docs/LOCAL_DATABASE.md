# 🗄️ Локальная База Данных для TaskGo

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
cd backend
npm install
```

### 2. Настройка локальной БД (автоматически)

```bash
# Настройка и заполнение БД тестовыми данными
npm run db:setup
```

### 3. Запуск сервера

```bash
# Запуск в режиме разработки
npm run dev
```

## 📊 Управление БД

### Основные команды:

```bash
# Первичная настройка БД с тестовыми данными
npm run db:setup

# Полный сброс БД (удаляет все данные и пересоздает)
npm run db:reset

# Заполнение дополнительными тестовыми данными
npm run db:seed
```

## 🔧 Как это работает

### Автоматический выбор БД:

- **Разработка**: SQLite файл в `backend/data/taskgo.sqlite`
- **Тесты**: In-memory SQLite
- **Production**: PostgreSQL (настраивается через .env)

### Структура данных:

- **Users** - пользователи (клиенты и исполнители)
- **Categories** - категории услуг
- **Tasks** - задачи с полной информацией

## 🌐 API Endpoints

После запуска сервера доступны:

```
GET    /api/tasks              # Получить все задачи
GET    /api/tasks/:id          # Получить задачу по ID
POST   /api/tasks              # Создать новую задачу
PUT    /api/tasks/:id          # Обновить задачу
DELETE /api/tasks/:id          # Удалить задачу
```

## 📱 Подключение к React Native

В вашем ApiService обновите baseURL:

```javascript
// src/services/ApiService.ts
const baseURL = 'http://localhost:3001/api';
// или для Android эмулятора:
const baseURL = 'http://10.0.2.2:3001/api';
```

## 🧪 Тестовые данные

После запуска `npm run db:setup` у вас будет:

### Пользователи:
- **Иван Петров** (ivan@example.com) - клиент
- **Мария Сидорова** (maria@example.com) - исполнитель

### Категории:
- Разработка ПО
- Дизайн  
- Маркетинг
- Копирайтинг

### Задачи:
- Разработка мобильного приложения
- Дизайн лендинга для стартапа

## 🛠️ Полезные команды

```bash
# Проверить статус БД
ls -la backend/data/

# Посмотреть логи сервера
npm run dev

# Запустить тесты
npm test

# Проверить API
curl http://localhost:3001/api/tasks
```

## 🔍 Отладка

### Проблемы с БД:

1. **"Cannot connect to database"**
   ```bash
   npm run db:reset
   ```

2. **"Port already in use"**
   ```bash
   # Найти и остановить процесс на порту 3001
   lsof -ti:3001 | xargs kill
   ```

3. **"Module not found"**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📂 Файлы БД

- **SQLite файл**: `backend/data/taskgo.sqlite`
- **Конфигурация**: `backend/src/models/database.ts`
- **Модели**: `backend/src/models/`
- **Скрипты**: `backend/src/scripts/`

---

**Готово!** 🎉 Ваша локальная БД настроена и готова к работе!
