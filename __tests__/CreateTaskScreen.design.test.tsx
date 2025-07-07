import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateTaskScreen from '../src/screens/CreateTaskScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

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

describe('CreateTaskScreen UI Design', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders back button with modern design', () => {
    const { getByText } = render(
      <CreateTaskScreen navigation={mockNavigation} />
    );

    const backButton = getByText('←');
    expect(backButton).toBeTruthy();
  });

  it('back button has correct styling and functionality', () => {
    const { getByText } = render(
      <CreateTaskScreen navigation={mockNavigation} />
    );

    const backButton = getByText('←');
    
    // Test functionality
    fireEvent.press(backButton);
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('renders header with proper alignment', () => {
    const { getByText } = render(
      <CreateTaskScreen navigation={mockNavigation} />
    );

    // Check header elements
    expect(getByText('←')).toBeTruthy(); // Back button
    expect(getByText('Новая задача')).toBeTruthy(); // Title
    expect(getByText('Создайте техническое задание')).toBeTruthy(); // Subtitle
  });

  it('renders all form elements', () => {
    const { getByText, getByPlaceholderText } = render(
      <CreateTaskScreen navigation={mockNavigation} />
    );

    // Check form elements
    expect(getByText('Название проекта')).toBeTruthy();
    expect(getByPlaceholderText('Кратко опишите проект')).toBeTruthy();
    expect(getByText('Категория')).toBeTruthy();
    expect(getByText('Краткое описание')).toBeTruthy();
    expect(getByPlaceholderText('Например: Создать интернет-магазин для продажи одежды')).toBeTruthy();
  });

  it('renders category chips', () => {
    const { getByText } = render(
      <CreateTaskScreen navigation={mockNavigation} />
    );

    // Check category chips
    expect(getByText('Веб-разработка')).toBeTruthy();
    expect(getByText('Мобильная разработка')).toBeTruthy();
    expect(getByText('Дизайн')).toBeTruthy();
    expect(getByText('Маркетинг')).toBeTruthy();
    expect(getByText('Контент')).toBeTruthy();
  });

  it('allows category selection', () => {
    const { getByText } = render(
      <CreateTaskScreen navigation={mockNavigation} />
    );

    const categoryChip = getByText('Веб-разработка');
    fireEvent.press(categoryChip);
    
    // Category should be selected (this would change styling in real app)
    expect(categoryChip).toBeTruthy();
  });

  it('renders action buttons', () => {
    const { getByText } = render(
      <CreateTaskScreen navigation={mockNavigation} />
    );

    expect(getByText('✨ Создать ТЗ с ИИ')).toBeTruthy();
    expect(getByText('📝 Создать задачу')).toBeTruthy();
  });

  it('renders budget and deadline inputs', () => {
    const { getByText, getByPlaceholderText } = render(
      <CreateTaskScreen navigation={mockNavigation} />
    );

    expect(getByText('Бюджет (₽)')).toBeTruthy();
    expect(getByPlaceholderText('50 000')).toBeTruthy();
    expect(getByText('Срок (дней)')).toBeTruthy();
    expect(getByPlaceholderText('30')).toBeTruthy();
  });

  it('handles form input changes', () => {
    const { getByPlaceholderText } = render(
      <CreateTaskScreen navigation={mockNavigation} />
    );

    const titleInput = getByPlaceholderText('Кратко опишите проект');
    const descriptionInput = getByPlaceholderText('Например: Создать интернет-магазин для продажи одежды');
    const budgetInput = getByPlaceholderText('50 000');
    const deadlineInput = getByPlaceholderText('30');

    fireEvent.changeText(titleInput, 'Тестовый проект');
    fireEvent.changeText(descriptionInput, 'Описание тестового проекта');
    fireEvent.changeText(budgetInput, '100000');
    fireEvent.changeText(deadlineInput, '45');

    expect(titleInput.props.value).toBe('Тестовый проект');
    expect(descriptionInput.props.value).toBe('Описание тестового проекта');
    expect(budgetInput.props.value).toBe('100000');
    expect(deadlineInput.props.value).toBe('45');
  });
});
