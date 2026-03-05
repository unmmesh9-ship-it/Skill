const { sequelize } = require('./models');

async function checkUsersTable() {
  try {
    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n👤 Users Table Columns:');
    console.table(results);
    
    const [sample] = await sequelize.query(`SELECT * FROM users LIMIT 1;`);
    console.log('\n📝 Sample User:');
    console.log(sample[0]);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit();
  }
}

checkUsersTable();
