import 'reflect-metadata';
import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createDatabase() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    user: 'postgres', // Connect as superuser first
    password: 'postgres123', // Default postgres password
    database: 'postgres', // Connect to default database
  });

  try {
    await client.connect();
    console.log('🔌 Connected to PostgreSQL as superuser');

    // Create database
    await client.query(`CREATE DATABASE ${process.env.DATABASE_NAME}`);
    console.log(`✅ Database '${process.env.DATABASE_NAME}' created successfully`);

    // Create user
    await client.query(`CREATE USER ${process.env.DATABASE_USER} WITH PASSWORD '${process.env.DATABASE_PASSWORD}'`);
    console.log(`✅ User '${process.env.DATABASE_USER}' created successfully`);

    // Grant privileges
    await client.query(`GRANT ALL PRIVILEGES ON DATABASE ${process.env.DATABASE_NAME} TO ${process.env.DATABASE_USER}`);
    console.log(`✅ Privileges granted to '${process.env.DATABASE_USER}'`);

  } catch (error: any) {
    if (error.code === '42P04') {
      console.log(`ℹ️ Database '${process.env.DATABASE_NAME}' already exists`);
    } else if (error.code === '42710') {
      console.log(`ℹ️ User '${process.env.DATABASE_USER}' already exists`);
    } else {
      console.error('❌ Error creating database:', error.message);
    }
  } finally {
    await client.end();
  }
}

createDatabase().catch(console.error);
