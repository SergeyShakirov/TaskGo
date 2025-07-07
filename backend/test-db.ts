import 'reflect-metadata';
import { initializeDatabase, testConnection } from './src/models/database';

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    await testConnection();
    console.log('✅ Connection test passed');
    
    console.log('🚀 Testing database initialization...');
    await initializeDatabase();
    console.log('✅ Database initialization passed');
    
    console.log('🎉 All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testDatabase();
