/**
 * Admin Login Page - Premium Dark Design with Animations
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/adminApi';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authApi.login({ email, password });
            const userData = response.data.data || response.data.user || response.data;
            const token = userData.token || response.data.token;

            if (userData?.role !== 'admin' && userData?.role !== 'editor' && userData?.role !== 'seo_manager') {
                setError('Access denied. Admin privileges required.');
                setLoading(false);
                return;
            }

            // Show success animation
            setSuccess(true);
            setLoading(false);

            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminUser', JSON.stringify({
                name: userData.name,
                email: userData.email,
                role: userData.role
            }));

            // Delay navigation for success animation
            setTimeout(() => {
                navigate('/admin');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"
                    style={{ animationDuration: '4s' }}
                />
                <div
                    className="absolute top-[40%] -right-[10%] w-[40%] h-[50%] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"
                    style={{ animationDuration: '5s', animationDelay: '1s' }}
                />
                <div
                    className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[80px] animate-pulse"
                    style={{ animationDuration: '6s', animationDelay: '2s' }}
                />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>

            <div
                className={`w-full max-w-md relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    } ${success ? 'scale-95 opacity-80' : ''}`}
            >
                {/* Logo Section */}
                <div className={`text-center mb-10 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`} style={{ transitionDelay: '0.1s' }}>
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 mb-6 shadow-xl shadow-emerald-500/20 backdrop-blur-xl transition-all duration-500 ${success ? 'scale-110 shadow-emerald-500/40' : 'hover:scale-105 hover:shadow-emerald-500/30'}`}>
                        {success ? (
                            <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                        ) : (
                            <ShieldCheck className="w-10 h-10 text-emerald-400" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {success ? 'Welcome Back!' : 'Admin Portal'}
                    </h1>
                    <p className="text-gray-400 transition-all duration-300">
                        {success ? 'Redirecting to dashboard...' : 'Sign in to manage your store'}
                    </p>
                </div>

                {/* Login Card */}
                <div
                    className={`bg-[#0f1218]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/50 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        } ${success ? 'border-emerald-500/30' : ''}`}
                    style={{ transitionDelay: '0.2s' }}
                >
                    {success ? (
                        <div className="py-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                            </div>
                            <p className="text-emerald-400 font-medium">Loading your dashboard...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="flex items-center gap-3 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-shake">
                                    <AlertCircle size={20} className="shrink-0 animate-pulse" />
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}

                            {/* Email */}
                            <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: '0.3s' }}>
                                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3.5 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white/10 transition-all duration-300 sm:text-sm"
                                        placeholder="admin@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: '0.4s' }}>
                                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-12 py-3.5 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white/10 transition-all duration-300 sm:text-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.5s' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-[#0f1218] transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <p className={`text-center text-gray-600 text-sm mt-8 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '0.6s' }}>
                    &copy; {new Date().getFullYear()} PurnaRoutine. All rights reserved.
                </p>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
                    50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
                }
                .animate-float {
                    animation: float linear infinite;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.6s ease-in-out;
                }
            `}</style>
        </div>
    );
}
