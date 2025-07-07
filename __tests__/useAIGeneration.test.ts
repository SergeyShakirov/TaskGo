import { renderHook, act } from "@testing-library/react-native";
import { useAIGeneration } from "../src/hooks/useAIGeneration";

// Mock the AIService
jest.mock("../src/services/AIService", () => ({
  __esModule: true,
  default: {
    generateTaskDescription: jest.fn(),
    estimateTask: jest.fn(),
    suggestImprovements: jest.fn(),
  },
}));

describe("useAIGeneration", () => {
  const mockAIService = require("../src/services/AIService").default;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with correct default state", () => {
    const { result } = renderHook(() => useAIGeneration());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.response).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it("should handle successful description generation", async () => {
    const mockResponse = {
      detailedDescription: "Test description",
      estimatedHours: 40,
      estimatedCost: 50000,
      suggestedMilestones: [
        "Планирование и анализ",
        "Разработка MVP",
        "Тестирование и доработка",
        "Развертывание",
      ],
      requirements: [
        "Создать базовую структуру проекта",
        "Реализовать основной функционал",
        "Добавить пользовательский интерфейс",
        "Протестировать приложение",
      ],
      deliverables: ["Готовое приложение"],
    };

    mockAIService.generateTaskDescription.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAIGeneration());

    await act(async () => {
      await result.current.generateDescription({
        shortDescription: "Test task",
        category: "1",
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.response).toEqual(mockResponse);
    expect(result.current.error).toBe(null);
  });

  it("should handle generation error", async () => {
    const mockError = new Error("API Error");
    mockAIService.generateTaskDescription.mockRejectedValue(mockError);

    const { result } = renderHook(() => useAIGeneration());

    await act(async () => {
      try {
        await result.current.generateDescription({
          shortDescription: "Test task",
          category: "1",
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.response).toBe(null);
    expect(result.current.error).toBe("API Error");
  });

  it("should clear error", () => {
    const { result } = renderHook(() => useAIGeneration());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it("should reset state", () => {
    const { result } = renderHook(() => useAIGeneration());

    act(() => {
      result.current.reset();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.response).toBe(null);
    expect(result.current.error).toBe(null);
  });
});
