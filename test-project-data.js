const http = require('http');

// Test project data
async function testProjectData() {
  try {
    console.log('🔍 Testing Project Data...\n');
    
    // Test getAllProjects
    console.log('1. Testing GET /api/projects');
    const projectsData = await makeRequest('http://localhost:5001/api/projects');
    console.log('   Success:', projectsData.success);
    console.log('   Count:', projectsData.count);
    
    if (projectsData.data && projectsData.data.length > 0) {
      console.log('\n   Sample project:');
      const project = projectsData.data[0];
      console.log('   ID:', project.id);
      console.log('   Name:', project.name);
      console.log('   Description:', project.description);
      console.log('   Status:', project.status);
      console.log('   Team Size:', project.team_size);
      console.log('   Start Date:', project.start_date);
      console.log('   End Date:', project.end_date);
      
      console.log('\n   All projects:');
      projectsData.data.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} - Status: ${p.status}, Team: ${p.team_size}`);
      });
    } else {
      console.log('   ⚠️  No projects found in database!');
    }
    
    // Test getTopProjects
    console.log('\n2. Testing GET /api/projects/analytics/top');
    const topProjectsData = await makeRequest('http://localhost:5001/api/projects/analytics/top?limit=5');
    console.log('   Success:', topProjectsData.success);
    console.log('   Count:', topProjectsData.count);
    
    if (topProjectsData.data && topProjectsData.data.length > 0) {
      console.log('   Top projects:');
      topProjectsData.data.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} - Team: ${p.team_size}`);
      });
    }
    
    console.log('\n✅ Tests completed!');
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

testProjectData();
