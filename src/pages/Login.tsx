
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Plus, User, Lock, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [animate, setAnimate] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans text-gray-800">
      {/* Main Card Container */}
      <div className={`relative w-full max-w-4xl h-[600px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-1000 ease-out transform ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

        {/* --- ART PANEL (Left) --- */}
        <div className="hidden md:flex w-5/12 relative overflow-hidden flex-col justify-between p-10 text-white bg-gradient-to-br from-teal-900 to-blue-900 z-20">

          {/* Background Blobs (Animated) */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 -left-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob bg-teal-500"></div>
            <div className="absolute top-0 -right-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000 bg-blue-500"></div>
            <div className="absolute -bottom-32 left-20 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000 bg-emerald-500"></div>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          </div>

          <div className="relative z-10 transition-all duration-700 ease-in-out delay-200">
            <div className="flex items-center space-x-3 text-white mb-8">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                <Plus className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-wide drop-shadow-md">TRIKSHA</h1>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold leading-tight animate-fade-in-up">
                Welcome Back.
              </h2>
              <p className="text-base text-white/90 leading-relaxed font-medium animate-fade-in-up delay-100">
                Access your personalized health dashboard, manage appointments, and stay connected with your care team.
              </p>
            </div>
          </div>

          <div className="relative z-10 text-xs text-white/70 font-medium tracking-wide">
            &copy; 2024 Triksha Health.
          </div>
        </div>

        {/* --- FORM PANEL (Right) --- */}
        <div className="w-full md:w-7/12 p-8 md:p-12 relative flex flex-col justify-center bg-white z-10">
          <div className="w-full max-w-sm mx-auto">

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sign In</h2>
              <Link to="/register" className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                Create Account
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-6 text-sm flex items-center shadow-sm animate-pulse">
                <Activity className="h-4 w-4 mr-2" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-5">
                <div className="relative group">
                  <input
                    name="identifier"
                    type="text"
                    required
                    placeholder="Phone, Email, or Aadhaar"
                    value={formData.identifier}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm"
                  />
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                </div>

                <div className="relative group">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm"
                  />
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a href="#" className="font-medium text-teal-600 hover:text-teal-500">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl shadow-xl shadow-teal-500/20 text-sm font-bold text-white tracking-wide transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn className="h-5 w-5 mr-2" /> Sign In
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Overlay (Hidden on Desktop) */}
        <div className="md:hidden absolute inset-0 pointer-events-none z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm text-white p-8 text-center hidden">
          <p>Please view on desktop for the best experience.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;