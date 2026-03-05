/**
 * Admin Layout Component
 * Sidebar and navigation for admin portal
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/skills', label: 'Skills', icon: '🎯' },
    { path: '/admin/projects', label: 'Projects', icon: '📁' },
    { path: '/admin/skill-requests', label: 'Skill Requests', icon: '📋' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 shadow-2xl text-white transition-all duration-300 flex flex-col group`}
        onMouseEnter={() => !sidebarOpen && setSidebarOpen(true)}
        onMouseLeave={() => sidebarOpen && setSidebarOpen(false)}
      >
        {/* Logo */}
        <div className="p-4 border-b border-blue-700/50 bg-gradient-to-r from-blue-800/30 to-slate-800/30">
          <div className="flex items-center">
            <span className="text-3xl mr-2">🎯</span>
            <div className={sidebarOpen ? '' : 'hidden'}>
              <h1 className="text-xl font-black bg-gradient-to-r from-blue-200 to-slate-200 bg-clip-text text-transparent">
                SkillMatrix Pro
              </h1>
              <p className="text-xs text-blue-300 font-medium">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group/item ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50 font-semibold scale-105'
                      : 'hover:bg-white/10 text-blue-100 hover:text-white hover:scale-105'
                  }`}
                >
                  <span className="text-2xl group-hover/item:scale-110 transition-transform">{item.icon}</span>
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Logout - Hidden until hover/expanded */}
        <div className="border-t border-blue-700/50 bg-gradient-to-r from-blue-800/30 to-slate-800/30">
          <div className={`p-4 ${sidebarOpen ? '' : 'hidden'}`}>
            <div className="mb-3 p-3 bg-white/10 rounded-xl backdrop-blur">
              <p className="text-sm font-bold text-white truncate">{user?.full_name}</p>
              <p className="text-xs text-blue-300 capitalize font-medium">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
            >
              <span className="text-lg">🚪</span>
              <span>Logout</span>
            </button>
          </div>
          {/* Collapsed logout icon */}
          {!sidebarOpen && (
            <button
              onClick={handleLogout}
              className="w-full p-4 hover:bg-white/10 transition-colors flex items-center justify-center text-red-400 hover:text-red-300 hover:scale-110"
              title="Logout"
            >
              <span className="text-2xl">🚪</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-lg px-6 py-4 flex items-center justify-between border-b border-blue-100 dark:border-gray-700 transition-colors duration-300">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-slate-600 bg-clip-text text-transparent mb-1">
              {menuItems.find((item) => isActive(item.path))?.label || 'Admin Portal'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide">Manage and analyze organizational data</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-md"
              style={{ 
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #1a1a2e, #0f3460)'
                  : 'linear-gradient(135deg, #1e40af, #3b82f6)',
                boxShadow: isDarkMode
                  ? '0 4px 12px rgba(15, 52, 96, 0.4)'
                  : '0 4px 12px rgba(59, 130, 246, 0.4)'
              }}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="text-2xl">{isDarkMode ? '☀️' : '🌙'}</span>
            </button>

            <div className="bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-900/30 dark:to-slate-900/30 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm transition-colors duration-300">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide">Welcome</p>
              <p className="font-bold text-blue-700 dark:text-blue-400 text-sm">{user?.full_name}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 dark:bg-gray-900 transition-colors duration-300">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
