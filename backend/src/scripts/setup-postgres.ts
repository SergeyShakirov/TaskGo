import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

interface DatabaseSetupOptions {
  superUserPassword?: string;
  postgresPath?: string;
}

async function setupPostgreSQLDatabase(options: DatabaseSetupOptions = {}) {
  const { superUserPassword = 'postgres', postgresPath } = options;
  
  // Try to find PostgreSQL installation
  const possiblePaths = [
    'C:\\Program Files\\PostgreSQL\\15\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\14\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\13\\bin\\psql.exe',
    'psql' // If in PATH
  ];

  let psqlPath = postgresPath;
  
  if (!psqlPath) {
    console.log('🔍 Searching for PostgreSQL installation...');
    for (const path of possiblePaths) {
      try {
        await execAsync(`"${path}" --version`);
        psqlPath = path;
        console.log(`✅ Found PostgreSQL at: ${path}`);
        break;
      } catch (error) {
        // Continue searching
      }
    }
  }

  if (!psqlPath) {
    console.error('❌ PostgreSQL not found. Please install PostgreSQL first.');
    console.log('📖 See POSTGRESQL_QUICKSTART.md for installation instructions.');
    return false;
  }

  console.log('🚀 Setting up TaskGo database...');

  const commands = [
    {
      description: 'Creating user taskgo_user',
      command: `"${psqlPath}" -U postgres -c "CREATE USER taskgo_user WITH PASSWORD 'taskgo_dev_password';"`,
    },
    {
      description: 'Creating database taskgo',
      command: `"${psqlPath}" -U postgres -c "CREATE DATABASE taskgo OWNER taskgo_user;"`,
    },
    {
      description: 'Granting privileges',
      command: `"${psqlPath}" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE taskgo TO taskgo_user;"`,
    },
    {
      description: 'Creating UUID extension',
      command: `"${psqlPath}" -U taskgo_user -d taskgo -c "CREATE EXTENSION IF NOT EXISTS \\"uuid-ossp\\";"`,
    },
  ];

  for (const { description, command } of commands) {
    try {
      console.log(`⏳ ${description}...`);
      
      // Set environment variable for password
      const env = { ...process.env, PGPASSWORD: superUserPassword };
      
      await execAsync(command, { env });
      console.log(`✅ ${description} completed`);
    } catch (error: any) {
      if (error.stderr?.includes('already exists')) {
        console.log(`ℹ️  ${description} (already exists)`);
      } else {
        console.error(`❌ ${description} failed:`, error.stderr || error.message);
        return false;
      }
    }
  }

  // Test connection
  try {
    console.log('🧪 Testing database connection...');
    const testCommand = `"${psqlPath}" -h localhost -p 5432 -U taskgo_user -d taskgo -c "SELECT version();"`;
    const env = { ...process.env, PGPASSWORD: 'taskgo_dev_password' };
    
    const { stdout } = await execAsync(testCommand, { env });
    console.log('✅ Database connection successful!');
    console.log('📊 PostgreSQL version:', stdout.split('\n')[2]?.trim());
    
    return true;
  } catch (error: any) {
    console.error('❌ Database connection test failed:', error.stderr || error.message);
    return false;
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const superUserPassword = args.find(arg => arg.startsWith('--password='))?.split('=')[1];
  const postgresPath = args.find(arg => arg.startsWith('--path='))?.split('=')[1];

  console.log('🔧 TaskGo PostgreSQL Database Setup');
  console.log('====================================');
  
  setupPostgreSQLDatabase({ superUserPassword, postgresPath })
    .then((success) => {
      if (success) {
        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n📝 Next steps:');
        console.log('   npm run db:setup   # Initialize database schema');
        console.log('   npm run build      # Compile TypeScript');
        console.log('   npm start          # Start the server');
      } else {
        console.log('\n💡 Manual setup required. See POSTGRESQL_QUICKSTART.md');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

export default setupPostgreSQLDatabase;
