import React from 'react';
import { render } from '@testing-library/react-native';
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

// Simple test to verify component renders
describe('TaskDetailScreen', () => {
  test('renders without crashing', () => {
    const { getByText } = render(
      <TaskDetailScreen navigation={mockNavigation} route={mockRoute} />
    );
    
    // Should at least render the header
    expect(getByText('Детали задачи')).toBeTruthy();
  });
});
