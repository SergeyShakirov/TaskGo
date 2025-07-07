import axios from "axios";
import {
  AIGenerationRequest,
  AIGenerationResponse,
  OpenAIRequest,
  OpenAIResponse,
} from "../types";

export class OpenAIService {
  private readonly apiKey: string;
  private readonly baseURL = "https://api.openai.com/v1";

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "demo-key";
    if (!this.apiKey || this.apiKey === "your_openai_api_key_here") {
      console.warn("⚠️  OPENAI_API_KEY not configured. Using demo responses.");
    }
  }

  private async makeRequest(request: OpenAIRequest): Promise<string> {
    try {
      // Если API ключ не настроен, возвращаем демо-ответ
      if (
        !this.apiKey ||
        this.apiKey === "demo-key" ||
        this.apiKey === "your_openai_api_key_here"
      ) {
        return this.getDemoResponse(request);
      }

      const response = await axios.post<OpenAIResponse>(
        `${this.baseURL}/chat/completions`,
        request,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0]?.message?.content || "";
    } catch (error: any) {
      console.error("OpenAI API Error:", error.response?.data || error.message);
      // В случае ошибки API возвращаем демо-ответ
      return this.getDemoResponse(request);
    }
  }

  private getDemoResponse(request: OpenAIRequest): string {
    const userMessage =
      request.messages.find((m) => m.role === "user")?.content || "";

    if (
      userMessage.includes("техническое задание") ||
      userMessage.includes("ТЗ")
    ) {
      return this.generateVariableDemoResponse(userMessage);
    }

    return '{"estimatedHours": 40, "estimatedCost": 60000}';
  }

  private generateVariableDemoResponse(description: string): string {
    // Генерируем различные ответы в зависимости от содержания
    const randomFactor = Math.floor(Math.random() * 3);
    const baseHours = 40 + Math.floor(Math.random() * 80);
    const baseCost = 50000 + Math.floor(Math.random() * 100000);

    const templates = [
      {
        detailedDescription: `Разработка проекта "${description.substring(
          0,
          50
        )}..." включает полный цикл от анализа до внедрения. Проект будет реализован с использованием современных технологий и лучших практик разработки.`,
        milestones: [
          "Анализ требований и планирование",
          "Создание архитектуры и дизайна",
          "Разработка основного функционала",
          "Тестирование и оптимизация",
          "Внедрение и поддержка",
        ],
        requirements: [
          "Современный адаптивный интерфейс",
          "Кроссплатформенная совместимость",
          "Высокая производительность",
          "Безопасность данных",
        ],
        deliverables: [
          "Готовое к использованию решение",
          "Техническая документация",
          "Руководство пользователя",
          "Исходный код проекта",
        ],
      },
      {
        detailedDescription:
          "Комплексная разработка проекта с учетом современных требований рынка. Включает создание пользовательского интерфейса, бэкенд-логики и интеграции с внешними сервисами.",
        milestones: [
          "Исследование и прототипирование",
          "UI/UX дизайн и верстка",
          "Программирование и интеграция",
          "Тестирование и отладка",
          "Деплой и настройка продакшн",
        ],
        requirements: [
          "Отзывчивый дизайн",
          "API интеграции",
          "Система авторизации",
          "Мониторинг и аналитика",
        ],
        deliverables: [
          "Веб/мобильное приложение",
          "Административная панель",
          "API документация",
          "Инструкция по развертыванию",
        ],
      },
      {
        detailedDescription:
          "Создание масштабируемого решения с использованием современного стека технологий. Проект ориентирован на высокую производительность и удобство использования.",
        milestones: [
          "Техническое планирование",
          "Разработка MVP версии",
          "Расширение функционала",
          "Интеграционное тестирование",
          "Финальная доставка",
        ],
        requirements: [
          "Масштабируемая архитектура",
          "Интуитивный интерфейс",
          "Надежная защита данных",
          "Поддержка мобильных устройств",
        ],
        deliverables: [
          "Рабочее приложение",
          "База данных и API",
          "Система тестирования",
          "Документация разработчика",
        ],
      },
    ];

    const template = templates[randomFactor];

    return JSON.stringify({
      detailedDescription: template.detailedDescription,
      estimatedHours: baseHours,
      estimatedCost: baseCost,
      suggestedMilestones: template.milestones,
      requirements: template.requirements,
      deliverables: template.deliverables,
    });
  }

  async generateTaskDescription(
    request: AIGenerationRequest
  ): Promise<AIGenerationResponse> {
    const prompt = this.buildTaskDescriptionPrompt(request);

    const openAIRequest: OpenAIRequest = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Ты опытный проект-менеджер, который создает детальные технические задания для различных проектов. Отвечай строго в формате JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    };

    const response = await this.makeRequest(openAIRequest);
    return this.parseAIResponse(response);
  }

  private buildTaskDescriptionPrompt(request: AIGenerationRequest): string {
    let prompt = `Создай детальное техническое задание на основе следующего краткого описания:

"${request.shortDescription}"

Категория: ${request.category}`;

    if (request.budget) {
      prompt += `\nБюджет: ${request.budget} рублей`;
    }

    if (request.deadline) {
      prompt += `\nСрок: ${request.deadline}`;
    }

    prompt += `

Верни результат в следующем JSON формате:
{
  "detailedDescription": "Подробное описание проекта с техническими требованиями",
  "estimatedHours": числовое_значение_часов,
  "estimatedCost": числовое_значение_стоимости_в_рублях,
  "suggestedMilestones": ["этап 1", "этап 2", "этап 3"],
  "requirements": ["требование 1", "требование 2", "требование 3"],
  "deliverables": ["результат 1", "результат 2", "результат 3"]
}

Учитывай российский рынок и реальные цены на услуги. Будь конкретным и практичным.`;

    return prompt;
  }

  private parseAIResponse(response: string): AIGenerationResponse {
    try {
      // Попытаемся извлечь JSON из ответа
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        success: true,
        data: {
          detailedDescription:
            parsed.detailedDescription || "Описание не сгенерировано",
          estimatedHours: Number(parsed.estimatedHours) || 40,
          estimatedCost: Number(parsed.estimatedCost) || 50000,
          suggestedMilestones: Array.isArray(parsed.suggestedMilestones)
            ? parsed.suggestedMilestones
            : ["Анализ требований", "Разработка", "Тестирование", "Деплой"],
          requirements: Array.isArray(parsed.requirements)
            ? parsed.requirements
            : [
                "Техническое задание",
                "Дизайн макеты",
                "Доступ к необходимым системам",
              ],
          deliverables: Array.isArray(parsed.deliverables)
            ? parsed.deliverables
            : ["Рабочий продукт", "Документация", "Передача проекта"],
        },
      };
    } catch (error) {
      console.error("Failed to parse AI response:", error);

      // Возвращаем fallback ответ
      return {
        success: true,
        data: {
          detailedDescription: `Детальное техническое задание для проекта: ${response.substring(
            0,
            200
          )}...`,
          estimatedHours: 40,
          estimatedCost: 50000,
          suggestedMilestones: [
            "Анализ требований и планирование",
            "Разработка основного функционала",
            "Тестирование и отладка",
            "Финальная проверка и деплой",
          ],
          requirements: [
            "Подробное техническое задание",
            "Доступ к необходимым системам",
            "Утверждение дизайна",
          ],
          deliverables: [
            "Готовый продукт",
            "Техническая документация",
            "Руководство пользователя",
          ],
        },
      };
    }
  }

  async estimateTask(
    description: string,
    category: string
  ): Promise<{
    estimatedHours: number;
    estimatedCost: number;
  }> {
    const prompt = `Оцени трудозатраты и стоимость для следующего проекта:
    
Описание: ${description}
Категория: ${category}

Верни результат в JSON формате:
{
  "estimatedHours": числовое_значение_часов,
  "estimatedCost": числовое_значение_стоимости_в_рублях
}

Учитывай средние цены на российском рынке.`;

    const openAIRequest: OpenAIRequest = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Ты опытный оценщик проектов. Давай реалистичные оценки времени и стоимости.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.3,
    };

    const response = await this.makeRequest(openAIRequest);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          estimatedHours: Number(parsed.estimatedHours) || 40,
          estimatedCost: Number(parsed.estimatedCost) || 50000,
        };
      }
    } catch (error) {
      console.error("Failed to parse estimation response:", error);
    }

    return {
      estimatedHours: 40,
      estimatedCost: 50000,
    };
  }
}
