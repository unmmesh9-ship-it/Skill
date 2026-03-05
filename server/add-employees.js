/**
 * Add 10 Fixed Employees to Database
 * Run: node add-employees.js
 */

const bcrypt = require('bcryptjs');
const { User } = require('./models');

const employees = [
  { full_name: 'Unmesh', email: 'unmesh@skillmatrix.com' },
  { full_name: 'Ankit', email: 'ankit@skillmatrix.com' },
  { full_name: 'Shivam', email: 'shivam@skillmatrix.com' },
  { full_name: 'Tushar', email: 'tushar@skillmatrix.com' },
  { full_name: 'Akshay', email: 'akshay@skillmatrix.com' },
  { full_name: 'Anant', email: 'anant@skillmatrix.com' },
  { full_name: 'Krishna', email: 'krishna@skillmatrix.com' },
  { full_name: 'Durgesh', email: 'durgesh@skillmatrix.com' },
  { full_name: 'Nilesh', email: 'nilesh@skillmatrix.com' }
];

async function addEmployees() {
  try {
    console.log('👥 Adding 10 employees to database...\n');
    
    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    let added = 0;
    let skipped = 0;

    for (const emp of employees) {
      try {
        // Check if user already exists
        const existing = await User.findOne({ where: { email: emp.email } });
        
        if (existing) {
          console.log(`⏭️  Skipped: ${emp.full_name} (already exists)`);
          skipped++;
          continue;
        }

        // Create new employee
        await User.create({
          full_name: emp.full_name,
          email: emp.email,
          password: hashedPassword,
          role: 'employee',
          profile_completion: 50
        });

        console.log(`✅ Added: ${emp.full_name} (${emp.email})`);
        added++;
      } catch (error) {
        console.error(`❌ Error adding ${emp.full_name}:`, error.message);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Added: ${added}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📧 Default password for all: ${defaultPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addEmployees();
