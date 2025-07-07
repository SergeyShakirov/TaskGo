import 'reflect-metadata';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';

dotenv.config();

console.log('🔍 Testing PostgreSQL connection...');
console.log('Database config:', {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD ? '***' : 'not set'
});

async function testPostgresConnection() {
  try {
    const sequelize = new Sequelize({
      database: process.env.DATABASE_NAME!,
      dialect: 'postgres',
      host: process.env.DATABASE_HOST!,
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER!,
      password: process.env.DATABASE_PASSWORD!,
      logging: console.log,
    });

    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection successful!');
    
    // Test basic query
    const [results] = await sequelize.query('SELECT version();');
    console.log('PostgreSQL version:', results);
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
  }
}

testPostgresConnection();
