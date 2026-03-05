const axios = require('axios');

async function testSkillRequests() {
  try {
    console.log('\n🧪 Testing Skill Request API...\n');

    // 1. Login as employee to get token
    console.log('1️⃣  Logging in as employee...');
    const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'unmesh@company.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Login successful!');

    // 2. Get available skills
    console.log('\n2️⃣  Fetching available skills...');
    const skillsRes = await axios.get('http://localhost:5001/api/skills', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Found ${skillsRes.data.data.length} skills`);

    // 3. Get my current skill requests
    console.log('\n3️⃣  Fetching my skill requests...');
    const requestsRes = await axios.get('http://localhost:5001/api/skill-requests/my-requests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ You have ${requestsRes.data.data.length} skill requests`);
    
    if (requestsRes.data.data.length > 0) {
      console.log('\n📋 Your Requests:');
      requestsRes.data.data.forEach(req => {
        console.log(`   - ${req.skill.name} (${req.status}) - Proficiency: ${req.proficiency_level}`);
        if (req.reviewer && req.reviewer.full_name) {
          console.log(`     Reviewed by: ${req.reviewer.full_name}`);
        }
      });
    }

    // 4. Test admin login and get pending requests
    console.log('\n4️⃣  Logging in as admin...');
    const adminLoginRes = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'admin@skillmatrix.com',
      password: 'admin123'
    });
    
    const adminToken = adminLoginRes.data.token;
    console.log('✅ Admin login successful!');

    console.log('\n5️⃣  Fetching pending skill requests (Admin)...');
    const pendingRes = await axios.get('http://localhost:5001/api/skill-requests/pending', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ ${pendingRes.data.data.length} pending requests found`);
    
    if (pendingRes.data.data.length > 0) {
      console.log('\n📋 Pending Requests:');
      pendingRes.data.data.forEach(req => {
        console.log(`   - ${req.user.full_name} requested ${req.skill.name}`);
        console.log(`     Proficiency: ${req.proficiency_level}, Status: ${req.status}`);
      });
    }

    console.log('\n✅ All API tests passed! Skill request system is working correctly.\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.error('Error details:', error.response?.data);
  } finally {
    process.exit();
  }
}

testSkillRequests();
