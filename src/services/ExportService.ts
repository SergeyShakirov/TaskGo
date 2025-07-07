import { WordExportData } from "../types";
import ApiService from "./ApiService";

class ExportService {
  private readonly endpoint = "/export";

  /**
   * Generates Word document from task data
   */
  async generateWordDocument(data: WordExportData): Promise<{
    downloadUrl: string;
    fileName: string;
  }> {
    const response = await ApiService.post<{
      downloadUrl: string;
      fileName: string;
    }>(`${this.endpoint}/word`, data);
    return response.data;
  }

  /**
   * Generates PDF document from task data
   */
  async generatePDFDocument(data: WordExportData): Promise<{
    downloadUrl: string;
    fileName: string;
  }> {
    const response = await ApiService.post<{
      downloadUrl: string;
      fileName: string;
    }>(`${this.endpoint}/pdf`, data);
    return response.data;
  }

  /**
   * Downloads file to device
   */
  async downloadFile(url: string, _fileName: string): Promise<string> {
    try {
      // This would be implemented with react-native-fs
      // For now, return the URL for the app to handle
      return url;
    } catch (error) {
      throw new Error(`Failed to download file: ${error}`);
    }
  }

  /**
   * Shares document via native sharing
   */
  async shareDocument(filePath: string, title: string): Promise<void> {
    try {
      // This would be implemented with react-native-share
      // For development, we'll just log the action
      if (__DEV__) {
        console.log(`Sharing document: ${filePath} with title: ${title}`);
      }
    } catch (error) {
      throw new Error(`Failed to share document: ${error}`);
    }
  }

  /**
   * Gets export templates
   */
  async getExportTemplates(): Promise<
    {
      id: string;
      name: string;
      description: string;
      format: "word" | "pdf";
    }[]
  > {
    const response = await ApiService.get<
      {
        id: string;
        name: string;
        description: string;
        format: "word" | "pdf";
      }[]
    >(`${this.endpoint}/templates`);
    return response.data;
  }
}

export default new ExportService();
