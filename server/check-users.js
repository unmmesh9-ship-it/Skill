const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'skillmatrix_db',
  user: 'postgres',
  password: 'Unmesh@27'
});

async function checkUsers() {
  try {
    await client.connect();
    
    const users = await client.query('SELECT id, full_name, email, role FROM users ORDER BY id');
    console.log('📋 All users in database:\n');
    users.rows.forEach(u => {
      console.log(`  ID: ${u.id}`);
      console.log(`  Name: ${u.full_name}`);
      console.log(`  Email: ${u.email}`);
      console.log(`  Role: ${u.role}`);
      console.log('  ---');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkUsers();
