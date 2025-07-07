import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { Button } from "../components/Button";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { TaskRequest } from "../types";
import { TaskCard } from "../components/TaskCard";

interface Props {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

const TaskListScreen: React.FC<Props> = ({ navigation }) => {
  const [tasks, setTasks] = useState<TaskRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setError(null);
      // Mock data since we don't have user auth yet
      const mockTasks: TaskRequest[] = [
        {
          id: "1",
          title: "Разработка мобильного приложения",
          shortDescription: "Создание приложения для заказа еды",
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
        },
        {
          id: "2",
          title: "Дизайн веб-сайта",
          shortDescription:
            "Создание современного дизайна для корпоративного сайта",
          priority: "medium",
          category: {
            id: "2",
            name: "Дизайн",
            description: "Графический дизайн и UI/UX",
            icon: "design",
          },
          client: {
            id: "2",
            name: "Анна Смирнова",
            email: "anna@example.com",
            role: "client",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          status: "in_progress",
          estimatedHours: 40,
          estimatedCost: 60000,
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(),
        },
      ];
      setTasks(mockTasks);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки задач");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
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
        return "Ожидает";
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

  const renderTask = ({ item }: { item: TaskRequest }) => (
    <TaskCard
      id={item.id}
      title={item.title}
      description={item.shortDescription}
      estimatedTime={
        item.estimatedHours ? `${item.estimatedHours} ч.` : undefined
      }
      estimatedCost={
        item.estimatedCost
          ? `${item.estimatedCost.toLocaleString("ru-RU")} ₽`
          : undefined
      }
      status={item.status}
      priority={item.priority || "medium"}
      category={item.category.name}
      createdAt={item.createdAt}
      onPress={() => {
        // Навигация к деталям задачи
        navigation.navigate("TaskDetail", { taskId: item.id });
      }}
    />
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Мои заявки</Text>
        <Button
          title="Создать новую"
          onPress={() => navigation.navigate("CreateTask")}
          style={styles.createButton}
        />
      </View>

      {error && <ErrorMessage message={error} onRetry={loadTasks} />}

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>У вас пока нет заявок</Text>
            <Button
              title="Создать первую заявку"
              onPress={() => navigation.navigate("CreateTask")}
              style={styles.emptyButton}
            />
          </View>
        }
      />
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
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 24, // Добавляем дополнительный отступ сверху
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexShrink: 0, // Предотвращаем сжатие
    minWidth: 60, // Минимальная ширина
    alignItems: "center", // Центрируем текст
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  taskDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 12,
  },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
    color: "#8E8E93",
  },
  cost: {
    fontSize: 16,
    fontWeight: "600",
    color: "#34C759",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 16,
    textAlign: "center",
  },
  emptyButton: {
    marginTop: 8,
  },
});

export default TaskListScreen;
