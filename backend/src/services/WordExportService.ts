import * as fs from "fs";
import * as path from "path";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { WordExportData } from "../types";

export class WordExportService {
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

  async generateWordDocument(data: WordExportData): Promise<{
    downloadUrl: string;
    fileName: string;
  }> {
    const fileName = `TZ_${data.taskRequest.id}_${Date.now()}.docx`;
    const filePath = path.join(this.outputDir, fileName);

    const document = this.createDocument(data);
    const buffer = await Packer.toBuffer(document);

    fs.writeFileSync(filePath, buffer);

    return {
      downloadUrl: `/api/export/download/${fileName}`,
      fileName: fileName,
    };
  }

  private createDocument(data: WordExportData): Document {
    const { taskRequest, aiGeneration } = data;
    // aiGeneration: AIGenerationResponse
    const ai = aiGeneration?.data || {};

    const children: Paragraph[] = [
      // Title
      new Paragraph({
        text: "ТЕХНИЧЕСКОЕ ЗАДАНИЕ",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),

      // Project info
      new Paragraph({
        children: [
          new TextRun({
            text: "Проект: ",
            bold: true,
          }),
          new TextRun({
            text: taskRequest.title,
          }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: "Дата создания: ",
            bold: true,
          }),
          new TextRun({
            text: new Date().toLocaleDateString("ru-RU"),
          }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: "Категория: ",
            bold: true,
          }),
          new TextRun({
            text: taskRequest.category.name,
          }),
        ],
        spacing: { after: 400 },
      }),

      // General description
      new Paragraph({
        text: "1. ОБЩЕЕ ОПИСАНИЕ ПРОЕКТА",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: taskRequest.shortDescription,
        spacing: { after: 400 },
      }),

      // Detailed description
      new Paragraph({
        text: "2. ДЕТАЛЬНОЕ ТЕХНИЧЕСКОЕ ЗАДАНИЕ",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        text: ai?.detailedDescription || "Детальное описание не сгенерировано",
        spacing: { after: 400 },
      }),
    ];

    // Add requirements if available
    if (ai?.requirements && ai.requirements.length > 0) {
      children.push(
        new Paragraph({
          text: "3. ТРЕБОВАНИЯ",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );

      ai.requirements.forEach((requirement, index) => {
        children.push(
          new Paragraph({
            text: `${index + 1}. ${requirement}`,
            spacing: { after: 100 },
          })
        );
      });

      children.push(new Paragraph({ text: "", spacing: { after: 400 } }));
    }

    // Add deliverables if available
    if (ai?.deliverables && ai.deliverables.length > 0) {
      children.push(
        new Paragraph({
          text: "4. РЕЗУЛЬТАТЫ РАБОТЫ",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );

      ai.deliverables.forEach((deliverable, index) => {
        children.push(
          new Paragraph({
            text: `${index + 1}. ${deliverable}`,
            spacing: { after: 100 },
          })
        );
      });

      children.push(new Paragraph({ text: "", spacing: { after: 400 } }));
    }

    // Add milestones if available
    if (ai?.suggestedMilestones && ai.suggestedMilestones.length > 0) {
      children.push(
        new Paragraph({
          text: "5. ЭТАПЫ ВЫПОЛНЕНИЯ",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );

      ai.suggestedMilestones.forEach((milestone, index) => {
        children.push(
          new Paragraph({
            text: `Этап ${index + 1}: ${milestone}`,
            spacing: { after: 100 },
          })
        );
      });

      children.push(new Paragraph({ text: "", spacing: { after: 400 } }));
    }

    // Add estimates
    children.push(
      new Paragraph({
        text: "6. ОЦЕНКА ПРОЕКТА",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    if (ai?.estimatedHours) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Оценка времени: ",
              bold: true,
            }),
            new TextRun({
              text: `${ai.estimatedHours} часов`,
            }),
          ],
          spacing: { after: 100 },
        })
      );
    }

    if (ai?.estimatedCost) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Оценка стоимости: ",
              bold: true,
            }),
            new TextRun({
              text: `${ai.estimatedCost.toLocaleString("ru-RU")} ₽`,
            }),
          ],
          spacing: { after: 100 },
        })
      );
    }

    if (taskRequest.deadline) {
      const deadlineDate = new Date(taskRequest.deadline);
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Срок выполнения: ",
              bold: true,
            }),
            new TextRun({
              text: deadlineDate.toLocaleDateString("ru-RU"),
            }),
          ],
          spacing: { after: 400 },
        })
      );
    }

    // Add signatures section
    children.push(
      new Paragraph({
        text: "7. СОГЛАСОВАНИЕ",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: "Заказчик: ",
            bold: true,
          }),
          new TextRun({
            text: taskRequest.client.name,
          }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Подпись: _________________ Дата: _________",
        spacing: { after: 400 },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: "Исполнитель: ",
            bold: true,
          }),
          new TextRun({
            text: "________________",
          }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({
        text: "Подпись: _________________ Дата: _________",
        spacing: { after: 400 },
      })
    );

    return new Document({
      creator: "TaskGo",
      title: `Техническое задание - ${taskRequest.title}`,
      description: "Техническое задание, сгенерированное с помощью ИИ",
      sections: [
        {
          children: children,
        },
      ],
    });
  }

  private generateDocumentContent(data: WordExportData): string {
    const { taskRequest, aiGeneration, clientApproval, contractorApproval } =
      data;

    const ai = aiGeneration?.data || {};
    return `
ТЕХНИЧЕСКОЕ ЗАДАНИЕ
===================

Проект: ${taskRequest.title}
Дата создания: ${new Date().toLocaleDateString("ru-RU")}

1. ОБЩЕЕ ОПИСАНИЕ ПРОЕКТА
${taskRequest.shortDescription}

2. ДЕТАЛЬНОЕ ОПИСАНИЕ
${ai.detailedDescription || ""}

3. ОЦЕНКА ПРОЕКТА
Ориентировочное время выполнения: ${ai.estimatedHours || ""} часов
Примерная стоимость: ${ai.estimatedCost || ""} рублей

4. ЭТАПЫ ВЫПОЛНЕНИЯ
${(ai.suggestedMilestones || [])
  .map((milestone: string, index: number) => `${index + 1}. ${milestone}`)
  .join("\n")}

5. ТРЕБОВАНИЯ
${(ai.requirements || [])
  .map((req: string, index: number) => `${index + 1}. ${req}`)
  .join("\n")}

6. РЕЗУЛЬТАТЫ РАБОТЫ
${(ai.deliverables || [])
  .map((deliverable: string, index: number) => `${index + 1}. ${deliverable}`)
  .join("\n")}

7. СОГЛАСОВАНИЕ
Заказчик: ${clientApproval ? "Согласовано" : "Не согласовано"}
Исполнитель: ${contractorApproval ? "Согласовано" : "Не согласовано"}

8. КОНТАКТНАЯ ИНФОРМАЦИЯ
Заказчик: ${taskRequest.client.name} (${taskRequest.client.email})
${
  taskRequest.contractor
    ? `Исполнитель: ${taskRequest.contractor.name} (${taskRequest.contractor.email})`
    : "Исполнитель: Не назначен"
}

---
Документ создан автоматически с помощью TaskGo AI Assistant
`;
  }

  async getExportTemplates(): Promise<
    {
      id: string;
      name: string;
      description: string;
      format: "word" | "pdf";
    }[]
  > {
    return [
      {
        id: "standard",
        name: "Стандартный шаблон",
        description: "Базовый шаблон технического задания",
        format: "word" as const,
      },
      {
        id: "detailed",
        name: "Детальный шаблон",
        description: "Расширенный шаблон с дополнительными разделами",
        format: "word" as const,
      },
      {
        id: "contract",
        name: "Договорный шаблон",
        description: "Шаблон для официального договора",
        format: "pdf" as const,
      },
    ];
  }

  getFilePath(fileName: string): string {
    return path.join(this.outputDir, fileName);
  }
}
