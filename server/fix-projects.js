/**
 * Fix Employee Projects Display
 * Adds status column and updates existing projects
 */

const pool = require('./config/database');

async function fixProjects() {
  try {
    console.log('🔧 Fixing projects table and data...\n');

    // Step 1: Add status column if it doesn't exist
    console.log('1️⃣ Adding status column to projects table...');
    await pool.query(`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active'
    `);
    console.log('   ✅ Status column added\n');

    // Step 2: Add start_date and end_date columns
    console.log('2️⃣ Adding date columns...');
    await pool.query(`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS start_date DATE,
      ADD COLUMN IF NOT EXISTS end_date DATE
    `);
    console.log('   ✅ Date columns added\n');

    // Step 3: Update existing projects with status and dates
    console.log('3️⃣ Updating existing projects...');
    
    const projects = await pool.query('SELECT id, name FROM projects ORDER BY id');
    
    for (let i = 0; i < projects.rows.length; i++) {
      const project = projects.rows[i];
      let status, startDate, endDate;
      
      // Assign different statuses based on project ID
      switch (i % 4) {
        case 0:
          status = 'Active';
          startDate = '2024-01-15';
          endDate = '2024-12-31';
          break;
        case 1:
          status = 'Planning';
          startDate = '2024-03-01';
          endDate = '2024-11-30';
          break;
        case 2:
          status = 'Active';
          startDate = '2024-02-01';
          endDate = '2024-10-31';
          break;
        case 3:
          status = 'Completed';
          startDate = '2023-06-01';
          endDate = '2024-01-31';
          break;
      }
      
      await pool.query(
        `UPDATE projects 
         SET status = $1, start_date = $2, end_date = $3 
         WHERE id = $4`,
        [status, startDate, endDate, project.id]
      );
      
      console.log(`   ✅ Updated: ${project.name} - Status: ${status}`);
    }

    // Step 4: Ensure all employees have at least one project assigned
    console.log('\n4️⃣ Checking employee project assignments...');
    
    const employees = await pool.query(
      "SELECT id, full_name FROM users WHERE role = 'employee' ORDER BY id"
    );
    
    const projectsList = await pool.query('SELECT id FROM projects ORDER BY id');
    
    for (let i = 0; i < employees.rows.length; i++) {
      const employee = employees.rows[i];
      
      // Check if employee has any projects
      const assignedProjects = await pool.query(
        'SELECT COUNT(*) FROM project_assignments WHERE user_id = $1',
        [employee.id]
      );
      
      if (parseInt(assignedProjects.rows[0].count) === 0) {
        // Assign employee to 2-3 random projects
        const numProjects = Math.min(2 + Math.floor(Math.random() * 2), projectsList.rows.length);
        
        for (let j = 0; j < numProjects; j++) {
          const projectIndex = (i + j) % projectsList.rows.length;
          const projectId = projectsList.rows[projectIndex].id;
          
          try {
            await pool.query(
              'INSERT INTO project_assignments (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
              [projectId, employee.id]
            );
            console.log(`   ✅ Assigned ${employee.full_name} to project ID ${projectId}`);
          } catch (err) {
            // Skip if already assigned
          }
        }
      } else {
        console.log(`   ℹ️  ${employee.full_name} already has projects assigned`);
      }
    }

    // Step 5: Show final summary
    console.log('\n📊 Final Summary:');
    console.log('================\n');
    
    const summary = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.status,
        p.start_date,
        p.end_date,
        COUNT(pa.user_id) as team_size
      FROM projects p
      LEFT JOIN project_assignments pa ON p.id = pa.project_id
      GROUP BY p.id, p.name, p.status, p.start_date, p.end_date
      ORDER BY p.id
    `);
    
    summary.rows.forEach(project => {
      console.log(`📁 ${project.name}`);
      console.log(`   Status: ${project.status}`);
      console.log(`   Team Size: ${project.team_size} members`);
      console.log(`   Duration: ${project.start_date} to ${project.end_date}\n`);
    });

    console.log('✅ All fixes applied successfully!');
    console.log('🎉 Employees can now see their projects!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixProjects();
