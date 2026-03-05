/**
 * User Model
 * Handles database operations for users table
 */

const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Find user by email
   */
  static async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, full_name, email, role, profile_completion, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new user
   */
  static async create(userData) {
    const { full_name, email, password, role = 'employee' } = userData;
    
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await pool.query(
        'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role, profile_completion, created_at',
        [full_name, email, hashedPassword, role]
      );
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all users (for admin)
   */
  static async getAll(filters = {}) {
    try {
      let query = 'SELECT id, full_name, email, role, profile_completion, created_at FROM users';
      const params = [];
      
      if (filters.role) {
        query += ' WHERE role = $1';
        params.push(filters.role);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user
   */
  static async update(id, updateData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      // Dynamically build update query
      Object.keys(updateData).forEach(key => {
        if (key !== 'id' && key !== 'password' && updateData[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(updateData[key]);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, full_name, email, role, profile_completion, created_at`;
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete user
   */
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update profile completion percentage
   */
  static async updateProfileCompletion(id, percentage) {
    try {
      const result = await pool.query(
        'UPDATE users SET profile_completion = $1 WHERE id = $2 RETURNING profile_completion',
        [percentage, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Compare password for login
   */
  static async comparePassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }
}

module.exports = User;
