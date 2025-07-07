# Руководство по разработке TaskGo

## Начало работы

### Предварительные требования

- Node.js 18 или выше
- npm или yarn
- React Native CLI
- Android Studio (для Android разработки)
- Xcode (для iOS разработки, только macOS)
- OpenAI API ключ (опционально для полной функциональности)

### Первоначальная настройка

1. **Клонирование репозитория**

   ```bash
   git clone <repository-url>
   cd TaskGo
   ```

2. **Установка зависимостей**

   ```bash
   # Установка зависимостей фронтенда
   npm install --legacy-peer-deps

   # Установка зависимостей бэкенда
   cd backend
   npm install
   ```

3. **Настройка окружения**

   ```bash
   # Создание файла .env в папке backend
   cp backend/.env.example backend/.env

   # Добавьте ваш OpenAI API ключ (опционально)
   OPENAI_API_KEY=your_api_key_here
   ```

4. **Запуск приложения**

   ```bash
   # Терминал 1: Запуск бэкенда
   cd backend
   npm run dev

   # Терминал 2: Запуск Metro (React Native bundler)
   npm start

   # Терминал 3: Запуск на устройстве/эмуляторе
   npm run android  # для Android
   npm run ios      # для iOS
   ```

## Архитектура проекта

### Frontend (React Native)

```
src/
├── components/        # Переиспользуемые UI компоненты
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── screens/          # Экраны приложения
│   └── CreateTaskScreen.tsx
├── services/         # API сервисы
│   ├── ApiService.ts
│   ├── AIService.ts
│   └── ExportService.ts
├── hooks/           # Custom React hooks
│   └── useAIGeneration.ts
├── types/           # TypeScript типы
│   ├── index.ts
│   └── globals.d.ts
└── utils/           # Утилиты
```

### Backend (Node.js)

```
backend/src/
├── controllers/     # API контроллеры
│   ├── AIController.ts
│   └── ExportController.ts
├── services/        # Бизнес логика
│   ├── OpenAIService.ts
│   └── WordExportService.ts
├── routes/          # API роуты
│   ├── ai.ts
│   └── export.ts
├── types/           # TypeScript типы
│   └── index.ts
├── utils/           # Утилиты
└── server.ts        # Главный файл сервера
```

## Соглашения по коду

### TypeScript

- Используйте строгую типизацию
- Создавайте интерфейсы для всех объектов данных
- Избегайте `any`, используйте `unknown` если необходимо
- Используйте generic типы где это уместно

### React Native

- Используйте функциональные компоненты с hooks
- Создавайте отдельные файлы стилей с StyleSheet
- Используйте memo() для оптимизации производительности
- Следуйте принципам SOLID

### Naming Conventions

- **Компоненты**: PascalCase (`CreateTaskScreen`)
- **Файлы**: PascalCase для компонентов, camelCase для утилит
- **Переменные/функции**: camelCase (`generateDescription`)
- **Константы**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Интерфейсы**: PascalCase с префиксом I (`IUser`) или без (`User`)

### Структура файлов

```typescript
// 1. Импорты из внешних библиотек
import React, { useState } from "react";
import { View, Text } from "react-native";

// 2. Импорты из внутренних модулей
import { Button } from "../components/Button";
import { ApiService } from "../services/ApiService";

// 3. Импорты типов
import { User, TaskRequest } from "../types";

// 4. Интерфейсы и типы
interface Props {
  user: User;
  onSubmit: (task: TaskRequest) => void;
}

// 5. Компонент
export const ComponentName: React.FC<Props> = ({ user, onSubmit }) => {
  // Состояние
  const [loading, setLoading] = useState(false);

  // Эффекты
  useEffect(() => {
    // ...
  }, []);

  // Обработчики
  const handleSubmit = () => {
    // ...
  };

  // Рендер
  return <View>{/* JSX */}</View>;
};

// 6. Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

## Тестирование

### Настройка тестов

```bash
# Запуск тестов фронтенда
npm test

# Запуск тестов бэкенда
cd backend
npm test

# Запуск с покрытием
npm run test:coverage
cd backend
npm run test:coverage
```

### Структура тестов

```typescript
describe("ComponentName", () => {
  beforeEach(() => {
    // Настройка перед каждым тестом
  });

  it("should render correctly", () => {
    // Тест рендера
  });

  it("should handle user interaction", () => {
    // Тест взаимодействия
  });
});
```

### Mock данные

```typescript
// __mocks__/MockData.ts
export const mockUser: User = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
  role: "client",
};

export const mockTaskRequest: TaskRequest = {
  id: "1",
  title: "Test Task",
  shortDescription: "Test description",
  client: mockUser,
  status: "draft",
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

## API Разработка

### Контроллеры

```typescript
export class AIController {
  async generateDescription(req: Request, res: Response): Promise<void> {
    try {
      // Валидация
      const { shortDescription, category } = req.body;
      if (!shortDescription || !category) {
        res.status(400).json({
          success: false,
          message: "Required fields are missing",
        });
        return;
      }

      // Бизнес логика
      const result = await this.aiService.generateDescription(req.body);

      // Ответ
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
```

### Сервисы

```typescript
export class OpenAIService {
  async generateDescription(
    request: AIGenerationRequest
  ): Promise<AIGenerationResponse> {
    try {
      // Логика обращения к API
      const response = await this.makeRequest(request);
      return this.parseResponse(response);
    } catch (error) {
      // Обработка ошибок
      throw new Error("Failed to generate description");
    }
  }
}
```

## Отладка

### Backend отладка

1. Установите breakpoints в VS Code
2. Запустите конфигурацию "Debug Backend"
3. Используйте Thunder Client или Postman для тестирования API

### Frontend отладка

1. Используйте React Native Debugger
2. Включите Debug JS Remotely в Dev Menu
3. Используйте console.log для отладки
4. Проверяйте Network tab для API вызовов

### Логирование

```typescript
// Backend
console.log("API request:", req.body);
console.error("Error occurred:", error);

// Frontend
console.log("State updated:", newState);
console.warn("Warning message");
```

## Deployment

### Backend

```bash
# Сборка для продакшн
cd backend
npm run build

# Запуск в продакшн
npm start
```

### Frontend

```bash
# Сборка Android APK
npm run android --mode=release

# Сборка iOS
npm run ios --mode=Release
```

## Полезные команды

### Разработка

```bash
# Очистка кэша Metro
npx react-native start --reset-cache

# Очистка кэша npm
npm cache clean --force

# Переустановка node_modules
rm -rf node_modules package-lock.json
npm install

# Проверка зависимостей
npm audit
npm audit fix
```

### Git workflow

```bash
# Создание feature branch
git checkout -b feature/task-creation

# Коммит изменений
git add .
git commit -m "feat: add task creation functionality"

# Push branch
git push origin feature/task-creation

# Merge в main
git checkout main
git merge feature/task-creation
```

## Troubleshooting

### Частые проблемы

1. **Metro bundle fails**

   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build fails**

   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

3. **iOS build fails**

   ```bash
   cd ios
   pod install
   cd ..
   npm run ios
   ```

4. **TypeScript errors**

   - Проверьте импорты
   - Убедитесь что типы установлены
   - Перезапустите TypeScript сервер в VS Code

5. **API connection issues**
   - Проверьте что бэкенд запущен
   - Проверьте URL в ApiService
   - Проверьте CORS настройки

## Ресурсы

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
