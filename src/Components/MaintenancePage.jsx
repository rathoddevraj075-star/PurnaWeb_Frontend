/**
 * Maintenance Page - Beautiful Full-Screen Maintenance Display
 */

import { Wrench, Clock, Mail, RefreshCw } from 'lucide-react';

export default function MaintenancePage({ message, siteName }) {
    const refreshPage = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-[30%] -left-[20%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[150px] animate-pulse"
                    style={{ animationDuration: '4s' }}
                />
                <div
                    className="absolute top-[30%] -right-[20%] w-[50%] h-[60%] bg-orange-500/10 rounded-full blur-[120px] animate-pulse"
                    style={{ animationDuration: '5s', animationDelay: '1s' }}
                />
                <div
                    className="absolute bottom-[10%] left-[30%] w-[40%] h-[40%] bg-yellow-500/5 rounded-full blur-[100px] animate-pulse"
                    style={{ animationDuration: '6s', animationDelay: '2s' }}
                />
            </div>

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            <div className="max-w-lg w-full relative z-10 text-center">
                {/* Animated Icon */}
                <div className="relative inline-flex items-center justify-center mb-8">
                    <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center shadow-2xl shadow-amber-500/20 backdrop-blur-xl">
                        <Wrench className="w-14 h-14 text-amber-400 animate-bounce" style={{ animationDuration: '2s' }} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    Under Maintenance
                </h1>

                {/* Subtitle */}
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {message || 'We are currently performing scheduled maintenance to improve your experience. Please check back soon.'}
                </p>

                {/* Status Card */}
                <div className="bg-[#0f1218]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl shadow-black/50 mb-8">
                    <div className="flex items-center justify-center gap-3 text-amber-400 mb-4">
                        <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                        <span className="font-medium">Maintenance in Progress</span>
                    </div>

                    <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"
                            style={{ width: '70%', animationDuration: '1.5s' }}
                        />
                    </div>

                    <p className="text-gray-500 text-sm">
                        Our team is working hard to bring you an improved experience
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={refreshPage}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Check Again
                    </button>

                    <a
                        href="mailto:support@purnaroutine.com"
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 text-gray-300 font-medium rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                        <Mail className="w-5 h-5" />
                        Contact Support
                    </a>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-white/5">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} {siteName || 'PurnaRoutine'}. We'll be back soon!
                    </p>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-amber-400/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${5 + Math.random() * 10}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* Inline Animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
                    50% { transform: translateY(-30px) rotate(180deg); opacity: 0.6; }
                }
            `}</style>
        </div>
    );
}
