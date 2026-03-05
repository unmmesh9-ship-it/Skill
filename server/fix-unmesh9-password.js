const { User } = require('./models');

(async () => {
  try {
    console.log('🔧 Fixing password for unmmesh9@skillmatrix.com...\n');
    
    const user = await User.findOne({ 
      where: { email: 'unmmesh9@skillmatrix.com' }
    });
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    // Update password - the beforeUpdate hook will hash it correctly
    user.password = 'password123';
    await user.save();
    
    console.log('✅ Password updated successfully!');
    console.log('   Email: unmmesh9@skillmatrix.com');
    console.log('   Password: password123');
    
    // Test the password
    const isValid = await user.comparePassword('password123');
    console.log('\n✅ Password verification:', isValid ? 'SUCCESS' : 'FAILED');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
