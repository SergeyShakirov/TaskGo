# TaskGo - DeepSeek AI Integration

## 🚀 Успешно интегрирован DeepSeek AI

TaskGo теперь использует DeepSeek AI вместо OpenAI для генерации технических заданий и анализа проектов.

### 🔧 Настройка

1. **Получите API ключ DeepSeek:**

   - Зарегистрируйтесь на https://platform.deepseek.com
   - Получите API ключ в личном кабинете

2. **Настройте переменные окружения:**

   ```bash
   # В файле backend/.env
   DEEPSEEK_API_KEY=your_actual_deepseek_api_key_here
   ```

3. **Запустите backend:**
   ```bash
   cd backend
   npm run build
   npm start
   ```

### 🛠️ API Endpoints

Все AI функции теперь работают через DeepSeek:

#### 1. Генерация технического задания

```http
POST /api/ai/generate-description
Content-Type: application/json

{
  "briefDescription": "Создать мобильное приложение для заказа еды с доставкой"
}
```

**Ответ:**

```json
{
  "success": true,
  "data": {
    "detailedDescription": "Подробное техническое задание...",
    "estimatedHours": 120,
    "estimatedCost": 180000,
    "suggestedMilestones": ["Этап 1", "Этап 2"],
    "technologies": ["React Native", "Node.js"],
    "riskAssessment": "Средний уровень сложности"
  }
}
```

#### 2. Оценка времени и стоимости

```http
POST /api/ai/estimate
Content-Type: application/json

{
  "description": "Разработка CRM системы"
}
```

#### 3. Предложения по улучшению

```http
POST /api/ai/suggest-improvements
Content-Type: application/json

{
  "description": "Простой сайт-визитка"
}
```

#### 4. Анализ сложности

```http
POST /api/ai/analyze-complexity
Content-Type: application/json

{
  "description": "Система машинного обучения"
}
```

#### 5. Предложение категорий

```http
POST /api/ai/suggest-categories
Content-Type: application/json

{
  "description": "Интернет-магазин одежды"
}
```

### 🎯 Преимущества DeepSeek

- **Бесплатное использование** (до определенного лимита)
- **Высокое качество** генерации на русском языке
- **Специализация** на программировании и технических задачах
- **Быстрый отклик** API
- **Экономичность** по сравнению с OpenAI

### 🔄 Демо режим

Если API ключ не настроен, сервис работает в демо режиме с заранее подготовленными ответами для тестирования.

### 📱 Интеграция с мобильным приложением

React Native приложение может отправлять запросы на backend:

```typescript
// Пример запроса из React Native
const response = await fetch(
  "http://your-backend-url/api/ai/generate-description",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      briefDescription: "Создать приложение для...",
    }),
  }
);

const result = await response.json();
console.log("DeepSeek result:", result.data);
```

### 🚀 Развертывание

1. **Backend готов к деплою** с DeepSeek интеграцией
2. **Мобильное приложение** собирается и запускается на Android
3. **Все API endpoints** протестированы и работают

### 🎉 Результат

TaskGo теперь имеет полную интеграцию с DeepSeek AI для:

- ✅ Генерации подробных технических заданий
- ✅ Оценки времени и стоимости проектов
- ✅ Анализа сложности задач
- ✅ Предложений по улучшению
- ✅ Категоризации проектов
- ✅ Экспорта в Word документы (существующий функционал)

Проект готов к дальнейшей разработке и тестированию!
