import request from "supertest";
import app from "../src/server";

describe("Export API", () => {
  describe("POST /api/export/pdf", () => {
    test("should export task to PDF successfully", async () => {
      const testData = {
        taskRequest: {
          id: "test-123",
          title: "Тестовая задача для экспорта",
          shortDescription: "Краткое описание",
          category: { name: "Разработка" },
          client: { name: "Тестовый клиент", email: "test@example.com" },
          deadline: null,
        },
        aiGeneration: {
          data: {
            detailedDescription: "Детальное описание задачи",
            estimatedHours: 40,
            estimatedCost: 50000,
            suggestedMilestones: ["Планирование", "Разработка", "Тестирование"],
            requirements: ["Требование 1", "Требование 2"],
            deliverables: ["Готовый продукт", "Документация"],
          },
        },
      };

      const response = await request(app)
        .post("/api/export/pdf")
        .send(testData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.fileName).toMatch(/^TZ_test-123_\d+\.pdf$/);
      expect(response.body.data.downloadUrl).toContain("/api/export/download/");
    }, 15000);

    test("should return error for invalid data", async () => {
      const invalidData = {};

      const response = await request(app)
        .post("/api/export/pdf")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("required");
    });
  });

  describe("GET /api/export/templates", () => {
    test("should return available export templates", async () => {
      const response = await request(app)
        .get("/api/export/templates")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);

      // Проверяем структуру шаблона
      const template = response.body.data[0];
      expect(template).toHaveProperty("id");
      expect(template).toHaveProperty("name");
      expect(template).toHaveProperty("description");
      expect(template).toHaveProperty("format");
    });
  });
});
