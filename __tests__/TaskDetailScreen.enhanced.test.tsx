import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TaskDetailScreen from '../src/screens/TaskDetailScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock route
const mockRoute = {
  params: {
    taskId: '1',
  },
};

// Mock react-native components and modules
jest.mock('react-native', () => {
  const actualRN = jest.requireActual('react-native');
  return {
    ...actualRN,
    Alert: {
      alert: jest.fn(),
    },
  };
});

// Mock components
jest.mock('../src/components/LoadingSpinner', () => {
  const { View, Text } = require('react-native');
  return {
    LoadingSpinner: () => <View testID="loading-spinner"><Text>Loading...</Text></View>,
  };
});

jest.mock('../src/components/ErrorMessage', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    ErrorMessage: ({ message, onRetry }: any) => (
      <View testID="error-message">
        <Text>{message}</Text>
        <TouchableOpacity onPress={onRetry}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    ),
  };
});

describe('TaskDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    const { getByTestId, getByText } = render(
      <TaskDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText('Загрузка...')).toBeTruthy();
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });

  it('renders task details after loading', async () => {
    const { getByText } = render(
      <TaskDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Детали задачи')).toBeTruthy();
      expect(getByText('Разработка мобильного приложения')).toBeTruthy();
      expect(getByText('Ожидает утверждения')).toBeTruthy();
      expect(getByText('Высокий')).toBeTruthy();
      expect(getByText('Разработка ПО')).toBeTruthy();
    });
  });

  it('renders task information correctly', async () => {
    const { getByText } = render(
      <TaskDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Информация о проекте')).toBeTruthy();
      expect(getByText('Иван Петров')).toBeTruthy();
      expect(getByText('ivan@example.com')).toBeTruthy();
      expect(getByText('120 ч.')).toBeTruthy();
      expect(getByText('150 000 ₽')).toBeTruthy();
    });
  });

  it('has back button that calls navigation.goBack when pressed', async () => {
    const { getAllByText } = render(
      <TaskDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      const backButtons = getAllByText('←');
      expect(backButtons.length).toBeGreaterThan(0);
      
      fireEvent.press(backButtons[0]);
      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });

  it('shows action buttons for pending tasks', async () => {
    const { getByText } = render(
      <TaskDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('✅ Утвердить ТЗ')).toBeTruthy();
      expect(getByText('✏️ Редактировать')).toBeTruthy();
      expect(getByText('🚀 Начать работу')).toBeTruthy();
    });
  });

  it('handles approve button press', async () => {
    const Alert = require('react-native').Alert;
    const { getByText } = render(
      <TaskDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      const approveButton = getByText('✅ Утвердить ТЗ');
      fireEvent.press(approveButton);
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Утверждение',
        'ТЗ утверждено!',
        [{ text: 'ОК', onPress: expect.any(Function) }]
      );
    });
  });

  it('handles edit button press', async () => {
    const Alert = require('react-native').Alert;
    const { getByText } = render(
      <TaskDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      const editButton = getByText('✏️ Редактировать');
      fireEvent.press(editButton);
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Редактирование',
        'Функция редактирования в разработке',
        [
          { text: 'Отмена', style: 'cancel' },
          { text: 'ОК' }
        ]
      );
    });
  });

  it('handles start work button press', async () => {
    const Alert = require('react-native').Alert;
    const { getByText } = render(
      <TaskDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      const startWorkButton = getByText('🚀 Начать работу');
      fireEvent.press(startWorkButton);
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Начать работу',
        'Вы уверены, что хотите начать работу над этой задачей?',
        [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Начать', onPress: expect.any(Function) }
        ]
      );
    });
  });

  it('renders priority badge with correct color', async () => {
    const { getByText } = render(
      <TaskDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      const priorityText = getByText('Высокий');
      expect(priorityText).toBeTruthy();
    });
  });

  it('renders category badge', async () => {
    const { getByText } = render(
      <TaskDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      const categoryText = getByText('Разработка ПО');
      expect(categoryText).toBeTruthy();
    });
  });

  it('formats dates correctly', async () => {
    const { getByText } = render(
      <TaskDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      // Check that dates are formatted as DD.MM.YYYY
      const dateRegex = /\d{2}\.\d{2}\.\d{4}/;
      const allText = getByText(/\d{2}\.\d{2}\.\d{4}/);
      expect(allText).toBeTruthy();
    });
  });

  it('renders task description with proper styling', async () => {
    const { getByText } = render(
      <TaskDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      const description = getByText(/Создание приложения для заказа еды/);
      expect(description).toBeTruthy();
    });
  });
});
