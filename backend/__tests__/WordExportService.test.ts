import { WordExportService } from "../src/services/WordExportService";
import { WordExportData } from "../src/types";
import * as fs from "fs";
import * as path from "path";

describe("WordExportService", () => {
  let wordExportService: WordExportService;
  const outputDir = path.join(__dirname, "../exports");

  beforeEach(() => {
    wordExportService = new WordExportService();
  });

  afterEach(() => {
    // Clean up generated files
    if (fs.existsSync(outputDir)) {
      const files = fs.readdirSync(outputDir);
      files.forEach((file) => {
        if (file.startsWith("TZ_test-") && file.endsWith(".docx")) {
          fs.unlinkSync(path.join(outputDir, file));
        }
      });
    }
  });

  it("should generate a Word document successfully", async () => {
    const mockData: WordExportData = {
      taskRequest: {
        id: "test-123",
        title: "Test Task",
        shortDescription: "Test description",
        category: {
          id: "1",
          name: "Development",
          description: "Software Development",
          icon: "code",
        },
        client: {
          id: "client-1",
          name: "John Doe",
          email: "john@example.com",
          role: "client",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        deadline: new Date("2025-12-31"),
      },
      aiGeneration: {
        success: true,
        data: {
          detailedDescription: "Detailed test description",
          estimatedHours: 40,
          estimatedCost: 50000,
          suggestedMilestones: ["Planning", "Development", "Testing"],
          technologies: ["React Native", "TypeScript"],
          requirements: ["Frontend", "Backend"],
          deliverables: ["Mobile App", "Documentation"],
        },
      },
      clientApproval: true,
      contractorApproval: true,
    };

    const result = await wordExportService.generateWordDocument(mockData);

    expect(result).toBeDefined();
    expect(result.fileName).toMatch(/^TZ_test-123_\d+\.docx$/);
    expect(result.downloadUrl).toContain("/api/export/download/");

    // Check that file was actually created
    const filePath = path.join(outputDir, result.fileName);
    expect(fs.existsSync(filePath)).toBe(true);

    // Check file is not empty
    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(0);
  });

  it("should handle missing AI generation data gracefully", async () => {
    const mockData: WordExportData = {
      taskRequest: {
        id: "test-456",
        title: "Test Task Without AI",
        shortDescription: "Test description",
        category: {
          id: "1",
          name: "Development",
          description: "Software Development",
          icon: "code",
        },
        client: {
          id: "client-1",
          name: "John Doe",
          email: "john@example.com",
          role: "client",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      aiGeneration: {
        success: true,
        data: {
          detailedDescription: "",
          estimatedHours: 0,
          estimatedCost: 0,
          suggestedMilestones: [],
          technologies: [],
          requirements: [],
          deliverables: [],
        },
      },
      clientApproval: false,
      contractorApproval: false,
    };

    const result = await wordExportService.generateWordDocument(mockData);

    expect(result).toBeDefined();
    expect(result.fileName).toMatch(/^TZ_test-456_\d+\.docx$/);

    // Check that file was created even with minimal data
    const filePath = path.join(outputDir, result.fileName);
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
