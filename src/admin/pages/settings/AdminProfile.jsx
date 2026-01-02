/**
 * Admin Profile Page - Premium Profile Design
 * Manage own profile and change password
 * Fully responsive light/dark mode
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../../services/adminApi';
import {
    User, Save, Lock, Mail, Phone, Calendar, Shield,
    Eye, EyeOff, Loader2, AlertCircle, Check, Clock
} from 'lucide-react';

export default function AdminProfile() {
    const queryClient = useQueryClient();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    // Fetch profile
    const { data: profile, isLoading } = useQuery({
        queryKey: ['admin-profile'],
        queryFn: () => settingsApi.getProfile().then(r => r.data.data)
    });

    // Update form when profile loads
    useEffect(() => {
        if (profile) {
            setProfileData({
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || ''
            });
        }
    }, [profile]);

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: (data) => settingsApi.updateProfile(data),
        onMutate: () => {
            setProfileError(''); // Clear error when starting
            setProfileSuccess(false);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);

            // Update localStorage for sidebar display
            const userData = response.data.data;
            localStorage.setItem('adminUser', JSON.stringify({
                name: userData.name,
                email: userData.email,
                role: userData.role
            }));

            // Scroll to top to show success message
            const contentArea = document.getElementById('admin-content-area');
            if (contentArea) contentArea.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onError: (error) => {
            setProfileError(error.response?.data?.message || 'Failed to update profile');
        }
    });

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: (data) => settingsApi.changePassword(data),
        onMutate: () => {
            setPasswordError(''); // Clear error when starting new mutation
        },
        onSuccess: () => {
            setPasswordSuccess(true);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setPasswordSuccess(false), 3000);

            // Scroll to password section
            const contentArea = document.getElementById('admin-content-area');
            if (contentArea) contentArea.scrollTo({ top: contentArea.scrollHeight, behavior: 'smooth' });
        },
        onError: (error) => {
            setPasswordError(error.response?.data?.message || 'Failed to change password');
        }
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        updateProfileMutation.mutate(profileData);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setPasswordError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        changePasswordMutation.mutate({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        });
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'AD';
    };

    const getRoleBadge = (role) => {
        const badges = {
            admin: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30',
            seo_manager: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30',
            editor: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
        };
        return badges[role] || 'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/30';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={48} className="text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20">
                        <User size={22} className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
                    </div>
                    My Profile
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account settings and password</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-[#0f1218] rounded-2xl border border-gray-800 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none transition-colors">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-500/10 dark:to-cyan-500/10 p-6 border-b border-gray-800 dark:border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-500/20">
                            {getInitials(profile?.name)}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{profile?.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{profile?.email}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border capitalize ${getRoleBadge(profile?.role)}`}>
                                    <Shield size={12} />
                                    {profile?.role?.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Info */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-800 dark:border-white/5">
                    <div className="flex items-center gap-3 text-sm">
                        <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-500 dark:text-gray-400">Joined:</span>
                        <span className="text-gray-900 dark:text-white font-medium pl-1">{formatDate(profile?.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Clock size={16} className="text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-500 dark:text-gray-400">Last Login:</span>
                        <span className="text-gray-900 dark:text-white font-medium pl-1">{formatDate(profile?.lastLogin)}</span>
                    </div>
                </div>

                {/* Edit Profile Form */}
                <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <User size={18} className="text-emerald-500 dark:text-emerald-400" />
                        Edit Profile
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
                        <div className="flex-1">
                            {profileSuccess && (
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
                                    <Check size={16} />
                                    Profile updated successfully!
                                </div>
                            )}
                            {profileError && (
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                    <AlertCircle size={16} />
                                    {profileError}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                            className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                        >
                            {updateProfileMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white dark:bg-[#0f1218] rounded-2xl border border-gray-800 dark:border-white/5 p-6 shadow-sm dark:shadow-none transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                    <Lock size={18} className="text-amber-500 dark:text-amber-400" />
                    Change Password
                </h3>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
                        <div className="flex-1">
                            {passwordSuccess && (
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
                                    <Check size={16} />
                                    Password changed successfully!
                                </div>
                            )}
                            {passwordError && (
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                    <AlertCircle size={16} />
                                    {passwordError}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={changePasswordMutation.isPending || !passwordData.currentPassword || !passwordData.newPassword}
                            className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                        >
                            {changePasswordMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
