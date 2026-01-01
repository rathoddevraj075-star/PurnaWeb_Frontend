/**
 * Product Edit Page - Premium Dark Design
 * Enhanced with all product fields for live preview
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, categoryApi } from "../../services/adminApi";
import SeoFormTabs from "../../components/seo/SeoFormTabs";
import {
    Save, ArrowLeft, Eye, Loader2, Package, Layers,
    ImageIcon, Box, Plus, Trash2, Star, Palette,
    ListChecks, Sparkles, FlaskConical
} from 'lucide-react';

const tabList = [
    { id: 'General', icon: Package },
    { id: 'Images', icon: ImageIcon },
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

// Reusable styled input component
const Input = ({ label, required, ...props }) => (
    <div>
        <label className="block text-sm font-medium mb-2 text-gray-400">
            {label} {required && '*'}
        </label>
        <input
            {...props}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600"
        />
    </div>
);

// Reusable styled textarea component
const TextArea = ({ label, required, rows = 4, ...props }) => (
    <div>
        <label className="block text-sm font-medium mb-2 text-gray-400">
            {label} {required && '*'}
        </label>
        <textarea
            {...props}
            rows={rows}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600"
        />
    </div>
);

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isNew = id === 'new';
    const [activeTab, setActiveTab] = useState('General');

    // Extended form data with all product fields
    const [formData, setFormData] = useState({
        // Basic Info
        name: '',
        slug: '',
        shortDescription: '',
        description: '',
        brand: '',
        tagline: '',

        // Status
        category: '',
        status: 'draft',

        // Media
        images: [],
        themeColor: '#000000',

        // Product Details
        keyBenefits: [],
        heroIngredient: { name: '', description: '' },
        howToUse: '',
        suitableFor: [],

        // Quick Summary for 3D Page
        benefitsSummary: '',
        ingredientsSummary: '',

        // Accordion Data
        accordion: {
            BENEFITS: [],
            INGREDIENTS: []
        },

        // Other
        seo: {},
        tags: [],
        isFeatured: false,
        variants: []
    });

    // Temp state for adding items
    const [newBenefit, setNewBenefit] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newSuitableFor, setNewSuitableFor] = useState('');
    const [newIngredient, setNewIngredient] = useState({ name: '', percentage: '', description: '' });

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
                tagline: product.tagline || '',
                category: product.category?._id || product.category || '',
                status: product.status || 'draft',
                images: product.images || [],
                themeColor: product.themeColor || '#000000',
                keyBenefits: product.keyBenefits || [],
                heroIngredient: product.heroIngredient || { name: '', description: '' },
                howToUse: product.howToUse || '',
                suitableFor: product.suitableFor || [],
                benefitsSummary: product.benefitsSummary || '',
                ingredientsSummary: product.ingredientsSummary || '',
                accordion: product.accordion || { BENEFITS: [], INGREDIENTS: [] },
                seo: product.seo || {},
                tags: product.tags || [],
                isFeatured: product.isFeatured || false,
                variants: product.variants || []
            });
        }
    }, [product]);

    const saveMutation = useMutation({
        mutationFn: (data) => isNew ? productApi.create(data) : productApi.update(id, data),
        retry: false, // Prevent automatic retries
        onSuccess: (res) => {
            queryClient.invalidateQueries(['admin-products']);
            queryClient.invalidateQueries(['admin-product', id]); // Refresh current product
            if (isNew) navigate(`/admin/products/${res.data.data._id}`);
        }
    });

    const handleSave = () => {
        if (saveMutation.isPending) return; // Prevent double-click
        saveMutation.mutate(formData);
    };

    const handleSeoSuggest = async () => {
        if (isNew) return null;
        const res = await productApi.getSeoSuggestions(id);
        return res.data.data;
    };

    // Image management handlers
    const addImage = () => {
        if (!newImageUrl.trim()) return;
        const newImg = {
            url: newImageUrl.trim(),
            alt: formData.name || 'Product image',
            isPrimary: formData.images.length === 0
        };
        setFormData({ ...formData, images: [...formData.images, newImg] });
        setNewImageUrl('');
    };

    const removeImage = (index) => {
        const updated = formData.images.filter((_, i) => i !== index);
        // Ensure first image is primary if we removed the primary
        if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
            updated[0].isPrimary = true;
        }
        setFormData({ ...formData, images: updated });
    };

    const setPrimaryImage = (index) => {
        const updated = formData.images.map((img, i) => ({
            ...img,
            isPrimary: i === index
        }));
        setFormData({ ...formData, images: updated });
    };

    // Key Benefits handlers
    const addBenefit = () => {
        if (!newBenefit.trim()) return;
        setFormData({ ...formData, keyBenefits: [...formData.keyBenefits, newBenefit.trim()] });
        setNewBenefit('');
    };

    const removeBenefit = (index) => {
        setFormData({
            ...formData,
            keyBenefits: formData.keyBenefits.filter((_, i) => i !== index)
        });
    };

    // Ingredient handlers
    const addIngredient = () => {
        if (!newIngredient.name.trim()) return;
        const updatedAccordion = {
            ...formData.accordion,
            INGREDIENTS: [...(formData.accordion?.INGREDIENTS || []), { ...newIngredient }]
        };
        setFormData({ ...formData, accordion: updatedAccordion });
        setNewIngredient({ name: '', percentage: '', description: '' });
    };

    const removeIngredient = (index) => {
        const updatedAccordion = {
            ...formData.accordion,
            INGREDIENTS: formData.accordion.INGREDIENTS.filter((_, i) => i !== index)
        };
        setFormData({ ...formData, accordion: updatedAccordion });
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
                            <Input
                                label="Product Name"
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter product name"
                            />
                            <Input
                                label="Slug"
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="auto-generated-from-name"
                            />
                            <Input
                                label="Tagline"
                                type="text"
                                value={formData.tagline}
                                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                placeholder="Short catchy tagline for the product"
                            />
                            <TextArea
                                label="Short Description"
                                rows={2}
                                value={formData.shortDescription}
                                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                placeholder="Brief product summary"
                            />
                            <TextArea
                                label="Full Description"
                                required
                                rows={8}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Detailed product description"
                            />
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
                            <Input
                                label="Brand"
                                type="text"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                placeholder="Brand name"
                            />

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

            {/* Images Tab */}
            {activeTab === 'Images' && (
                <div className="animate-fade-in space-y-6">
                    {/* Theme Color */}
                    <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 shadow-xl shadow-black/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Palette className="text-emerald-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Theme Color</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">This color is used throughout the product page for accents and theming.</p>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                value={formData.themeColor}
                                onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                                className="w-16 h-16 rounded-xl cursor-pointer border-2 border-white/10"
                            />
                            <div>
                                <input
                                    type="text"
                                    value={formData.themeColor}
                                    onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-mono"
                                    placeholder="#000000"
                                />
                                <p className="text-gray-500 text-xs mt-1">Hex color code</p>
                            </div>
                            <div
                                className="flex-1 h-16 rounded-xl border border-white/10"
                                style={{ backgroundColor: formData.themeColor }}
                            />
                        </div>
                    </div>

                    {/* Product Images */}
                    <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 shadow-xl shadow-black/20">
                        <div className="flex items-center gap-3 mb-4">
                            <ImageIcon className="text-emerald-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Product Images</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Add product images via URL. The primary image is displayed on the 3D product packaging.</p>

                        {/* Add Image Input */}
                        <div className="flex gap-3 mb-6">
                            <input
                                type="text"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600"
                                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                                onKeyDown={(e) => e.key === 'Enter' && addImage()}
                            />
                            <button
                                onClick={addImage}
                                className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl hover:bg-emerald-500/30 transition-colors font-medium"
                            >
                                <Plus size={18} /> Add
                            </button>
                        </div>

                        {/* Image Grid */}
                        {formData.images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.images.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`relative group rounded-xl overflow-hidden border-2 ${img.isPrimary ? 'border-emerald-500' : 'border-white/10'}`}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.alt || 'Product'}
                                            className="w-full h-32 object-cover"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Error'; }}
                                        />
                                        {img.isPrimary && (
                                            <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                <Star size={10} className="fill-current" /> Primary
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            {!img.isPrimary && (
                                                <button
                                                    onClick={() => setPrimaryImage(index)}
                                                    className="p-2 bg-white/20 rounded-lg hover:bg-emerald-500/50 transition-colors"
                                                    title="Set as primary"
                                                >
                                                    <Star size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="p-2 bg-white/20 rounded-lg hover:bg-red-500/50 transition-colors"
                                                title="Remove image"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
                                <ImageIcon className="mx-auto text-gray-600 mb-3" size={40} />
                                <p className="text-gray-400">No images added yet</p>
                                <p className="text-gray-500 text-sm">Add image URLs above</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Details Tab - Enhanced for 3D Product Page */}
            {activeTab === 'Details' && (
                <div className="animate-fade-in space-y-6">
                    {/* 3D Page Summaries Section */}
                    <div className="bg-[#0f1218] rounded-2xl p-6 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="text-emerald-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">3D Product Page Content</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">These fields are displayed on the immersive 3D product page during the scroll journey.</p>

                        <div className="space-y-6">
                            {/* Benefits Summary */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">
                                    Benefits Title <span className="text-emerald-400">(2-3 words, shown large)</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.benefitsSummary}
                                    onChange={(e) => setFormData({ ...formData, benefitsSummary: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-2xl font-bold uppercase tracking-wider focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600"
                                    placeholder="PURE RADIANCE"
                                />
                                <p className="text-gray-500 text-xs mt-2">Example: "DEEP HYDRATION", "NATURAL GLOW", "PURE POWER"</p>
                            </div>

                            {/* Ingredients Summary */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">
                                    Ingredients Description <span className="text-emerald-400">(shown during scroll)</span>
                                </label>
                                <textarea
                                    value={formData.ingredientsSummary}
                                    onChange={(e) => setFormData({ ...formData, ingredientsSummary: e.target.value })}
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600"
                                    placeholder="Aloe Vera, Neem Extract, Turmeric, Vitamin E..."
                                />
                                <p className="text-gray-500 text-xs mt-2">List key ingredients that float up during the "Powered By Nature's Best" phase</p>
                            </div>

                            {/* Preview Card */}
                            <div className="bg-black/50 rounded-xl p-6 border border-white/10">
                                <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-4">Preview</h4>
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <p className="text-gray-500 text-xs mb-2">Phase 3: Benefits</p>
                                        <h3 className="text-4xl font-black uppercase" style={{ color: formData.themeColor || '#E65800' }}>
                                            {formData.benefitsSummary?.split(' ')[0] || 'PURE'}
                                        </h3>
                                        <h3 className="text-4xl font-black text-white uppercase">
                                            {formData.benefitsSummary?.split(' ').slice(1).join(' ') || 'POWER'}
                                        </h3>
                                    </div>
                                    <div className="border-t border-white/10 pt-4">
                                        <p className="text-gray-500 text-xs mb-2">Phase 2: Ingredients</p>
                                        <p className="text-white/70 text-sm">
                                            {formData.ingredientsSummary || 'A potent blend of organic botanicals...'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Key Benefits Section */}
                    <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 shadow-xl shadow-black/20">
                        <div className="flex items-center gap-3 mb-4">
                            <ListChecks className="text-emerald-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Key Benefits</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Add the main benefits of this product. These appear as bullet points on the product page.</p>

                        {/* Add Benefit Input */}
                        <div className="flex gap-3 mb-4">
                            <input
                                type="text"
                                value={newBenefit}
                                onChange={(e) => setNewBenefit(e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600"
                                placeholder="e.g., Deeply hydrates skin for 24 hours"
                                onKeyDown={(e) => e.key === 'Enter' && addBenefit()}
                            />
                            <button
                                onClick={addBenefit}
                                className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl hover:bg-emerald-500/30 transition-colors font-medium"
                            >
                                <Plus size={18} /> Add
                            </button>
                        </div>

                        {/* Benefits List */}
                        {formData.keyBenefits.length > 0 ? (
                            <div className="space-y-2">
                                {formData.keyBenefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 group">
                                        <span className="text-emerald-400">✓</span>
                                        <span className="flex-1 text-white text-sm">{benefit}</span>
                                        <button
                                            onClick={() => removeBenefit(index)}
                                            className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 border-2 border-dashed border-white/10 rounded-xl">
                                <p className="text-gray-500 text-sm">No benefits added yet</p>
                            </div>
                        )}
                    </div>

                    {/* Hero Ingredient Section */}
                    <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 shadow-xl shadow-black/20">
                        <div className="flex items-center gap-3 mb-4">
                            <FlaskConical className="text-emerald-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Hero Ingredient</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Highlight the star ingredient of this product.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Ingredient Name"
                                type="text"
                                value={formData.heroIngredient?.name || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    heroIngredient: { ...formData.heroIngredient, name: e.target.value }
                                })}
                                placeholder="e.g., Hyaluronic Acid"
                            />
                            <div className="md:col-span-2">
                                <TextArea
                                    label="Description"
                                    rows={2}
                                    value={formData.heroIngredient?.description || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        heroIngredient: { ...formData.heroIngredient, description: e.target.value }
                                    })}
                                    placeholder="Describe why this ingredient is special and its benefits..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Suitable For Section */}
                    <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 shadow-xl shadow-black/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="text-emerald-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Suitable For</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Specify skin types, hair types, or conditions this product is suitable for.</p>

                        {/* Add Suitable For Input */}
                        <div className="flex gap-3 mb-4">
                            <input
                                type="text"
                                value={newSuitableFor}
                                onChange={(e) => setNewSuitableFor(e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600"
                                placeholder="e.g., Oily Skin, Dry Hair, All Skin Types"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newSuitableFor.trim()) {
                                        setFormData({ ...formData, suitableFor: [...formData.suitableFor, newSuitableFor.trim()] });
                                        setNewSuitableFor('');
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    if (newSuitableFor.trim()) {
                                        setFormData({ ...formData, suitableFor: [...formData.suitableFor, newSuitableFor.trim()] });
                                        setNewSuitableFor('');
                                    }
                                }}
                                className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl hover:bg-emerald-500/30 transition-colors font-medium"
                            >
                                <Plus size={18} /> Add
                            </button>
                        </div>

                        {/* Suitable For Tags */}
                        {formData.suitableFor.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {formData.suitableFor.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 group">
                                        <span className="text-white text-sm">{item}</span>
                                        <button
                                            onClick={() => setFormData({
                                                ...formData,
                                                suitableFor: formData.suitableFor.filter((_, i) => i !== index)
                                            })}
                                            className="text-gray-500 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 border-2 border-dashed border-white/10 rounded-xl">
                                <p className="text-gray-500 text-sm">No skin/hair types added yet</p>
                            </div>
                        )}
                    </div>

                    {/* How To Use Section */}
                    <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 shadow-xl shadow-black/20">
                        <div className="flex items-center gap-3 mb-4">
                            <ListChecks className="text-emerald-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">How To Use</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Provide clear usage instructions for this product.</p>

                        <TextArea
                            label="Usage Instructions"
                            rows={4}
                            value={formData.howToUse}
                            onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                            placeholder="1. Apply a small amount to damp skin...&#10;2. Massage gently in circular motions...&#10;3. Rinse with warm water..."
                        />
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                        <div className="text-blue-400 mt-0.5">ℹ️</div>
                        <div>
                            <p className="text-blue-300 text-sm font-medium">About the 3D Product Page</p>
                            <p className="text-blue-200/70 text-xs mt-1">
                                The immersive product page uses: <strong>Name</strong>, <strong>Images</strong>, <strong>Theme Color</strong>,
                                <strong> Short Description</strong>, and these summary fields. Other product data is used on standard listing pages.
                            </p>
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
