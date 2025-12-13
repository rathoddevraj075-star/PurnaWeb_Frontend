/**
 * Notifications Page - Premium Dark Design
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from "../services/adminApi";
import { Bell, Check, Trash2, Filter, Search, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function NotificationsPage() {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState('all'); // all, unread

    const { data, isLoading } = useQuery({
        queryKey: ['admin-notifications-page', filter],
        queryFn: () => notificationApi.getAll({
            limit: 50,
            unread: filter === 'unread' ? true : undefined
        }).then(r => r.data)
    });

    const notifications = data?.data || [];
    const unreadCount = data?.meta?.unreadCount || 0;

    // Mutations
    const markReadMutation = useMutation({
        mutationFn: (id) => notificationApi.markRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-notifications']);
            queryClient.invalidateQueries(['admin-notifications-page']);
        }
    });

    const markAllReadMutation = useMutation({
        mutationFn: () => notificationApi.markAllRead(),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-notifications']);
            queryClient.invalidateQueries(['admin-notifications-page']);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => notificationApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-notifications']);
            queryClient.invalidateQueries(['admin-notifications-page']);
        }
    });

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={24} className="text-emerald-400" />;
            case 'warning': return <AlertTriangle size={24} className="text-amber-400" />;
            case 'error': return <XCircle size={24} className="text-red-400" />;
            default: return <Info size={24} className="text-blue-400" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'success': return 'bg-emerald-500/10 border-emerald-500/20';
            case 'warning': return 'bg-amber-500/10 border-amber-500/20';
            case 'error': return 'bg-red-500/10 border-red-500/20';
            default: return 'bg-blue-500/10 border-blue-500/20';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Bell className="text-emerald-400" />
                        Notifications
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Stay updated with alerts and activities</p>
                </div>
                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <button
                            onClick={() => markAllReadMutation.mutate()}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all text-sm font-medium"
                        >
                            <Check size={16} /> Mark all read
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#0f1218] rounded-2xl p-2 border border-white/5 shadow-xl shadow-black/20 inline-flex">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    All Notifications
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'unread' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    Unread Only {unreadCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">{unreadCount}</span>}
                </button>
            </div>

            {/* List */}
            <div className="bg-[#0f1218] rounded-2xl border border-white/5 shadow-xl shadow-black/20 overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p>Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Bell size={48} className="mb-4 opacity-20" />
                        <p>No notifications found</p>
                        {filter === 'unread' && <button onClick={() => setFilter('all')} className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm">View all notifications</button>}
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {notifications.map(notification => (
                            <div
                                key={notification._id}
                                className={`p-6 transition-colors hover:bg-white/[0.02] group ${!notification.read ? 'bg-white/[0.02]' : ''}`}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className={`font-semibold ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                                                    {notification.title}
                                                    {!notification.read && <span className="ml-2 w-2 h-2 inline-block bg-red-500 rounded-full"></span>}
                                                </h3>
                                                <p className="text-gray-400 mt-1">{notification.message}</p>
                                                {notification.link && (
                                                    <a
                                                        href={notification.link}
                                                        className="inline-block mt-3 text-sm text-emerald-400 hover:text-emerald-300 hover:underline"
                                                        onClick={(e) => {
                                                            if (!notification.read) markReadMutation.mutate(notification._id);
                                                        }}
                                                    >
                                                        Take Action →
                                                    </a>
                                                )}
                                                <p className="text-xs text-gray-500 mt-3 font-mono">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markReadMutation.mutate(notification._id)}
                                                        className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Delete this notification?')) {
                                                            deleteMutation.mutate(notification._id);
                                                        }
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
