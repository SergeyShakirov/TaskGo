#!/usr/bin/env ts-node

import 'reflect-metadata';
import { initializeDatabase } from '../models/database';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Task } from '../models/Task';

async function setupLocalDatabase() {
  try {
    console.log('🚀 Setting up local development database...');
    
    // Initialize database
    await initializeDatabase();
    
    // Check if data already exists
    const userCount = await User.count();
    const categoryCount = await Category.count();
    
    if (userCount === 0 && categoryCount === 0) {
      console.log('📊 Database is empty, seeding with initial data...');
      
      // Create categories
      const categories = await Category.bulkCreate([
        {
          name: 'Разработка ПО',
          description: 'Разработка программного обеспечения и приложений',
          icon: 'code',
          sortOrder: 1,
          isActive: true
        },
        {
          name: 'Дизайн',
          description: 'UI/UX дизайн и графический дизайн',
          icon: 'palette',
          sortOrder: 2,
          isActive: true
        },
        {
          name: 'Маркетинг',
          description: 'Интернет-маркетинг и реклама',
          icon: 'megaphone',
          sortOrder: 3,
          isActive: true
        },
        {
          name: 'Копирайтинг',
          description: 'Написание текстов и контента',
          icon: 'edit',
          sortOrder: 4,
          isActive: true
        }
      ]);
      
      console.log(`✅ Created ${categories.length} categories`);
      
      // Create test users
      const users = await User.bulkCreate([
        {
          name: 'Иван Петров',
          email: 'ivan@example.com',
          password: 'password123', // В реальном проекте хэшировать!
          role: 'client',
          isVerified: true
        },
        {
          name: 'Мария Сидорова',
          email: 'maria@example.com',
          password: 'password123',
          role: 'contractor',
          rating: 4.8,
          completedTasks: 15,
          isVerified: true
        }
      ]);
      
      console.log(`✅ Created ${users.length} users`);
      
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
            'Push-уведомления'
          ],
          deliverables: [
            'Исходный код приложения',
            'Документация API'
          ]
        },
        {
          title: 'Дизайн лендинга для стартапа',
          shortDescription: 'Создание современного дизайна посадочной страницы для IT стартапа',
          priority: 'medium',
          status: 'draft',
          estimatedHours: 40,
          estimatedCost: 50000,
          clientId: users[0].id,
          categoryId: categories[1].id
        }
      ]);
      
      console.log(`✅ Created ${tasks.length} sample tasks`);
      
    } else {
      console.log('📊 Database already contains data');
      console.log(`   Users: ${userCount}`);
      console.log(`   Categories: ${categoryCount}`);
    }
    
    console.log('🎉 Local database setup completed!');
    console.log('📍 Database location: backend/data/taskgo.sqlite');
    console.log('🌐 API will be available at: http://localhost:3001/api');
    
  } catch (error) {
    console.error('❌ Failed to setup local database:', error);
    throw error;
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupLocalDatabase()
    .then(() => {
      console.log('\n✅ Setup complete! You can now start the server with: npm run dev');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

export default setupLocalDatabase;
