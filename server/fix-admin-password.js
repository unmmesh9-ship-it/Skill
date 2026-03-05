const { User } = require('./models');

async function fixAdminPassword() {
  try {
    console.log('🔧 Fixing admin password...\n');
    
    const admin = await User.findOne({ where: { email: 'admin@skillmatrix.com' } });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }
    
    // Update password - the beforeUpdate hook will hash it correctly
    admin.password = 'password123';
    await admin.save();
    
    console.log('✅ Admin password updated successfully!');
    console.log('   Email: admin@skillmatrix.com');
    console.log('   Password: password123');
    
    // Test the password
    const isValid = await admin.comparePassword('password123');
    console.log('\n✅ Password verification:', isValid ? 'SUCCESS' : 'FAILED');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fixAdminPassword();
