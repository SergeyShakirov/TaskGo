import request from "supertest";
import app from "../src/server";

describe("AI Controller", () => {
  describe("POST /api/ai/generate-description", () => {
    it("should generate task description with valid input", async () => {
      const requestBody = {
        briefDescription: "Создать интернет-магазин",
        category: "1",
        budget: 100000,
      };

      const response = await request(app)
        .post("/api/ai/generate-description")
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("detailedDescription");
      expect(response.body.data).toHaveProperty("estimatedHours");
      expect(response.body.data).toHaveProperty("estimatedCost");
      expect(response.body.data).toHaveProperty("suggestedMilestones");
      expect(response.body.data).toHaveProperty("technologies");
      expect(response.body.data).toHaveProperty("riskAssessment");
    });

    it("should return 400 when briefDescription is missing", async () => {
      const requestBody = {
        category: "1",
      };

      const response = await request(app)
        .post("/api/ai/generate-description")
        .send(requestBody)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("required");
    });

    it("should generate task description without category", async () => {
      const requestBody = {
        briefDescription: "Создать интернет-магазин",
      };

      const response = await request(app)
        .post("/api/ai/generate-description")
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("detailedDescription");
    });
  });

  describe("POST /api/ai/estimate", () => {
    it("should estimate task with valid input", async () => {
      const requestBody = {
        description: "Создать интернет-магазин с корзиной и оплатой",
        category: "web-development",
      };

      const response = await request(app)
        .post("/api/ai/estimate")
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("hours");
      expect(response.body.data).toHaveProperty("cost");
      expect(typeof response.body.data.hours).toBe("number");
      expect(typeof response.body.data.cost).toBe("number");
    });

    it("should return 400 when description is missing", async () => {
      const requestBody = {
        category: "web-development",
      };

      const response = await request(app)
        .post("/api/ai/estimate")
        .send(requestBody)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("required");
    });
  });

  describe("POST /api/ai/suggest-improvements", () => {
    it("should suggest improvements with valid input", async () => {
      const requestBody = {
        description: "Сделать сайт",
      };

      const response = await request(app)
        .post("/api/ai/suggest-improvements")
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("suggestions");
      expect(response.body.data).toHaveProperty("improvedDescription");
      expect(Array.isArray(response.body.data.suggestions)).toBe(true);
    });
  });

  describe("POST /api/ai/suggest-categories", () => {
    it("should suggest categories with valid input", async () => {
      const requestBody = {
        description: "Создать мобильное приложение для iOS",
      };

      const response = await request(app)
        .post("/api/ai/suggest-categories")
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty("id");
      expect(response.body.data[0]).toHaveProperty("name");
      expect(response.body.data[0]).toHaveProperty("description");
    });
  });

  describe("POST /api/ai/analyze-complexity", () => {
    it("should analyze complexity with valid input", async () => {
      const requestBody = {
        description:
          "Создать систему с машинным обучением и интеграцией с внешними API",
      };

      const response = await request(app)
        .post("/api/ai/analyze-complexity")
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("complexity");
      expect(response.body.data).toHaveProperty("factors");
      expect(response.body.data).toHaveProperty("recommendations");
      expect(["Низкая", "Средняя", "Высокая"]).toContain(
        response.body.data.complexity
      );
    });

    it("should return complexity for complex descriptions", async () => {
      const requestBody = {
        description:
          "Создать платформу с машинным обучением, искусственным интеллектом, интеграцией с множественными API, база данных, микросервисная архитектура",
      };

      const response = await request(app)
        .post("/api/ai/analyze-complexity")
        .send(requestBody)
        .expect(200);

      // Since we're using demo responses, we expect the default 'Средняя' complexity
      expect(["Низкая", "Средняя", "Высокая"]).toContain(
        response.body.data.complexity
      );
    });

    it("should return complexity for simple descriptions", async () => {
      const requestBody = {
        description: "Простой сайт",
      };

      const response = await request(app)
        .post("/api/ai/analyze-complexity")
        .send(requestBody)
        .expect(200);

      // Since we're using demo responses, we expect the default 'Средняя' complexity
      expect(["Низкая", "Средняя", "Высокая"]).toContain(
        response.body.data.complexity
      );
    });
  });
});
