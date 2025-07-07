import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export type TaskStatus =
  | "draft"
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

interface TaskCardProps {
  id?: string;
  title: string;
  description: string;
  estimatedTime?: string;
  estimatedCost?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  createdAt?: Date;
  onPress?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  estimatedTime,
  estimatedCost,
  status = "pending",
  priority = "medium",
  category,
  createdAt,
  onPress,
}) => {
  const getStatusColor = (taskStatus: TaskStatus): string => {
    switch (taskStatus) {
      case "draft":
        return "#9CA3AF";
      case "pending":
        return "#FFA500";
      case "in_progress":
        return "#007AFF";
      case "completed":
        return "#10B981";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getPriorityColor = (taskPriority: TaskPriority): string => {
    switch (taskPriority) {
      case "low":
        return "#10B981";
      case "medium":
        return "#F59E0B";
      case "high":
        return "#EF4444";
      case "urgent":
        return "#DC2626";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (taskStatus: TaskStatus): string => {
    switch (taskStatus) {
      case "draft":
        return "Черновик";
      case "pending":
        return "Ожидает";
      case "in_progress":
        return "В работе";
      case "completed":
        return "Завершено";
      case "cancelled":
        return "Отменено";
      default:
        return "Неизвестно";
    }
  };

  const getPriorityText = (taskPriority: TaskPriority): string => {
    switch (taskPriority) {
      case "low":
        return "Низкий";
      case "medium":
        return "Средний";
      case "high":
        return "Высокий";
      case "urgent":
        return "Срочно";
      default:
        return "Средний";
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(status)}</Text>
        </View>
      </View>

      {category && (
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>📂 {category}</Text>
        </View>
      )}

      <Text style={styles.description} numberOfLines={3}>
        {description}
      </Text>

      <View style={styles.metaInfo}>
        <View style={styles.priorityContainer}>
          <View
            style={[
              styles.priorityDot,
              { backgroundColor: getPriorityColor(priority) },
            ]}
          />
          <Text style={styles.priorityText}>{getPriorityText(priority)}</Text>
        </View>

        {createdAt && (
          <Text style={styles.dateText}>📅 {formatDate(createdAt)}</Text>
        )}
      </View>

      {(estimatedTime || estimatedCost) && (
        <View style={styles.estimatesContainer}>
          {estimatedTime && (
            <View style={styles.estimateItem}>
              <Text style={styles.estimateLabel}>⏱️ Время:</Text>
              <Text style={styles.estimateValue}>{estimatedTime}</Text>
            </View>
          )}
          {estimatedCost && (
            <View style={styles.estimateItem}>
              <Text style={styles.estimateLabel}>💰 Стоимость:</Text>
              <Text style={styles.estimateValue}>{estimatedCost}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priorityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  estimatesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  estimateItem: {
    flex: 1,
    alignItems: "center",
  },
  estimateLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  estimateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
});
