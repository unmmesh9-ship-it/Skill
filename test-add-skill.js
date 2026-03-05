/**
 * Test script to verify skill addition is working
 */

const http = require('http');

function makeRequest(method, path, token = null, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 400) {
            reject({ status: res.statusCode, data: parsed });
          } else {
            resolve({ status: res.statusCode, data: parsed });
          }
        } catch (e) {
          reject({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAddSkill() {
  console.log('🧪 Testing Add Skill Functionality...\n');

  try {
    // 1. Login as employee
    console.log('1️⃣  Logging in as employee...');
    const loginRes = await makeRequest('POST', '/api/auth/login', null, {
      email: 'unmesh@company.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Login successful!\n');

    // 2. Get available skills
    console.log('2️⃣  Fetching available skills...');
    const skillsRes = await makeRequest('GET', '/api/skills', token);
    console.log(`✅ Found ${skillsRes.data.count} skills\n`);

    // 3. Get current user skills
    console.log('3️⃣  Fetching current user skills...');
    const mySkillsRes = await makeRequest('GET', '/api/skills/employee/my-skills', token);
    const currentSkills = mySkillsRes.data.data.map(s => s.skill_id);
    console.log(`✅ Current skills: ${currentSkills.length} skills\n`);

    // 4. Find a skill to add (one not already owned)
    const availableSkills = skillsRes.data.data.filter(s => !currentSkills.includes(s.id));
    
    if (availableSkills.length === 0) {
      console.log('⚠️  User already has all skills!');
      return;
    }

    const skillToAdd = availableSkills[0];
    console.log(`4️⃣  Attempting to add skill: ${skillToAdd.name} (ID: ${skillToAdd.id})`);

    // 5. Test adding skill WITH proficiency_level
    try {
      const addRes = await makeRequest('POST', '/api/skills/employee/add', token, {
        skill_id: skillToAdd.id,
        proficiency_level: 3
      });
      console.log('✅ Skill added successfully WITH proficiency_level!');
      console.log('📦 Response:', JSON.stringify(addRes.data, null, 2));
      console.log();
    } catch (error) {
      console.log('❌ Failed to add skill WITH proficiency_level');
      console.log('Error:', error.data || error.message);
      console.log();
    }

    // 6. Test adding another skill WITHOUT proficiency_level (should default to 3)
    if (availableSkills.length > 1) {
      const skillToAdd2 = availableSkills[1];
      console.log(`5️⃣  Attempting to add skill WITHOUT proficiency: ${skillToAdd2.name} (ID: ${skillToAdd2.id})`);
      
      try {
        const addRes2 = await makeRequest('POST', '/api/skills/employee/add', token, {
          skill_id: skillToAdd2.id
          // No proficiency_level - should default to 3
        });
        console.log('✅ Skill added successfully WITHOUT proficiency_level (should default to 3)!');
        console.log('📦 Response:', JSON.stringify(addRes2.data, null, 2));
        console.log();
      } catch (error) {
        console.log('❌ Failed to add skill WITHOUT proficiency_level');
        console.log('Error:', error.data || error.message);
        console.log();
      }
    }

    // 7. Test duplicate skill (should fail gracefully)
    console.log(`6️⃣  Testing duplicate skill prevention...`);
    try {
      await makeRequest('POST', '/api/skills/employee/add', token, {
        skill_id: skillToAdd.id,
        proficiency_level: 4
      });
      console.log('❌ Duplicate skill was allowed (should have been prevented!)');
    } catch (error) {
      if (error.status === 400) {
        console.log('✅ Duplicate skill correctly prevented!');
        console.log('📦 Error message:', error.data.error);
      } else {
        console.log('❌ Unexpected error:', error.data || error.message);
      }
    }

    console.log('\n✅ All add skill tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.data || error.message);
  }
}

testAddSkill();
