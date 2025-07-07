import { useState, useCallback } from "react";
import { AIGenerationRequest, AIGenerationResponse } from "../types";
// import AIService from "../services/AIService"; // Временно отключено

interface UseAIGenerationState {
  isLoading: boolean;
  response: AIGenerationResponse | null;
  error: string | null;
}

export const useAIGeneration = () => {
  const [state, setState] = useState<UseAIGenerationState>({
    isLoading: false,
    response: null,
    error: null,
  });

  const generateDescription = useCallback(
    async (request: AIGenerationRequest) => {
      setState((prev: UseAIGenerationState) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        // Временный мок вместо реального API вызова
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockResponse: AIGenerationResponse = {
          detailedDescription: `Подробное описание для проекта "${request.shortDescription}". Это автоматически сгенерированное описание для категории ${request.category}.`,
          requirements: [
            "Создать базовую структуру проекта",
            "Реализовать основной функционал",
            "Добавить пользовательский интерфейс",
            "Протестировать приложение"
          ],
          deliverables: [
            "Готовое приложение",
            "Документация",
            "Тестовое покрытие"
          ],
          suggestedMilestones: [
            "Планирование и анализ",
            "Разработка MVP",
            "Тестирование и доработка",
            "Развертывание"
          ],
          estimatedHours: request.budget ? Math.ceil(request.budget / 1000) : 40,
          estimatedCost: request.budget || 50000
        };
        
        setState((prev: UseAIGenerationState) => ({
          ...prev,
          response: mockResponse,
          isLoading: false,
        }));
        return mockResponse;
      } catch (error: any) {
        const errorMessage = error.message || "Failed to generate description";
        setState((prev: UseAIGenerationState) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));
        throw error;
      }
    },
    []
  );

  const estimateTask = useCallback(
    async (description: string, category: string) => {
      setState((prev: UseAIGenerationState) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        // Мок для оценки задачи
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const estimate = {
          estimatedHours: 40,
          estimatedCost: 50000,
          complexity: 'medium' as const
        };
        
        setState((prev: UseAIGenerationState) => ({
          ...prev,
          isLoading: false,
        }));
        return estimate;
      } catch (error: any) {
        const errorMessage = error.message || "Failed to estimate task";
        setState((prev: UseAIGenerationState) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));
        throw error;
      }
    },
    []
  );

  const suggestImprovements = useCallback(async (description: string) => {
    setState((prev: UseAIGenerationState) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Мок для предложений улучшений
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const suggestions = [
        "Добавить детализированное описание пользовательских историй",
        "Рассмотреть возможность использования современных технологий",
        "Включить план тестирования"
      ];
      
      setState((prev: UseAIGenerationState) => ({ ...prev, isLoading: false }));
      return suggestions;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to get suggestions";
      setState((prev: UseAIGenerationState) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev: UseAIGenerationState) => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      response: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    generateDescription,
    estimateTask,
    suggestImprovements,
    clearError,
    reset,
  };
};
