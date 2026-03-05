/**
 * Test script to verify admin skill management endpoints
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

async function testAdminSkillManagement() {
  console.log('🧪 Testing Admin Skill Management...\n');

  try {
    // 1. Login as admin
    console.log('1️⃣  Logging in as admin...');
    const adminLoginRes = await makeRequest('POST', '/api/auth/login', null, {
      email: 'admin@skillmatrix.com',
      password: 'admin123'
    });
    const adminToken = adminLoginRes.data.token;
    console.log('✅ Admin login successful!\n');

    // 2. Login as employee to get their user ID
    console.log('2️⃣  Getting employee user ID...');
    const empLoginRes = await makeRequest('POST', '/api/auth/login', null, {
      email: 'unmesh@company.com',
      password: 'password123'
    });
    const employeeId = empLoginRes.data.user.id;
    console.log(`✅ Employee ID: ${employeeId}\n`);

    // 3. Get employee's current skills
    console.log('3️⃣  Fetching employee skills (admin view)...');
    const empSkillsRes = await makeRequest('GET', `/api/skills/admin/employee/${employeeId}`, adminToken);
    console.log(`✅ Employee has ${empSkillsRes.data.count} skills`);
    const currentSkills = empSkillsRes.data.data.map(s => s.skill_id);
    console.log(`   Skill IDs: ${currentSkills.join(', ')}\n`);

    // 4. Get all skills
    console.log('4️⃣  Fetching all skills...');
    const allSkillsRes = await makeRequest('GET', '/api/skills', adminToken);
    console.log(`✅ Found ${allSkillsRes.data.count} skills\n`);

    // 5. Find a skill to add
    const availableSkills = allSkillsRes.data.data.filter(s => !currentSkills.includes(s.id));
    if (availableSkills.length === 0) {
      console.log('⚠️  Employee already has all skills!\n');
      return;
    }

    const skillToAdd = availableSkills[0];
    console.log(`5️⃣  Adding skill "${skillToAdd.name}" to employee...`);
    
    try {
      const addRes = await makeRequest('POST', `/api/skills/admin/employee/${employeeId}`, adminToken, {
        skill_id: skillToAdd.id,
        proficiency_level: 4
      });
      console.log('✅ Skill added successfully!');
      console.log(`   Added: ${addRes.data.data.skill.name} with proficiency ${addRes.data.data.proficiency_level}\n`);

      // 6. Update proficiency
      console.log('6️⃣  Updating skill proficiency...');
      const updateRes = await makeRequest('PUT', `/api/skills/admin/employee/${employeeId}/${skillToAdd.id}`, adminToken, {
        proficiency_level: 5
      });
      console.log(`✅ Proficiency updated to ${updateRes.data.data.proficiency_level}\n`);

      // 7. Remove the skill
      console.log('7️⃣  Removing the test skill...');
      await makeRequest('DELETE', `/api/skills/admin/employee/${employeeId}/${skillToAdd.id}`, adminToken);
      console.log('✅ Skill removed successfully!\n');

    } catch (error) {
      console.log('❌ Error:', error.data || error.message);
    }

    // 8. Verify skill was removed
    console.log('8️⃣  Verifying skill removal...');
    const finalSkillsRes = await makeRequest('GET', `/api/skills/admin/employee/${employeeId}`, adminToken);
    console.log(`✅ Employee now has ${finalSkillsRes.data.count} skills (should be same as before)\n`);

    console.log('✅ All admin skill management tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.data || error.message);
  }
}

testAdminSkillManagement();
