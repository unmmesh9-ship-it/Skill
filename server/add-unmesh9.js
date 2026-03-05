/**
 * Add unmmesh9-ship-it user to Database
 * Run: node add-unmesh9.js
 */

const bcrypt = require('bcryptjs');
const { User } = require('./models');

async function addUser() {
  try {
    console.log('👥 Adding unmmesh9-ship-it to database...\n');
    
    const userData = {
      full_name: 'Unmesh Ship',
      email: 'unmmesh9@skillmatrix.com',
      role: 'employee',
      password: 'password123'
    };
    
    // Check if user already exists
    const existing = await User.findOne({ where: { email: userData.email } });
    
    if (existing) {
      console.log(`⚠️  User already exists: ${userData.full_name} (${userData.email})`);
      console.log(`   ID: ${existing.id}`);
      console.log(`   Role: ${existing.role}`);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create new user
    const newUser = await User.create({
      full_name: userData.full_name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      profile_completion: 50
    });

    console.log('✅ User added successfully!\n');
    console.log('📋 User Details:');
    console.log(`   Name: ${newUser.full_name}`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Role: ${newUser.role}`);
    console.log(`   ID: ${newUser.id}`);
    console.log(`   Password: ${userData.password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addUser();
