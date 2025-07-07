# API Documentation

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://api.taskgo.com/api`

## Authentication

Currently, authentication is not implemented. All endpoints are public for development.

## Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "data": any,
  "message": string (optional)
}
```

## Error Handling

Error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## AI Endpoints

### Generate Task Description

Creates a detailed technical specification from a brief description using AI.

**Endpoint:** `POST /api/ai/generate-description`

**Request Body:**

```json
{
  "shortDescription": "Создать интернет-магазин",
  "category": "1",
  "budget": 100000,
  "deadline": "2024-12-31T00:00:00.000Z"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "detailedDescription": "Создание современного интернет-магазина...",
    "estimatedHours": 120,
    "estimatedCost": 180000,
    "suggestedMilestones": [
      "Создание дизайн-макетов и прототипа",
      "Разработка фронтенда",
      "Создание бэкенда и API",
      "Интеграция платежных систем",
      "Тестирование и деплой"
    ],
    "requirements": [
      "Адаптивный дизайн для мобильных устройств",
      "Интеграция с платежными системами",
      "SSL сертификат для безопасности"
    ],
    "deliverables": [
      "Полностью рабочий интернет-магазин",
      "Административная панель",
      "Мобильная версия сайта"
    ]
  }
}
```

### Estimate Task

Provides time and cost estimation for a given task description.

**Endpoint:** `POST /api/ai/estimate`

**Request Body:**

```json
{
  "description": "Создать интернет-магазин с корзиной и оплатой",
  "category": "web-development"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "estimatedHours": 80,
    "estimatedCost": 120000
  }
}
```

### Suggest Improvements

Provides suggestions for improving a task description.

**Endpoint:** `POST /api/ai/suggest-improvements`

**Request Body:**

```json
{
  "description": "Сделать сайт"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "suggestions": [
      "Добавьте более детальные требования к дизайну",
      "Уточните технические ограничения",
      "Определите критерии приемки"
    ],
    "improvedDescription": "Улучшенное описание с дополнительными деталями..."
  }
}
```

### Suggest Categories

Suggests appropriate categories based on task description.

**Endpoint:** `POST /api/ai/suggest-categories`

**Request Body:**

```json
{
  "description": "Создать мобильное приложение для iOS"
}
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Веб-разработка",
      "description": "Создание веб-сайтов и приложений",
      "icon": "web"
    },
    {
      "id": "2",
      "name": "Мобильная разработка",
      "description": "Разработка мобильных приложений",
      "icon": "mobile"
    }
  ]
}
```

### Analyze Complexity

Analyzes the complexity of a project and provides recommendations.

**Endpoint:** `POST /api/ai/analyze-complexity`

**Request Body:**

```json
{
  "description": "Создать систему с машинным обучением и интеграцией с внешними API"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "complexity": "high",
    "factors": [
      "Длина описания: 89 символов",
      "Обнаружены сложные технические термины"
    ],
    "recommendations": [
      "Разбить проект на этапы",
      "Детализировать требования",
      "Привлечь экспертов"
    ]
  }
}
```

## Export Endpoints

### Export to Word

Generates a Word document from task data.

**Endpoint:** `POST /api/export/word`

**Request Body:**

```json
{
  "taskRequest": {
    "id": "1",
    "title": "Создать интернет-магазин",
    "shortDescription": "Простой магазин",
    "client": {
      "id": "1",
      "name": "Иван Иванов",
      "email": "ivan@example.com"
    }
  },
  "aiGeneration": {
    "detailedDescription": "Детальное описание...",
    "estimatedHours": 120,
    "estimatedCost": 180000,
    "suggestedMilestones": ["Этап 1", "Этап 2"],
    "requirements": ["Требование 1"],
    "deliverables": ["Результат 1"]
  },
  "clientApproval": true,
  "contractorApproval": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "downloadUrl": "/api/export/download/TZ_1_1234567890.txt",
    "fileName": "TZ_1_1234567890.docx"
  },
  "message": "Document generated successfully"
}
```

### Get Export Templates

Returns available export templates.

**Endpoint:** `GET /api/export/templates`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "standard",
      "name": "Стандартный шаблон",
      "description": "Базовый шаблон технического задания",
      "format": "word"
    },
    {
      "id": "detailed",
      "name": "Детальный шаблон",
      "description": "Расширенный шаблон с дополнительными разделами",
      "format": "word"
    }
  ]
}
```

### Download File

Downloads a generated file.

**Endpoint:** `GET /api/export/download/:fileName`

**Parameters:**

- `fileName` (string) - Name of the file to download

**Response:** File download

## Health Check

### Health Check

Returns the health status of the API.

**Endpoint:** `GET /health`

**Response:**

```json
{
  "success": true,
  "message": "TaskGo Backend is running",
  "timestamp": "2024-07-04T06:27:23.554Z"
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Rate limit headers are included in responses

## CORS

CORS is configured to allow requests from:

- `http://localhost:3000` (development frontend)
- `http://localhost:8081` (React Native Metro)
- Production domains (when deployed)

## Error Codes

- `400` - Bad Request (validation errors)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
