const { sequelize } = require('./models');

async function checkTable() {
  try {
    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'skill_requests' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Skill Requests Table Columns:');
    console.table(results);
    
    const [count] = await sequelize.query(`SELECT COUNT(*) as count FROM skill_requests;`);
    console.log('\n📊 Total Requests:', count[0].count);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit();
  }
}

checkTable();
