/**
 * User List Page - Premium Dark Glass Design
 * Fully responsive for all screen sizes
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../../services/adminApi';
import {
    Users, Plus, Search, Edit2, Trash2, UserCheck, UserX,
    Calendar, Shield, Filter, ChevronLeft, ChevronRight,
    AlertCircle, Mail, Phone, MoreVertical
} from 'lucide-react';

const ROLES = [
    { value: 'all', label: 'All Roles' },
    { value: 'user', label: 'Customer' },
    { value: 'editor', label: 'Editor' },
    { value: 'seo_manager', label: 'SEO Manager' },
    { value: 'admin', label: 'Admin' }
];

const STATUS_OPTIONS = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
];

export default function UserList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('all');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Fetch users
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-users', { search, role, status, page }],
        queryFn: () => userApi.getAll({
            search: search || undefined,
            role: role !== 'all' ? role : undefined,
            status: status !== 'all' ? status : undefined,
            page,
            limit: 10
        }).then(r => r.data)
    });

    // Fetch stats
    const { data: statsData } = useQuery({
        queryKey: ['admin-users-stats'],
        queryFn: () => userApi.getStats().then(r => r.data.data)
    });

    // Toggle status mutation
    const toggleStatusMutation = useMutation({
        mutationFn: (id) => userApi.toggleStatus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            queryClient.invalidateQueries({ queryKey: ['admin-users-stats'] });
        }
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => userApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            queryClient.invalidateQueries({ queryKey: ['admin-users-stats'] });
            setDeleteId(null);
        }
    });

    const users = data?.data || [];
    const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

    const getRoleBadgeClass = (userRole) => {
        const classes = {
            admin: 'bg-red-500/20 text-red-400 border-red-500/30',
            seo_manager: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            editor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            user: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        };
        return classes[userRole] || classes.user;
    };

    const getRoleLabel = (userRole) => {
        const labels = {
            admin: 'Admin',
            seo_manager: 'SEO Manager',
            editor: 'Editor',
            user: 'Customer'
        };
        return labels[userRole] || 'Customer';
    };

    const formatDate = (date) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
                            <Users size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        User Management
                    </h1>
                    <p className="text-gray-400 text-sm mt-1 hidden sm:block">
                        Manage customers and staff accounts
                    </p>
                </div>
                <Link
                    to="/admin/users/new"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                    <Plus size={18} />
                    <span>Add User</span>
                </Link>
            </div>

            {/* Stats Cards */}
            {statsData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-[#0f1218] rounded-xl border border-white/5 p-4">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Users</p>
                        <p className="text-2xl font-bold text-white">{statsData.stats.total}</p>
                    </div>
                    <div className="bg-[#0f1218] rounded-xl border border-white/5 p-4">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Active</p>
                        <p className="text-2xl font-bold text-emerald-400">{statsData.stats.active}</p>
                    </div>
                    <div className="bg-[#0f1218] rounded-xl border border-white/5 p-4">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Inactive</p>
                        <p className="text-2xl font-bold text-amber-400">{statsData.stats.inactive}</p>
                    </div>
                    <div className="bg-[#0f1218] rounded-xl border border-white/5 p-4">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Staff</p>
                        <p className="text-2xl font-bold text-purple-400">{statsData.stats.staff}</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-[#0f1218] rounded-xl sm:rounded-2xl border border-white/5 p-3 sm:p-4">
                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="sm:hidden w-full flex items-center justify-between p-2 text-gray-400"
                >
                    <span className="flex items-center gap-2">
                        <Filter size={16} />
                        Filters
                    </span>
                    <ChevronRight size={16} className={`transform transition-transform ${showMobileFilters ? 'rotate-90' : ''}`} />
                </button>

                {/* Filters Content */}
                <div className={`${showMobileFilters ? 'block mt-3' : 'hidden'} sm:block`}>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
                            />
                        </div>

                        {/* Role Filter */}
                        <select
                            value={role}
                            onChange={(e) => { setRole(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm appearance-none cursor-pointer min-w-[140px]"
                        >
                            {ROLES.map(r => (
                                <option key={r.value} value={r.value} className="bg-[#0f1218]">
                                    {r.label}
                                </option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm appearance-none cursor-pointer min-w-[130px]"
                        >
                            {STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-[#0f1218]">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-400">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-medium">Failed to load users</span>
                        <p className="text-sm mt-1 text-red-300">
                            {error?.response?.data?.message || error?.message || 'Please try again.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-[#0f1218] rounded-xl p-4 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-white/5 rounded w-1/3" />
                                    <div className="h-3 bg-white/5 rounded w-1/4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && users.length === 0 && (
                <div className="bg-[#0f1218] rounded-2xl border border-white/5 p-8 sm:p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                        <Users size={32} className="text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        {search || role !== 'all' || status !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Get started by creating your first user'}
                    </p>
                    {!search && role === 'all' && status === 'all' && (
                        <Link
                            to="/admin/users/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                        >
                            <Plus size={18} />
                            Create First User
                        </Link>
                    )}
                </div>
            )}

            {/* User List - Desktop Table */}
            {!isLoading && !error && users.length > 0 && (
                <>
                    {/* Desktop View */}
                    <div className="hidden lg:block bg-[#0f1218] rounded-2xl border border-white/5 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">User</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Role</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Last Login</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Joined</th>
                                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-medium text-sm">
                                                        {getInitials(user.name)}
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-medium text-white truncate max-w-[200px] group-hover:text-emerald-400 transition-colors">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate max-w-[200px] flex items-center gap-1">
                                                        <Mail size={12} />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border capitalize ${getRoleBadgeClass(user.role)}`}>
                                                <Shield size={12} />
                                                {getRoleLabel(user.role)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatusMutation.mutate(user._id)}
                                                disabled={toggleStatusMutation.isPending}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${user.isActive
                                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                                                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'
                                                    }`}
                                            >
                                                {user.isActive ? <UserCheck size={12} /> : <UserX size={12} />}
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Calendar size={14} />
                                                {formatDate(user.lastLogin)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-400">
                                                {formatDate(user.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/users/${user._id}`)}
                                                    className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(user._id)}
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile/Tablet Card View */}
                    <div className="lg:hidden space-y-3">
                        {users.map((user) => (
                            <div key={user._id} className="bg-[#0f1218] rounded-xl border border-white/5 p-4 hover:border-white/10 transition-all">
                                <div className="flex gap-3">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full object-cover border border-white/10 flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                                            {getInitials(user.name)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-white text-sm sm:text-base truncate">
                                            {user.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${getRoleBadgeClass(user.role)}`}>
                                                <Shield size={10} />
                                                {getRoleLabel(user.role)}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${user.isActive
                                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                }`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                                    <button
                                        onClick={() => toggleStatusMutation.mutate(user._id)}
                                        disabled={toggleStatusMutation.isPending}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-all"
                                    >
                                        {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                                        {user.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/admin/users/${user._id}`)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all"
                                    >
                                        <Edit2 size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(user._id)}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f1218] rounded-xl border border-white/5 p-4">
                            <p className="text-sm text-gray-400 order-2 sm:order-1">
                                Showing {(pagination.page - 1) * 10 + 1} - {Math.min(pagination.page * 10, pagination.total)} of {pagination.total}
                            </p>
                            <div className="flex items-center gap-2 order-1 sm:order-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="flex items-center gap-1">
                                    {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                                        let pageNum;
                                        if (pagination.pages <= 5) {
                                            pageNum = i + 1;
                                        } else if (page <= 3) {
                                            pageNum = i + 1;
                                        } else if (page >= pagination.pages - 2) {
                                            pageNum = pagination.pages - 4 + i;
                                        } else {
                                            pageNum = page - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setPage(pageNum)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${pageNum === page
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                    disabled={page === pagination.pages}
                                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0f1218] rounded-2xl border border-white/10 p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-red-500/20">
                                <Trash2 size={24} className="text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Delete User</h3>
                                <p className="text-sm text-gray-400">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete this user? All associated data will be permanently removed.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2.5 bg-white/5 text-gray-300 font-medium rounded-xl hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteMutation.mutate(deleteId)}
                                disabled={deleteMutation.isPending}
                                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-all disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
