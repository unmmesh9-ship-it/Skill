/**
 * Login Page
 * User authentication page
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);
      
      // Redirect based on user role
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-colors duration-500">
      {/* Animated Background with enhanced effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-40 dark:opacity-30 animate-blob bg-pink-400 dark:bg-pink-600"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-40 dark:opacity-30 animate-blob animation-delay-2000 bg-cyan-400 dark:bg-cyan-600"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-40 dark:opacity-30 animate-blob animation-delay-4000 bg-purple-400 dark:bg-purple-600"></div>
      </div>
      
      <div className="max-w-md w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-gray-200 dark:border-white/20 relative z-10 card-3d transition-colors duration-300">
        {/* Header with enhanced styling */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 rounded-2xl shadow-lg animate-glow bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 dark:from-pink-500 dark:via-purple-500 dark:to-cyan-500">
              <span className="text-5xl animate-float">🎯</span>
            </div>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 dark:from-pink-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent animate-shimmer mb-2">SkillMatrix Pro</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 font-medium">Employee Skill & Project Analytics Platform</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-center text-gray-600 dark:text-purple-200 text-sm -mt-2">Sign in to continue to your dashboard</p>

          {error && (
            <div className="bg-red-500/90 backdrop-blur border-l-4 border-red-300 text-white px-4 py-3 rounded-r-xl shadow-lg animate-slide-in-up">
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              📧 Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:border-purple-400 text-gray-900 dark:text-gray-100 font-medium placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="your.email@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              🔒 Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:border-purple-400 text-gray-900 dark:text-gray-100 font-medium placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-hover-scale w-full text-white font-bold py-3 px-4 rounded-xl shadow-xl disabled:opacity-50 disabled:hover:scale-100 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 dark:from-pink-600 dark:via-purple-600 dark:to-cyan-600 dark:hover:from-pink-700 dark:hover:via-purple-700 dark:hover:to-cyan-700 transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In →'
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-600 dark:text-purple-400 hover:text-pink-600 dark:hover:text-pink-400 font-bold transition-colors underline">
                Register here
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Credentials with enhanced styling */}
        <div className="mt-6 p-5 bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur rounded-2xl border-2 border-cyan-200 dark:border-cyan-700 shadow-lg transition-colors duration-300">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
            <span className="mr-2 text-xl">🔐</span> Demo Credentials
          </p>
          <div className="space-y-3">
            <div className="bg-pink-50 dark:bg-pink-900/30 p-3 rounded-xl border-2 border-pink-300 dark:border-pink-700 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <p className="text-xs font-bold mb-1 text-pink-700 dark:text-pink-400">👨‍💼 Admin Account</p>
              <p className="text-xs text-gray-700 dark:text-gray-300">📧 admin@skillmatrix.com</p>
              <p className="text-xs text-gray-700 dark:text-gray-300">🔑 admin123</p>
            </div>
            <div className="bg-cyan-50 dark:bg-cyan-900/30 p-3 rounded-xl border-2 border-cyan-300 dark:border-cyan-700 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <p className="text-xs font-bold mb-1 text-cyan-700 dark:text-cyan-400">👤 Employee Account</p>
              <p className="text-xs text-gray-700 dark:text-gray-300">📧 unmesh@company.com</p>
              <p className="text-xs text-gray-700 dark:text-gray-300">🔑 password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
