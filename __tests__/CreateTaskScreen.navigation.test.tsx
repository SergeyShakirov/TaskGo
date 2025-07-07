import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateTaskScreen from '../src/screens/CreateTaskScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock react-native components
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  ScrollView: 'ScrollView',
  SafeAreaView: 'SafeAreaView',
  StatusBar: 'StatusBar',
  TouchableOpacity: 'TouchableOpacity',
  TextInput: 'TextInput',
  ActivityIndicator: 'ActivityIndicator',
  StyleSheet: {
    create: (styles: any) => styles,
  },
  Alert: {
    alert: jest.fn(),
  },
}));

// Mock the AI generation hook
jest.mock('../src/hooks/useAIGeneration', () => ({
  useAIGeneration: () => ({
    generateDescription: jest.fn(),
    response: null,
    isLoading: false,
    error: null,
    clearError: jest.fn(),
  }),
}));

describe('CreateTaskScreen Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render back button and call navigation.goBack when pressed', () => {
    const { getByText } = render(
      <CreateTaskScreen navigation={mockNavigation} />
    );

    // Check if back button exists
    const backButton = getByText('←');
    expect(backButton).toBeTruthy();

    // Press back button
    fireEvent.press(backButton);

    // Check if navigation.goBack was called
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('should render header with correct title', () => {
    const { getByText } = render(
      <CreateTaskScreen navigation={mockNavigation} />
    );

    expect(getByText('Новая задача')).toBeTruthy();
    expect(getByText('Создайте техническое задание')).toBeTruthy();
  });
});
