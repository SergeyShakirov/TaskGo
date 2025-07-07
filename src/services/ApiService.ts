import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import { ApiResponse, ApiError } from "../types";

declare const __DEV__: boolean;

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: __DEV__
        ? "http://10.0.2.2:3001/api"
        : "https://api.taskgo.com/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || "Network error",
          code: error.response?.status?.toString() || "NETWORK_ERROR",
          details: error.response?.data,
        };
        return Promise.reject(apiError);
      }
    );
  }

  private getAuthToken(): string | null {
    // This would be implemented with AsyncStorage or similar
    return null;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(endpoint);
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(
      endpoint,
      data
    );
    return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(
      endpoint,
      data
    );
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(endpoint);
    return response.data;
  }

  async uploadFile(
    endpoint: string,
    fileUri: string
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      type: "application/octet-stream",
      name: "file",
    } as any);

    const response = await this.axiosInstance.post<ApiResponse<any>>(
      endpoint,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  async exportToWord(data: any): Promise<ApiResponse<any>> {
    return await this.post("/export/word", data);
  }
}

export default new ApiService();
