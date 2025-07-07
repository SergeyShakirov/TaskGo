import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskListScreen from '../src/screens/TaskListScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock components
jest.mock('../src/components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({ title, onPress, style }: any) => (
      <TouchableOpacity onPress={onPress} style={style}>
        <Text>{title}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('../src/components/LoadingSpinner', () => {
  const { View, Text } = require('react-native');
  return {
    LoadingSpinner: () => <View><Text>Loading...</Text></View>,
  };
});

jest.mock('../src/components/ErrorMessage', () => {
  const { View, Text } = require('react-native');
  return {
    ErrorMessage: ({ message }: any) => <View><Text>{message}</Text></View>,
  };
});

jest.mock('../src/components/TaskCard', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    TaskCard: ({ title, onPress }: any) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{title}</Text>
      </TouchableOpacity>
    ),
  };
});

describe('TaskListScreen Navigation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to CreateTask when create button is pressed', () => {
    const { getByText } = render(
      <TaskListScreen navigation={mockNavigation} />
    );

    const createButton = getByText('Создать новую');
    fireEvent.press(createButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('CreateTask');
  });

  it('navigates to TaskDetail when task card is pressed', () => {
    const { getByText } = render(
      <TaskListScreen navigation={mockNavigation} />
    );

    // Wait for tasks to load, then click on a task
    const taskCard = getByText('Разработка мобильного приложения');
    fireEvent.press(taskCard);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('TaskDetail', { taskId: '1' });
  });

  it('renders header without back button on main screen', () => {
    const { getByText, queryByText } = render(
      <TaskListScreen navigation={mockNavigation} />
    );

    // Should have title
    expect(getByText('Мои заявки')).toBeTruthy();
    
    // Should NOT have back button on main screen
    expect(queryByText('←')).toBeNull();
  });

  it('renders create button in empty state', () => {
    // Mock empty task list
    const { getByText } = render(
      <TaskListScreen navigation={mockNavigation} />
    );

    // Check for empty state button (this would appear if no tasks)
    // For now we check the main create button exists
    expect(getByText('Создать новую')).toBeTruthy();
  });

  it('renders task list with proper structure', () => {
    const { getByText } = render(
      <TaskListScreen navigation={mockNavigation} />
    );

    // Check main elements
    expect(getByText('Мои заявки')).toBeTruthy();
    expect(getByText('Создать новую')).toBeTruthy();
    
    // Check task cards exist
    expect(getByText('Разработка мобильного приложения')).toBeTruthy();
    expect(getByText('Дизайн веб-сайта')).toBeTruthy();
  });

  it('handles multiple navigation calls correctly', () => {
    const { getByText } = render(
      <TaskListScreen navigation={mockNavigation} />
    );

    // Navigate to create task
    const createButton = getByText('Создать новую');
    fireEvent.press(createButton);

    // Navigate to task detail
    const taskCard = getByText('Разработка мобильного приложения');
    fireEvent.press(taskCard);

    expect(mockNavigation.navigate).toHaveBeenCalledTimes(2);
    expect(mockNavigation.navigate).toHaveBeenNthCalledWith(1, 'CreateTask');
    expect(mockNavigation.navigate).toHaveBeenNthCalledWith(2, 'TaskDetail', { taskId: '1' });
  });
});
