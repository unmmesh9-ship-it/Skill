-- ====================================================
-- SkillMatrix Pro - Database Schema
-- PostgreSQL Database Schema
-- ====================================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS project_assignments CASCADE;
DROP TABLE IF EXISTS employee_skills CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ====================================================
-- Table: users
-- Stores user accounts (both admin and employees)
-- ====================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'employee')),
    profile_completion INTEGER DEFAULT 0 CHECK (profile_completion >= 0 AND profile_completion <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================
-- Table: skills
-- Master list of all available skills
-- ====================================================
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================
-- Table: employee_skills
-- Junction table linking employees to their skills
-- ====================================================
CREATE TABLE employee_skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level INTEGER NOT NULL CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_id)
);

-- ====================================================
-- Table: projects
-- Stores project information
-- ====================================================
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================
-- Table: project_assignments
-- Junction table linking projects to employees
-- ====================================================
CREATE TABLE project_assignments (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

-- ====================================================
-- Create Indexes for Better Performance
-- ====================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_employee_skills_user_id ON employee_skills(user_id);
CREATE INDEX idx_employee_skills_skill_id ON employee_skills(skill_id);
CREATE INDEX idx_project_assignments_project_id ON project_assignments(project_id);
CREATE INDEX idx_project_assignments_user_id ON project_assignments(user_id);
CREATE INDEX idx_skills_category ON skills(category);

-- ====================================================
-- Insert Sample Data
-- ====================================================

-- Insert default admin user (password: admin123)
INSERT INTO users (full_name, email, password, role, profile_completion) VALUES
('Admin User', 'admin@skillmatrix.com', '$2a$10$rX8LvVqJZK8YqYqJZK8YqO8YqYqJZK8YqYqJZK8YqYqJZK8Yqu', 'admin', 100);

-- Insert sample employees (password: password123 for all)
INSERT INTO users (full_name, email, password, role, profile_completion) VALUES
('John Doe', 'john@company.com', '$2a$10$rX8LvVqJZK8YqYqJZK8YqO8YqYqJZK8YqYqJZK8YqYqJZK8Yqu', 'employee', 75),
('Jane Smith', 'jane@company.com', '$2a$10$rX8LvVqJZK8YqYqJZK8YqO8YqYqJZK8YqYqJZK8YqYqJZK8Yqu', 'employee', 60),
('Mike Johnson', 'mike@company.com', '$2a$10$rX8LvVqJZK8YqYqJZK8YqO8YqYqJZK8YqYqJZK8YqYqJZK8Yqu', 'employee', 85),
('Sarah Williams', 'sarah@company.com', '$2a$10$rX8LvVqJZK8YqYqJZK8YqO8YqYqJZK8YqYqJZK8YqYqJZK8Yqu', 'employee', 90);

-- Insert sample skills
INSERT INTO skills (name, category) VALUES
('JavaScript', 'Programming'),
('Python', 'Programming'),
('Java', 'Programming'),
('React', 'Frontend'),
('Angular', 'Frontend'),
('Vue.js', 'Frontend'),
('Node.js', 'Backend'),
('Express.js', 'Backend'),
('Django', 'Backend'),
('PostgreSQL', 'Database'),
('MongoDB', 'Database'),
('MySQL', 'Database'),
('AWS', 'Cloud'),
('Azure', 'Cloud'),
('Docker', 'DevOps'),
('Kubernetes', 'DevOps'),
('Git', 'Version Control'),
('Agile', 'Methodology'),
('Scrum', 'Methodology'),
('REST API', 'API Design');

-- Insert sample employee skills
INSERT INTO employee_skills (user_id, skill_id, proficiency_level) VALUES
(2, 1, 5), (2, 4, 4), (2, 7, 4), (2, 10, 3),
(3, 2, 5), (3, 9, 4), (3, 10, 5), (3, 13, 3),
(4, 1, 4), (4, 3, 4), (4, 7, 5), (4, 15, 4),
(5, 1, 5), (5, 4, 5), (5, 7, 4), (5, 10, 4), (5, 15, 3);

-- Insert sample projects
INSERT INTO projects (name, description, created_by) VALUES
('E-Commerce Platform', 'Full-stack e-commerce solution with payment integration', 1),
('Mobile Banking App', 'Secure mobile banking application for iOS and Android', 1),
('AI Analytics Dashboard', 'Real-time analytics dashboard with ML insights', 1),
('Healthcare Portal', 'Patient management and appointment scheduling system', 1);

-- Insert sample project assignments
INSERT INTO project_assignments (project_id, user_id) VALUES
(1, 2), (1, 4),
(2, 3), (2, 5),
(3, 2), (3, 5),
(4, 4);

-- ====================================================
-- End of Schema
-- ====================================================
