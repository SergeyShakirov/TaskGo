const axios = require("axios");

const BASE_URL = "http://localhost:3001/api/ai";

async function testDeepSeekEndpoints() {
  console.log("🤖 Тестируем DeepSeek API endpoints...\n");

  // Тест 1: Генерация описания
  console.log("1️⃣ Тестируем /generate-description");
  try {
    const response = await axios.post(`${BASE_URL}/generate-description`, {
      briefDescription:
        "Создать мобильное приложение для заказа еды с доставкой",
    });
    console.log("✅ Успешно:", response.data.success);
    console.log(
      "📝 Детальное описание:",
      response.data.data?.detailedDescription?.substring(0, 100) + "..."
    );
    console.log("⏱️ Часы:", response.data.data?.estimatedHours);
    console.log("💰 Стоимость:", response.data.data?.estimatedCost);
  } catch (error) {
    console.log("❌ Ошибка:", error.response?.data || error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Тест 2: Оценка задачи
  console.log("2️⃣ Тестируем /estimate");
  try {
    const response = await axios.post(`${BASE_URL}/estimate`, {
      description: "Разработка CRM системы для управления клиентами",
    });
    console.log("✅ Успешно:", response.data.success);
    console.log("⏱️ Часы:", response.data.data?.hours);
    console.log("💰 Стоимость:", response.data.data?.cost);
    console.log("🎯 Сложность:", response.data.data?.complexity);
  } catch (error) {
    console.log("❌ Ошибка:", error.response?.data || error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Тест 3: Предложения по улучшениям
  console.log("3️⃣ Тестируем /suggest-improvements");
  try {
    const response = await axios.post(`${BASE_URL}/suggest-improvements`, {
      description: "Простой сайт-визитка для компании",
    });
    console.log("✅ Успешно:", response.data.success);
    console.log(
      "💡 Предложения:",
      response.data.data?.suggestions?.length,
      "штук"
    );
    response.data.data?.suggestions?.forEach((suggestion, index) => {
      console.log(`   ${index + 1}. ${suggestion}`);
    });
  } catch (error) {
    console.log("❌ Ошибка:", error.response?.data || error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Тест 4: Предложения категорий
  console.log("4️⃣ Тестируем /suggest-categories");
  try {
    const response = await axios.post(`${BASE_URL}/suggest-categories`, {
      description: "Создание интернет-магазина одежды с корзиной и оплатой",
    });
    console.log("✅ Успешно:", response.data.success);
    console.log("📂 Категории:");
    response.data.data?.forEach((category) => {
      console.log(`   • ${category.name} (${category.icon})`);
    });
  } catch (error) {
    console.log("❌ Ошибка:", error.response?.data || error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Тест 5: Анализ сложности
  console.log("5️⃣ Тестируем /analyze-complexity");
  try {
    const response = await axios.post(`${BASE_URL}/analyze-complexity`, {
      description:
        "Создание системы машинного обучения для анализа данных с интеграцией блокчейн технологий",
    });
    console.log("✅ Успешно:", response.data.success);
    console.log("🎯 Сложность:", response.data.data?.complexity);
    console.log("⚠️ Факторы:", response.data.data?.factors?.length, "штук");
    console.log(
      "💡 Рекомендации:",
      response.data.data?.recommendations?.length,
      "штук"
    );
  } catch (error) {
    console.log("❌ Ошибка:", error.response?.data || error.message);
  }

  console.log("\n🎉 Тестирование завершено!");
}

// Запускаем тесты
testDeepSeekEndpoints().catch(console.error);
