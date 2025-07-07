import 'reflect-metadata';
import { initializeDatabase } from '../models/database';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Task } from '../models/Task';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Initialize database
    await initializeDatabase();

    // Create categories
    const categories = await Category.bulkCreate([
      {
        name: 'Разработка ПО',
        description: 'Разработка программного обеспечения и приложений',
        icon: 'code',
        sortOrder: 1
      },
      {
        name: 'Дизайн',
        description: 'UI/UX дизайн и графический дизайн',
        icon: 'palette',
        sortOrder: 2
      },
      {
        name: 'Маркетинг',
        description: 'Интернет-маркетинг и реклама',
        icon: 'megaphone',
        sortOrder: 3
      },
      {
        name: 'Копирайтинг',
        description: 'Написание текстов и контента',
        icon: 'edit',
        sortOrder: 4
      },
      {
        name: 'Видео/Фото',
        description: 'Видеопроизводство и фотография',
        icon: 'camera',
        sortOrder: 5
      }
    ]);

    console.log('✅ Categories created:', categories.length);

    // Create users
    const users = await User.bulkCreate([
      {
        name: 'Иван Петров',
        email: 'ivan@example.com',
        password: 'hashedpassword123', // В реальном проекте хэшировать!
        role: 'client',
        isVerified: true
      },
      {
        name: 'Мария Сидорова',
        email: 'maria@example.com',
        password: 'hashedpassword123',
        role: 'contractor',
        rating: 4.8,
        completedTasks: 15,
        isVerified: true
      },
      {
        name: 'Алексей Волков',
        email: 'alex@example.com',
        password: 'hashedpassword123',
        role: 'contractor',
        rating: 4.5,
        completedTasks: 8,
        isVerified: true
      }
    ]);

    console.log('✅ Users created:', users.length);

    // Create sample tasks
    const tasks = await Task.bulkCreate([
      {
        title: 'Разработка мобильного приложения',
        shortDescription: 'Создание приложения для заказа еды с функциями регистрации, каталога, корзины и оплаты',
        priority: 'high',
        status: 'pending',
        estimatedHours: 120,
        estimatedCost: 150000,
        clientId: users[0].id,
        categoryId: categories[0].id,
        requirements: [
          'Поддержка iOS и Android',
          'Интеграция с платежными системами',
          'Push-уведомления',
          'Геолокация'
        ],
        deliverables: [
          'Исходный код приложения',
          'Документация API',
          'Инструкция по установке'
        ]
      },
      {
        title: 'Дизайн лендинга для стартапа',
        shortDescription: 'Создание современного дизайна посадочной страницы для IT стартапа',
        priority: 'medium',
        status: 'in_progress',
        estimatedHours: 40,
        estimatedCost: 50000,
        clientId: users[0].id,
        contractorId: users[1].id,
        categoryId: categories[1].id,
        requirements: [
          'Адаптивный дизайн',
          'Современный стиль',
          'Call-to-action элементы'
        ],
        deliverables: [
          'Макеты в Figma',
          'Готовая HTML/CSS верстка'
        ]
      },
      {
        title: 'Написание контента для блога',
        shortDescription: 'Создание 10 статей для корпоративного блога в сфере финтех',
        priority: 'low',
        status: 'completed',
        estimatedHours: 20,
        estimatedCost: 25000,
        actualHours: 18,
        actualCost: 22500,
        clientId: users[0].id,
        contractorId: users[2].id,
        categoryId: categories[3].id
      }
    ]);

    console.log('✅ Tasks created:', tasks.length);
    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Database seeded successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to seed database:', error);
      process.exit(1);
    });
}

export default seedDatabase;
