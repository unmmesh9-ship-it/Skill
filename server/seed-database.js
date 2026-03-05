/**
 * Comprehensive Database Seeder
 * Seeds skills, projects, and creates relationships
 * Run: node seed-database.js
 */

const pool = require('./config/database');

// Skills to add by category
const skillsData = [
  // Frontend
  { name: 'React', category: 'Frontend' },
  { name: 'Vue.js', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'HTML5', category: 'Frontend' },
  { name: 'CSS3', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'JavaScript', category: 'Frontend' },
  { name: 'TypeScript', category: 'Frontend' },
  
  // Backend
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'Python', category: 'Backend' },
  { name: 'Django', category: 'Backend' },
  { name: 'Flask', category: 'Backend' },
  { name: 'Java', category: 'Backend' },
  { name: 'Spring Boot', category: 'Backend' },
  { name: 'PHP', category: 'Backend' },
  
  // Database
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'MySQL', category: 'Database' },
  { name: 'Redis', category: 'Database' },
  { name: 'SQL', category: 'Database' },
  
  // DevOps
  { name: 'Docker', category: 'DevOps' },
  { name: 'Kubernetes', category: 'DevOps' },
  { name: 'Jenkins', category: 'DevOps' },
  { name: 'Git', category: 'DevOps' },
  { name: 'GitHub Actions', category: 'DevOps' },
  { name: 'Linux', category: 'DevOps' },
  
  // Cloud
  { name: 'AWS', category: 'Cloud' },
  { name: 'Azure', category: 'Cloud' },
  { name: 'Google Cloud', category: 'Cloud' },
  { name: 'Heroku', category: 'Cloud' },
  
  // Mobile
  { name: 'React Native', category: 'Mobile' },
  { name: 'Flutter', category: 'Mobile' },
  { name: 'iOS Development', category: 'Mobile' },
  { name: 'Android Development', category: 'Mobile' },
  
  // Testing
  { name: 'Jest', category: 'Testing' },
  { name: 'Pytest', category: 'Testing' },
  { name: 'Selenium', category: 'Testing' },
  { name: 'Cypress', category: 'Testing' },
  
  // Design
  { name: 'Figma', category: 'Design' },
  { name: 'Adobe XD', category: 'Design' },
  { name: 'UI/UX Design', category: 'Design' },
  
  // Management
  { name: 'Agile', category: 'Management' },
  { name: 'Scrum', category: 'Management' },
  { name: 'Jira', category: 'Management' },
];

// Projects to add
const projectsData = [
  {
    name: 'E-Commerce Platform',
    description: 'Full-stack e-commerce platform with payment integration, inventory management, and real-time analytics',
    status: 'Active',
    start_date: '2026-01-15',
    end_date: '2026-06-30'
  },
  {
    name: 'Mobile Banking App',
    description: 'Cross-platform mobile banking application with secure transactions, biometric authentication, and real-time notifications',
    status: 'Active',
    start_date: '2026-02-01',
    end_date: '2026-08-15'
  },
  {
    name: 'AI Chatbot System',
    description: 'Intelligent chatbot system using NLP and machine learning for customer support automation',
    status: 'Active',
    start_date: '2026-01-10',
    end_date: '2026-05-20'
  },
  {
    name: 'Data Analytics Dashboard',
    description: 'Real-time data visualization dashboard for business intelligence and reporting',
    status: 'Completed',
    start_date: '2025-09-01',
    end_date: '2025-12-31'
  },
  {
    name: 'Cloud Migration Project',
    description: 'Migration of legacy systems to AWS cloud infrastructure with microservices architecture',
    status: 'On Hold',
    start_date: '2025-11-01',
    end_date: '2026-04-30'
  },
  {
    name: 'Healthcare Portal',
    description: 'Patient management system with appointment scheduling, EHR integration, and telemedicine features',
    status: 'Active',
    start_date: '2026-02-15',
    end_date: '2026-09-30'
  },
];

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    console.log('🌱 Starting database seeding...\n');

    // Get admin user
    const adminResult = await client.query(
      "SELECT id FROM users WHERE email = 'admin@skillmatrix.com'"
    );
    
    if (adminResult.rows.length === 0) {
      console.log('❌ Admin user not found. Please ensure admin user exists.');
      await client.query('ROLLBACK');
      return;
    }
    
    const adminId = adminResult.rows[0].id;
    console.log('✅ Found admin user (ID: ' + adminId + ')\n');

    // ============ SEED SKILLS ============
    console.log('📚 Seeding Skills...');
    let skillsAdded = 0;
    let skillsSkipped = 0;

    for (const skill of skillsData) {
      const existing = await client.query(
        'SELECT id FROM skills WHERE name = $1',
        [skill.name]
      );

      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO skills (name, category)
           VALUES ($1, $2)`,
          [skill.name, skill.category]
        );
        skillsAdded++;
        console.log(`   ✅ Added: ${skill.name} (${skill.category})`);
      } else {
        skillsSkipped++;
      }
    }

    console.log(`\n📊 Skills Summary: ${skillsAdded} added, ${skillsSkipped} already exist\n`);

    // ============ SEED PROJECTS ============
    console.log('🚀 Seeding Projects...');
    let projectsAdded = 0;
    let projectsSkipped = 0;
    const projectIds = [];

    for (const project of projectsData) {
      const existing = await client.query(
        'SELECT id FROM projects WHERE name = $1',
        [project.name]
      );

      if (existing.rows.length === 0) {
        const result = await client.query(
          `INSERT INTO projects (name, description, status, start_date, end_date, created_by)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [project.name, project.description, project.status, project.start_date, project.end_date, adminId]
        );
        projectIds.push(result.rows[0].id);
        projectsAdded++;
        console.log(`   ✅ Added: ${project.name} (${project.status})`);
      } else {
        projectIds.push(existing.rows[0].id);
        projectsSkipped++;
      }
    }

    console.log(`\n📊 Projects Summary: ${projectsAdded} added, ${projectsSkipped} already exist\n`);

    // ============ ASSIGN SKILLS TO EMPLOYEES ============
    console.log('👥 Assigning Skills to Employees...');
    
    const employees = await client.query(
      "SELECT id, full_name FROM users WHERE role = 'employee' ORDER BY id"
    );

    const allSkills = await client.query('SELECT id, name, category FROM skills');

    if (employees.rows.length > 0 && allSkills.rows.length > 0) {
      let assignmentsAdded = 0;

      for (const employee of employees.rows) {
        // Clear existing skills for this employee
        await client.query('DELETE FROM employee_skills WHERE user_id = $1', [employee.id]);

        // Assign 5-10 random skills
        const numSkills = Math.floor(Math.random() * 6) + 5;
        const shuffledSkills = [...allSkills.rows].sort(() => 0.5 - Math.random());
        const employeeSkills = shuffledSkills.slice(0, numSkills);

        for (const skill of employeeSkills) {
          const proficiency = Math.floor(Math.random() * 5) + 1;
          const experience = Math.floor(Math.random() * 5) + 1;

          await client.query(
            `INSERT INTO employee_skills (user_id, skill_id, proficiency_level)
             VALUES ($1, $2, $3)`,
            [employee.id, skill.id, proficiency]
          );
          assignmentsAdded++;
        }
        console.log(`   👤 ${employee.full_name}: ${numSkills} skills assigned`);
      }

      console.log(`\n📊 Skill Assignments: ${assignmentsAdded} total assignments\n`);

      // ============ ASSIGN EMPLOYEES TO PROJECTS ============
      console.log('🔗 Assigning Employees to Projects...');
      
      let projectAssignmentsAdded = 0;

      for (const projectId of projectIds) {
        // Clear existing assignments for this project
        await client.query('DELETE FROM project_assignments WHERE project_id = $1', [projectId]);

        // Assign 2-4 random employees
        const numEmployees = Math.floor(Math.random() * 3) + 2;
        const shuffledEmployees = [...employees.rows].sort(() => 0.5 - Math.random());
        const projectEmployees = shuffledEmployees.slice(0, numEmployees);

        const roles = ['Developer', 'Lead Developer', 'QA Engineer', 'Project Manager', 'Designer'];

        for (const employee of projectEmployees) {
          await client.query(
            `INSERT INTO project_assignments (user_id, project_id)
             VALUES ($1, $2)`,
            [employee.id, projectId]
          );
          projectAssignmentsAdded++;
        }

        const projectInfo = await client.query(
          'SELECT name FROM projects WHERE id = $1',
          [projectId]
        );
        console.log(`   📋 ${projectInfo.rows[0].name}: ${numEmployees} employees assigned`);
      }

      console.log(`\n📊 Project Assignments: ${projectAssignmentsAdded} total assignments\n`);
    } else {
      console.log('⚠️  No employees or skills found for assignments\n');
    }

    await client.query('COMMIT');
    
    // ============ FINAL STATISTICS ============
    console.log('═══════════════════════════════════════');
    console.log('✅ Database Seeding Complete!\n');
    
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM skills) as total_skills,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(*) FROM employee_skills) as total_skill_assignments,
        (SELECT COUNT(*) FROM project_assignments) as total_project_assignments,
        (SELECT COUNT(*) FROM users WHERE role = 'employee') as total_employees
    `);
    
    const s = stats.rows[0];
    console.log('📊 Database Statistics:');
    console.log(`   Skills: ${s.total_skills}`);
    console.log(`   Projects: ${s.total_projects}`);
    console.log(`   Employees: ${s.total_employees}`);
    console.log(`   Skill Assignments: ${s.total_skill_assignments}`);
    console.log(`   Project Assignments: ${s.total_project_assignments}`);
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    process.exit(0);
  }
}

// Run the seeder
seedDatabase().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
