/**
 * Update user passwords with proper bcrypt hashes
 * Run this once to fix password hashes in the database
 */

const bcrypt = require('bcryptjs');
const pool = require('./config/database');

async function updatePasswords() {
  try {
    console.log('🔐 Updating user passwords...\n');

    // Hash the passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const employeePassword = await bcrypt.hash('password123', 10);

    // Update admin user
    await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [adminPassword, 'admin@skillmatrix.com']
    );
    console.log('✅ Admin password updated (admin123)');

    // Update employee users
    const employees = ['john@company.com', 'jane@company.com', 'mike@company.com', 'sarah@company.com'];
    
    for (const email of employees) {
      await pool.query(
        'UPDATE users SET password = $1 WHERE email = $2',
        [employeePassword, email]
      );
      console.log(`✅ ${email} password updated (password123)`);
    }

    console.log('\n✨ All passwords updated successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@skillmatrix.com / admin123');
    console.log('Employees: [name]@company.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating passwords:', error.message);
    process.exit(1);
  }
}

updatePasswords();
