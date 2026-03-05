const pool = require('./config/database');

async function testDatabaseConnection() {
  try {
    // Test connection
    const client = await pool.connect();
    console.log(' Database connection: Successful');
    
    // Get table counts
    const result = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as user_count,
        (SELECT COUNT(*) FROM skills) as skill_count,
        (SELECT COUNT(*) FROM projects) as project_count,
        (SELECT COUNT(*) FROM employee_skills) as employee_skill_count,
        (SELECT COUNT(*) FROM project_assignments) as assignment_count
    `);
    
    console.log('\n Database Statistics:');
    console.log(`   Users: ${result.rows[0].user_count}`);
    console.log(`   Skills: ${result.rows[0].skill_count}`);
    console.log(`   Projects: ${result.rows[0].project_count}`);
    console.log(`   Employee Skills: ${result.rows[0].employee_skill_count}`);
    console.log(`   Project Assignments: ${result.rows[0].assignment_count}`);
    
    client.release();
    await pool.end();
    
    console.log('\n All database checks passed!');
    process.exit(0);
  } catch (error) {
    console.error(' Database Error:', error.message);
    process.exit(1);
  }
}

testDatabaseConnection();
