import React from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

const App: React.FC = () => {
  const handleCreateTask = () => {
    Alert.alert(
      "TaskGo",
      "Функция создания задачи будет добавлена в следующих обновлениях!"
    );
  };

  const handleViewTasks = () => {
    Alert.alert(
      "TaskGo",
      "Функция просмотра задач будет добавлена в следующих обновлениях!"
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TaskGo</Text>
        <Text style={styles.headerSubtitle}>
          Платформа для управления задачами
        </Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Добро пожаловать в TaskGo!</Text>
          <Text style={styles.sectionText}>
            Платформа для создания и управления техническими заявками с помощью
            ИИ
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCreateTask}
          >
            <Text style={styles.buttonText}>Создать задачу</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewTasks}
          >
            <Text style={styles.secondaryButtonText}>Просмотреть задачи</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Последние заявки</Text>
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>
              Разработка мобильного приложения
            </Text>
            <Text style={styles.taskDescription}>
              Создание кроссплатформенного мобильного приложения с
              использованием React Native
            </Text>
            <Text style={styles.taskMeta}>
              Время: 2-3 недели | Стоимость: 150,000 - 200,000 руб
            </Text>
          </View>
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>Настройка CI/CD</Text>
            <Text style={styles.taskDescription}>
              Автоматизация процесса сборки и развертывания приложения
            </Text>
            <Text style={styles.taskMeta}>
              Время: 1-2 дня | Стоимость: 30,000 - 50,000 руб
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6C757D",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: "#6C757D",
    lineHeight: 24,
  },
  buttonsContainer: {
    marginTop: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007BFF",
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: "#6C757D",
    lineHeight: 20,
    marginBottom: 8,
  },
  taskMeta: {
    fontSize: 12,
    color: "#28A745",
    fontWeight: "500",
  },
});

export default App;
