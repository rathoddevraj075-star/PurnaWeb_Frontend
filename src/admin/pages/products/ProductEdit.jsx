/**
 * Product Edit Page - Premium Dark Design
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, categoryApi } from "../../services/adminApi";
import SeoFormTabs from "../../components/seo/SeoFormTabs";
import { Save, ArrowLeft, Eye, Loader2, Package, Layers, Image as ImageIcon, Box } from 'lucide-react';

const tabList = [
    { id: 'General', icon: Package },
    { id: 'Details', icon: Layers },
    { id: 'SEO', icon: SearchIcon },
    { id: 'Variants', icon: Box }
];

// Helper icon for SEO tab (internal use)
function SearchIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isNew = id === 'new';
    const [activeTab, setActiveTab] = useState('General');
    const [formData, setFormData] = useState({
        name: '', slug: '', shortDescription: '', description: '', brand: '',
        price: '', discountPrice: '', category: '', status: 'draft',
        images: [], seo: {}, tags: [], isFeatured: false
    });

    const { data: product, isLoading } = useQuery({
        queryKey: ['admin-product', id],
        queryFn: () => productApi.getOne(id).then(r => r.data.data),
        enabled: !isNew
    });

    const { data: categories } = useQuery({
        queryKey: ['admin-categories-all'],
        queryFn: () => categoryApi.getAll({ limit: 100 }).then(r => r.data.data)
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                slug: product.slug || '',
                shortDescription: product.shortDescription || '',
                description: product.description || '',
                brand: product.brand || '',
                price: product.price || '',
                discountPrice: product.discountPrice || '',
                category: product.category?._id || product.category || '',
                status: product.status || 'draft',
                images: product.images || [],
                seo: product.seo || {},
                tags: product.tags || [],
                isFeatured: product.isFeatured || false,
                variants: product.variants || []
            });
        }
    }, [product]);

    const saveMutation = useMutation({
        mutationFn: (data) => isNew ? productApi.create(data) : productApi.update(id, data),
        onSuccess: (res) => {
            queryClient.invalidateQueries(['admin-products']);
            if (isNew) navigate(`/admin/products/${res.data.data._id}`);
        }
    });

    const handleSave = () => saveMutation.mutate(formData);

    const handleSeoSuggest = async () => {
        if (isNew) return null;
        const res = await productApi.getSeoSuggestions(id);
        return res.data.data;
    };

    if (isLoading && !isNew) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-emerald-400" size={32} />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white shadow-sm">{isNew ? 'New Product' : `Edit: ${formData.name}`}</h1>
                        <p className="text-gray-400 text-sm mt-0.5">{isNew ? 'Create a new product listing' : 'Manage product details and SEO'}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {!isNew && (
                        <a
                            href={`/products/${formData.slug}`}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <Eye size={18} /> <span className="hidden sm:inline">Preview</span>
                        </a>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-xl hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all font-medium"
                    >
                        {saveMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto">
                {tabList.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id
                                ? 'text-white'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? 'text-emerald-400' : ''} />
                        {tab.id}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* General Tab */}
            {activeTab === 'General' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 shadow-xl shadow-black/20 space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">Product Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600"
                                    placeholder="Enter product name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">Slug</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600"
                                    placeholder="auto-generated-from-name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">Short Description</label>
                                <textarea
                                    value={formData.shortDescription}
                                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">Full Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={8}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 shadow-xl shadow-black/20 space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
                                >
                                    <option value="draft" className="bg-gray-900">Draft</option>
                                    <option value="published" className="bg-gray-900">Published</option>
                                    <option value="archived" className="bg-gray-900">Archived</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
                                >
                                    <option value="" className="bg-gray-900">Select category</option>
                                    {categories?.map(cat => (
                                        <option key={cat._id} value={cat._id} className="bg-gray-900">{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">Brand</label>
                                <input
                                    type="text"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-400">Price *</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-400">Sale Price</label>
                                    <input
                                        type="number"
                                        value={formData.discountPrice}
                                        onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600"
                                    />
                                </div>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-5 h-5 text-emerald-500 rounded border-gray-600 bg-gray-700 focus:ring-emerald-500 focus:ring-offset-gray-900"
                                />
                                <span className="text-sm font-medium text-white">Featured Product</span>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'SEO' && (
                <div className="animate-fade-in">
                    <SeoFormTabs
                        seo={formData.seo}
                        onChange={(seo) => setFormData({ ...formData, seo })}
                        onSuggest={isNew ? null : handleSeoSuggest}
                        entityName={formData.name}
                    />
                </div>
            )}

            {/* Details Tab */}
            {activeTab === 'Details' && (
                <div className="bg-[#0f1218] rounded-2xl p-12 border border-white/5 shadow-xl shadow-black/20 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Layers className="text-gray-500" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Ingredients & Benefits</h3>
                    <p className="text-gray-400">Detailed benefits editor coming soon...</p>
                </div>
            )}

            {/* Variants Tab */}
            {activeTab === 'Variants' && (
                <div className="bg-[#0f1218] rounded-2xl p-12 border border-white/5 shadow-xl shadow-black/20 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Box className="text-gray-500" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Variant Management</h3>
                    <p className="text-gray-400">SKU, Stock, and Pricing variants editor coming soon...</p>
                </div>
            )}
        </div>
    );
}
