#!/usr/bin/env node

console.log("🔍 TaskGo Diagnostic Tool");
console.log("=========================\n");

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Проверяем основные файлы
const requiredFiles = [
  "package.json",
  "index.js",
  "App.tsx",
  "app.json",
  "android/build.gradle",
  "android/app/build.gradle",
  "android/app/src/main/java/com/taskgo/MainActivity.java",
  "android/app/src/main/java/com/taskgo/MainApplication.java",
];

console.log("📁 Проверяем основные файлы:");
requiredFiles.forEach((file) => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? "✅" : "❌"} ${file}`);
});

// Проверяем node_modules
console.log("\n📦 Проверяем зависимости:");
const nodeModulesExists = fs.existsSync("node_modules");
console.log(`  ${nodeModulesExists ? "✅" : "❌"} node_modules`);

if (nodeModulesExists) {
  const reactNativeExists = fs.existsSync("node_modules/react-native");
  console.log(`  ${reactNativeExists ? "✅" : "❌"} react-native`);

  const reactExists = fs.existsSync("node_modules/react");
  console.log(`  ${reactExists ? "✅" : "❌"} react`);
}

// Проверяем Android файлы
console.log("\n🤖 Проверяем Android конфигурацию:");
const gradlewExists =
  fs.existsSync("android/gradlew") || fs.existsSync("android/gradlew.bat");
console.log(`  ${gradlewExists ? "✅" : "❌"} gradle wrapper`);

const mainActivityExists = fs.existsSync(
  "android/app/src/main/java/com/taskgo/MainActivity.java"
);
console.log(`  ${mainActivityExists ? "✅" : "❌"} MainActivity.java`);

const mainApplicationExists = fs.existsSync(
  "android/app/src/main/java/com/taskgo/MainApplication.java"
);
console.log(`  ${mainApplicationExists ? "✅" : "❌"} MainApplication.java`);

// Проверяем Flipper файлы
const debugFlipperExists = fs.existsSync(
  "android/app/src/debug/java/com/taskgo/ReactNativeFlipper.java"
);
console.log(
  `  ${debugFlipperExists ? "✅" : "❌"} Debug ReactNativeFlipper.java`
);

const releaseFlipperExists = fs.existsSync(
  "android/app/src/release/java/com/taskgo/ReactNativeFlipper.java"
);
console.log(
  `  ${releaseFlipperExists ? "✅" : "❌"} Release ReactNativeFlipper.java`
);

// Читаем release Flipper файл для проверки
if (releaseFlipperExists) {
  try {
    const flipperContent = fs.readFileSync(
      "android/app/src/release/java/com/taskgo/ReactNativeFlipper.java",
      "utf8"
    );
    if (flipperContent.trim().length === 0) {
      console.log("  ⚠️  Release ReactNativeFlipper.java пустой!");
    } else {
      console.log("  ✅ Release ReactNativeFlipper.java содержит код");
    }
  } catch (e) {
    console.log("  ❌ Ошибка чтения Release ReactNativeFlipper.java");
  }
}

console.log("\n🚀 Попытка проверки React Native...");
try {
  const rnVersion = execSync("npx react-native --version", {
    encoding: "utf8",
    timeout: 10000,
  });
  console.log(`  ✅ React Native CLI: ${rnVersion.trim()}`);
} catch (e) {
  console.log(`  ❌ Ошибка React Native CLI: ${e.message}`);
}

console.log("\n☕ Проверяем Java...");
try {
  const javaVersion = execSync("java -version", {
    encoding: "utf8",
    stderr: "pipe",
    timeout: 5000,
  });
  console.log("  ✅ Java установлена");
} catch (e) {
  console.log(`  ❌ Java не найдена: ${e.message}`);
}

console.log("\n🤖 Проверяем ADB...");
try {
  const adbDevices = execSync("adb devices", {
    encoding: "utf8",
    timeout: 5000,
  });
  console.log("  ✅ ADB работает");
  console.log(`  Устройства:\n${adbDevices}`);
} catch (e) {
  console.log(`  ❌ ADB недоступен: ${e.message}`);
}

console.log("\n🔧 Рекомендации:");
if (!nodeModulesExists) {
  console.log("  • Запустите: npm install");
}
if (!gradlewExists) {
  console.log("  • Проверьте Android SDK и React Native настройки");
}
console.log(
  "  • Если проблемы продолжаются, запустите: npx react-native doctor"
);
console.log("  • Для очистки кеша: npx react-native start --reset-cache");

console.log("\n✅ Диагностика завершена!");
