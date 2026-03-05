const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'skillmatrix_db',
  user: 'postgres',
  password: 'Unmesh@27'
});

async function testDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check skills
    const skillsCount = await client.query('SELECT COUNT(*) FROM skills');
    console.log('Total skills:', skillsCount.rows[0].count);

    const skills = await client.query('SELECT id, name, category FROM skills LIMIT 10');
    console.log('\nSample skills:');
    skills.rows.forEach(s => console.log(`  ${s.id}: ${s.name} (${s.category})`));

    // Check employee_skills
    const empSkillsCount = await client.query('SELECT COUNT(*) FROM employee_skills');
    console.log('\nTotal employee_skills:', empSkillsCount.rows[0].count);

    const empSkills = await client.query('SELECT es.id, es.user_id, s.name, es.proficiency_level FROM employee_skills es JOIN skills s ON es.skill_id = s.id LIMIT 5');
    console.log('\nSample employee_skills:');
    empSkills.rows.forEach(es => console.log(`  User ${es.user_id}: ${es.name} (Level ${es.proficiency_level})`));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

testDatabase();
