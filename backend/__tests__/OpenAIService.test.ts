import { OpenAIService } from "../src/services/OpenAIService";
import { AIGenerationRequest } from "../src/types";

describe("OpenAIService", () => {
  let openAIService: OpenAIService;

  beforeEach(() => {
    openAIService = new OpenAIService();
  });

  describe("generateTaskDescription", () => {
    test("should generate task description successfully", async () => {
      const request: AIGenerationRequest = {
        briefDescription: "Создать мобильное приложение для интернет-магазина",
        category: "mobile-development",
        budget: 100000,
      };

      const result = await openAIService.generateTaskDescription(request);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.detailedDescription).toBeDefined();
      expect(result.data.estimatedHours).toBeGreaterThan(0);
      expect(result.data.estimatedCost).toBeGreaterThan(0);
      expect(Array.isArray(result.data.suggestedMilestones)).toBe(true);
      expect(Array.isArray(result.data.requirements)).toBe(true);
      expect(Array.isArray(result.data.deliverables)).toBe(true);
    });

    test("should return different responses for different descriptions", async () => {
      const request1: AIGenerationRequest = {
        briefDescription: "Создать веб-сайт",
        category: "web-development",
      };

      const request2: AIGenerationRequest = {
        briefDescription: "Разработать мобильное приложение",
        category: "mobile-development",
      };

      const result1 = await openAIService.generateTaskDescription(request1);
      const result2 = await openAIService.generateTaskDescription(request2);

      // Проверяем что ответы разные (хотя бы по стоимости или времени)
      expect(
        result1.data.estimatedCost !== result2.data.estimatedCost ||
          result1.data.estimatedHours !== result2.data.estimatedHours
      ).toBe(true);
    });

    test("should handle empty description gracefully", async () => {
      const request: AIGenerationRequest = {
        briefDescription: "",
      };

      const result = await openAIService.generateTaskDescription(request);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe("estimateTask", () => {
    test("should estimate task parameters", async () => {
      const result = await openAIService.estimateTask(
        "Создать интернет-магазин",
        "e-commerce"
      );

      expect(result.estimatedHours).toBeGreaterThan(0);
      expect(result.estimatedCost).toBeGreaterThan(0);
    });
  });
});
