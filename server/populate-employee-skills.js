/**
 * Populate Employee Skills
 * Assigns skills to employees with proficiency levels
 */

const pool = require('./config/database');

const populateEmployeeSkills = async () => {
  try {
    console.log('🔄 Populating employee skills...');

    // Get all users and skills
    const usersResult = await pool.query("SELECT id FROM users WHERE role = 'employee'");
    const skillsResult = await pool.query('SELECT id, name, category FROM skills');
    
    const users = usersResult.rows;
    const skills = skillsResult.rows;

    console.log(`Found ${users.length} employees and ${skills.length} skills`);

    // Clear existing employee skills
    await pool.query('DELETE FROM employee_skills');
    console.log('✅ Cleared existing employee skills');

    let insertCount = 0;

    // Assign random skills to each employee
    for (const user of users) {
      // Each employee gets 3-8 random skills
      const numSkills = Math.floor(Math.random() * 6) + 3;
      const shuffledSkills = [...skills].sort(() => 0.5 - Math.random());
      const userSkills = shuffledSkills.slice(0, numSkills);

      for (const skill of userSkills) {
        // Random proficiency level between 1 and 5
        const proficiencyLevel = Math.floor(Math.random() * 5) + 1;

        await pool.query(
          `INSERT INTO employee_skills (user_id, skill_id, proficiency_level, created_at, updated_at)
           VALUES ($1, $2, $3, NOW(), NOW())`,
          [user.id, skill.id, proficiencyLevel]
        );
        insertCount++;
      }
    }

    console.log(`✅ Successfully added ${insertCount} employee-skill relationships`);

    // Show distribution
    const distribution = await pool.query(`
      SELECT s.category, COUNT(DISTINCT es.user_id) as employee_count
      FROM skills s
      LEFT JOIN employee_skills es ON s.id = es.skill_id
      GROUP BY s.category
      ORDER BY employee_count DESC
    `);

    console.log('\n📊 Skill Distribution by Category:');
    distribution.rows.forEach(row => {
      console.log(`   ${row.category}: ${row.employee_count} employees`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating employee skills:', error);
    process.exit(1);
  }
};

populateEmployeeSkills();
