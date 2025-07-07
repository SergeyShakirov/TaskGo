import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Button } from "../components/Button";

const ProfileScreen: React.FC = () => {
  // Mock user data
  const user = {
    id: "1",
    name: "Иван Петров",
    email: "ivan.petrov@example.com",
    role: "client" as const,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    completedTasks: 12,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date(),
  };

  const stats = [
    { label: "Выполненных задач", value: user.completedTasks },
    { label: "Средний рейтинг", value: user.rating },
    { label: "Активных заявок", value: 3 },
    { label: "В работе", value: 1 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                user.avatar ||
                "https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=User",
            }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.role}>
          {user.role === "client" ? "Заказчик" : "Исполнитель"}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Статистика</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Настройки</Text>
        <View style={styles.settingsList}>
          <Button
            title="Редактировать профиль"
            onPress={() => {}}
            variant="outline"
            style={styles.settingButton}
          />
          <Button
            title="Настройки уведомлений"
            onPress={() => {}}
            variant="outline"
            style={styles.settingButton}
          />
          <Button
            title="Помощь и поддержка"
            onPress={() => {}}
            variant="outline"
            style={styles.settingButton}
          />
          <Button
            title="О приложении"
            onPress={() => {}}
            variant="outline"
            style={styles.settingButton}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Аккаунт</Text>
        <View style={styles.settingsList}>
          <Button
            title="Сменить пароль"
            onPress={() => {}}
            variant="outline"
            style={styles.settingButton}
          />
          <Button
            title="Выйти из аккаунта"
            onPress={() => {}}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Версия 1.0.0</Text>
        <Text style={styles.copyright}>© 2025 TaskGo. Все права защищены.</Text>
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
    padding: 24,
    alignItems: "center",
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
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E5EA",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 8,
  },
  role: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
  },
  statsContainer: {
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
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
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
  settingsList: {
    gap: 8,
  },
  settingButton: {
    marginVertical: 4,
  },
  logoutButton: {
    marginVertical: 4,
    borderColor: "#FF3B30",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  version: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
  },
});

export default ProfileScreen;
