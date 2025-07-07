import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "../components/Button";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { TaskRequest } from "../types";
import { RootStackParamList } from "../navigation/AppNavigator";
import ApiService from "../services/ApiService";

type ApprovalScreenRouteProp = RouteProp<RootStackParamList, "Approval">;
type ApprovalScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Approval"
>;

interface Props {
  route: ApprovalScreenRouteProp;
  navigation: ApprovalScreenNavigationProp;
}

const ApprovalScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState<TaskRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTaskDetails();
  }, [taskId, loadTaskDetails]);

  const loadTaskDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data since we don't have a real backend call yet
      const mockTask: TaskRequest = {
        id: taskId,
        title: "Разработка мобильного приложения для заказа еды",
        shortDescription:
          "Создание современного мобильного приложения для заказа и доставки еды с интуитивным интерфейсом",
        aiGeneratedDescription: `Разработка кроссплатформенного мобильного приложения для заказа и доставки еды с следующими основными функциями:

1. Регистрация и авторизация пользователей
2. Каталог ресторанов с возможностью фильтрации
3. Детальное меню с фотографиями блюд
4. Корзина покупок с возможностью изменения количества
5. Система оплаты (банковские карты, электронные кошельки)
6. Отслеживание заказа в реальном времени
7. Система оценок и отзывов
8. Push-уведомления о статусе заказа
9. Программа лояльности и промокоды
10. Поддержка нескольких языков

Техническими требованиями являются:
- React Native для кроссплатформенности
- Адаптивный дизайн для различных экранов
- Интеграция с картами для геолокации
- Безопасная обработка платежей
- Оптимизация производительности
- Соответствие guidelines iOS и Android`,
        estimatedHours: 320,
        estimatedCost: 480000,
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
          createdAt: new Date("2025-06-01"),
          updatedAt: new Date(),
        },
        status: "pending",
        createdAt: new Date("2025-06-15"),
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

  const handleApprove = async () => {
    if (!task) {
      return;
    }

    try {
      setApproving(true);

      // Here we would normally call the backend to approve the task
      // For now, we'll just simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Успешно!",
        "Техническое задание утверждено. Теперь вы можете экспортировать его в Word.",
        [
          {
            text: "OK",
            onPress: () => {
              // Update task status
              setTask((prev) =>
                prev ? { ...prev, status: "in_progress" } : null
              );
            },
          },
        ]
      );
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Не удалось утвердить ТЗ");
    } finally {
      setApproving(false);
    }
  };

  const handleExportToWord = async () => {
    if (!task) {
      return;
    }

    try {
      setExporting(true);

      const apiService = ApiService;
      const exportData = {
        taskId: task.id,
        title: task.title,
        description: task.aiGeneratedDescription || task.shortDescription,
        estimatedHours: task.estimatedHours,
        estimatedCost: task.estimatedCost,
        category: task.category.name,
        client: task.client.name,
        deadline: task.deadline,
      };

      await apiService.exportToWord(exportData);

      Alert.alert(
        "Экспорт завершён",
        "Документ Word успешно создан. Ссылка для скачивания отправлена на ваш email.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        "Ошибка экспорта",
        err.message || "Не удалось экспортировать документ"
      );
    } finally {
      setExporting(false);
    }
  };

  const handleReject = () => {
    Alert.alert(
      "Отклонить ТЗ",
      "Вы уверены, что хотите отклонить это техническое задание?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Отклонить",
          style: "destructive",
          onPress: () => {
            // Here we would call the backend to reject the task
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={loadTaskDetails} />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Задача не найдена</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Утверждение технического задания</Text>
        <Text style={styles.subtitle}>
          Внимательно проверьте детали проекта перед утверждением
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Название проекта</Text>
        <Text style={styles.description}>{task.title}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Техническое задание</Text>
        <Text style={styles.description}>
          {task.aiGeneratedDescription || task.shortDescription}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Оценка проекта</Text>
        <View style={styles.estimateContainer}>
          {task.estimatedHours && (
            <View style={styles.estimateItem}>
              <Text style={styles.estimateLabel}>Время выполнения:</Text>
              <Text style={styles.estimateValue}>
                {task.estimatedHours} часов
              </Text>
            </View>
          )}
          {task.estimatedCost && (
            <View style={styles.estimateItem}>
              <Text style={styles.estimateLabel}>Стоимость:</Text>
              <Text style={styles.costValue}>
                {task.estimatedCost.toLocaleString("ru-RU")} ₽
              </Text>
            </View>
          )}
          {task.deadline && (
            <View style={styles.estimateItem}>
              <Text style={styles.estimateLabel}>Дедлайн:</Text>
              <Text style={styles.estimateValue}>
                {task.deadline.toLocaleDateString("ru-RU")}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningTitle}>⚠️ Важно</Text>
        <Text style={styles.warningText}>
          После утверждения техническое задание нельзя будет изменить без
          согласования с исполнителем. Убедитесь, что все детали указаны
          корректно.
        </Text>
      </View>

      <View style={styles.actions}>
        {task.status === "pending" ? (
          <>
            <Button
              title={approving ? "Утверждаем..." : "Утвердить ТЗ"}
              onPress={handleApprove}
              disabled={approving}
              loading={approving}
              variant="primary"
            />
            <Button
              title="Отклонить"
              onPress={handleReject}
              variant="outline"
              disabled={approving}
            />
          </>
        ) : (
          <Button
            title={exporting ? "Экспортируем..." : "Экспортировать в Word"}
            onPress={handleExportToWord}
            disabled={exporting}
            loading={exporting}
            variant="primary"
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    padding: 16,
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
  },
  estimateContainer: {
    gap: 12,
  },
  estimateItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  estimateLabel: {
    fontSize: 14,
    color: "#666666",
  },
  estimateValue: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "500",
  },
  costValue: {
    fontSize: 16,
    color: "#34C759",
    fontWeight: "600",
  },
  warningBox: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FFB000",
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F57C00",
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: "#F57C00",
    lineHeight: 20,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 32,
  },
});

export default ApprovalScreen;
