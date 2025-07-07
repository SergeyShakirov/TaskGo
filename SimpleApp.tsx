import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import TaskListScreen from "./src/screens/TaskListScreen";
import CreateTaskScreen from "./src/screens/CreateTaskScreen";
import TaskDetailScreen from "./src/screens/TaskDetailScreen";

type Screen = "TaskList" | "CreateTask" | "TaskDetail";

const SimpleApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("TaskList");
  const [screenParams, setScreenParams] = useState<any>(null);

  const navigation = {
    navigate: (screen: Screen, params?: any) => {
      setCurrentScreen(screen);
      setScreenParams(params);
    },
    goBack: () => setCurrentScreen("TaskList"),
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "TaskList":
        return <TaskListScreen navigation={navigation} />;
      case "CreateTask":
        return <CreateTaskScreen navigation={navigation} />;
      case "TaskDetail":
        return (
          <TaskDetailScreen
            navigation={navigation}
            route={{ params: screenParams } as any}
          />
        );
      default:
        return <TaskListScreen navigation={navigation} />;
    }
  };

  return <View style={styles.container}>{renderCurrentScreen()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SimpleApp;
