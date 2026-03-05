/**
 * Project Model
 * Handles database operations for projects and project_assignments tables
 */

const pool = require('../config/database');

class Project {
  /**
   * Get all projects
   */
  static async getAll() {
    try {
      const result = await pool.query(
        `SELECT p.id as project_id, 
                p.name as project_name, 
                p.description,
                p.status,
                p.start_date,
                p.end_date,
                p.created_at,
                p.updated_at,
                u.full_name as creator_name,
                (SELECT COUNT(*)::INTEGER FROM project_assignments WHERE project_id = p.id) as team_size
         FROM projects p
         LEFT JOIN users u ON p.created_by = u.id
         ORDER BY p.created_at DESC`
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get project by ID
   */
  static async findById(id) {
    try {
      const result = await pool.query(
        `SELECT p.id as project_id, 
                p.name as project_name, 
                p.description,
                p.status,
                p.start_date,
                p.end_date,
                p.created_at,
                p.updated_at,
                u.full_name as creator_name,
                (SELECT COUNT(*)::INTEGER FROM project_assignments WHERE project_id = p.id) as team_size
         FROM projects p
         LEFT JOIN users u ON p.created_by = u.id
         WHERE p.id = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new project
   */
  static async create(projectData) {
    const { name, description, created_by } = projectData;
    
    try {
      const result = await pool.query(
        'INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
        [name, description, created_by]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update project
   */
  static async update(id, projectData) {
    const { name, description } = projectData;
    
    try {
      const result = await pool.query(
        'UPDATE projects SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [name, description, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete project
   */
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM projects WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get projects assigned to a user
   */
  static async getUserProjects(userId) {
    try {
      const result = await pool.query(
        `SELECT p.id as project_id, 
                p.name as project_name, 
                p.description,
                p.status,
                p.start_date,
                p.end_date,
                p.created_at,
                u.full_name as creator_name, 
                pa.assigned_at,
                (SELECT COUNT(*)::INTEGER FROM project_assignments WHERE project_id = p.id) as team_size
         FROM projects p
         JOIN project_assignments pa ON p.id = pa.project_id
         LEFT JOIN users u ON p.created_by = u.id
         WHERE pa.user_id = $1
         ORDER BY pa.assigned_at DESC`,
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get team members for a project
   */
  static async getProjectTeam(projectId) {
    try {
      const result = await pool.query(
        `SELECT u.id, u.full_name, u.email, u.profile_completion, pa.assigned_at
         FROM users u
         JOIN project_assignments pa ON u.id = pa.user_id
         WHERE pa.project_id = $1
         ORDER BY pa.assigned_at`,
        [projectId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Assign user to project
   */
  static async assignUser(projectId, userId) {
    try {
      const result = await pool.query(
        'INSERT INTO project_assignments (project_id, user_id) VALUES ($1, $2) RETURNING *',
        [projectId, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove user from project
   */
  static async removeUser(projectId, userId) {
    try {
      const result = await pool.query(
        'DELETE FROM project_assignments WHERE project_id = $1 AND user_id = $2 RETURNING id',
        [projectId, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get top projects by team size
   */
  static async getTopProjects(limit = 10) {
    try {
      const result = await pool.query(
        `SELECT p.id as project_id, 
                p.name as project_name, 
                p.description,
                p.status,
                p.start_date,
                p.end_date,
                COUNT(pa.id)::INTEGER as team_size
         FROM projects p
         LEFT JOIN project_assignments pa ON p.id = pa.project_id
         GROUP BY p.id, p.name, p.description, p.status, p.start_date, p.end_date
         ORDER BY team_size DESC, p.created_at DESC
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Project;
