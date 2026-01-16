
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Plus, User, Mail, Phone, Lock, MapPin, Activity, Stethoscope } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    email: '',
    role: 'patient',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [animate, setAnimate] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Derived state for layout swapping
  const isDoctor = formData.role === 'doctor';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans text-gray-800">
      {/* Main Card Container */}
      <div className={`relative w-full max-w-5xl h-[700px] bg-white rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-1000 ease-out transform ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

        {/* 
                   ANIMATED SLIDING PANELS (The "Clean" Swap)
                   We use absolute positioning + left/right transitions because layout reflows (Flexbox order) are instant and jarring.
                   This creates the physical "gliding" effect.
                */}

        {/* --- ART PANEL (The Overlay) --- */}
        <div
          className={`absolute top-0 h-full w-5/12 z-20 transition-all duration-1000 ease-in-out flex flex-col justify-between p-10 text-white overflow-hidden
                    ${isDoctor ? 'left-[58.333333%] bg-blue-900' : 'left-0 bg-teal-900'}
                    `}
        >
          {/* Background Blobs (Animated) */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className={`absolute top-0 -left-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob ${isDoctor ? 'bg-blue-500' : 'bg-teal-500'}`}></div>
            <div className={`absolute top-0 -right-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000 ${isDoctor ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
            <div className={`absolute -bottom-32 left-20 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000 ${isDoctor ? 'bg-purple-500' : 'bg-green-500'}`}></div>
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
              <h2 key={isDoctor ? 'doc-h' : 'pat-h'} className="text-3xl font-extrabold leading-tight animate-fade-in-up">
                {isDoctor ? "Join as a Specialist." : "Your Health, Unified."}
              </h2>
              <p key={isDoctor ? 'doc-p' : 'pat-p'} className="text-base text-white/90 leading-relaxed font-medium animate-fade-in-up delay-100">
                {isDoctor
                  ? "Seamlessly connect with patients, manage your schedule, and access advanced diagnostic tools."
                  : "One platform for your medical records, appointments, and real-time health monitoring."}
              </p>
            </div>
          </div>

          {/* Role Icon Animation */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-grow">
            <div className={`w-40 h-40 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl transition-all duration-700 hover:scale-105 group`}>
              {isDoctor ? (
                <Stethoscope className="h-20 w-20 text-white drop-shadow-lg animate-pulse-slow" />
              ) : (
                <User className="h-20 w-20 text-white drop-shadow-lg animate-pulse-slow" />
              )}
            </div>
          </div>

          <div className="relative z-10 text-xs text-white/70 font-medium tracking-wide text-center uppercase">
            Secure • Private • HIPAA Compliant
          </div>
        </div>


        {/* --- FORM PANEL (The Content) --- */}
        <div
          className={`absolute top-0 h-full w-7/12 z-10 bg-white transition-all duration-1000 ease-in-out flex flex-col justify-center
                    ${isDoctor ? 'left-0' : 'left-[41.666667%]'}
                    `}
        >
          <div className="w-full max-w-lg mx-auto px-8 py-8 h-full overflow-y-auto custom-scrollbar">

            <div className="flex justify-between items-center mb-6 pt-2">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
                <p className="text-sm text-gray-500 mt-1">Get started with Triksha today</p>
              </div>
              <Link to="/login" className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                Sign In
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-6 text-sm flex items-center shadow-sm animate-pulse">
                <Activity className="h-4 w-4 mr-2" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 pb-6">

              {/* Animated Role Toggle (The Trigger) */}
              <div className="flex justify-center mb-6">
                <div className="relative flex bg-gray-100 rounded-full p-1.5 shadow-inner w-72 items-center cursor-pointer">
                  {/* Sliding Pill Background inside the toggle */}
                  <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-md transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isDoctor ? 'translate-x-[100%] left-1.5' : 'translate-x-0 left-1.5'}`}></div>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'patient' })}
                    className={`relative z-10 w-1/2 text-xs font-bold uppercase tracking-wider py-2.5 rounded-full transition-colors duration-300 ${!isDoctor ? 'text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'doctor' })}
                    className={`relative z-10 w-1/2 text-xs font-bold uppercase tracking-wider py-2.5 rounded-full transition-colors duration-300 ${isDoctor ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Doctor
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="space-y-4">
                {/* Name & Gender Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <input name="name" type="text" required placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm" />
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <div className="relative group">
                    <select name="gender" required value={formData.gender} onChange={handleInputChange} className="w-full pl-3 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm text-gray-600 appearance-none">
                      <option value="" disabled>Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Email & Phone Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm" />
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <div className="relative group">
                    <input name="phone" type="tel" required placeholder="Mobile" value={formData.phone} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm" />
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                </div>

                {/* Passwords Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <input name="password" type={showPassword ? 'text' : 'password'} required placeholder="Password" value={formData.password} onChange={handleInputChange} className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm" />
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <div className="relative group">
                    <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required placeholder="Confirm" value={formData.confirmPassword} onChange={handleInputChange} className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm" />
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="flex items-center text-xs mt-2 pl-1">
                <input id="agree" name="agree" type="checkbox" required className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer" />
                <label htmlFor="agree" className="ml-2 text-gray-500 cursor-pointer select-none">
                  I agree to the <a href="#" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">Terms of Service</a> & <a href="#" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl shadow-xl shadow-teal-500/20 text-sm font-bold text-white tracking-wide transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed
                                ${isDoctor ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-blue-500/30' : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:shadow-teal-500/30'}
                                `}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </span>
                ) : (
                  `Register as ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}`
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

export default Register;