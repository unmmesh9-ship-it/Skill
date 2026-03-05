/**
 * Test Admin Features
 * Comprehensive test for all admin CRUD operations
 */

const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

// Admin credentials
const ADMIN_EMAIL = 'admin@skillmatrix.com';
const ADMIN_PASSWORD = 'admin123';

let adminToken = '';
let createdProjectId = null;
let createdSkillId = null;
let testUserId = null;

// Helper function to log test results
function logTest(name, status, message) {
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : 'ℹ️';
  console.log(`${icon} ${name}: ${message}`);
}

// 1. Admin Login
async function adminLogin() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    if (response.data.token) {
      adminToken = response.data.token;
      logTest('Admin Login', 'pass', 'Successfully logged in');
      return true;
    }
  } catch (error) {
    logTest('Admin Login', 'fail', error.response?.data?.message || error.message);
    return false;
  }
}

// 2. Test Project CRUD
async function testProjectCRUD() {
  console.log('\n🔷 Testing Project CRUD Operations...\n');
  
  // CREATE Project
  try {
    const response = await axios.post(`${API_URL}/projects`, {
      name: 'Test Admin Project',
      description: 'Testing project creation via admin',
      status: 'Active',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    createdProjectId = response.data.data.id;
    logTest('CREATE Project', 'pass', `Created project ID: ${createdProjectId}`);
  } catch (error) {
    logTest('CREATE Project', 'fail', error.response?.data?.message || error.message);
  }
  
  // READ Projects
  try {
    const response = await axios.get(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    logTest('READ Projects', 'pass', `Retrieved ${response.data.count} projects`);
  } catch (error) {
    logTest('READ Projects', 'fail', error.response?.data?.message || error.message);
  }
  
  // UPDATE Project
  if (createdProjectId) {
    try {
      const response = await axios.put(`${API_URL}/projects/${createdProjectId}`, {
        name: 'Test Admin Project (Updated)',
        description: 'Updated description',
        status: 'Active'
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      logTest('UPDATE Project', 'pass', 'Successfully updated project');
    } catch (error) {
      logTest('UPDATE Project', 'fail', error.response?.data?.message || error.message);
    }
  }
  
  // DELETE Project
  if (createdProjectId) {
    try {
      await axios.delete(`${API_URL}/projects/${createdProjectId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      logTest('DELETE Project', 'pass', 'Successfully deleted project');
      createdProjectId = null;
    } catch (error) {
      logTest('DELETE Project', 'fail', error.response?.data?.message || error.message);
    }
  }
}

// 3. Test Skill CRUD
async function testSkillCRUD() {
  console.log('\n🔷 Testing Skill CRUD Operations...\n');
  
  // CREATE Skill
  try {
    const response = await axios.post(`${API_URL}/skills`, {
      name: 'Test Admin Skill',
      category: 'Testing',
      description: 'Testing skill creation'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    createdSkillId = response.data.data.id;
    logTest('CREATE Skill', 'pass', `Created skill ID: ${createdSkillId}`);
  } catch (error) {
    logTest('CREATE Skill', 'fail', error.response?.data?.message || error.message);
  }
  
  // READ Skills
  try {
    const response = await axios.get(`${API_URL}/skills`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    logTest('READ Skills', 'pass', `Retrieved ${response.data.count} skills`);
  } catch (error) {
    logTest('READ Skills', 'fail', error.response?.data?.message || error.message);
  }
  
  // UPDATE Skill
  if (createdSkillId) {
    try {
      await axios.put(`${API_URL}/skills/${createdSkillId}`, {
        name: 'Test Admin Skill (Updated)',
        category: 'Testing',
        description: 'Updated description'
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      logTest('UPDATE Skill', 'pass', 'Successfully updated skill');
    } catch (error) {
      logTest('UPDATE Skill', 'fail', error.response?.data?.message || error.message);
    }
  }
  
  // DELETE Skill
  if (createdSkillId) {
    try {
      await axios.delete(`${API_URL}/skills/${createdSkillId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      logTest('DELETE Skill', 'pass', 'Successfully deleted skill');
      createdSkillId = null;
    } catch (error) {
      logTest('DELETE Skill', 'fail', error.response?.data?.message || error.message);
    }
  }
}

// 4. Test User CRUD
async function testUserCRUD() {
  console.log('\n🔷 Testing User CRUD Operations...\n');
  
  // CREATE User
  try {
    const response = await axios.post(`${API_URL}/users`, {
      full_name: 'Test Admin User',
      email: `testuser${Date.now()}@skillmatrix.com`,
      password: 'password123',
      role: 'employee'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    testUserId = response.data.data.id;
    logTest('CREATE User', 'pass', `Created user ID: ${testUserId}`);
  } catch (error) {
    logTest('CREATE User', 'fail', error.response?.data?.message || error.message);
  }
  
  // READ Users
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    logTest('READ Users', 'pass', `Retrieved ${response.data.count} users`);
  } catch (error) {
    logTest('READ Users', 'fail', error.response?.data?.message || error.message);
  }
  
  // UPDATE User
  if (testUserId) {
    try {
      await axios.put(`${API_URL}/users/${testUserId}`, {
        full_name: 'Test Admin User (Updated)',
        email: `testuser${Date.now()}@skillmatrix.com`,
        role: 'employee'
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      logTest('UPDATE User', 'pass', 'Successfully updated user');
    } catch (error) {
      logTest('UPDATE User', 'fail', error.response?.data?.message || error.message);
    }
  }
  
  // DELETE User
  if (testUserId) {
    try {
      await axios.delete(`${API_URL}/users/${testUserId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      logTest('DELETE User', 'pass', 'Successfully deleted user');
      testUserId = null;
    } catch (error) {
      logTest('DELETE User', 'fail', error.response?.data?.message || error.message);
    }
  }
}

// 5. Test Employee Skill Management
async function testEmployeeSkillManagement() {
  console.log('\n🔷 Testing Employee Skill Management...\n');
  
  // Get first employee user
  let employeeId = null;
  let skillId = null;
  
  try {
    const usersResponse = await axios.get(`${API_URL}/users?role=employee`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (usersResponse.data.data.length > 0) {
      employeeId = usersResponse.data.data[0].id;
      logTest('Get Employee', 'pass', `Found employee ID: ${employeeId}`);
    }
  } catch (error) {
    logTest('Get Employee', 'fail', error.response?.data?.message || error.message);
    return;
  }
  
  // Get a skill to assign
  try {
    const skillsResponse = await axios.get(`${API_URL}/skills`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (skillsResponse.data.data.length > 0) {
      skillId = skillsResponse.data.data[0].id;
      logTest('Get Skill', 'pass', `Found skill ID: ${skillId}`);
    }
  } catch (error) {
    logTest('Get Skill', 'fail', error.response?.data?.message || error.message);
    return;
  }
  
  // GET Employee Skills
  if (employeeId) {
    try {
      const response = await axios.get(`${API_URL}/skills/admin/employee/${employeeId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      logTest('GET Employee Skills', 'pass', `Employee has ${response.data.count || 0} skills`);
    } catch (error) {
      logTest('GET Employee Skills', 'fail', error.response?.data?.message || error.message);
    }
  }
  
  // ADD Skill to Employee
  if (employeeId && skillId) {
    try {
      await axios.post(`${API_URL}/skills/admin/employee/${employeeId}`, {
        skill_id: skillId,
        proficiency_level: 3
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      logTest('ADD Skill to Employee', 'pass', 'Successfully added skill');
    } catch (error) {
      logTest('ADD Skill to Employee', 'fail', error.response?.data?.message || error.message);
    }
  }
  
  // UPDATE Employee Skill Proficiency
  if (employeeId && skillId) {
    try {
      await axios.put(`${API_URL}/skills/admin/employee/${employeeId}/${skillId}`, {
        proficiency_level: 4
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      logTest('UPDATE Skill Proficiency', 'pass', 'Successfully updated proficiency');
    } catch (error) {
      logTest('UPDATE Skill Proficiency', 'fail', error.response?.data?.message || error.message);
    }
  }
  
  // REMOVE Skill from Employee
  if (employeeId && skillId) {
    try {
      await axios.delete(`${API_URL}/skills/admin/employee/${employeeId}/${skillId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      logTest('REMOVE Skill from Employee', 'pass', 'Successfully removed skill');
    } catch (error) {
      logTest('REMOVE Skill from Employee', 'fail', error.response?.data?.message || error.message);
    }
  }
}

// 6. Test Analytics
async function testAnalytics() {
  console.log('\n🔷 Testing Analytics Endpoints...\n');
  
  // Project Analytics
  try {
    const response = await axios.get(`${API_URL}/projects/analytics/overview`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    logTest('Project Overview', 'pass', 'Retrieved project overview');
  } catch (error) {
    logTest('Project Overview', 'fail', error.response?.data?.message || error.message);
  }
  
  // Skill Analytics
  try {
    const response = await axios.get(`${API_URL}/skills/analytics/top?limit=10`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    logTest('Top Skills', 'pass', `Retrieved top ${response.data.count} skills`);
  } catch (error) {
    logTest('Top Skills', 'fail', error.response?.data?.message || error.message);
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Admin Feature Tests\n');
  console.log('=' .repeat(60));
  
  const loginSuccess = await adminLogin();
  
  if (!loginSuccess) {
    console.log('\n❌ Cannot proceed without admin authentication\n');
    return;
  }
  
  await testProjectCRUD();
  await testSkillCRUD();
  await testUserCRUD();
  await testEmployeeSkillManagement();
  await testAnalytics();
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ All Tests Completed!\n');
}

runTests().catch(console.error);
