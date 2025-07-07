import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import TaskListScreen from "../src/screens/TaskListScreen";

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe("TaskListScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task list correctly", () => {
    const { getByText } = render(
      <TaskListScreen navigation={mockNavigation} />
    );

    expect(getByText("Мои заявки")).toBeTruthy();
    expect(getByText("Создать новую")).toBeTruthy();
  });

  it("displays tasks when available", async () => {
    const { getByText } = render(
      <TaskListScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText("Разработка мобильного приложения")).toBeTruthy();
      expect(getByText("Дизайн веб-сайта")).toBeTruthy();
    });
  });

  it("shows correct status badges", async () => {
    const { getByText } = render(
      <TaskListScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText("Ожидает")).toBeTruthy();
      expect(getByText("В работе")).toBeTruthy();
    });
  });

  it("shows empty state when no tasks", async () => {
    // Mock empty tasks
    render(<TaskListScreen navigation={mockNavigation} />);

    // Override the mock data to be empty for this test
    // This would require refactoring the component to accept tasks as props
    // For now, this is a placeholder test structure
  });
});
