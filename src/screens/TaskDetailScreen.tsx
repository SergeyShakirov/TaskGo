import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { TaskRequest } from "../types";
import { RootStackParamList } from "../navigation/AppNavigator";

type TaskDetailScreenRouteProp = RouteProp<RootStackParamList, "TaskDetail">;
type TaskDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TaskDetail"
>;

interface Props {
  route: TaskDetailScreenRouteProp;
  navigation: TaskDetailScreenNavigationProp;
}

const TaskDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState<TaskRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTaskDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data since we don't have backend yet
      const mockTask: TaskRequest = {
        id: taskId,
        title: "Разработка мобильного приложения",
        shortDescription:
          "Создание приложения для заказа еды с функциями регистрации, каталога, корзины и оплаты. Приложение должно поддерживать iOS и Android, иметь современный дизайн и интуитивный интерфейс.",
        priority: "high",
        category: {
          id: "1",
          name: "Разработка ПО",
          description: "Разработка программного обеспечения",
          icon: "code",
        },
        client: {
          id: "1",
          name: "Иван Петров",
          email: "ivan@example.com",
          role: "client",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        status: "pending",
        estimatedHours: 120,
        estimatedCost: 150000,
        createdAt: new Date(),
        updatedAt: new Date(),
        deadline: new Date("2025-08-01"),
      };

      setTask(mockTask);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки деталей задачи");
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadTaskDetails();
  }, [loadTaskDetails]);

  const handleApprove = () => {
    if (task) {
      Alert.alert("Утверждение", "ТЗ утверждено!", [
        { text: "ОК", onPress: () => navigation.goBack() },
      ]);
    }
  };

  const handleEdit = () => {
    Alert.alert("Редактирование", "Функция редактирования в разработке", [
      { text: "Отмена", style: "cancel" },
      { text: "ОК" },
    ]);
  };

  const handleStartWork = () => {
    Alert.alert(
      "Начать работу",
      "Вы уверены, что хотите начать работу над этой задачей?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Начать",
          onPress: () => Alert.alert("Успех", "Работа начата!"),
        },
      ]
    );
  };

  const getStatusColor = (status: TaskRequest["status"]) => {
    switch (status) {
      case "pending":
        return "#FF9500";
      case "in_progress":
        return "#007AFF";
      case "completed":
        return "#34C759";
      case "cancelled":
        return "#FF3B30";
      default:
        return "#8E8E93";
    }
  };

  const getStatusText = (status: TaskRequest["status"]) => {
    switch (status) {
      case "pending":
        return "Ожидает утверждения";
      case "in_progress":
        return "В работе";
      case "completed":
        return "Завершено";
      case "cancelled":
        return "Отменено";
      case "draft":
        return "Черновик";
      default:
        return "Неизвестно";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "#FF3B30";
      case "medium":
        return "#FF9500";
      case "low":
        return "#34C759";
      default:
        return "#8E8E93";
    }
  };

  const getPriorityText = (priority?: string) => {
    switch (priority) {
      case "high":
        return "Высокий";
      case "medium":
        return "Средний";
      case "low":
        return "Низкий";
      default:
        return "Не указан";
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Загрузка...</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ошибка</Text>
          <View style={styles.placeholder} />
        </View>
        <ErrorMessage message={error} onRetry={loadTaskDetails} />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Задача не найдена</Text>
          <View style={styles.placeholder} />
        </View>
        <Text style={styles.errorText}>Задача не найдена</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Детали задачи</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Основная информация */}
        <View style={styles.card}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{task.title}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(task.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(task.status)}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{task.shortDescription}</Text>

          {/* Приоритет и категория */}
          <View style={styles.tagsSection}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(task.priority) },
              ]}
            >
              <Text style={styles.priorityText}>
                {getPriorityText(task.priority)}
              </Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{task.category.name}</Text>
            </View>
          </View>
        </View>

        {/* Детальная информация */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Информация о проекте</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Заказчик:</Text>
              <Text style={styles.infoValue}>{task.client.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{task.client.email}</Text>
            </View>

            {task.estimatedHours && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Время выполнения:</Text>
                <Text style={styles.infoValue}>{task.estimatedHours} ч.</Text>
              </View>
            )}

            {task.estimatedCost && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Стоимость:</Text>
                <Text style={[styles.infoValue, styles.costValue]}>
                  {task.estimatedCost.toLocaleString("ru-RU")} ₽
                </Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Создано:</Text>
              <Text style={styles.infoValue}>
                {task.createdAt.toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </Text>
            </View>

            {task.deadline && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Срок выполнения:</Text>
                <Text style={styles.infoValue}>
                  {task.deadline.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Кнопки действий */}
        <View style={styles.actionsCard}>
          {task.status === "pending" && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={handleApprove}
              >
                <Text style={styles.primaryButtonText}>✅ Утвердить ТЗ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={handleEdit}
              >
                <Text style={styles.secondaryButtonText}>✏️ Редактировать</Text>
              </TouchableOpacity>
            </>
          )}

          {task.status === "draft" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={handleEdit}
            >
              <Text style={styles.primaryButtonText}>✏️ Редактировать</Text>
            </TouchableOpacity>
          )}

          {task.status === "pending" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.workButton]}
              onPress={handleStartWork}
            >
              <Text style={styles.workButtonText}>🚀 Начать работу</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  backButtonText: {
    fontSize: 22,
    color: "#1F2937",
    fontWeight: "700",
    lineHeight: 22,
    textAlign: "center",
    marginLeft: -2,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  editButtonText: {
    fontSize: 18,
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
    lineHeight: 32,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
    marginBottom: 20,
  },
  tagsSection: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#EBF8FF",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1D4ED8",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  costValue: {
    color: "#059669",
    fontSize: 16,
    fontWeight: "700",
  },
  actionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#059669",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  workButton: {
    backgroundColor: "#3B82F6",
  },
  workButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginTop: 32,
    paddingHorizontal: 20,
  },
});

export default TaskDetailScreen;
