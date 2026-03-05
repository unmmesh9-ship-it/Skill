/**
 * Skill Model
 * Handles database operations for skills and employee_skills tables
 */

const pool = require('../config/database');

class Skill {
  /**
   * Get all skills
   */
  static async getAll() {
    try {
      const result = await pool.query(
        'SELECT * FROM skills ORDER BY category, name'
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get skill by ID
   */
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM skills WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new skill
   */
  static async create(skillData) {
    const { name, category } = skillData;
    
    try {
      const result = await pool.query(
        'INSERT INTO skills (name, category) VALUES ($1, $2) RETURNING *',
        [name, category]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update skill
   */
  static async update(id, skillData) {
    const { name, category } = skillData;
    
    try {
      const result = await pool.query(
        'UPDATE skills SET name = $1, category = $2 WHERE id = $3 RETURNING *',
        [name, category, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete skill
   */
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM skills WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get employee skills
   */
  static async getEmployeeSkills(userId) {
    try {
      const result = await pool.query(
        `SELECT es.id, es.skill_id, s.name, s.category, es.proficiency_level, es.created_at, es.updated_at
         FROM employee_skills es
         JOIN skills s ON es.skill_id = s.id
         WHERE es.user_id = $1
         ORDER BY es.proficiency_level DESC, s.name`,
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add skill to employee
   */
  static async addEmployeeSkill(userId, skillId, proficiencyLevel) {
    try {
      const result = await pool.query(
        'INSERT INTO employee_skills (user_id, skill_id, proficiency_level) VALUES ($1, $2, $3) RETURNING *',
        [userId, skillId, proficiencyLevel]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update employee skill proficiency
   */
  static async updateEmployeeSkill(id, proficiencyLevel) {
    try {
      const result = await pool.query(
        'UPDATE employee_skills SET proficiency_level = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [proficiencyLevel, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete employee skill
   */
  static async deleteEmployeeSkill(id) {
    try {
      const result = await pool.query(
        'DELETE FROM employee_skills WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get top skills across all employees
   */
  static async getTopSkills(limit = 20) {
    try {
      const result = await pool.query(
        `SELECT s.id, s.name, s.category, 
                COUNT(es.id)::INTEGER as employee_count,
                AVG(es.proficiency_level)::numeric(10,2) as avg_proficiency
         FROM skills s
         LEFT JOIN employee_skills es ON s.id = es.skill_id
         GROUP BY s.id, s.name, s.category
         ORDER BY employee_count DESC, avg_proficiency DESC
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get skill distribution by category
   */
  static async getSkillDistribution() {
    try {
      const result = await pool.query(
        `SELECT s.category, COUNT(DISTINCT es.user_id)::INTEGER as employee_count
         FROM skills s
         LEFT JOIN employee_skills es ON s.id = es.skill_id
         GROUP BY s.category
         ORDER BY employee_count DESC`
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Skill;
