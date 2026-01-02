/**
 * Contact List Page - Inbox-style Premium Design
 * Fully responsive for all screen sizes
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactApi } from '../../services/adminApi';
import {
    Inbox, Search, Trash2, Calendar, Mail, Phone, User,
    ChevronLeft, ChevronRight, AlertCircle, Clock, CheckCircle,
    XCircle, MessageSquare, Filter, X, Copy, Check, Send, Loader2, Reply
} from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'all', label: 'All Status', color: '' },
    { value: 'pending', label: 'Pending', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    { value: 'responded', label: 'Responded', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    { value: 'closed', label: 'Closed', color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' }
];

const getStatusBadge = (status) => {
    const statusMap = {
        'pending': { label: 'Pending', icon: Clock, class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
        'in-progress': { label: 'In Progress', icon: MessageSquare, class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
        'responded': { label: 'Responded', icon: CheckCircle, class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
        'closed': { label: 'Closed', icon: XCircle, class: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' }
    };
    return statusMap[status] || statusMap.pending;
};

export default function ContactList() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [selectedContact, setSelectedContact] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [replyError, setReplyError] = useState('');
    const [replySuccess, setReplySuccess] = useState(false);

    // Fetch contacts
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-contacts', { search, status, page }],
        queryFn: () => contactApi.getAll({
            search: search || undefined,
            status: status !== 'all' ? status : undefined,
            page,
            limit: 10
        }).then(r => r.data)
    });

    // Fetch stats
    const { data: statsData } = useQuery({
        queryKey: ['admin-contacts-stats'],
        queryFn: () => contactApi.getStats().then(r => r.data.data)
    });

    // Update status mutation
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => contactApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
            queryClient.invalidateQueries({ queryKey: ['admin-contacts-stats'] });
        }
    });

    // Update notes mutation
    const updateNotesMutation = useMutation({
        mutationFn: ({ id, notes }) => contactApi.updateNotes(id, notes),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
            if (selectedContact) {
                setSelectedContact(prev => ({ ...prev, adminNotes: data.data.data.adminNotes }));
            }
        }
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => contactApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
            queryClient.invalidateQueries({ queryKey: ['admin-contacts-stats'] });
            setDeleteId(null);
            setSelectedContact(null);
        }
    });

    // Send reply mutation
    const sendReplyMutation = useMutation({
        mutationFn: ({ id, message }) => contactApi.sendReply(id, { message }),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
            queryClient.invalidateQueries({ queryKey: ['admin-contacts-stats'] });
            setSelectedContact(response.data.data);
            setReplySuccess(true);
            setReplyMessage('');
            setReplyError('');
            setTimeout(() => {
                setReplySuccess(false);
                setShowReplyModal(false);
            }, 2000);
        },
        onError: (error) => {
            setReplyError(error.response?.data?.message || 'Failed to send reply. Please try again.');
        }
    });

    const contacts = data?.data || [];
    const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const copyEmail = async (email) => {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleStatusChange = (contactId, newStatus) => {
        updateStatusMutation.mutate({ id: contactId, status: newStatus });
        if (selectedContact && selectedContact._id === contactId) {
            setSelectedContact(prev => ({ ...prev, status: newStatus }));
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20">
                            <Inbox size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        Contact Inquiries
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 hidden sm:block">
                        Manage customer inquiries and support requests
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            {statsData && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                    <div className="bg-white dark:bg-[#0f1218] rounded-xl border border-gray-800 dark:border-white/5 p-4 shadow-sm dark:shadow-none transition-colors">
                        <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Total</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsData.total}</p>
                    </div>
                    <div className="bg-white dark:bg-[#0f1218] rounded-xl border border-gray-800 dark:border-white/5 p-4 shadow-sm dark:shadow-none transition-colors">
                        <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Pending</p>
                        <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">{statsData.pending}</p>
                    </div>
                    <div className="bg-white dark:bg-[#0f1218] rounded-xl border border-gray-800 dark:border-white/5 p-4 shadow-sm dark:shadow-none transition-colors">
                        <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">In Progress</p>
                        <p className="text-2xl font-bold text-blue-500 dark:text-blue-400">{statsData.inProgress}</p>
                    </div>
                    <div className="bg-white dark:bg-[#0f1218] rounded-xl border border-gray-800 dark:border-white/5 p-4 shadow-sm dark:shadow-none transition-colors">
                        <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Responded</p>
                        <p className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">{statsData.responded}</p>
                    </div>
                    <div className="bg-white dark:bg-[#0f1218] rounded-xl border border-gray-800 dark:border-white/5 p-4 col-span-2 md:col-span-1 shadow-sm dark:shadow-none transition-colors">
                        <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Closed</p>
                        <p className="text-2xl font-bold text-gray-400 dark:text-gray-400">{statsData.closed}</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white dark:bg-[#0f1218] rounded-xl sm:rounded-2xl border border-gray-800 dark:border-white/5 p-3 sm:p-4 shadow-sm dark:shadow-none transition-colors">
                <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="sm:hidden w-full flex items-center justify-between p-2 text-gray-500 dark:text-gray-400"
                >
                    <span className="flex items-center gap-2">
                        <Filter size={16} />
                        Filters
                    </span>
                    <ChevronRight size={16} className={`transform transition-transform ${showMobileFilters ? 'rotate-90' : ''}`} />
                </button>

                <div className={`${showMobileFilters ? 'block mt-3' : 'hidden'} sm:block`}>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or subject..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm appearance-none cursor-pointer min-w-[150px]"
                        >
                            {STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-600 dark:text-red-400">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <span>Failed to load contacts. Please try again.</span>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white dark:bg-[#0f1218] rounded-xl p-4 animate-pulse border border-gray-800 dark:border-white/5">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-white/5 rounded-full flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/3" />
                                    <div className="h-3 bg-gray-200 dark:bg-white/5 rounded w-2/3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && contacts.length === 0 && (
                <div className="bg-white dark:bg-[#0f1218] rounded-2xl border border-gray-800 dark:border-white/5 p-8 sm:p-12 text-center transition-colors">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                        <Inbox size={32} className="text-purple-500 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No inquiries found</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {search || status !== 'all' ? 'Try adjusting your filters' : 'Your inbox is empty'}
                    </p>
                </div>
            )}

            {/* Contact List */}
            {!isLoading && !error && contacts.length > 0 && (
                <div className="space-y-3">
                    {contacts.map((contact) => {
                        const statusInfo = getStatusBadge(contact.status);
                        const StatusIcon = statusInfo.icon;

                        return (
                            <div
                                key={contact._id}
                                onClick={() => setSelectedContact(contact)}
                                className={`bg-white dark:bg-[#0f1218] rounded-xl border ${contact.status === 'pending' ? 'border-amber-500/30' : 'border-gray-800 dark:border-white/5'} p-4 hover:border-gray-300 dark:hover:border-white/20 cursor-pointer transition-all group shadow-sm dark:shadow-none`}
                            >
                                <div className="flex gap-3 sm:gap-4">
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                                        {contact.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                                                    {contact.name}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-500 truncate">{contact.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${statusInfo.class}`}>
                                                    <StatusIcon size={12} />
                                                    {statusInfo.label}
                                                </span>
                                                <span className="text-xs text-gray-500 hidden md:block">
                                                    {formatDate(contact.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 truncate">{contact.subject}</p>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{contact.message}</p>

                                        {/* Mobile Status Badge */}
                                        <div className="sm:hidden flex items-center justify-between mt-3 pt-2 border-t border-gray-800 dark:border-white/5">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border ${statusInfo.class}`}>
                                                <StatusIcon size={10} />
                                                {statusInfo.label}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(contact.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0f1218] rounded-xl border border-gray-800 dark:border-white/5 p-4 transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
                        Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                    </p>
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                            disabled={page === pagination.pages}
                            className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedContact(null)}>
                    <div
                        className="bg-white dark:bg-[#0f1218] rounded-2xl border border-gray-800 dark:border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transition-colors"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white dark:bg-[#0f1218] border-b border-gray-800 dark:border-white/10 p-4 sm:p-6 flex items-start justify-between gap-4 z-10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                    {selectedContact.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedContact.name}</h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Mail size={14} />
                                        <span>{selectedContact.email}</span>
                                        <button
                                            onClick={() => copyEmail(selectedContact.email)}
                                            className="p-1 hover:text-gray-900 dark:hover:text-white transition-colors"
                                            title="Copy email"
                                        >
                                            {copied ? <Check size={14} className="text-emerald-500 dark:text-emerald-400" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedContact(null)}
                                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 sm:p-6 space-y-6">
                            {/* Contact Info */}
                            <div className="flex flex-wrap gap-4 text-sm">
                                {selectedContact.phone && (
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Phone size={14} />
                                        <span>{selectedContact.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <Calendar size={14} />
                                    <span>Submitted: {formatDate(selectedContact.createdAt)}</span>
                                </div>
                            </div>

                            {/* Status Change */}
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status</label>
                                <div className="flex flex-wrap gap-2">
                                    {STATUS_OPTIONS.filter(s => s.value !== 'all').map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleStatusChange(selectedContact._id, opt.value)}
                                            disabled={updateStatusMutation.isPending}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${selectedContact.status === opt.value
                                                ? opt.color + ' ring-2 ring-gray-800 dark:ring-white/20'
                                                : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-800 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Subject</label>
                                <p className="text-gray-900 dark:text-white font-medium">{selectedContact.subject}</p>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Message</label>
                                <div className="bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl p-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {selectedContact.message}
                                </div>
                            </div>

                            {/* Admin Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Admin Notes</label>
                                <textarea
                                    value={selectedContact.adminNotes || ''}
                                    onChange={(e) => setSelectedContact(prev => ({ ...prev, adminNotes: e.target.value }))}
                                    onBlur={(e) => updateNotesMutation.mutate({ id: selectedContact._id, notes: e.target.value })}
                                    placeholder="Add internal notes..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm resize-none"
                                />
                                {updateNotesMutation.isPending && (
                                    <p className="text-xs text-gray-500 mt-1">Saving...</p>
                                )}
                            </div>

                            {/* Reply History */}
                            {selectedContact.replies && selectedContact.replies.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Reply History</label>
                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {selectedContact.replies.map((reply, index) => (
                                            <div key={index} className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1.5">
                                                        <Reply size={14} />
                                                        {reply.sentByName || 'Admin'}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">{formatDate(reply.sentAt)}</span>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap">{reply.message}</p>
                                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-emerald-500/10 dark:border-white/5">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${reply.status === 'sent' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                                        }`}>
                                                        {reply.status === 'sent' ? 'Delivered' : 'Failed'}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">to {reply.emailSentTo}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Response Info */}
                            {selectedContact.respondedBy && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm">
                                    <p className="text-emerald-600 dark:text-emerald-400">
                                        Responded by <span className="font-medium">{selectedContact.respondedBy.name}</span>
                                        {selectedContact.respondedAt && ` on ${formatDate(selectedContact.respondedAt)}`}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white dark:bg-[#0f1218] border-t border-gray-800 dark:border-white/10 p-4 sm:p-6 flex justify-between transition-colors">
                            <button
                                onClick={() => {
                                    setDeleteId(selectedContact._id);
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                            <button
                                onClick={() => {
                                    setShowReplyModal(true);
                                    setReplyMessage('');
                                    setReplyError('');
                                    setReplySuccess(false);
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                            >
                                <Send size={16} />
                                Send Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#0f1218] rounded-2xl border border-gray-800 dark:border-white/10 p-6 max-w-md w-full shadow-2xl transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-red-500/10 dark:bg-red-500/20">
                                <Trash2 size={24} className="text-red-500 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Inquiry</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete this inquiry? All data will be permanently removed.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
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

            {/* Reply Modal */}
            {showReplyModal && selectedContact && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#0f1218] rounded-2xl border border-gray-800 dark:border-white/10 w-full max-w-lg shadow-2xl transition-colors">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-800 dark:border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                                        <Send size={20} className="text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reply to {selectedContact.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{selectedContact.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowReplyModal(false)}
                                    className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {/* Success State */}
                            {replySuccess && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle size={20} />
                                    <span>Reply sent successfully!</span>
                                </div>
                            )}

                            {/* Error State */}
                            {replyError && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-600 dark:text-red-400">
                                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                                    <span>{replyError}</span>
                                </div>
                            )}

                            {/* Original Subject */}
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Subject</label>
                                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-3 text-sm">
                                    Re: {selectedContact.subject}
                                </p>
                            </div>

                            {/* Reply Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Your Reply</label>
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Type your reply message here..."
                                    rows={6}
                                    disabled={sendReplyMutation.isPending || replySuccess}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm resize-none disabled:opacity-50"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Email will be sent to {selectedContact.email} with a professional template
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-800 dark:border-white/10 flex gap-3">
                            <button
                                onClick={() => setShowReplyModal(false)}
                                disabled={sendReplyMutation.isPending}
                                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => sendReplyMutation.mutate({ id: selectedContact._id, message: replyMessage })}
                                disabled={sendReplyMutation.isPending || !replyMessage.trim() || replySuccess}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sendReplyMutation.isPending ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : replySuccess ? (
                                    <>
                                        <CheckCircle size={16} />
                                        Sent!
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Send Reply
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
