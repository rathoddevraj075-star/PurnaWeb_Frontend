/**
 * System Settings Page - Premium Dark Glass Design
 * Manage site-wide settings and email preferences
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../../services/adminApi';
import {
    Settings, Save, Globe, Mail, Bell, AlertTriangle,
    Loader2, Check, AlertCircle, Facebook, Instagram,
    Twitter, Youtube, Linkedin, Phone
} from 'lucide-react';

export default function SystemSettings() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        siteName: '',
        siteDescription: '',
        contactEmail: '',
        contactPhone: '',
        emailNotifications: {
            newOrder: true,
            newContact: true,
            newUser: false,
            lowStock: true,
            dailySummary: false
        },
        maintenanceMode: false,
        maintenanceMessage: '',
        socialLinks: {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: '',
            linkedin: ''
        }
    });
    // State for toast notifications
    const [notification, setNotification] = useState(null);

    // Auto-hide notification after 5 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Fetch settings
    const { data: settings, isLoading } = useQuery({
        queryKey: ['admin-settings'],
        queryFn: () => settingsApi.getSettings().then(r => r.data.data)
    });

    // Update form when settings load
    useEffect(() => {
        if (settings) {
            setFormData({
                siteName: settings.siteName || '',
                siteDescription: settings.siteDescription || '',
                contactEmail: settings.contactEmail || '',
                contactPhone: settings.contactPhone || '',
                emailNotifications: {
                    newOrder: settings.emailNotifications?.newOrder ?? true,
                    newContact: settings.emailNotifications?.newContact ?? true,
                    newUser: settings.emailNotifications?.newUser ?? false,
                    lowStock: settings.emailNotifications?.lowStock ?? true,
                    dailySummary: settings.emailNotifications?.dailySummary ?? false
                },
                maintenanceMode: settings.maintenanceMode || false,
                maintenanceMessage: settings.maintenanceMessage || '',
                socialLinks: {
                    facebook: settings.socialLinks?.facebook || '',
                    instagram: settings.socialLinks?.instagram || '',
                    twitter: settings.socialLinks?.twitter || '',
                    youtube: settings.socialLinks?.youtube || '',
                    linkedin: settings.socialLinks?.linkedin || ''
                }
            });
        }
    }, [settings]);

    // Update settings mutation
    const updateMutation = useMutation({
        mutationFn: (data) => settingsApi.updateSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
            setNotification({ type: 'success', message: 'System settings saved successfully' });

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onError: (error) => {
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Failed to update settings'
            });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    const handleNotificationToggle = (key) => {
        setFormData(prev => ({
            ...prev,
            emailNotifications: {
                ...prev.emailNotifications,
                [key]: !prev.emailNotifications[key]
            }
        }));
    };

    const handleSocialChange = (platform, value) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [platform]: value
            }
        }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={48} className="text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto relative">
            {/* Toast Notification */}
            {notification && (
                <div className={`fixed top-24 right-6 z-50 transform transition-all duration-300 ease-out animate-slide-in
                    flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border`
                }
                    style={{
                        backgroundColor: notification.type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                        borderColor: notification.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                    }}>
                    <div className="p-2 bg-white/20 rounded-full">
                        {notification.type === 'success' ? <Check size={20} className="text-white" /> : <AlertCircle size={20} className="text-white" />}
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">
                            {notification.type === 'success' ? 'Success' : 'Error'}
                        </h4>
                        <p className="text-white/90 text-sm">{notification.message}</p>
                    </div>
                    <button
                        onClick={() => setNotification(null)}
                        className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <Settings size={14} className="opacity-0" /> {/* Spacer */}
                        <div className="absolute right-4 top-4">×</div>
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20">
                            <Settings size={22} />
                        </div>
                        System Settings
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Manage site-wide configuration</p>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={updateMutation.isPending}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50"
                >
                    {updateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save All Settings
                </button>
            </div>

            {/* Site Information */}
            <div className="bg-[#0f1218] rounded-2xl border border-white/5 p-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                    <Globe size={18} className="text-blue-400" />
                    Site Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                        <input
                            type="text"
                            value={formData.siteName}
                            onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
                            placeholder="Your Site Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                value={formData.contactEmail}
                                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
                                placeholder="contact@yoursite.com"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
                        <textarea
                            value={formData.siteDescription}
                            onChange={(e) => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))}
                            rows={2}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm resize-none"
                            placeholder="Brief description of your site"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone</label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="tel"
                                value={formData.contactPhone}
                                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Notifications */}
            <div className="bg-[#0f1218] rounded-2xl border border-white/5 p-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                    <Bell size={18} className="text-amber-400" />
                    Email Notifications
                </h3>

                <div className="space-y-4">
                    {[
                        { key: 'newContact', label: 'New Contact Inquiry', desc: 'Receive emails when someone submits the contact form' },
                        { key: 'newUser', label: 'New User Registration', desc: 'Receive emails when a new user signs up' }
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div>
                                <p className="text-white font-medium text-sm">{item.label}</p>
                                <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => handleNotificationToggle(item.key)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${formData.emailNotifications[item.key] ? 'bg-emerald-500' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.emailNotifications[item.key] ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Maintenance Mode */}
            <div className="bg-[#0f1218] rounded-2xl border border-white/5 p-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                    <AlertTriangle size={18} className="text-red-400" />
                    Maintenance Mode
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                            <p className="text-white font-medium text-sm">Enable Maintenance Mode</p>
                            <p className="text-gray-500 text-xs mt-0.5">Show maintenance page to visitors (admins can still access)</p>
                        </div>
                        <button
                            onClick={() => setFormData(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                            className={`relative w-12 h-6 rounded-full transition-colors ${formData.maintenanceMode ? 'bg-red-500' : 'bg-white/10'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.maintenanceMode ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {formData.maintenanceMode && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Maintenance Message</label>
                            <textarea
                                value={formData.maintenanceMessage}
                                onChange={(e) => setFormData(prev => ({ ...prev, maintenanceMessage: e.target.value }))}
                                rows={2}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all text-sm resize-none"
                                placeholder="Message to show visitors during maintenance"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-[#0f1218] rounded-2xl border border-white/5 p-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                    <Globe size={18} className="text-cyan-400" />
                    Social Media Links
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-400' },
                        { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400' },
                        { key: 'twitter', label: 'Twitter / X', icon: Twitter, color: 'text-sky-400' },
                        { key: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-400' },
                        { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-500' }
                    ].map((social) => (
                        <div key={social.key} className="relative">
                            <social.icon size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${social.color}`} />
                            <input
                                type="url"
                                value={formData.socialLinks[social.key]}
                                onChange={(e) => handleSocialChange(social.key, e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
                                placeholder={`${social.label} URL`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Save Button */}
            <div className="flex justify-end pb-4">
                <button
                    onClick={handleSubmit}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50"
                >
                    {updateMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save All Settings
                </button>
            </div>
        </div>
    );
}
