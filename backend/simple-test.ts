// Simple test for database initialization
console.log('🔍 Starting simple database test...');

import 'reflect-metadata';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_HOST:', process.env.DATABASE_HOST);

import { Sequelize } from 'sequelize-typescript';
import path from 'path';

// Try to create a simple database connection
const dbPath = path.join(__dirname, 'data/test.sqlite');
console.log('Database path:', dbPath);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log,
});

async function testSimpleConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Simple database connection successful!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testSimpleConnection();
