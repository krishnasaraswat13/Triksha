
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Mail, ShieldCheck, AlertCircle } from 'lucide-react';

const VerifyEmail = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get email from router state (passed from Register page)
    const email = location.state?.email || '';

    useEffect(() => {
        if (!email) {
            // If no email in state, redirect back to login
            navigate('/login');
        }
    }, [email, navigate]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/dashboard'); // Direct to dashboard or login
                }, 2000);
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans text-gray-800">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md text-center transform transition-all hover:scale-[1.01]">

                <div className="mx-auto flex items-center justify-center w-20 h-20 bg-teal-50 rounded-full mb-6 relative">
                    <ShieldCheck className="h-10 w-10 text-teal-600" />
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                        <Mail className="h-4 w-4 text-white" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                <p className="text-gray-500 text-sm mb-6">
                    We've sent a 6-digit verification code to <br />
                    <span className="font-semibold text-teal-700">{email}</span>
                </p>

                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 mr-2" /> {error}
                    </div>
                )}

                {success ? (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4 flex flex-col items-center animate-bounce-short">
                        <CheckCircle className="h-8 w-8 mb-2" />
                        <span className="font-bold">Verified Successfully!</span>
                        <span className="text-xs">Redirecting...</span>
                    </div>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-6">
                        <input
                            type="text"
                            maxLength={6}
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only numbers
                            className="w-full text-center text-3xl font-mono tracking-[0.5em] py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-gray-700 placeholder-gray-300"
                            placeholder="000000"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl shadow-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-sm tracking-wide hover:shadow-teal-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70"
                        >
                            {loading ? 'Verifying...' : 'Confirm Account'}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-xs text-gray-400">
                    Didn't receive code? <button className="text-teal-600 font-semibold hover:underline">Resend</button>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
