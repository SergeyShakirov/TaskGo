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
    description: "Продвижение и реклама",
    icon: "marketing",
  },
  {
    id: "5",
    name: "Контент",
    description: "Создание контента",
    icon: "content",
  },
];

interface Props {
  navigation: any;
}

export const CreateTaskScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const { generateDescription, response, isLoading, error, clearError } =
    useAIGeneration();

  const handleGenerateDescription = async () => {
    if (!shortDescription.trim() || !selectedCategory) {
      Alert.alert(
        "Ошибка",
        "Пожалуйста, заполните описание и выберите категорию"
      );
      return;
    }

    const request: AIGenerationRequest = {
      shortDescription: shortDescription.trim(),
      category: selectedCategory.name,
      budget: budget ? parseFloat(budget) : undefined,
    };

    await generateDescription(request);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCreateTask = () => {
    if (!title.trim() || !shortDescription.trim() || !selectedCategory) {
      Alert.alert("Ошибка", "Пожалуйста, заполните все обязательные поля");
      return;
    }

    Alert.alert("Успех", "Задача создана!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  const handleExportToWord = () => {
    Alert.alert("Экспорт", "Функция экспорта в разработке");
  };

  const handleApprove = () => {
    Alert.alert("Утверждение", "ТЗ утверждено!");
  };

  const renderBackButton = () => (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
      activeOpacity={0.7}
    >
      <View style={styles.backArrow}>
        <Text style={styles.backArrowText}>←</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryChip = (category: ServiceCategory) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryChip,
        selectedCategory?.id === category.id && styles.categoryChipSelected,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory?.id === category.id &&
            styles.categoryChipTextSelected,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Компактный заголовок */}
      <View style={styles.header}>
        {renderBackButton()}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Новая задача</Text>
          <Text style={styles.headerSubtitle}>
            Создайте техническое задание
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Компактная форма */}
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Название проекта</Text>
            <TextInput
              style={styles.compactInput}
              placeholder="Кратко опишите проект"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Категория</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {mockCategories.map(renderCategoryChip)}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Краткое описание</Text>
            <TextInput
              style={[styles.compactInput, styles.textArea]}
              placeholder="Например: Создать интернет-магазин для продажи одежды"
              value={shortDescription}
              onChangeText={setShortDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Бюджет (₽)</Text>
              <TextInput
                style={styles.compactInput}
                placeholder="50 000"
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Срок (дней)</Text>
              <TextInput
                style={styles.compactInput}
                placeholder="30"
                value={deadline}
                onChangeText={setDeadline}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
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
              <Text style={styles.generateButtonText}>✨ Создать ТЗ с ИИ</Text>
            )}
          </TouchableOpacity>
        </View>

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 15,
  },
  backArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  backArrowText: {
    fontSize: 18,
    color: "#374151",
    fontWeight: "600",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  scrollView: {
    flex: 1,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  compactInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  categoryScroll: {
    marginTop: 4,
  },
  categoryChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryChipSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#2563EB",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  categoryChipTextSelected: {
    color: "#FFFFFF",
  },
  generateButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  generateButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  statusBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  resultSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  expandIcon: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "600",
  },
  sectionContent: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginTop: 8,
  },
  listItem: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  errorCard: {
    backgroundColor: "#FEF2F2",
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 20,
  },
});
