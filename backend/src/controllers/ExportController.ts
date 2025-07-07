import { Request, Response } from "express";
import { WordExportService } from "../services/WordExportService";
import { PDFExportService } from "../services/PDFExportService";
import { WordExportData, ApiResponse } from "../types";
import * as fs from "fs";
import * as path from "path";

export class ExportController {
  private wordExportService: WordExportService;
  private pdfExportService: PDFExportService;

  constructor() {
    this.wordExportService = new WordExportService();
    this.pdfExportService = new PDFExportService();
  }

  async exportToWord(req: Request, res: Response): Promise<void> {
    try {
      const data: WordExportData = req.body;

      // Валидация
      if (!data.taskRequest || !data.aiGeneration) {
        res.status(400).json({
          success: false,
          message: "Task request and AI generation data are required",
        });
        return;
      }

      const result = await this.wordExportService.generateWordDocument(data);

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: "Document generated successfully",
      };

      res.json(response);
    } catch (error: any) {
      console.error("Export to Word error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to export to Word",
      });
    }
  }

  async exportToPDF(req: Request, res: Response): Promise<void> {
    try {
      const data: WordExportData = req.body;

      // Валидация
      if (!data.taskRequest || !data.aiGeneration) {
        res.status(400).json({
          success: false,
          message: "Task request and AI generation data are required",
        });
        return;
      }

      const result = await this.pdfExportService.generatePDFDocument(data);

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: "PDF document generated successfully",
      };

      res.json(response);
    } catch (error: any) {
      console.error("Export to PDF error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to export to PDF",
      });
    }
  }

  async getTemplates(req: Request, res: Response): Promise<void> {
    try {
      const templates = await this.wordExportService.getExportTemplates();

      const response: ApiResponse<typeof templates> = {
        success: true,
        data: templates,
      };

      res.json(response);
    } catch (error: any) {
      console.error("Get templates error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get templates",
      });
    }
  }

  async downloadFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileName } = req.params;
      const filePath = path.join(__dirname, "../../exports", fileName);

      if (!fs.existsSync(filePath)) {
        res.status(404).json({
          success: false,
          message: "File not found",
        });
        return;
      }

      res.download(filePath, fileName, (err: any) => {
        if (err) {
          console.error("Download error:", err);
          res.status(500).json({
            success: false,
            message: "Failed to download file",
          });
        }
      });
    } catch (error: any) {
      console.error("Download file error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to download file",
      });
    }
  }
}
