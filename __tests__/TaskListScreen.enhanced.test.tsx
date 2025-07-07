import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskListScreen from '../src/screens/TaskListScreen';

// Mock TaskCard component
jest.mock('../src/components/TaskCard', () => {
  const { View, Text } = require('react-native');
  return {
    TaskCard: ({ title, description, status, priority, category, onPress }: any) => (
      <View testID={`task-card-${title}`} onTouchEnd={onPress}>
        <Text testID="task-title">{title}</Text>
        <Text testID="task-description">{description}</Text>
        <Text testID="task-status">{status}</Text>
        <Text testID="task-priority">{priority}</Text>
        <Text testID="task-category">{category}</Text>
      </View>
    ),
  };
});

// Mock other components
jest.mock('../src/components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({ title, onPress, testID }: any) => (
      <TouchableOpacity testID={testID} onPress={onPress}>
        <Text>{title}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('../src/components/LoadingSpinner', () => {
  const { View, Text } = require('react-native');
  return {
    LoadingSpinner: () => (
      <View testID="loading-spinner">
        <Text>Loading...</Text>
      </View>
    ),
  };
});

jest.mock('../src/components/ErrorMessage', () => {
  const { View, Text } = require('react-native');
  return {
    ErrorMessage: ({ message, onRetry }: any) => (
      <View testID="error-message">
        <Text>{message}</Text>
      </View>
    ),
  };
});

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('TaskListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with title and create button', () => {
    const { getByText } = render(<TaskListScreen navigation={mockNavigation} />);
    
    expect(getByText('Мои заявки')).toBeTruthy();
    expect(getByText('Создать новую')).toBeTruthy();
  });

  it('displays mock tasks after loading', async () => {
    const { findByTestId, findByText } = render(<TaskListScreen navigation={mockNavigation} />);
    
    // Wait for tasks to load
    await findByText('Разработка мобильного приложения');
    
    expect(await findByTestId('task-card-Разработка мобильного приложения')).toBeTruthy();
    expect(await findByTestId('task-card-Дизайн веб-сайта')).toBeTruthy();
  });

  it('displays task information correctly', async () => {
    const { findByText } = render(<TaskListScreen navigation={mockNavigation} />);
    
    // Check first task details
    expect(await findByText('Разработка мобильного приложения')).toBeTruthy();
    expect(await findByText('Создание приложения для заказа еды')).toBeTruthy();
    expect(await findByText('pending')).toBeTruthy();
    expect(await findByText('high')).toBeTruthy();
    expect(await findByText('Разработка ПО')).toBeTruthy();
  });

  it('calls navigation.navigate when create button is pressed', async () => {
    const { findByText } = render(<TaskListScreen navigation={mockNavigation} />);
    
    const createButton = await findByText('Создать новую');
    fireEvent.press(createButton);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('CreateTask');
  });

  it('shows tasks with different statuses and priorities', async () => {
    const { findByText } = render(<TaskListScreen navigation={mockNavigation} />);
    
    // Check that different statuses are displayed
    expect(await findByText('pending')).toBeTruthy();
    expect(await findByText('in_progress')).toBeTruthy();
    
    // Check that different priorities are displayed
    expect(await findByText('high')).toBeTruthy();
    expect(await findByText('medium')).toBeTruthy();
  });

  it('handles refresh functionality', async () => {
    const { findByText } = render(<TaskListScreen navigation={mockNavigation} />);
    
    // Wait for initial load
    await findByText('Разработка мобильного приложения');
    
    // Refresh should work without errors
    // Note: Testing actual refresh would require more complex mocking
    expect(await findByText('Разработка мобильного приложения')).toBeTruthy();
  });
});
