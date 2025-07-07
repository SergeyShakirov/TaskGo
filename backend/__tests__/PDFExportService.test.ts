import { PDFExportService } from "../src/services/PDFExportService";
import { WordExportData } from "../src/types";
import * as fs from "fs";
import * as path from "path";

describe("PDFExportService", () => {
  let pdfExportService: PDFExportService;
  const testExportsDir = path.join(__dirname, "../test-exports");

  beforeEach(() => {
    pdfExportService = new PDFExportService();

    // Создаем тестовую директорию
    if (!fs.existsSync(testExportsDir)) {
      fs.mkdirSync(testExportsDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Очищаем тестовые файлы
    if (fs.existsSync(testExportsDir)) {
      try {
        const files = fs.readdirSync(testExportsDir);
        files.forEach((file) => {
          const filePath = path.join(testExportsDir, file);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      } catch (error) {
        console.warn("Failed to clean test files:", error);
      }
    }
  });

  describe("generatePDFDocument", () => {
    test("should generate PDF document successfully", async () => {
      const mockData: WordExportData = {
        taskRequest: {
          id: "test-123",
          title: "Тестовая задача",
          shortDescription: "Краткое описание тестовой задачи",
          category: {
            id: "1",
            name: "Разработка",
            description: "Разработка ПО",
            icon: "code",
          },
          client: {
            id: "1",
            name: "Тестовый клиент",
            email: "client@test.com",
            role: "client" as const,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          status: "draft" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        aiGeneration: {
          success: true,
          data: {
            detailedDescription: "Детальное описание тестовой задачи",
            estimatedHours: 40,
            estimatedCost: 50000,
            suggestedMilestones: ["Этап 1", "Этап 2"],
            requirements: ["Требование 1", "Требование 2"],
            deliverables: ["Результат 1", "Результат 2"],
          },
        },
        clientApproval: false,
        contractorApproval: false,
      };

      const result = await pdfExportService.generatePDFDocument(mockData);

      expect(result).toBeDefined();
      expect(result.fileName).toContain("TZ_test-123");
      expect(result.fileName).toMatch(/\.pdf$/);
      expect(result.downloadUrl).toContain("/api/export/download/");

      // Проверяем, что файл действительно создан
      expect(fs.existsSync(pdfExportService.getFilePath(result.fileName))).toBe(
        true
      );
    }, 60000); // Увеличиваем timeout до 60 секунд для PDF генерации

    test("should handle missing AI data gracefully", async () => {
      const mockData: WordExportData = {
        taskRequest: {
          id: "test-456",
          title: "Задача без ИИ данных",
          shortDescription: "Краткое описание",
          category: {
            id: "1",
            name: "Разработка",
            description: "Разработка ПО",
            icon: "code",
          },
          client: {
            id: "1",
            name: "Клиент",
            email: "client@test.com",
            role: "client" as const,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          status: "draft" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        aiGeneration: {
          success: false,
          data: {
            detailedDescription: "",
            estimatedHours: 0,
            estimatedCost: 0,
            suggestedMilestones: [],
            requirements: [],
            deliverables: [],
          },
        },
        clientApproval: false,
        contractorApproval: false,
      };

      const result = await pdfExportService.generatePDFDocument(mockData);

      expect(result).toBeDefined();
      expect(result.fileName).toContain("TZ_test-456");
    }, 60000); // Увеличиваем timeout до 60 секунд
  });
});
