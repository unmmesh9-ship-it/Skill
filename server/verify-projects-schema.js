const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'skillmatrix_db',
  user: 'postgres',
  password: 'Unmesh@27'
});

async function verifySchema() {
  try {
    await client.connect();
    console.log('✅ Connected\n');

    // Check projects table
    const projectsSchema = await client.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'projects' ORDER BY ordinal_position"
    );
    console.log('📊 PROJECTS table columns:');
    projectsSchema.rows.forEach(r => console.log(`  - ${r.column_name} (${r.data_type})`));

    // Check project_assignments table
    const assignmentsSchema = await client.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'project_assignments' ORDER BY ordinal_position"
    );
    console.log('\n📊 PROJECT_ASSIGNMENTS table columns:');
    assignmentsSchema.rows.forEach(r => console.log(`  - ${r.column_name} (${r.data_type})`));

    // Check sample data
    const projectsCount = await client.query('SELECT COUNT(*) FROM projects');
    console.log(`\n📈 Total projects: ${projectsCount.rows[0].count}`);

    const sampleProjects = await client.query('SELECT id, name, status FROM projects LIMIT 3');
    console.log('\nSample projects:');
    sampleProjects.rows.forEach(p => console.log(`  ${p.id}: ${p.name} (${p.status})`));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

verifySchema();
