/**
 * Database Migration: Add Missing Columns
 * Adds columns that the models expect but are missing from the schema
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'skillmatrix_db',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database migration...\n');
    
    // Add status, start_date, end_date to projects table
    console.log('📊 Adding columns to projects table...');
    
    await client.query(`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'Active',
      ADD COLUMN IF NOT EXISTS start_date DATE,
      ADD COLUMN IF NOT EXISTS end_date DATE;
    `);
    
    console.log('✅ Added: status, start_date, end_date to projects');
    
    // Update existing projects to have 'Active' status
    await client.query(`
      UPDATE projects 
      SET status = 'Active' 
      WHERE status IS NULL OR status = '';
    `);
    
    console.log('✅ Updated existing projects with default status\n');
    
    console.log('🎉 Migration completed successfully!\n');
    console.log('Database schema is now synchronized with the models.');
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
