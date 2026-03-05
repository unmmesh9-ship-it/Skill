const http = require('http');

// Test user API
async function testUserAPI() {
  try {
    console.log('🔍 Testing User API...\n');
    
    console.log('Testing GET /api/users');
    const usersData = await makeRequest('http://localhost:5001/api/users');
    console.log('Status: 200');
    console.log('Success:', usersData.success);
    console.log('Count:', usersData.count);
    
    if (usersData.data && usersData.data.length > 0) {
      console.log('\nFirst user sample:');
      const user = usersData.data[0];
      console.log('  Name:', user.full_name);
      console.log('  Email:', user.email);
      console.log('  Role:', user.role);
      console.log('  Projects field exists:', !!user.projects);
      console.log('  Projects count:', user.projects?.length || 0);
      
      if (user.projects && user.projects.length > 0) {
        console.log('  First project:', {
          id: user.projects[0].id,
          name: user.projects[0].name,
          status: user.projects[0].status
        });
      }
      
      console.log('\nAll users projects summary:');
      usersData.data.forEach(u => {
        console.log(`  ${u.full_name} (${u.role}): ${u.projects?.length || 0} projects`);
      });
    }
    
    console.log('\n✅ Test completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

testUserAPI();
