// Mock axios completely
let mockGet: jest.Mock;
let mockPost: jest.Mock;
let mockPut: jest.Mock;
let mockDelete: jest.Mock;

jest.mock("axios", () => {
  // Create mock functions
  mockGet = jest.fn();
  mockPost = jest.fn();
  mockPut = jest.fn();
  mockDelete = jest.fn();

  // Create a mock axios instance inside the mock
  const mockAxiosInstance = {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  const mockCreate = jest.fn().mockReturnValue(mockAxiosInstance);

  return {
    __esModule: true,
    default: {
      create: mockCreate,
    },
    create: mockCreate,
  };
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

import apiService from "../src/services/ApiService";

describe("ApiService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET requests", () => {
    it("should make successful GET request", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { id: 1, name: "Test" },
        },
      };

      mockGet.mockResolvedValue(mockResponse);
      const result = await apiService.get("/test");

      expect(mockGet).toHaveBeenCalledWith("/test");
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle GET request errors", async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: "Not found" },
        },
      };

      mockGet.mockRejectedValue(mockError);

      // The test expects the raw axios error structure since interceptors aren't triggered in jest
      await expect(apiService.get("/test")).rejects.toMatchObject({
        response: {
          status: 404,
          data: { message: "Not found" },
        },
      });
    });
  });

  describe("POST requests", () => {
    it("should make successful POST request", async () => {
      const requestData = { name: "Test Task" };
      const mockResponse = {
        data: {
          success: true,
          data: { id: 1, ...requestData },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const result = await apiService.post("/tasks", requestData);

      expect(mockPost).toHaveBeenCalledWith("/tasks", requestData);
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle POST request errors", async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: "Validation error" },
        },
      };

      mockPost.mockRejectedValue(mockError);

      await expect(apiService.post("/tasks", {})).rejects.toMatchObject({
        response: {
          status: 400,
          data: { message: "Validation error" },
        },
      });
    });
  });

  describe("Error handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network Error");
      mockGet.mockRejectedValue(networkError);

      // Since interceptors don't run in test environment, we get the raw error
      await expect(apiService.get("/test")).rejects.toThrow("Network Error");
    });

    it("should handle server errors without response data", async () => {
      const serverError = {
        response: {
          status: 500,
        },
      };

      mockGet.mockRejectedValue(serverError);

      // Since interceptors don't run in test environment, we get the raw error
      await expect(apiService.get("/test")).rejects.toMatchObject({
        response: {
          status: 500,
        },
      });
    });
  });
});
