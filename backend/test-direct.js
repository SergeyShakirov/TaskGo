console.log("🤖 Тестируем DeepSeek интеграцию...");

// Проверяем сервис напрямую
const { DeepSeekService } = require("./dist/services/DeepSeekService");

async function testDeepSeekService() {
  const deepSeekService = new DeepSeekService();

  console.log("1️⃣ Тестируем генерацию описания...");
  const result = await deepSeekService.generateDescription({
    briefDescription: "Создать мобильное приложение для заказа еды",
  });

  console.log("Результат:", result);
  console.log("✅ Тест завершен");
}

testDeepSeekService().catch(console.error);
