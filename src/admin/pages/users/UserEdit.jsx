/**
 * User Edit Page - Premium Dark Glass Design
 * Create and Edit users with role/permission management
 * Fully responsive for all screen sizes
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../services/adminApi';
import {
    User, Save, ArrowLeft, Shield, Lock, Mail, Phone,
    UserCheck, UserX, Loader2, AlertCircle, Eye, EyeOff,
    Calendar, Clock, Check, X
} from 'lucide-react';

const ROLES = [
    { value: 'user', label: 'Customer', description: 'Regular customer account with no admin access' },
    { value: 'editor', label: 'Editor', description: 'Can manage products and content' },
    { value: 'seo_manager', label: 'SEO Manager', description: 'Can manage SEO settings and redirects' },
    { value: 'admin', label: 'Administrator', description: 'Full access to all features' }
];

const TABS = [
    { id: 'general', label: 'General', icon: User },
    { id: 'role', label: 'Role & Permissions', icon: Shield },
    { id: 'activity', label: 'Activity', icon: Clock }
];

// Reusable Input Component
const Input = ({ label, required, type = 'text', className = '', ...props }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-300 mb-2">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            type={type}
            {...props}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
        />
    </div>
);

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isNew = id === 'new';

    const [activeTab, setActiveTab] = useState('general');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'user',
        isActive: true,
        customPermissions: [],
        deniedPermissions: []
    });
    const [errors, setErrors] = useState({});

    // Fetch user data for editing
    const { data: userData, isLoading: isFetching } = useQuery({
        queryKey: ['admin-user', id],
        queryFn: () => userApi.getOne(id).then(r => r.data.data),
        enabled: !isNew
    });

    // Fetch stats for permissions list
    const { data: statsData } = useQuery({
        queryKey: ['admin-users-stats'],
        queryFn: () => userApi.getStats().then(r => r.data.data)
    });

    // Populate form when data loads
    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                password: '',
                phone: userData.phone || '',
                role: userData.role || 'user',
                isActive: userData.isActive !== false,
                customPermissions: userData.customPermissions || [],
                deniedPermissions: userData.deniedPermissions || []
            });
        }
    }, [userData]);

    // Save mutation
    const saveMutation = useMutation({
        mutationFn: async (data) => {
            const payload = { ...data };
            // Only include password if it's set
            if (!payload.password) {
                delete payload.password;
            }

            if (isNew) {
                return userApi.create(payload);
            } else {
                return userApi.update(id, payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            queryClient.invalidateQueries({ queryKey: ['admin-users-stats'] });
            navigate('/admin/users');
        }
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const togglePermission = (permission, type) => {
        const field = type === 'custom' ? 'customPermissions' : 'deniedPermissions';
        const current = formData[field];

        if (current.includes(permission)) {
            handleChange(field, current.filter(p => p !== permission));
        } else {
            handleChange(field, [...current, permission]);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (isNew && !formData.password) newErrors.password = 'Password is required for new users';
        if (formData.password) {
            // Password must be at least 12 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
            if (!passwordRegex.test(formData.password)) {
                newErrors.password = 'Password must be at least 12 characters with uppercase, lowercase, number, and special character';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            saveMutation.mutate(formData);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Group permissions by category
    const permissionsByCategory = statsData?.permissions?.reduce((acc, p) => {
        if (!acc[p.category]) acc[p.category] = [];
        acc[p.category].push(p);
        return acc;
    }, {}) || {};

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={48} className="text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="p-2 sm:p-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                            <User size={20} className="sm:w-6 sm:h-6 text-blue-400" />
                            {isNew ? 'New User' : 'Edit User'}
                        </h1>
                        <p className="text-gray-400 text-sm mt-0.5 hidden sm:block">
                            {isNew ? 'Create a new user account' : `Editing ${userData?.name || 'user'}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Status Toggle */}
                    <button
                        onClick={() => handleChange('isActive', !formData.isActive)}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border font-medium text-sm transition-all ${formData.isActive
                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                            : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                            }`}
                    >
                        {formData.isActive ? <UserCheck size={16} /> : <UserX size={16} />}
                        <span className="hidden sm:inline">{formData.isActive ? 'Active' : 'Inactive'}</span>
                    </button>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 text-sm sm:text-base"
                    >
                        {saveMutation.isPending ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        <span>{saveMutation.isPending ? 'Saving...' : 'Save'}</span>
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {saveMutation.isError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-400">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-medium">Failed to save user</span>
                        <p className="text-sm mt-1 text-red-300">
                            {saveMutation.error?.response?.data?.message || saveMutation.error?.message || 'Please check your input and try again.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="bg-[#0f1218] rounded-xl border border-white/5 p-1 flex overflow-x-auto">
                {TABS.filter(tab => isNew ? tab.id !== 'activity' : true).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white border border-emerald-500/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Form Content */}
            <div className="bg-[#0f1218] rounded-xl sm:rounded-2xl border border-white/5 p-4 sm:p-6">
                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Full Name"
                                required
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                            {errors.name && (
                                <p className="text-red-400 text-sm -mt-4 flex items-center gap-1 md:col-span-2">
                                    <AlertCircle size={14} /> {errors.name}
                                </p>
                            )}

                            <Input
                                label="Email Address"
                                required
                                type="email"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-400 text-sm -mt-4 flex items-center gap-1">
                                <AlertCircle size={14} /> {errors.email}
                            </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Password {isNew && <span className="text-red-400">*</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={isNew ? 'Enter password' : 'Leave blank to keep current'}
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                        <AlertCircle size={14} /> {errors.password}
                                    </p>
                                )}
                            </div>

                            <Input
                                label="Phone Number"
                                type="tel"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Role & Permissions Tab */}
                {activeTab === 'role' && (
                    <div className="space-y-8">
                        {/* Role Selection */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Shield size={18} className="text-purple-400" />
                                User Role
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ROLES.map(role => (
                                    <button
                                        key={role.value}
                                        onClick={() => handleChange('role', role.value)}
                                        className={`p-4 rounded-xl border text-left transition-all ${formData.role === role.value
                                            ? 'bg-emerald-500/20 border-emerald-500/50 ring-2 ring-emerald-500/30'
                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-white">{role.label}</span>
                                            {formData.role === role.value && (
                                                <Check size={18} className="text-emerald-400" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400">{role.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Permissions */}
                        {formData.role !== 'admin' && Object.keys(permissionsByCategory).length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Custom Permissions</h3>
                                <p className="text-sm text-gray-400 mb-4">Add extra permissions beyond the role's default access</p>

                                <div className="space-y-4">
                                    {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                                        <div key={category} className="bg-white/5 rounded-xl p-4">
                                            <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-3 capitalize">{category}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {permissions.map(p => {
                                                    const isCustom = formData.customPermissions.includes(p.value);
                                                    const isDenied = formData.deniedPermissions.includes(p.value);
                                                    const isRoleDefault = userData?.rolePermissions?.includes(p.value);

                                                    return (
                                                        <button
                                                            key={p.value}
                                                            onClick={() => togglePermission(p.value, 'custom')}
                                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${isCustom
                                                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                                : isRoleDefault
                                                                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                                                                }`}
                                                        >
                                                            {p.value.split(':')[1]}
                                                            {isRoleDefault && !isCustom && <span className="ml-1 opacity-60">(default)</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && !isNew && userData && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Calendar size={18} className="text-gray-400" />
                                    <span className="text-sm text-gray-400">Account Created</span>
                                </div>
                                <p className="text-white font-medium">{formatDate(userData.createdAt)}</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Clock size={18} className="text-gray-400" />
                                    <span className="text-sm text-gray-400">Last Login</span>
                                </div>
                                <p className="text-white font-medium">{formatDate(userData.lastLogin)}</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Mail size={18} className="text-gray-400" />
                                    <span className="text-sm text-gray-400">Email Verified</span>
                                </div>
                                <p className={`font-medium ${userData.emailVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {userData.emailVerified ? 'Verified' : 'Not Verified'}
                                </p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Lock size={18} className="text-gray-400" />
                                    <span className="text-sm text-gray-400">Two-Factor Auth</span>
                                </div>
                                <p className={`font-medium ${userData.twoFactorEnabled ? 'text-emerald-400' : 'text-gray-400'}`}>
                                    {userData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                </p>
                            </div>
                        </div>

                        {userData.lastLoginIp && (
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Shield size={18} className="text-gray-400" />
                                    <span className="text-sm text-gray-400">Last Login IP</span>
                                </div>
                                <p className="text-white font-medium font-mono">{userData.lastLoginIp}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Action Bar - Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0c10]/95 backdrop-blur-md border-t border-white/10 p-4 flex gap-3 z-40">
                <button
                    onClick={() => handleChange('isActive', !formData.isActive)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-medium text-sm transition-all ${formData.isActive
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                        }`}
                >
                    {formData.isActive ? <UserCheck size={18} /> : <UserX size={18} />}
                    {formData.isActive ? 'Active' : 'Inactive'}
                </button>
                <button
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-xl disabled:opacity-50"
                >
                    {saveMutation.isPending ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Save size={18} />
                    )}
                    {saveMutation.isPending ? 'Saving...' : 'Save User'}
                </button>
            </div>

            {/* Spacer for mobile bottom bar */}
            <div className="lg:hidden h-20" />
        </div>
    );
}
