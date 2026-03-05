const http = require('http');

function makeRequest(path, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function makePostRequest(path, body) {
  return new Promise((resolve, reject) => {
    const bodyString = JSON.stringify(body);
    
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyString)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.write(bodyString);
    req.end();
  });
}

async function testCharts() {
  console.log('\n🧪 Testing Chart Data APIs...\n');

  try {
    // 1. Login as admin
    console.log('1️⃣  Logging in as admin...');
    const loginRes = await makePostRequest('/api/auth/login', {
      email: 'admin@skillmatrix.com',
      password: 'admin123'
    });

    if (!loginRes.token) {
      console.error('❌ Login failed:', loginRes);
      return;
    }
    console.log('✅ Admin login successful!');

    // 2. Test skill distribution endpoint
    console.log('\n2️⃣  Testing skill distribution endpoint...');
    const distRes = await makeRequest('/api/skills/analytics/distribution', loginRes.token);
    
    if (distRes.success) {
      console.log('✅ Skill distribution API working!');
      console.log('📊 Distribution data:', JSON.stringify(distRes.data, null, 2));
      
      if (distRes.data && distRes.data.length > 0) {
        console.log('\n✅ Data structure correct!');
        console.log('   Sample:', distRes.data[0]);
        
        // Check if it has employee_count
        if (distRes.data[0].employee_count !== undefined) {
          console.log('   ✅ employee_count field present');
        } else {
          console.log('   ⚠️  employee_count field missing!');
        }
      } else {
        console.log('\n⚠️  No distribution data returned (might be empty database)');
      }
    } else {
      console.error('❌ API Error:', distRes);
    }

    // 3. Test top skills endpoint
    console.log('\n3️⃣  Testing top skills endpoint...');
    const topSkillsRes = await makeRequest('/api/skills/analytics/top?limit=10', loginRes.token);
    
    if (topSkillsRes.success) {
      console.log('✅ Top skills API working!');
      console.log('📊 Found', topSkillsRes.count, 'skills');
      if (topSkillsRes.data && topSkillsRes.data.length > 0) {
        console.log('   Sample:', topSkillsRes.data[0]);
      }
    } else {
      console.error('❌ API Error:', topSkillsRes);
    }

    console.log('\n✅ All chart API tests completed!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  } finally {
    process.exit();
  }
}

// Wait 2 seconds for server to be ready
setTimeout(testCharts, 2000);
