/**
 * Update Employee Names
 * Updates the names of existing employees in the database
 */

const pool = require('./config/database');

async function updateEmployeeNames() {
  try {
    console.log('👤 Updating employee names...\n');

    // New employee names
    const newNames = ['Unmesh', 'Annant', 'Umandra', 'Ankit', 'Nileshh'];

    // Get all employees ordered by ID
    const employees = await pool.query(
      "SELECT id, full_name, email FROM users WHERE role = 'employee' ORDER BY id"
    );

    console.log(`Found ${employees.rows.length} employees\n`);

    // Update each employee with new name
    for (let i = 0; i < employees.rows.length && i < newNames.length; i++) {
      const employee = employees.rows[i];
      const newName = newNames[i];
      
      // Create email from name
      const newEmail = `${newName.toLowerCase()}@company.com`;
      
      await pool.query(
        'UPDATE users SET full_name = $1, email = $2 WHERE id = $3',
        [newName, newEmail, employee.id]
      );
      
      console.log(`✅ Updated: ${employee.full_name} (${employee.email}) → ${newName} (${newEmail})`);
    }

    // Show final list
    console.log('\n📋 Updated Employee List:');
    console.log('==========================\n');
    
    const updatedEmployees = await pool.query(
      "SELECT id, full_name, email, profile_completion FROM users WHERE role = 'employee' ORDER BY id"
    );
    
    updatedEmployees.rows.forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.full_name}`);
      console.log(`   Email: ${emp.email}`);
      console.log(`   Profile: ${emp.profile_completion}%\n`);
    });

    console.log('✅ All employee names updated successfully!');
    console.log('🔐 Password for all employees: password123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

updateEmployeeNames();
