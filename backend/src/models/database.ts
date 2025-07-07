import 'reflect-metadata';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { User } from './User';
import { Task } from './Task';
import { Category } from './Category';
import path from 'path';

// Load environment variables
dotenv.config();

// Database configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

// Choose database type based on environment
let sequelize: Sequelize;

if (isTest) {
  // Use in-memory SQLite for tests
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    models: [User, Task, Category],
    logging: false,
  });
} else if (process.env.DATABASE_HOST && process.env.DATABASE_NAME) {
  // Use PostgreSQL for production/staging
  sequelize = new Sequelize({
    database: process.env.DATABASE_NAME,
    dialect: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    models: [User, Task, Category],
    logging: isDevelopment ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // Use SQLite for local development
  const dbPath = path.join(__dirname, '../../data/taskgo.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    models: [User, Task, Category],
    logging: isDevelopment ? console.log : false,
  });
}

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

// Initialize database
export const initializeDatabase = async (): Promise<void> => {
  try {
    await testConnection();
    
    // Create data directory for SQLite if needed
    if (sequelize.getDialect() === 'sqlite' && !isTest) {
      const fs = require('fs');
      const dataDir = path.join(__dirname, '../../data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    }
    
    // Sync models with database
    await sequelize.sync({ 
      force: isDevelopment && process.env.DB_FORCE_SYNC === 'true',
      alter: !isDevelopment
    });
    
    console.log(`✅ Database initialized successfully (${sequelize.getDialect()})`);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export { sequelize };
export default sequelize;
