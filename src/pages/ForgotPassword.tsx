
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, ArrowRight, CheckCircle, Activity, KeyRound, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier })
            });
            const data = await res.json();
            if (res.ok) {
                setStep(2);
                setMessage('OTP sent! Check your inbox/phone (Simulated in Console).');
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, otp })
            });
            const data = await res.json();
            if (res.ok) {
                setStep(3);
                setMessage('OTP Verified. Please set a new password.');
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, otp, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans text-gray-800">
            <div className={`relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8 transition-all duration-700 ease-out transform ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

                <div className="text-center mb-8">
                    <div className="mx-auto flex items-center justify-center w-16 h-16 bg-teal-50 rounded-full mb-4">
                        <KeyRound className="h-8 w-8 text-teal-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                    <p className="text-sm text-gray-500 mt-2">
                        {step === 1 && "Enter your registered email or phone number to receive an OTP."}
                        {step === 2 && "Enter the 6-digit OTP sent to your device."}
                        {step === 3 && "Create a secure new password for your account."}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-6 text-sm flex items-center animate-pulse">
                        <AlertCircle className="h-4 w-4 mr-2" /> {error}
                    </div>
                )}
                {message && !error && (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg mb-6 text-sm flex items-center animate-bounce-short">
                        <CheckCircle className="h-4 w-4 mr-2" /> {message}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-6">
                        <div className="relative group">
                            <input
                                type="text"
                                required
                                placeholder="Email or Phone"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm"
                            />
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full py-4 rounded-xl shadow-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-sm hover:shadow-teal-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70">
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div className="relative group">
                            <input
                                type="text"
                                required
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm tracking-widest text-center font-mono text-lg"
                            />
                            <KeyRound className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full py-4 rounded-xl shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-sm hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70">
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button type="button" onClick={() => setStep(1)} className="w-full text-center text-xs text-gray-500 hover:text-gray-700 mt-2 underline">Wrong number? Go back</button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <input
                                    type="password"
                                    required
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm"
                                />
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                            </div>
                            <div className="relative group">
                                <input
                                    type="password"
                                    required
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm"
                                />
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                            </div>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full py-4 rounded-xl shadow-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-sm hover:shadow-teal-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70">
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                    <Link to="/login" className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center justify-center">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
