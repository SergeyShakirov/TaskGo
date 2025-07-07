export interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "contractor";
  avatar?: string;
  rating?: number;
  completedTasks?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface TaskRequest {
  id: string;
  title: string;
  shortDescription: string;
  aiGeneratedDescription?: string;
  estimatedHours?: number;
  estimatedCost?: number;
  category: ServiceCategory;
  client: User;
  status: "draft" | "pending" | "in_progress" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  createdAt: Date;
  updatedAt: Date;
  contractor?: User;
  deadline?: Date;
}

export interface AIGenerationRequest {
  shortDescription: string;
  category: string;
  budget?: number;
  deadline?: Date;
}

export interface AIGenerationResponse {
  detailedDescription: string;
  estimatedHours: number;
  estimatedCost: number;
  suggestedMilestones: string[];
  requirements: string[];
  deliverables: string[];
}

export interface WordExportData {
  taskRequest: TaskRequest;
  aiGeneration: AIGenerationResponse;
  clientApproval: boolean;
  contractorApproval: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}
