import {
  AIGenerationRequest,
  AIGenerationResponse,
  ServiceCategory,
} from "../types";
import ApiService from "./ApiService";

class AIService {
  private readonly endpoint = "/ai";

  /**
   * Generates detailed task description using AI
   */
  async generateTaskDescription(
    request: AIGenerationRequest
  ): Promise<AIGenerationResponse> {
    const response = await ApiService.post<AIGenerationResponse>(
      `${this.endpoint}/generate-description`,
      request
    );
    return response.data;
  }

  /**
   * Estimates hours and cost for a task
   */
  async estimateTask(
    description: string,
    category: string
  ): Promise<{
    estimatedHours: number;
    estimatedCost: number;
  }> {
    const response = await ApiService.post<{
      estimatedHours: number;
      estimatedCost: number;
    }>(`${this.endpoint}/estimate`, {
      description,
      category,
    });
    return response.data;
  }

  /**
   * Suggests improvements to task description
   */
  async suggestImprovements(description: string): Promise<{
    suggestions: string[];
    improvedDescription: string;
  }> {
    const response = await ApiService.post<{
      suggestions: string[];
      improvedDescription: string;
    }>(`${this.endpoint}/suggest-improvements`, {
      description,
    });
    return response.data;
  }

  /**
   * Gets suggested categories based on description
   */
  async suggestCategories(description: string): Promise<ServiceCategory[]> {
    const response = await ApiService.post<ServiceCategory[]>(
      `${this.endpoint}/suggest-categories`,
      { description }
    );
    return response.data;
  }

  /**
   * Analyzes task complexity and provides recommendations
   */
  async analyzeComplexity(description: string): Promise<{
    complexity: "low" | "medium" | "high";
    factors: string[];
    recommendations: string[];
  }> {
    const response = await ApiService.post<{
      complexity: "low" | "medium" | "high";
      factors: string[];
      recommendations: string[];
    }>(`${this.endpoint}/analyze-complexity`, {
      description,
    });
    return response.data;
  }
}

export default new AIService();
