import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { useAIGeneration } from "../hooks/useAIGeneration";
import { AIGenerationRequest, ServiceCategory } from "../types";

const mockCategories: ServiceCategory[] = [
  {
    id: "1",
    name: "Веб-разработка",
    description: "Создание веб-сайтов и приложений",
    icon: "web",
  },
  {
    id: "2",
    name: "Мобильная разработка",
    description: "Разработка мобильных приложений",
    icon: "mobile",
  },
  {
    id: "3",
    name: "Дизайн",
    description: "Графический дизайн и UI/UX",
    icon: "design",
  },
  {
    id: "4",
    name: "Маркетинг",
    description: "Цифровой маркетинг и реклама",
    icon: "marketing",
  },
];

export const CreateTaskScreen: React.FC<{ navigation?: any }> = ({
  navigation,
}) => {
  const [shortDescription, setShortDescription] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const scaleAnim = new Animated.Value(1);

  const { isLoading, response, error, generateDescription, clearError, reset } =
    useAIGeneration();

  const handleBackPress = () => {
    // Анимация нажатия кнопки
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (navigation) {
      navigation.goBack();
    }
  };

  const handleGenerateDescription = async () => {
    if (!shortDescription.trim()) {
      Alert.alert("Ошибка", "Пожалуйста, опишите кратко что вы хотите");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Ошибка", "Пожалуйста, выберите категорию");
      return;
    }

    try {
      const request: AIGenerationRequest = {
        shortDescription: shortDescription.trim(),
        category: selectedCategory.id,
        budget: budget ? parseFloat(budget) : undefined,
        deadline: deadline ? new Date(deadline) : undefined,
      };

      await generateDescription(request);
      Alert.alert("Успешно", "ТЗ сгенерировано! Проверьте детали ниже.");
    } catch (err) {
      Alert.alert("Ошибка", "Не удалось сгенерировать ТЗ. Попробуйте еще раз.");
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleApprove = () => {
    Alert.alert("Подтверждение", "Вы хотите утвердить это ТЗ?", [
      { text: "Отмена", style: "cancel" },
      { text: "Утвердить", onPress: () => console.log("Approved") },
    ]);
  };

  const handleExportToWord = () => {
    if (!response) {
      return;
    }

    Alert.alert(
      "Экспорт в Word",
      "Документ будет сгенерирован и сохранен на устройство",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Экспортировать",
          onPress: () => {
            // Здесь будет логика экспорта
            Alert.alert("Успешно", "Документ сохранен в Downloads");
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="ИИ создает детальное ТЗ..." />;
  }

  if (error && !response) {
    return (
      <ErrorMessage message={error} onRetry={clearError} retryText="Закрыть" />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Компактная шапка с интересной кнопкой назад */}
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.8}
          >
            <View style={styles.backButtonInner}>
              <Text style={styles.backArrow}>‹</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Создать задачу</Text>
          <Text style={styles.headerSubtitle}>ИИ поможет составить ТЗ</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Основная форма в компактном виде */}
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Опишите вашу задачу *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Например: создать мобильное приложение для заказа еды"
              multiline
              numberOfLines={3}
              value={shortDescription}
              onChangeText={setShortDescription}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Категория *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryRow}>
                {mockCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      selectedCategory?.id === category.id &&
                        styles.categoryChipSelected,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory?.id === category.id &&
                          styles.categoryTextSelected,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Бюджет</Text>
              <TextInput
                style={styles.textInput}
                placeholder="₽ 50,000"
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Дедлайн</Text>
              <TextInput
                style={styles.textInput}
                placeholder="2 недели"
                value={deadline}
                onChangeText={setDeadline}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.generateButton,
              isLoading && styles.generateButtonDisabled,
            ]}
            onPress={handleGenerateDescription}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.generateButtonText}>
                  ✨ Создать ТЗ с ИИ
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Input
          label="Краткое описание задачи"
          placeholder="Например: Создать интернет-магазин для продажи одежды"
          value={shortDescription}
          onChangeText={setShortDescription}
          multiline
          numberOfLines={3}
          required
        />

        <Text style={styles.sectionTitle}>Категория</Text>
        <View style={styles.categoryContainer}>
          {mockCategories.map((category) => (
            <Button
              key={category.id}
              title={category.name}
              variant={
                selectedCategory?.id === category.id ? "primary" : "outline"
              }
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </View>

        <Input
          label="Бюджет (опционально)"
          placeholder="Укажите примерный бюджет в рублях"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
        />

        <Input
          label="Срок выполнения (опционально)"
          placeholder="Когда нужно завершить проект?"
          value={deadline}
          onChangeText={setDeadline}
        />

        <Button
          title="Сгенерировать ТЗ с помощью ИИ"
          onPress={handleGenerateDescription}
          loading={isLoading}
          disabled={!shortDescription.trim() || !selectedCategory}
        />

        {/* Результаты ИИ в компактном виде */}
        {response && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>📋 Готовое ТЗ</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Готово</Text>
              </View>
            </View>

            <View style={styles.resultSection}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection("title")}
              >
                <Text style={styles.sectionTitle}>Название проекта</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === "title" ? "−" : "+"}
                </Text>
              </TouchableOpacity>
              {(expandedSection === "title" || expandedSection === null) && (
                <Text style={styles.sectionContent}>
                  {title || "Новый проект"}
                </Text>
              )}
            </View>

            <View style={styles.resultSection}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection("description")}
              >
                <Text style={styles.sectionTitle}>Описание</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === "description" ? "−" : "+"}
                </Text>
              </TouchableOpacity>
              {(expandedSection === "description" ||
                expandedSection === null) && (
                <Text style={styles.sectionContent}>
                  {response.detailedDescription}
                </Text>
              )}
            </View>

            {response.requirements && response.requirements.length > 0 && (
              <View style={styles.resultSection}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection("requirements")}
                >
                  <Text style={styles.sectionTitle}>Требования</Text>
                  <Text style={styles.expandIcon}>
                    {expandedSection === "requirements" ? "−" : "+"}
                  </Text>
                </TouchableOpacity>
                {(expandedSection === "requirements" ||
                  expandedSection === null) && (
                  <View>
                    {response.requirements.map((req, index) => (
                      <Text key={index} style={styles.listItem}>
                        • {req}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleExportToWord}
              >
                <Text style={styles.secondaryButtonText}>📄 Word</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleApprove}
              >
                <Text style={styles.primaryButtonText}>✅ Утвердить</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>❌ {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={clearError}>
              <Text style={styles.retryButtonText}>Попробовать снова</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333333",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  errorContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FED7D7",
  },
  errorText: {
    color: "#DC3545",
    fontSize: 14,
    marginBottom: 8,
  },
  responseContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  responseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: "#333333",
  },
  responseText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666666",
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666666",
    marginBottom: 4,
  },
  actionContainer: {
    marginTop: 16,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  backButtonInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 18,
    color: "#333333",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  headerSpacer: {
    width: 40,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  categoryRow: {
    flexDirection: "row",
    gap: 8,
  },
  categoryChip: {
    backgroundColor: "#F1F1F1",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
  },
  categoryChipSelected: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  categoryText: {
    fontSize: 14,
    color: "#333333",
  },
  categoryTextSelected: {
    color: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  generateButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  generateButtonDisabled: {
    backgroundColor: "#A0C4FF",
  },
  generateButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  statusBadge: {
    backgroundColor: "#E1F5FE",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#01579B",
    fontWeight: "500",
  },
  resultSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F1F1F1",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "600",
  },
  expandIcon: {
    fontSize: 16,
    color: "#007BFF",
  },
  sectionContent: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginTop: 8,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#E1F5FE",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  secondaryButtonText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "600",
  },
  errorCard: {
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FED7D7",
    marginTop: 16,
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  bottomPadding: {
    height: 32,
  },
});

export default CreateTaskScreen;
