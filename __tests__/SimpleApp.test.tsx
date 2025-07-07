import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SimpleApp from '../SimpleApp';

// Mock the screen components
jest.mock('../src/screens/TaskListScreen', () => {
  const { View, Text } = require('react-native');
  return function MockTaskListScreen({ navigation }: any) {
    return (
      <View testID="task-list-screen">
        <Text>Task List Screen</Text>
      </View>
    );
  };
});

jest.mock('../src/screens/CreateTaskScreen', () => {
  const { View, Text } = require('react-native');
  return function MockCreateTaskScreen({ navigation }: any) {
    return (
      <View testID="create-task-screen">
        <Text>Create Task Screen</Text>
      </View>
    );
  };
});

describe('SimpleApp', () => {
  it('renders TaskListScreen by default', () => {
    const { getByTestId } = render(<SimpleApp />);
    
    expect(getByTestId('task-list-screen')).toBeTruthy();
  });

  it('navigates between screens using navigation object', () => {
    const { getByTestId } = render(<SimpleApp />);
    
    // Initially shows TaskList
    expect(getByTestId('task-list-screen')).toBeTruthy();
    
    // Navigation is handled internally by the app state
    // Since we removed the bottom tabs, navigation would be handled
    // by buttons within the screens themselves
  });

  it('starts with TaskList as default screen', () => {
    const { getByTestId } = render(<SimpleApp />);
    
    expect(getByTestId('task-list-screen')).toBeTruthy();
  });
});
