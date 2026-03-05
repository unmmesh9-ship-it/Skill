const bcrypt = require('bcryptjs');
const { User } = require('./models');

(async () => {
  try {
    const user = await User.findOne({ 
      where: { email: 'unmmesh9@skillmatrix.com' },
      attributes: { include: ['password'] }
    });
    
    if (user) {
      const testPassword = 'password123';
      console.log('Testing password for:', user.email);
      console.log('Password hash:', user.password.substring(0, 40) + '...');
      
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log('Direct bcrypt compare result:', isValid);
      
      const isValidMethod = await user.comparePassword(testPassword);
      console.log('comparePassword method result:', isValidMethod);
    } else {
      console.log('User not found');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
