/**
 * Main Application Component
 * Routes and application structure
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminSkills from './pages/AdminSkills';
import AdminProjects from './pages/AdminProjects';
import AdminSkillRequests from './pages/AdminSkillRequests';

// Employee Pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeSkills from './pages/EmployeeSkills';
import EmployeeProjects from './pages/EmployeeProjects';
import EmployeeProfile from './pages/EmployeeProfile';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSkills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/skill-requests"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSkillRequests />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/skills"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeSkills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/projects"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />

          {/* Default Route - Redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 - Redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
