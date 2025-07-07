import * as fs from "fs";
import * as path from "path";
import * as htmlPdf from "html-pdf-node";
import { WordExportData } from "../types";

export class PDFExportService {
  private readonly outputDir: string;

  constructor() {
    this.outputDir = path.join(__dirname, "../../exports");
    this.ensureOutputDir();
  }

  private ensureOutputDir(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generatePDFDocument(data: WordExportData): Promise<{
    downloadUrl: string;
    fileName: string;
  }> {
    const fileName = `TZ_${data.taskRequest.id}_${Date.now()}.pdf`;
    const filePath = path.join(this.outputDir, fileName);

    const html = this.generateHTML(data);

    const options = {
      format: "A4",
      margin: { top: "20mm", bottom: "20mm", left: "20mm", right: "20mm" },
      printBackground: true,
      preferCSSPageSize: true,
    };

    try {
      const file = { content: html };
      // Use callback-style API
      const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        try {
          htmlPdf.generatePdf(file, options, (err: any, buffer: Buffer) => {
            if (err) {
              reject(err);
            } else {
              resolve(buffer);
            }
          });
        } catch (error) {
          reject(error);
        }
      });

      fs.writeFileSync(filePath, pdfBuffer);

      return {
        downloadUrl: `/api/export/download/${fileName}`,
        fileName: fileName,
      };
    } catch (error: any) {
      throw new Error(
        `Failed to generate PDF: ${error.message || "Unknown error"}`
      );
    }
  }

  private generateHTML(data: WordExportData): string {
    const { taskRequest, aiGeneration } = data;
    const ai = aiGeneration?.data || {};

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Техническое задание - ${taskRequest.title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #007BFF;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #007BFF;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 16px;
            color: #666;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #212529;
            border-bottom: 2px solid #E9ECEF;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .info-item {
            background: #F8F9FA;
            padding: 12px;
            border-radius: 6px;
            border-left: 4px solid #007BFF;
        }
        
        .info-label {
            font-weight: bold;
            color: #495057;
            margin-bottom: 5px;
        }
        
        .info-value {
            color: #212529;
        }
        
        .content {
            background: #FAFAFA;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #DEE2E6;
            margin-bottom: 15px;
        }
        
        .list {
            list-style: none;
            padding: 0;
        }
        
        .list-item {
            background: #F8F9FA;
            margin-bottom: 8px;
            padding: 10px;
            border-radius: 4px;
            border-left: 3px solid #28A745;
            position: relative;
            padding-left: 40px;
        }
        
        .list-item:before {
            content: counter(item);
            counter-increment: item;
            position: absolute;
            left: 15px;
            top: 10px;
            background: #28A745;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }
        
        .requirements { counter-reset: item; }
        .deliverables { counter-reset: item; }
        .milestones { counter-reset: item; }
        
        .estimates {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .estimate-box {
            text-align: center;
            background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
        }
        
        .estimate-label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 5px;
        }
        
        .estimate-value {
            font-size: 24px;
            font-weight: bold;
        }
        
        .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #E9ECEF;
        }
        
        .signature-block {
            text-align: center;
        }
        
        .signature-role {
            font-weight: bold;
            margin-bottom: 10px;
            color: #495057;
        }
        
        .signature-line {
            border-bottom: 1px solid #666;
            margin: 30px 0 10px 0;
            height: 1px;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #DEE2E6;
            color: #6C757D;
            font-size: 12px;
        }
        
        @media print {
            body { 
                margin: 0;
                padding: 15mm;
            }
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">ТЕХНИЧЕСКОЕ ЗАДАНИЕ</div>
        <div class="subtitle">Автоматически сгенерировано с помощью TaskGo AI Assistant</div>
    </div>

    <div class="info-grid">
        <div class="info-item">
            <div class="info-label">Проект:</div>
            <div class="info-value">${taskRequest.title}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Дата создания:</div>
            <div class="info-value">${new Date().toLocaleDateString(
              "ru-RU"
            )}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Категория:</div>
            <div class="info-value">${taskRequest.category.name}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Заказчик:</div>
            <div class="info-value">${taskRequest.client.name}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">1. ОБЩЕЕ ОПИСАНИЕ ПРОЕКТА</div>
        <div class="content">
            ${taskRequest.shortDescription}
        </div>
    </div>

    <div class="section">
        <div class="section-title">2. ДЕТАЛЬНОЕ ТЕХНИЧЕСКОЕ ЗАДАНИЕ</div>
        <div class="content">
            ${ai.detailedDescription || "Детальное описание не предоставлено"}
        </div>
    </div>

    ${
      ai.requirements && ai.requirements.length > 0
        ? `
    <div class="section">
        <div class="section-title">3. ТРЕБОВАНИЯ</div>
        <ol class="list requirements">
            ${ai.requirements
              .map((req) => `<li class="list-item">${req}</li>`)
              .join("")}
        </ol>
    </div>
    `
        : ""
    }

    ${
      ai.deliverables && ai.deliverables.length > 0
        ? `
    <div class="section">
        <div class="section-title">4. РЕЗУЛЬТАТЫ РАБОТЫ</div>
        <ol class="list deliverables">
            ${ai.deliverables
              .map((deliverable) => `<li class="list-item">${deliverable}</li>`)
              .join("")}
        </ol>
    </div>
    `
        : ""
    }

    ${
      ai.suggestedMilestones && ai.suggestedMilestones.length > 0
        ? `
    <div class="section">
        <div class="section-title">5. ЭТАПЫ ВЫПОЛНЕНИЯ</div>
        <ol class="list milestones">
            ${ai.suggestedMilestones
              .map((milestone) => `<li class="list-item">${milestone}</li>`)
              .join("")}
        </ol>
    </div>
    `
        : ""
    }

    <div class="section">
        <div class="section-title">6. ОЦЕНКА ПРОЕКТА</div>
        <div class="estimates">
            ${
              ai.estimatedHours
                ? `
            <div class="estimate-box">
                <div class="estimate-label">Время выполнения</div>
                <div class="estimate-value">${ai.estimatedHours} часов</div>
            </div>
            `
                : ""
            }
            ${
              ai.estimatedCost
                ? `
            <div class="estimate-box">
                <div class="estimate-label">Стоимость</div>
                <div class="estimate-value">${ai.estimatedCost.toLocaleString(
                  "ru-RU"
                )} ₽</div>
            </div>
            `
                : ""
            }
        </div>
    </div>

    <div class="section">
        <div class="section-title">7. СОГЛАСОВАНИЕ</div>
        <div class="signatures">
            <div class="signature-block">
                <div class="signature-role">Заказчик</div>
                <div>${taskRequest.client.name}</div>
                <div class="signature-line"></div>
                <div>Подпись / Дата</div>
            </div>
            <div class="signature-block">
                <div class="signature-role">Исполнитель</div>
                <div>____________________</div>
                <div class="signature-line"></div>
                <div>Подпись / Дата</div>
            </div>
        </div>
    </div>

    <div class="footer">
        Документ создан автоматически с помощью TaskGo AI Assistant<br>
        ${new Date().toLocaleString("ru-RU")}
    </div>
</body>
</html>
    `;
  }

  getFilePath(fileName: string): string {
    return path.join(this.outputDir, fileName);
  }
}
