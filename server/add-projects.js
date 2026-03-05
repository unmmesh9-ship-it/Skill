/**
 * Add New Projects to Database
 * Adds Full Stack Project and Python Project with team assignments
 */

const pool = require('./config/database');

async function addNewProjects() {
  try {
    console.log('🚀 Adding new projects to database...\n');

    // Get admin user ID (who created projects)
    const adminResult = await pool.query(
      "SELECT id FROM users WHERE email = 'admin@skillmatrix.com'"
    );
    const adminId = adminResult.rows[0].id;

    // Check if projects already exist
    const existingProjects = await pool.query(
      "SELECT name FROM projects WHERE name IN ('Full Stack Web Application', 'Python Data Analysis Project')"
    );

    if (existingProjects.rows.length > 0) {
      console.log('⚠️  Projects already exist. Skipping insertion.');
      
      // Show all projects
      const allProjects = await pool.query('SELECT id, name, description FROM projects ORDER BY id');
      console.log('\n📋 Current Projects:');
      allProjects.rows.forEach(project => {
        console.log(`   ${project.id}. ${project.name}`);
        console.log(`      ${project.description}\n`);
      });
      
      process.exit(0);
      return;
    }

    // Insert Full Stack Web Application Project
    const fullStackProject = await pool.query(
      `INSERT INTO projects (name, description, created_by) 
       VALUES ($1, $2, $3) 
       RETURNING id, name`,
      [
        'Full Stack Web Application',
        'Modern full-stack web application using React, Node.js, Express, and PostgreSQL with real-time features and RESTful API architecture',
        adminId
      ]
    );
    console.log(`✅ Added: ${fullStackProject.rows[0].name} (ID: ${fullStackProject.rows[0].id})`);

    // Insert Python Data Analysis Project
    const pythonProject = await pool.query(
      `INSERT INTO projects (name, description, created_by) 
       VALUES ($1, $2, $3) 
       RETURNING id, name`,
      [
        'Python Data Analysis Project',
        'Data analysis and visualization project using Python, Pandas, NumPy, and Matplotlib for business intelligence and reporting',
        adminId
      ]
    );
    console.log(`✅ Added: ${pythonProject.rows[0].name} (ID: ${pythonProject.rows[0].id})`);

    // Get employee IDs for project assignments
    const employees = await pool.query(
      "SELECT id, full_name FROM users WHERE role = 'employee' ORDER BY id"
    );

    if (employees.rows.length >= 4) {
      // Assign employees to Full Stack Project
      const fullStackId = fullStackProject.rows[0].id;
      
      // John and Jane on Full Stack Project
      await pool.query(
        `INSERT INTO project_assignments (project_id, user_id) 
         VALUES ($1, $2), ($1, $3)`,
        [
          fullStackId,
          employees.rows[0].id, // John
          employees.rows[1].id  // Jane
        ]
      );
      console.log(`   👥 Assigned: ${employees.rows[0].full_name}`);
      console.log(`   👥 Assigned: ${employees.rows[1].full_name}`);

      // Assign employees to Python Project
      const pythonId = pythonProject.rows[0].id;
      
      // Mike and Sarah on Python Project
      await pool.query(
        `INSERT INTO project_assignments (project_id, user_id) 
         VALUES ($1, $2), ($1, $3)`,
        [
          pythonId,
          employees.rows[2].id, // Mike
          employees.rows[3].id  // Sarah
        ]
      );
      console.log(`   👥 Assigned: ${employees.rows[2].full_name}`);
      console.log(`   👥 Assigned: ${employees.rows[3].full_name}`);
    }

    console.log('\n✨ All projects added successfully!');
    console.log('\n📊 Total Projects in Database:');
    
    const allProjects = await pool.query(
      'SELECT id, name, description FROM projects ORDER BY id'
    );
    
    allProjects.rows.forEach(project => {
      console.log(`\n   ${project.id}. ${project.name}`);
      console.log(`      ${project.description}`);
    });

    console.log('\n🎉 Database updated! Refresh your application to see the new projects.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding projects:', error.message);
    process.exit(1);
  }
}

addNewProjects();
