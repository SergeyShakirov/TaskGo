import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import CreateTaskScreen from "../screens/CreateTaskScreen";
import TaskListScreen from "../screens/TaskListScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ApprovalScreen from "../screens/ApprovalScreen";

export type RootStackParamList = {
  MainTabs: undefined;
  TaskDetail: { taskId: string };
  Approval: { taskId: string };
};

export type MainTabParamList = {
  CreateTask: undefined;
  TaskList: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{
          title: "Мои заявки",
          tabBarIcon: ({ color, size }) => (
            <Icon name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CreateTask"
        component={CreateTaskScreen}
        options={{
          title: "Создать заявку",
          tabBarIcon: ({ color, size }) => (
            <Icon name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Профиль",
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{ title: "Детали заявки" }}
        />
        <Stack.Screen
          name="Approval"
          component={ApprovalScreen}
          options={{ title: "Утверждение ТЗ" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
