const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  console.log('🔍 Checking database connection...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };

  console.log('Connection config:', {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password ? '***' : '(empty)'
  });

  try {
    // Test connection
    console.log('\n📡 Connecting to MySQL...');
    const connection = await mysql.createConnection(config);
    console.log('✅ MySQL connection successful!\n');

    // Check if database exists
    const dbName = process.env.DB_NAME || 'yourfirstmove';
    console.log(`🔍 Checking if database '${dbName}' exists...`);
    
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [dbName]);
    
    if (databases.length === 0) {
      console.log(`❌ Database '${dbName}' does not exist!`);
      console.log(`\n📝 Creating database '${dbName}'...`);
      await connection.query(`CREATE DATABASE ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log(`✅ Database '${dbName}' created successfully!\n`);
    } else {
      console.log(`✅ Database '${dbName}' already exists!\n`);
    }

    // Check tables
    await connection.changeUser({ database: dbName });
    const [tables] = await connection.query('SHOW TABLES');
    
    console.log(`📊 Current tables in '${dbName}':`);
    if (tables.length === 0) {
      console.log('   (no tables yet - migrations need to be run)\n');
    } else {
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
      console.log('');
    }

    await connection.end();

    console.log('✅ Database setup check complete!\n');
    console.log('📝 Next steps:');
    console.log('   1. Run migrations: npm run migrate:latest');
    console.log('   2. Start the server: npm run dev\n');

  } catch (error) {
    console.error('❌ Database connection failed!\n');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure MySQL is running');
    console.error('   2. Check your .env file has correct credentials');
    console.error('   3. Verify MySQL is listening on port', config.port);
    console.error('   4. Try connecting manually: mysql -u', config.user, '-p\n');
    process.exit(1);
  }
}

setupDatabase();
