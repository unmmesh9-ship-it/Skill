/**
 * Demo Server with Mock Data
 * No database required - for UI visualization
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Mock Data
const mockUsers = [
  { id: 1, full_name: 'Admin User', email: 'admin@skillmatrix.com', role: 'admin', profile_completion: 100 },
  { id: 2, full_name: 'John Doe', email: 'john@company.com', role: 'employee', profile_completion: 75 },
  { id: 3, full_name: 'Jane Smith', email: 'jane@company.com', role: 'employee', profile_completion: 60 },
];

// Current logged in user (changes on login)
let currentUser = mockUsers[1]; // Default to employee user

// Mock Auth Middleware - Always pass
app.use((req, res, next) => {
  req.user = currentUser;
  next();
});

const mockSkills = [
  { id: 1, name: 'JavaScript', category: 'Programming' },
  { id: 2, name: 'Python', category: 'Programming' },
  { id: 3, name: 'React', category: 'Frontend' },
  { id: 4, name: 'Node.js', category: 'Backend' },
  { id: 5, name: 'PostgreSQL', category: 'Database' },
  { id: 6, name: 'AWS', category: 'Cloud' },
  { id: 7, name: 'Docker', category: 'DevOps' },
  { id: 8, name: 'Git', category: 'Version Control' },
];

const mockTopSkills = [
  { id: 1, name: 'JavaScript', category: 'Programming', employee_count: 10, avg_proficiency: '4.20' },
  { id: 2, name: 'Python', category: 'Programming', employee_count: 8, avg_proficiency: '4.50' },
  { id: 3, name: 'React', category: 'Frontend', employee_count: 9, avg_proficiency: '4.10' },
  { id: 4, name: 'Node.js', category: 'Backend', employee_count: 7, avg_proficiency: '4.30' },
  { id: 5, name: 'PostgreSQL', category: 'Database', employee_count: 6, avg_proficiency: '3.80' },
  { id: 6, name: 'AWS', category: 'Cloud', employee_count: 5, avg_proficiency: '3.60' },
  { id: 7, name: 'Docker', category: 'DevOps', employee_count: 6, avg_proficiency: '3.90' },
  { id: 8, name: 'Git', category: 'Version Control', employee_count: 12, avg_proficiency: '4.50' },
  { id: 9, name: 'Angular', category: 'Frontend', employee_count: 4, avg_proficiency: '3.50' },
  { id: 10, name: 'Vue.js', category: 'Frontend', employee_count: 3, avg_proficiency: '3.70' },
];

const mockProjects = [
  { id: 1, name: 'E-Commerce Platform', description: 'Full-stack e-commerce solution', creator_name: 'Admin User', team_size: 3 },
  { id: 2, name: 'Mobile Banking App', description: 'Secure mobile banking', creator_name: 'Admin User', team_size: 4 },
  { id: 3, name: 'AI Analytics Dashboard', description: 'Real-time analytics', creator_name: 'Admin User', team_size: 2 },
  { id: 4, name: 'Healthcare Portal', description: 'Patient management system', creator_name: 'Admin User', team_size: 1 },
];

const mockEmployeeSkills = [
  { id: 1, skill_id: 1, name: 'JavaScript', category: 'Programming', proficiency_level: 5 },
  { id: 2, skill_id: 3, name: 'React', category: 'Frontend', proficiency_level: 4 },
  { id: 3, skill_id: 4, name: 'Node.js', category: 'Backend', proficiency_level: 4 },
  { id: 4, skill_id: 5, name: 'PostgreSQL', category: 'Database', proficiency_level: 3 },
];

const mockEmployeeProjects = [
  { id: 1, name: 'E-Commerce Platform', description: 'Full-stack e-commerce solution', creator_name: 'Admin User', assigned_at: '2026-02-01' },
  { id: 2, name: 'AI Analytics Dashboard', description: 'Real-time analytics', creator_name: 'Admin User', assigned_at: '2026-01-15' },
];

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = mockUsers.find(u => u.email === email);
  
  if (user) {
    currentUser = user; // Set the current logged in user
    res.json({
      success: true,
      token: 'mock-jwt-token',
      user: user
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: currentUser // Return current logged in user
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// User Routes
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    count: mockUsers.length,
    data: mockUsers
  });
});

// Skill Routes
app.get('/api/skills', (req, res) => {
  res.json({
    success: true,
    count: mockSkills.length,
    data: mockSkills
  });
});

app.get('/api/skills/analytics/top', (req, res) => {
  res.json({
    success: true,
    count: mockTopSkills.length,
    data: mockTopSkills
  });
});

app.get('/api/skills/analytics/distribution', (req, res) => {
  const distribution = [
    { category: 'Programming', employee_count: 18 },
    { category: 'Frontend', employee_count: 16 },
    { category: 'Backend', employee_count: 14 },
    { category: 'Database', employee_count: 12 },
    { category: 'Cloud', employee_count: 10 },
    { category: 'DevOps', employee_count: 8 },
  ];
  
  res.json({
    success: true,
    data: distribution
  });
});

app.get('/api/skills/employee/my-skills', (req, res) => {
  // Return different skills based on current user
  const skills = currentUser.role === 'employee' ? mockEmployeeSkills : [];
  res.json({
    success: true,
    count: skills.length,
    data: skills
  });
});

app.post('/api/skills/employee/add', (req, res) => {
  const { skill_id, proficiency_level } = req.body;
  const skill = mockSkills.find(s => s.id === skill_id);
  
  if (skill) {
    const newSkill = {
      id: mockEmployeeSkills.length + 1,
      skill_id: skill_id,
      name: skill.name,
      category: skill.category,
      proficiency_level: proficiency_level
    };
    mockEmployeeSkills.push(newSkill);
    res.json({
      success: true,
      message: 'Skill added successfully',
      data: newSkill
    });
  } else {
    res.status(404).json({ success: false, message: 'Skill not found' });
  }
});

app.put('/api/skills/employee/:id', (req, res) => {
  const { proficiency_level } = req.body;
  const skill = mockEmployeeSkills.find(s => s.id === parseInt(req.params.id));
  
  if (skill) {
    skill.proficiency_level = proficiency_level;
    res.json({
      success: true,
      message: 'Skill updated successfully',
      data: skill
    });
  } else {
    res.status(404).json({ success: false, message: 'Skill not found' });
  }
});

app.delete('/api/skills/employee/:id', (req, res) => {
  const index = mockEmployeeSkills.findIndex(s => s.id === parseInt(req.params.id));
  
  if (index !== -1) {
    mockEmployeeSkills.splice(index, 1);
    res.json({
      success: true,
      message: 'Skill removed successfully'
    });
  } else {
    res.status(404).json({ success: false, message: 'Skill not found' });
  }
});

// Project Routes
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    count: mockProjects.length,
    data: mockProjects
  });
});

app.get('/api/projects/analytics/top', (req, res) => {
  res.json({
    success: true,
    count: mockProjects.length,
    data: mockProjects
  });
});

app.get('/api/projects/my-projects', (req, res) => {
  res.json({
    success: true,
    count: mockEmployeeProjects.length,
    data: mockEmployeeProjects
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Demo Server Running - No Database Required'
  });
});

// Start Server
const PORT = 5001;
app.listen(PORT, () => {
  console.log('===========================================');
  console.log('🎯 DEMO MODE - No Database Required!');
  console.log('===========================================');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📊 Using mock data for visualization');
  console.log('🔓 Any password works for login');
  console.log('===========================================');
});
