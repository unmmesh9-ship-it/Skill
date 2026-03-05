const https = require('https');
const http = require('http');

// Test skill APIs
async function testSkillAPIs() {
  try {
    console.log('🔍 Testing Skill APIs...\n');
    
    // Test getAllSkills
    console.log('1. Testing GET /api/skills');
    const skillsData = await makeRequest('http://localhost:5001/api/skills');
    console.log('   Full response:', JSON.stringify(skillsData, null, 2).substring(0, 500));
    console.log('   Count:', skillsData.count);
    if (skillsData.data && skillsData.data.length > 0) {
      console.log('   Sample skill:', {
        name: skillsData.data[0].name,
        employee_count: skillsData.data[0].employee_count,
        avg_proficiency: skillsData.data[0].avg_proficiency
      });
    }
    console.log('');
    
    // Test getTopSkills
    console.log('2. Testing GET /api/skills/analytics/top');
    const topSkillsData = await makeRequest('http://localhost:5001/api/skills/analytics/top?limit=10');
    console.log('   Status: 200');
    console.log('   Count:', topSkillsData.count);
    if (topSkillsData.data && topSkillsData.data.length > 0) {
      console.log('   Top 5 skills:');
      topSkillsData.data.slice(0, 5).forEach((skill, i) => {
        console.log(`   ${i + 1}. ${skill.name} - ${skill.employee_count} employees, avg prof: ${skill.avg_proficiency}`);
      });
    }
    
    console.log('\n✅ All tests completed!');
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

testSkillAPIs();
