const { sequelize } = require('./config/database');

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log(' Database connection: Successful');
    
    const [results] = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as user_count,
        (SELECT COUNT(*) FROM skills) as skill_count,
        (SELECT COUNT(*) FROM projects) as project_count,
        (SELECT COUNT(*) FROM employee_skills) as employee_skill_count,
        (SELECT COUNT(*) FROM project_assignments) as assignment_count
    `);
    
    console.log('\n Database Statistics:');
    console.log(`   Users: ${results[0].user_count}`);
    console.log(`   Skills: ${results[0].skill_count}`);
    console.log(`   Projects: ${results[0].project_count}`);
    console.log(`   Employee Skills: ${results[0].employee_skill_count}`);
    console.log(`   Project Assignments: ${results[0].assignment_count}`);
    
    await sequelize.close();
    console.log('\n All database checks passed!');
    process.exit(0);
  } catch (error) {
    console.error(' Database Error:', error.message);
    process.exit(1);
  }
}

testDatabaseConnection();
