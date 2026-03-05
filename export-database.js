/**
 * Simple Database Exporter
 * Exports all data to a simple, readable SQL file
 * No external tools needed - pure Node.js
 */

const { Pool } = require('pg');
const fs = require('fs');

// Direct database connection
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Unmesh@27',
  database: 'skillmatrix_db'
});

async function exportDatabase() {
  console.log('🗄️  Simple Database Exporter\n');
  console.log('================================\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const filename = `skillmatrix_export_${timestamp}.sql`;
  
  let sqlContent = `-- ============================================
-- Skill Matrix Database Export
-- Date: ${new Date().toLocaleString()}
-- Database: skillmatrix_db
-- ============================================

-- Clean existing data (optional - uncomment to use)
-- TRUNCATE TABLE skill_requests, employee_skills, skills, project_assignments, projects, users RESTART IDENTITY CASCADE;

`;

  try {
    // 1. Export Users
    console.log('📋 Exporting users...');
    const usersResult = await pool.query('SELECT * FROM users ORDER BY id');
    sqlContent += `\n-- ============================================\n-- USERS (${usersResult.rows.length} records)\n-- ============================================\n\n`;
    
    for (const user of usersResult.rows) {
      sqlContent += `INSERT INTO users (id, full_name, email, password, role, profile_completion, created_at, updated_at) VALUES\n`;
      sqlContent += `  (${user.id}, '${user.full_name.replace(/'/g, "''")}', '${user.email}', '${user.password}', '${user.role}', ${user.profile_completion}, '${user.created_at.toISOString()}', '${user.updated_at.toISOString()}');\n`;
    }

    // 2. Export Skills
    console.log('📋 Exporting skills...');
    const skillsResult = await pool.query('SELECT * FROM skills ORDER BY id');
    sqlContent += `\n-- ============================================\n-- SKILLS (${skillsResult.rows.length} records)\n-- ============================================\n\n`;
    
    for (const skill of skillsResult.rows) {
      sqlContent += `INSERT INTO skills (id, name, category, created_at, updated_at) VALUES\n`;
      sqlContent += `  (${skill.id}, '${skill.name.replace(/'/g, "''")}', '${skill.category.replace(/'/g, "''")}', '${skill.created_at.toISOString()}', '${skill.updated_at ? "'" + skill.updated_at.toISOString() + "'" : 'NULL'});\n`;
    }

    // 3. Export Employee Skills
    console.log('📋 Exporting employee skills...');
    const empSkillsResult = await pool.query('SELECT * FROM employee_skills ORDER BY id');
    sqlContent += `\n-- ============================================\n-- EMPLOYEE SKILLS (${empSkillsResult.rows.length} records)\n-- ============================================\n\n`;
    
    for (const es of empSkillsResult.rows) {
      sqlContent += `INSERT INTO employee_skills (id, user_id, skill_id, proficiency_level, created_at, updated_at) VALUES\n`;
      sqlContent += `  (${es.id}, ${es.user_id}, ${es.skill_id}, ${es.proficiency_level}, '${es.created_at.toISOString()}', ${es.updated_at ? "'" + es.updated_at.toISOString() + "'" : 'NULL'});\n`;
    }

    // 4. Export Projects
    console.log('📋 Exporting projects...');
    const projectsResult = await pool.query('SELECT * FROM projects ORDER BY id');
    sqlContent += `\n-- ============================================\n-- PROJECTS (${projectsResult.rows.length} records)\n-- ============================================\n\n`;
    
    for (const project of projectsResult.rows) {
      const desc = project.description ? project.description.replace(/'/g, "''") : '';
      sqlContent += `INSERT INTO projects (id, name, description, status, start_date, end_date, created_at, updated_at) VALUES\n`;
      sqlContent += `  (${project.id}, '${project.name.replace(/'/g, "''")}', '${desc}', '${project.status}', '${project.start_date}', ${project.end_date ? "'" + project.end_date + "'" : 'NULL'}, '${project.created_at.toISOString()}', '${project.updated_at.toISOString()}');\n`;
    }

    // 5. Export Project Assignments
    console.log('📋 Exporting project assignments...');
    const assignmentsResult = await pool.query('SELECT * FROM project_assignments ORDER BY id');
    sqlContent += `\n-- ============================================\n-- PROJECT ASSIGNMENTS (${assignmentsResult.rows.length} records)\n-- ============================================\n\n`;
    
    for (const assignment of assignmentsResult.rows) {
      sqlContent += `INSERT INTO project_assignments (id, user_id, project_id, assigned_at) VALUES\n`;
      sqlContent += `  (${assignment.id}, ${assignment.user_id}, ${assignment.project_id}, '${assignment.assigned_at.toISOString()}');\n`;
    }

    // 6. Export Skill Requests
    console.log('📋 Exporting skill requests...');
    const requestsResult = await pool.query('SELECT * FROM skill_requests ORDER BY id');
    sqlContent += `\n-- ============================================\n-- SKILL REQUESTS (${requestsResult.rows.length} records)\n-- ============================================\n\n`;
    
    for (const request of requestsResult.rows) {
      const msg = request.request_message ? request.request_message.replace(/'/g, "''") : '';
      const response = request.admin_response ? request.admin_response.replace(/'/g, "''") : null;
      sqlContent += `INSERT INTO skill_requests (id, user_id, skill_id, proficiency_level, status, request_message, admin_response, reviewed_by, reviewed_at, created_at, updated_at) VALUES\n`;
      sqlContent += `  (${request.id}, ${request.user_id}, ${request.skill_id}, ${request.proficiency_level}, '${request.status}', '${msg}', ${response ? "'" + response + "'" : 'NULL'}, ${request.reviewed_by || 'NULL'}, ${request.reviewed_at ? "'" + request.reviewed_at.toISOString() + "'" : 'NULL'}, '${request.created_at.toISOString()}', '${request.updated_at.toISOString()}');\n`;
    }

    // Add sequence resets
    sqlContent += `\n-- ============================================\n-- RESET SEQUENCES\n-- ============================================\n\n`;
    sqlContent += `-- Reset all ID sequences to continue from current max\n`;
    sqlContent += `SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));\n`;
    sqlContent += `SELECT setval('skills_id_seq', (SELECT MAX(id) FROM skills));\n`;
    sqlContent += `SELECT setval('employee_skills_id_seq', (SELECT MAX(id) FROM employee_skills));\n`;
    sqlContent += `SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));\n`;
    sqlContent += `SELECT setval('project_assignments_id_seq', (SELECT MAX(id) FROM project_assignments));\n`;
    sqlContent += `SELECT setval('skill_requests_id_seq', (SELECT MAX(id) FROM skill_requests));\n`;

    // Write to file
    fs.writeFileSync(filename, sqlContent);
    
    const stats = fs.statSync(filename);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    
    console.log('\n✅ Export completed successfully!\n');
    console.log(`📄 File: ${filename}`);
    console.log(`📊 Size: ${fileSizeKB} KB\n`);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📖 How to use this export:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('1️⃣  View the file:');
    console.log(`   notepad ${filename}`);
    console.log('');
    console.log('2️⃣  Import to same database:');
    console.log(`   psql -U postgres -d skillmatrix_db -f ${filename}`);
    console.log('');
    console.log('3️⃣  Import to new database:');
    console.log(`   createdb -U postgres new_database`);
    console.log(`   psql -U postgres -d new_database -f ${filename}`);
    console.log('');
    console.log('✨ Export is ready to use!\n');

  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run export
exportDatabase();
