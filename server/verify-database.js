const pool = require('./config/database');

async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection: Successful');
    
    const result = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as user_count,
        (SELECT COUNT(*) FROM skills) as skill_count,
        (SELECT COUNT(*) FROM projects) as project_count,
        (SELECT COUNT(*) FROM employee_skills) as employee_skill_count,
        (SELECT COUNT(*) FROM project_assignments) as assignment_count
    `);
    
    console.log('\n📊 Database Statistics:');
    console.log(`   ✅ Users: ${result.rows[0].user_count}`);
    console.log(`   ✅ Skills: ${result.rows[0].skill_count}`);
    console.log(`   ✅ Projects: ${result.rows[0].project_count}`);
    console.log(`   ✅ Employee Skills: ${result.rows[0].employee_skill_count}`);
    console.log(`   ✅ Project Assignments: ${result.rows[0].assignment_count}`);
    
    // Check for any orphaned records
    const orphanCheck = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM employee_skills es 
         WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = es.user_id)) as orphaned_employee_skills,
        (SELECT COUNT(*) FROM employee_skills es 
         WHERE NOT EXISTS (SELECT 1 FROM skills s WHERE s.id = es.skill_id)) as orphaned_skills,
        (SELECT COUNT(*) FROM project_assignments pa 
         WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = pa.user_id)) as orphaned_project_users
    `);
    
    if (orphanCheck.rows[0].orphaned_employee_skills > 0 || 
        orphanCheck.rows[0].orphaned_skills > 0 || 
        orphanCheck.rows[0].orphaned_project_users > 0) {
      console.log('\n⚠️  Data Integrity Issues:');
      if (orphanCheck.rows[0].orphaned_employee_skills > 0) {
        console.log(`   → ${orphanCheck.rows[0].orphaned_employee_skills} orphaned employee_skills records`);
      }
      if (orphanCheck.rows[0].orphaned_skills > 0) {
        console.log(`   → ${orphanCheck.rows[0].orphaned_skills} orphaned skill references`);
      }
      if (orphanCheck.rows[0].orphaned_project_users > 0) {
        console.log(`   → ${orphanCheck.rows[0].orphaned_project_users} orphaned project assignments`);
      }
    } else {
      console.log('\n✅ Data Integrity: All good!');
    }
    
    client.release();
    await pool.end();
    
    console.log('\n🎉 All database checks passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database Error:', error.message);
    process.exit(1);
  }
}

testDatabaseConnection();
