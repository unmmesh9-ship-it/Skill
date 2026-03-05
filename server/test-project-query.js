const pool = require('./config/database');

async function testProjectQuery() {
  try {
    console.log('🔍 Testing Project Query...\n');
    
    // Test the SQL query directly
    const result = await pool.query(`
      SELECT 
        p.id, 
        p.name, 
        p.description,
        p.status, 
        p.start_date,
        p.end_date,
        p.created_at,
        COUNT(pa.user_id) as team_size 
      FROM projects p 
      LEFT JOIN project_assignments pa ON p.id = pa.project_id 
      GROUP BY p.id 
      ORDER BY p.created_at DESC
    `);
    
    console.log(`Found ${result.rows.length} projects:\n`);
    
    result.rows.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Status: ${p.status}`);
      console.log(`   Team Size: ${p.team_size}`);
      console.log(`   Description: ${p.description?.substring(0, 50)}...`);
      console.log('');
    });
    
    // Check project assignments
    const assignmentsResult = await pool.query('SELECT COUNT(*) FROM project_assignments');
    console.log(`Total project assignments: ${assignmentsResult.rows[0].count}`);
    
    // Check which users are assigned
    const usersWithProjects = await pool.query(`
      SELECT u.full_name, COUNT(pa.project_id) as project_count
      FROM users u
      LEFT JOIN project_assignments pa ON u.id = pa.user_id
      WHERE u.role = 'employee'
      GROUP BY u.id, u.full_name
      ORDER BY project_count DESC
    `);
    
    console.log('\nEmployees and their project counts:');
    usersWithProjects.rows.forEach(u => {
      console.log(`  ${u.full_name}: ${u.project_count} projects`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testProjectQuery();
