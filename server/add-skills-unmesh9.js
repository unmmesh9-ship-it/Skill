const { User, Skill, EmployeeSkill } = require('./models');

async function addSkillsToUnmesh9() {
  try {
    console.log('🎯 Adding sample skills to unmmesh9@skillmatrix.com...\n');
    
    // Find user
    const user = await User.findOne({ where: { email: 'unmmesh9@skillmatrix.com' } });
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    // Get some existing skills or create them
    const skillsToAdd = [
      { name: 'JavaScript', category: 'Programming', proficiency: 4 },
      { name: 'React', category: 'Frontend', proficiency: 4 },
      { name: 'Node.js', category: 'Backend', proficiency: 3 },
      { name: 'PostgreSQL', category: 'Database', proficiency: 3 },
      { name: 'Git', category: 'Tools', proficiency: 4 }
    ];
    
    for (const skillData of skillsToAdd) {
      // Find or create skill
      let skill = await Skill.findOne({ where: { name: skillData.name } });
      
      if (!skill) {
        skill = await Skill.create({
          name: skillData.name,
          category: skillData.category
        });
        console.log(`✅ Created skill: ${skillData.name}`);
      }
      
      // Add to employee if not already added
      const existing = await EmployeeSkill.findOne({
        where: { user_id: user.id, skill_id: skill.id }
      });
      
      if (!existing) {
        await EmployeeSkill.create({
          user_id: user.id,
          skill_id: skill.id,
          proficiency_level: skillData.proficiency
        });
        console.log(`✅ Added ${skillData.name} (Proficiency: ${skillData.proficiency}/5)`);
      } else {
        console.log(`⏭️  ${skillData.name} already exists`);
      }
    }
    
    console.log('\n✅ Successfully added skills to user!');
    console.log('💡 Refresh the Employee Profile or Skills page to see them.');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

addSkillsToUnmesh9();
