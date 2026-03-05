const pool = require('./config/database');

async function checkSchema() {
  try {
    console.log('Checking database schema...\n');
    
    const tables = ['users', 'skills', 'projects', 'employee_skills', 'project_assignments'];
    
    for (const table of tables) {
      const result = await pool.query(
        `SELECT column_name, data_type 
         FROM information_schema.columns 
         WHERE table_name = $1 
         ORDER BY ordinal_position`,
        [table]
      );
      
      console.log(`\n${table.toUpperCase()} table columns:`);
      result.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkSchema();
