// Простой тест для проверки основных компонентов
const React = require('react');

console.log('React импортирован успешно');

// Проверяем, что файлы существуют
const fs = require('fs');
const path = require('path');

const files = [
  'App.tsx',
  'SimpleApp.tsx',
  'src/screens/TaskListScreen.tsx',
  'src/screens/CreateTaskScreen.tsx',
  'src/components/TaskCard.tsx'
];

console.log('Проверка файлов:');
files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - найден`);
  } else {
    console.log(`❌ ${file} - не найден`);
  }
});

console.log('Тест завершен');
