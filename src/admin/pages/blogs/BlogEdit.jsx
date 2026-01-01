/**
 * Blog Edit Page - Premium Dark Glass Design
 * Create and Edit blog posts with rich content support
 * Fully responsive for all screen sizes
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../../services/adminApi';
import {
    FileText, Save, ArrowLeft, Image as ImageIcon, Tag,
    Eye, EyeOff, Loader2, AlertCircle, Check, X,
    Upload, Trash2, Type, AlignLeft, Layers, CheckCircle, XCircle
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const CATEGORIES = [
    { value: 'wellness', label: 'Wellness' },
    { value: 'health', label: 'Health' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'tips', label: 'Tips' },
    { value: 'news', label: 'News' },
    { value: 'other', label: 'Other' }
];

const TABS = [
    { id: 'general', label: 'General', icon: Type },
    { id: 'content', label: 'Content', icon: AlignLeft },
    { id: 'media', label: 'Media', icon: ImageIcon }
];

// Reusable Input Component
const Input = ({ label, required, className = '', ...props }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-300 mb-2">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            {...props}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
        />
    </div>
);

// Reusable Textarea Component
const TextArea = ({ label, required, rows = 4, className = '', ...props }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-300 mb-2">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <textarea
            rows={rows}
            {...props}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm resize-none"
        />
    </div>
);

// Reusable Select Component
const Select = ({ label, required, options, className = '', ...props }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-300 mb-2">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <select
            {...props}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm appearance-none cursor-pointer"
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#0f1218]">
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

export default function BlogEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isNew = id === 'new';

    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'other',
        tags: [],
        isPublished: false,
        featuredImage: ''
    });
    const [tagInput, setTagInput] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }

    // Auto-hide notification after 5 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Fetch blog data for editing
    const { data: blogData, isLoading: isFetching } = useQuery({
        queryKey: ['admin-blog', id],
        queryFn: () => blogApi.getOne(id).then(r => r.data.data),
        enabled: !isNew
    });

    // Populate form when data loads
    useEffect(() => {
        if (blogData) {
            setFormData({
                title: blogData.title || '',
                excerpt: blogData.excerpt || '',
                content: blogData.content || '',
                category: blogData.category || 'other',
                tags: blogData.tags || [],
                isPublished: blogData.isPublished || false,
                featuredImage: blogData.featuredImage || ''
            });
            if (blogData.featuredImage) {
                setImagePreview(blogData.featuredImage);
            }
        }
    }, [blogData]);

    // Save mutation
    const saveMutation = useMutation({
        mutationFn: async (data) => {
            const formPayload = new FormData();
            formPayload.append('title', data.title);
            formPayload.append('excerpt', data.excerpt);
            formPayload.append('content', data.content);
            formPayload.append('category', data.category);
            formPayload.append('tags', JSON.stringify(data.tags));
            formPayload.append('isPublished', data.isPublished);

            if (imageFile) {
                formPayload.append('blogImage', imageFile);
            } else if (data.featuredImage) {
                formPayload.append('featuredImage', data.featuredImage);
            }

            if (isNew) {
                return blogApi.create(formPayload);
            } else {
                return blogApi.update(id, formPayload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
            setNotification({ type: 'success', message: isNew ? 'Blog post created successfully!' : 'Blog post updated successfully!' });
            setTimeout(() => navigate('/admin/blogs'), 1500);
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save blog post';
            setNotification({ type: 'error', message: errorMessage });
        }
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData(prev => ({ ...prev, featuredImage: '' }));
    };

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !formData.tags.includes(tag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag]
            }));
        }
        setTagInput('');
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tagToRemove)
        }));
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.content.trim()) newErrors.content = 'Content is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            saveMutation.mutate(formData);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={48} className="text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border transition-all animate-slide-in ${notification.type === 'success'
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/20 border-red-500/30 text-red-400'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span className="font-medium">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="ml-2 text-gray-400 hover:text-white">×</button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={() => navigate('/admin/blogs')}
                        className="p-2 sm:p-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                            <FileText size={20} className="sm:w-6 sm:h-6 text-purple-400" />
                            {isNew ? 'New Blog Post' : 'Edit Blog Post'}
                        </h1>
                        <p className="text-gray-400 text-sm mt-0.5 hidden sm:block">
                            {isNew ? 'Create a new article for your blog' : 'Update article details'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Publish Toggle */}
                    <button
                        onClick={() => handleChange('isPublished', !formData.isPublished)}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border font-medium text-sm transition-all ${formData.isPublished
                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                            : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                            }`}
                    >
                        {formData.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                        <span className="hidden sm:inline">{formData.isPublished ? 'Published' : 'Draft'}</span>
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
                        <span className="font-medium">Failed to save blog</span>
                        <p className="text-sm mt-1 text-red-300">
                            {saveMutation.error?.response?.data?.message || saveMutation.error?.message || 'Please check your input and try again.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="bg-[#0f1218] rounded-xl border border-white/5 p-1 flex overflow-x-auto">
                {TABS.map(tab => (
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
                        <Input
                            label="Title"
                            required
                            placeholder="Enter blog post title"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                        {errors.title && (
                            <p className="text-red-400 text-sm -mt-4 flex items-center gap-1">
                                <AlertCircle size={14} /> {errors.title}
                            </p>
                        )}

                        <TextArea
                            label="Excerpt"
                            placeholder="Brief summary of the article (displayed in listings)"
                            rows={3}
                            value={formData.excerpt}
                            onChange={(e) => handleChange('excerpt', e.target.value)}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Category"
                                required
                                options={CATEGORIES}
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Tags
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add a tag..."
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 transition-all"
                                    >
                                        <Tag size={16} />
                                    </button>
                                </div>
                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {formData.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 text-purple-400 text-sm rounded-lg border border-purple-500/30"
                                            >
                                                #{tag}
                                                <button
                                                    onClick={() => removeTag(tag)}
                                                    className="hover:text-red-400 transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                    <div className="space-y-4 quill-dark-theme mb-8">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Content <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={(content) => handleChange('content', content)}
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['link', 'image', 'clean'],
                                        [{ 'color': [] }, { 'background': [] }],
                                        [{ 'align': [] }]
                                    ],
                                }}
                                className="bg-white/5 border border-white/10 rounded-xl text-white overflow-hidden"
                            />
                        </div>
                        {errors.content && (
                            <p className="text-red-400 text-sm flex items-center gap-1">
                                <AlertCircle size={14} /> {errors.content}
                            </p>
                        )}
                        <style>{`
                            .quill-dark-theme .ql-toolbar {
                                background: rgba(255, 255, 255, 0.05);
                                border-color: rgba(255, 255, 255, 0.1) !important;
                                border-top-left-radius: 0.75rem;
                                border-top-right-radius: 0.75rem;
                            }
                            .quill-dark-theme .ql-container {
                                border-color: rgba(255, 255, 255, 0.1) !important;
                                border-bottom-left-radius: 0.75rem;
                                border-bottom-right-radius: 0.75rem;
                                min-height: 400px;
                                font-size: 1rem;
                                color: white;
                                background: transparent;
                            }
                            .quill-dark-theme .ql-editor.ql-blank::before {
                                color: #6b7280;
                                font-style: normal;
                            }
                            .quill-dark-theme .ql-stroke {
                                stroke: #9ca3af !important;
                            }
                            .quill-dark-theme .ql-fill {
                                fill: #9ca3af !important;
                            }
                            .quill-dark-theme .ql-picker {
                                color: #9ca3af !important;
                            }
                            .quill-dark-theme .ql-picker-options {
                                background-color: #0f1218 !important;
                                border-color: rgba(255, 255, 255, 0.1) !important;
                                color: white !important;
                            }
                        `}</style>
                    </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Featured Image
                            </label>

                            {imagePreview ? (
                                <div className="relative group">
                                    <img
                                        src={imagePreview}
                                        alt="Featured"
                                        className="w-full max-w-md aspect-video object-cover rounded-xl border border-white/10"
                                    />
                                    <button
                                        onClick={removeImage}
                                        className="absolute top-3 right-3 p-2 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full max-w-md aspect-video border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-emerald-500/50 hover:bg-white/[0.02] transition-all">
                                    <div className="flex flex-col items-center justify-center py-6">
                                        <Upload size={40} className="text-gray-500 mb-3" />
                                        <p className="text-sm text-gray-400 mb-1">
                                            <span className="text-emerald-400 font-medium">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, WEBP up to 10MB
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        <Input
                            label="Image URL (Alternative)"
                            placeholder="https://example.com/image.jpg"
                            value={formData.featuredImage}
                            onChange={(e) => handleChange('featuredImage', e.target.value)}
                            disabled={!!imageFile}
                        />
                        <p className="text-gray-500 text-sm -mt-4">
                            You can either upload an image or provide a URL
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom Action Bar - Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0c10]/95 backdrop-blur-md border-t border-white/10 p-4 flex gap-3 z-40">
                <button
                    onClick={() => handleChange('isPublished', !formData.isPublished)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-medium text-sm transition-all ${formData.isPublished
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                        }`}
                >
                    {formData.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                    {formData.isPublished ? 'Published' : 'Draft'}
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
                    {saveMutation.isPending ? 'Saving...' : 'Save Post'}
                </button>
            </div>

            {/* Spacer for mobile bottom bar */}
            <div className="lg:hidden h-20" />
        </div>
    );
}
