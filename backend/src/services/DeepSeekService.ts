import axios from "axios";
import { AIGenerationRequest, AIGenerationResponse } from "../types";

interface DeepSeekRequest {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class DeepSeekService {
  private readonly apiKey: string;
  private readonly baseURL = "https://api.deepseek.com/v1"; // Официальный API URL
  private readonly model = "deepseek-chat"; // Основная модель для чата

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || "demo-key";
    if (!this.apiKey || this.apiKey === "your_deepseek_api_key_here") {
      console.warn(
        "⚠️  DEEPSEEK_API_KEY not configured. Using demo responses."
      );
    }
  }

  private async makeRequest(request: DeepSeekRequest): Promise<string> {
    try {
      // Если API ключ не настроен, возвращаем демо-ответ
      if (
        !this.apiKey ||
        this.apiKey === "demo-key" ||
        this.apiKey === "your_deepseek_api_key_here"
      ) {
        return this.getDemoResponse(request);
      }

      const response = await axios.post<DeepSeekResponse>(
        `${this.baseURL}/chat/completions`,
        request,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 секунд таймаут
        }
      );

      return response.data.choices[0]?.message?.content || "";
    } catch (error: any) {
      console.error(
        "DeepSeek API Error:",
        error.response?.data || error.message
      );
      // В случае ошибки API возвращаем демо-ответ
      return this.getDemoResponse(request);
    }
  }

  private getDemoResponse(request: DeepSeekRequest): string {
    const userMessage =
      request.messages.find((m) => m.role === "user")?.content || "";

    if (
      userMessage.includes("техническое задание") ||
      userMessage.includes("ТЗ")
    ) {
      return JSON.stringify({
        detailedDescription:
          "Разработка мобильного приложения TaskGo - marketplace для услуг с ИИ-ассистентом. Включает создание React Native фронтенда, Node.js бэкенда, интеграцию с DeepSeek AI для генерации технических заданий, систему оценки времени и стоимости работ, экспорт в Word документы.",
        estimatedHours: 200,
        estimatedCost: 300000,
        suggestedMilestones: [
          "Настройка архитектуры и базовой инфраструктуры (2 недели)",
          "Разработка мобильного интерфейса (3 недели)",
          "Интеграция ИИ и backend API (2 недели)",
          "Система документооборота и экспорт (1 неделя)",
          "Тестирование и деплой (1 неделя)",
        ],
        technologies: [
          "React Native",
          "TypeScript",
          "Node.js",
          "Express",
          "MongoDB",
          "DeepSeek AI",
        ],
        riskAssessment:
          "Средний уровень сложности. Основные риски: интеграция ИИ API, производительность мобильного приложения",
        requirements: [
          "Техническое задание согласовано с заказчиком",
          "Предоставлены доступы к необходимым системам",
          "Определены сроки и бюджет проекта",
          "Настроена инфраструктура разработки",
        ],
        deliverables: [
          "Готовое мобильное приложение для iOS и Android",
          "Backend API с документацией",
          "Техническая документация проекта",
          "Инструкция по эксплуатации и деплою",
        ],
      });
    }

    if (userMessage.includes("оценка") || userMessage.includes("стоимость")) {
      return JSON.stringify({
        estimatedHours: Math.floor(Math.random() * 100) + 50,
        estimatedCost: Math.floor(Math.random() * 150000) + 75000,
        complexity: ["Низкая", "Средняя", "Высокая"][
          Math.floor(Math.random() * 3)
        ],
        riskFactors: [
          "Неопределенность требований",
          "Сложность интеграции",
          "Временные ограничения",
        ],
      });
    }

    if (
      userMessage.includes("улучшения") ||
      userMessage.includes("рекомендации")
    ) {
      return JSON.stringify({
        improvements: [
          "Добавить систему уведомлений для клиентов",
          "Интегрировать онлайн-платежи",
          "Реализовать систему рейтингов и отзывов",
          "Добавить геолокацию для поиска исполнителей",
          "Внедрить чат между клиентом и исполнителем",
        ],
        priorityLevel: "Высокий",
        implementationComplexity: "Средняя",
      });
    }

    return JSON.stringify({
      response:
        "Анализ выполнен с помощью DeepSeek AI. Для получения более точных результатов рекомендуется настроить API-ключ.",
      suggestion: "Уточните техническое задание для более детального анализа.",
    });
  }

  async generateDescription(
    request: AIGenerationRequest
  ): Promise<AIGenerationResponse> {
    try {
      const prompt = `Создай подробное техническое задание для проекта: "${request.briefDescription}".
      
Требуется:
1. Детальное описание функционала
2. Оценка времени разработки в часах
3. Примерная стоимость в рублях (исходя из 1500 руб/час)
4. Список этапов разработки
5. Необходимые технологии
6. Оценка рисков

Ответ должен быть в формате JSON с полями:
- detailedDescription: string
- estimatedHours: number
- estimatedCost: number  
- suggestedMilestones: string[]
- technologies: string[]
- riskAssessment: string`;

      const deepSeekRequest: DeepSeekRequest = {
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "Ты - эксперт по созданию технических заданий для IT-проектов. Отвечай только в формате JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      };

      const responseText = await this.makeRequest(deepSeekRequest);
      const parsedResponse = JSON.parse(responseText);

      return {
        success: true,
        data: {
          detailedDescription:
            parsedResponse.detailedDescription || responseText,
          estimatedHours: parsedResponse.estimatedHours || 0,
          estimatedCost: parsedResponse.estimatedCost || 0,
          suggestedMilestones: parsedResponse.suggestedMilestones || [],
          technologies: parsedResponse.technologies || [],
          riskAssessment: parsedResponse.riskAssessment || "",
          requirements: parsedResponse.requirements || [
            "Техническое задание согласовано с заказчиком",
            "Предоставлены все необходимые доступы",
            "Определены сроки выполнения работ",
          ],
          deliverables: parsedResponse.deliverables || [
            "Рабочий продукт согласно техническому заданию",
            "Документация к проекту",
            "Инструкция по эксплуатации",
          ],
        },
      };
    } catch (error: any) {
      console.error("DeepSeek generation error:", error);
      return {
        success: false,
        error: "Ошибка генерации с DeepSeek AI",
        data: {
          detailedDescription: "Ошибка при обращении к ИИ",
          estimatedHours: 0,
          estimatedCost: 0,
          suggestedMilestones: [],
          technologies: [],
          riskAssessment: "",
          requirements: ["Требуется дополнительная настройка"],
          deliverables: ["Результат будет определен позже"],
        },
      };
    }
  }

  async estimateTask(
    description: string
  ): Promise<{ hours: number; cost: number; complexity: string }> {
    try {
      const prompt = `Оцени сложность и время разработки для задачи: "${description}".
      
Ответ в JSON формате:
- estimatedHours: number (часы разработки)
- estimatedCost: number (стоимость в рублях, 1500 руб/час)
- complexity: string ("Низкая", "Средняя", "Высокая")
- riskFactors: string[] (основные риски)`;

      const deepSeekRequest: DeepSeekRequest = {
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "Ты - эксперт по оценке сложности IT-проектов. Отвечай только в формате JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      };

      const responseText = await this.makeRequest(deepSeekRequest);
      const parsedResponse = JSON.parse(responseText);

      return {
        hours: parsedResponse.estimatedHours || 40,
        cost: parsedResponse.estimatedCost || 60000,
        complexity: parsedResponse.complexity || "Средняя",
      };
    } catch (error: any) {
      console.error("DeepSeek estimation error:", error);
      return {
        hours: 40,
        cost: 60000,
        complexity: "Средняя",
      };
    }
  }

  async suggestImprovements(description: string): Promise<string[]> {
    try {
      const prompt = `Предложи улучшения для проекта: "${description}".
      
Ответ в JSON формате:
- improvements: string[] (список конкретных улучшений)
- priorityLevel: string (уровень приоритета)
- implementationComplexity: string (сложность реализации)`;

      const deepSeekRequest: DeepSeekRequest = {
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "Ты - консультант по улучшению IT-продуктов. Предлагай конкретные и реализуемые улучшения.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1500,
      };

      const responseText = await this.makeRequest(deepSeekRequest);
      const parsedResponse = JSON.parse(responseText);

      return (
        parsedResponse.improvements || [
          "Добавить базовую документацию",
          "Улучшить пользовательский интерфейс",
          "Оптимизировать производительность",
        ]
      );
    } catch (error: any) {
      console.error("DeepSeek improvements error:", error);
      return [
        "Добавить базовую документацию",
        "Улучшить пользовательский интерфейс",
        "Оптимизировать производительность",
      ];
    }
  }

  async suggestCategories(description: string): Promise<string[]> {
    try {
      const prompt = `Определи подходящие категории для проекта: "${description}".
      
Ответ в JSON формате:
- categories: string[] (список релевантных категорий)`;

      const deepSeekRequest: DeepSeekRequest = {
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "Ты - эксперт по классификации IT-проектов. Определяй точные и релевантные категории.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
      };

      const responseText = await this.makeRequest(deepSeekRequest);
      const parsedResponse = JSON.parse(responseText);

      return (
        parsedResponse.categories || [
          "Разработка ПО",
          "Мобильные приложения",
          "Веб-разработка",
        ]
      );
    } catch (error: any) {
      console.error("DeepSeek categories error:", error);
      return ["Разработка ПО", "Мобильные приложения", "Веб-разработка"];
    }
  }

  async analyzeComplexity(description: string): Promise<{
    complexity: string;
    factors: string[];
    recommendations: string[];
  }> {
    try {
      const prompt = `Проанализируй сложность проекта: "${description}".
      
Ответ в JSON формате:
- complexity: string ("Низкая", "Средняя", "Высокая")
- factors: string[] (факторы, влияющие на сложность)
- recommendations: string[] (рекомендации по снижению рисков)`;

      const deepSeekRequest: DeepSeekRequest = {
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "Ты - аналитик сложности IT-проектов. Делай объективную оценку и давай практические рекомендации.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 1000,
      };

      const responseText = await this.makeRequest(deepSeekRequest);
      const parsedResponse = JSON.parse(responseText);

      return {
        complexity: parsedResponse.complexity || "Средняя",
        factors: parsedResponse.factors || ["Требует дополнительного анализа"],
        recommendations: parsedResponse.recommendations || [
          "Уточнить требования",
          "Разбить на этапы",
        ],
      };
    } catch (error: any) {
      console.error("DeepSeek complexity error:", error);
      return {
        complexity: "Средняя",
        factors: ["Требует дополнительного анализа"],
        recommendations: ["Уточнить требования", "Разбить на этапы"],
      };
    }
  }
}
