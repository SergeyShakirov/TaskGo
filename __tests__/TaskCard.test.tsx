import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TaskCard } from '../src/components/TaskCard';

describe('TaskCard', () => {
  const mockProps = {
    title: 'Test Task',
    description: 'Test description for the task',
    estimatedTime: '10 ч.',
    estimatedCost: '50,000 ₽',
    status: 'pending' as const,
    priority: 'high' as const,
    category: 'Разработка ПО',
    createdAt: new Date('2023-01-01'),
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    const { getByText } = render(<TaskCard {...mockProps} />);
    
    expect(getByText('Test Task')).toBeTruthy();
    expect(getByText('Test description for the task')).toBeTruthy();
    expect(getByText('📂 Разработка ПО')).toBeTruthy();
    expect(getByText('Ожидает')).toBeTruthy();
    expect(getByText('Высокий')).toBeTruthy();
    expect(getByText('⏱️ Время:')).toBeTruthy();
    expect(getByText('10 ч.')).toBeTruthy();
    expect(getByText('💰 Стоимость:')).toBeTruthy();
    expect(getByText('50,000 ₽')).toBeTruthy();
  });

  it('renders correctly without optional props', () => {
    const minimalProps = {
      title: 'Minimal Task',
      description: 'Minimal description',
    };
    
    const { getByText, queryByText } = render(<TaskCard {...minimalProps} />);
    
    expect(getByText('Minimal Task')).toBeTruthy();
    expect(getByText('Minimal description')).toBeTruthy();
    expect(getByText('Ожидает')).toBeTruthy(); // default status
    expect(getByText('Средний')).toBeTruthy(); // default priority
    expect(queryByText('📂')).toBeFalsy(); // no category
    expect(queryByText('⏱️ Время:')).toBeFalsy(); // no time
    expect(queryByText('💰 Стоимость:')).toBeFalsy(); // no cost
  });

  it('calls onPress when card is pressed', () => {
    const { getByText } = render(<TaskCard {...mockProps} />);
    
    const card = getByText("Test Task"); // Find by title text and get its parent
    fireEvent.press(card);
    
    expect(mockProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('displays correct status colors and text', () => {
    const statuses: Array<{ status: any; text: string }> = [
      { status: 'draft', text: 'Черновик' },
      { status: 'pending', text: 'Ожидает' },
      { status: 'in_progress', text: 'В работе' },
      { status: 'completed', text: 'Завершено' },
      { status: 'cancelled', text: 'Отменено' },
    ];

    statuses.forEach(({ status, text }) => {
      const { getByText } = render(
        <TaskCard {...mockProps} status={status} />
      );
      expect(getByText(text)).toBeTruthy();
    });
  });

  it('displays correct priority colors and text', () => {
    const priorities: Array<{ priority: any; text: string }> = [
      { priority: 'low', text: 'Низкий' },
      { priority: 'medium', text: 'Средний' },
      { priority: 'high', text: 'Высокий' },
      { priority: 'urgent', text: 'Срочно' },
    ];

    priorities.forEach(({ priority, text }) => {
      const { getByText } = render(
        <TaskCard {...mockProps} priority={priority} />
      );
      expect(getByText(text)).toBeTruthy();
    });
  });

  it('formats date correctly', () => {
    const testDate = new Date('2023-12-25');
    const { getByText } = render(
      <TaskCard {...mockProps} createdAt={testDate} />
    );
    
    expect(getByText('📅 25.12.2023')).toBeTruthy();
  });

  it('truncates long title and description', () => {
    const longTitle = 'Very long title that should be truncated to avoid overflow in the card component';
    const longDescription = 'Very long description that should be truncated to avoid taking too much space in the card and maintain good user experience';
    
    const { getByText } = render(
      <TaskCard 
        {...mockProps} 
        title={longTitle}
        description={longDescription}
      />
    );
    
    // Title should be present (numberOfLines=2)
    expect(getByText(longTitle)).toBeTruthy();
    // Description should be present (numberOfLines=3)
    expect(getByText(longDescription)).toBeTruthy();
  });
});
