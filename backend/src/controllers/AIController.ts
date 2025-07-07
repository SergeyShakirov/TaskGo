import { Request, Response } from "express";
import { DeepSeekService } from "../services/DeepSeekService";
import { AIGenerationRequest, ApiResponse } from "../types";

export class AIController {
  private deepSeekService: DeepSeekService;

  constructor() {
    this.deepSeekService = new DeepSeekService();
  }

  async generateDescription(req: Request, res: Response): Promise<void> {
    try {
      const request: AIGenerationRequest = req.body;

      // Валидация
      if (!request.briefDescription) {
        res.status(400).json({
          success: false,
          message: "Brief description is required",
        });
        return;
      }

      const result = await this.deepSeekService.generateDescription(request);

      // Если не success, возвращаем ошибку с message
      if (!result.success) {
        res.status(502).json({
          success: false,
          message: result.error || "Ошибка генерации с DeepSeek AI",
          data: result.data,
        });
        return;
      }

      res.json(result);
    } catch (error: any) {
      console.error("Generate description error:", error);
      res.status(500).json({
        success: false,
        message:
          error.message || "Failed to generate description with DeepSeek",
      });
    }
  }

  async estimateTask(req: Request, res: Response): Promise<void> {
    try {
      const { description } = req.body;

      if (!description) {
        res.status(400).json({
          success: false,
          message: "Description is required",
        });
        return;
      }

      const result = await this.deepSeekService.estimateTask(description);

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };

      res.json(response);
    } catch (error: any) {
      console.error("Estimate task error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to estimate task with DeepSeek",
      });
    }
  }

  async suggestImprovements(req: Request, res: Response): Promise<void> {
    try {
      const { description } = req.body;

      if (!description) {
        res.status(400).json({
          success: false,
          message: "Description is required",
        });
        return;
      }

      const improvements = await this.deepSeekService.suggestImprovements(
        description
      );

      const result = {
        suggestions: improvements,
        improvedDescription:
          "Улучшенное описание с учетом рекомендаций DeepSeek AI.",
      };

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };

      res.json(response);
    } catch (error: any) {
      console.error("Suggest improvements error:", error);
      res.status(500).json({
        success: false,
        message:
          error.message || "Failed to suggest improvements with DeepSeek",
      });
    }
  }

  async suggestCategories(req: Request, res: Response): Promise<void> {
    try {
      const { description } = req.body;

      if (!description) {
        res.status(400).json({
          success: false,
          message: "Description is required",
        });
        return;
      }

      const categoryNames = await this.deepSeekService.suggestCategories(
        description
      );

      // Преобразуем в формат с дополнительными данными
      const categories = categoryNames.map((name, index) => ({
        id: (index + 1).toString(),
        name,
        description: `Категория: ${name}`,
        icon: name.toLowerCase().includes("веб")
          ? "web"
          : name.toLowerCase().includes("мобил")
          ? "mobile"
          : name.toLowerCase().includes("дизайн")
          ? "design"
          : "code",
      }));

      const response: ApiResponse<typeof categories> = {
        success: true,
        data: categories,
      };

      res.json(response);
    } catch (error: any) {
      console.error("Suggest categories error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to suggest categories with DeepSeek",
      });
    }
  }

  async analyzeComplexity(req: Request, res: Response): Promise<void> {
    try {
      const { description } = req.body;

      if (!description) {
        res.status(400).json({
          success: false,
          message: "Description is required",
        });
        return;
      }

      const result = await this.deepSeekService.analyzeComplexity(description);

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };

      res.json(response);
    } catch (error: any) {
      console.error("Analyze complexity error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to analyze complexity with DeepSeek",
      });
    }
  }
}
