/**
 * Employee Layout Component
 * Sidebar and navigation for employee portal
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const EmployeeLayout = ({ children }) => {
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
    { path: '/employee/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/employee/skills', label: 'My Skills', icon: '🎯' },
    { path: '/employee/projects', label: 'My Projects', icon: '📁' },
    { path: '/employee/profile', label: 'Profile', icon: '👤' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Professional Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } text-white transition-all duration-300 flex flex-col group relative overflow-hidden`}
        style={{ background: 'linear-gradient(180deg, #1e293b 0%, #334155 40%, #475569 100%)', boxShadow: '4px 0 24px rgba(0, 0, 0, 0.12)' }}
        onMouseEnter={() => !sidebarOpen && setSidebarOpen(true)}
        onMouseLeave={() => sidebarOpen && setSidebarOpen(false)}
      >
        {/* Subtle animated accents */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: '#3b82f6' }}></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl animate-pulse animation-delay-2000" style={{ backgroundColor: '#10b981' }}></div>
        </div>
        {/* Professional Logo Section */}
        <div className="p-5 border-b relative z-10" style={{ borderColor: 'rgba(59, 130, 246, 0.2)', background: 'rgba(255, 255, 255, 0.03)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.2))', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
              <span className="text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.4))' }}>🎯</span>
            </div>
            <div className={sidebarOpen ? '' : 'hidden'}>
              <h1 className="text-xl font-black" style={{ 
                background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '0.02em'
              }}>
                SkillMatrix Pro
              </h1>
              <p className="text-xs font-semibold opacity-70" style={{ color: '#60a5fa' }}>EMPLOYEE PORTAL</p>
            </div>
          </div>
        </div>

        {/* Professional Navigation */}
        <nav className="flex-1 p-4 relative z-10">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group/item ${
                    isActive(item.path)
                      ? 'text-white font-semibold shadow-lg'
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                  style={isActive(item.path) 
                    ? { 
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4), 0 2px 8px rgba(37, 99, 235, 0.3)',
                      }
                    : { 
                        color: 'rgba(255, 255, 255, 0.65)'
                      }
                  }
                >
                  <span className="text-2xl group-hover/item:scale-110 transition-transform">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="font-medium text-sm tracking-wide">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Professional User Section */}
        <div className="border-t relative z-10" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div className={`p-4 ${sidebarOpen ? '' : 'hidden'}`}>
            <div className="mb-3 p-3.5 rounded-xl border" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(59, 130, 246, 0.2)',
              backdropFilter: 'blur(8px)'
            }}>
              <p className="text-sm font-bold text-white truncate">{user?.full_name}</p>
              <p className="text-xs capitalize font-medium mt-0.5 opacity-70" style={{ color: '#60a5fa' }}>{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
            >
              <span className="text-base">🚪</span>
              <span>Logout</span>
            </button>
          </div>
          {/* Collapsed professional logout */}
          {!sidebarOpen && (
            <button
              onClick={handleLogout}
              className="w-full p-4 hover:bg-white/5 transition-all flex items-center justify-center"
              style={{ color: 'rgba(239, 68, 68, 0.9)' }}
              title="Logout"
            >
              <span className="text-2xl">🚪</span>
            </button>
          )}
        </div>
      </aside>

      {/* Professional Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Professional Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm px-8 py-5 flex items-center justify-between border-b transition-colors duration-300" style={{ borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(59, 130, 246, 0.15)' }}>
          <div>
            <h2 className="text-2xl font-black mb-1" style={{ 
              background: 'linear-gradient(135deg, #1e40af, #3b82f6, #2563eb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.01em'
            }}>
              {menuItems.find((item) => isActive(item.path))?.label || 'Employee Portal'}
            </h2>
            <p className="text-xs font-semibold tracking-wide uppercase opacity-60" style={{ color: '#3b82f6' }}>Your Professional Workspace</p>
          </div>

          <div className="flex items-center gap-4">
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

            <div className="px-5 py-2.5 rounded-xl border shadow-sm" style={{ 
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
              borderColor: 'rgba(59, 130, 246, 0.2)'
            }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#3b82f6' }}>Welcome Back</p>
              <p className="font-black text-sm" style={{ color: '#1e40af' }}>{user?.full_name}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 dark:bg-gray-900 transition-colors duration-300">{children}</main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
