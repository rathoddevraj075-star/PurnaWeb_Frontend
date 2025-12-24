/**
 * Store Edit/Create Page - Admin Panel
 * Premium Dark Design with Map Picker
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeApi, productApi } from '../../services/adminApi';
import {
    Save, ArrowLeft, Loader2, Store, MapPin, Phone, Mail,
    Clock, Package, Plus, X, Search, Check
} from 'lucide-react';

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

export default function StoreEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isNew = id === 'new';

    const [formData, setFormData] = useState({
        name: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
        },
        latitude: '',
        longitude: '',
        phone: '',
        email: '',
        storeType: 'retail',
        products: [],
        openingHours: {
            monday: { open: '09:00', close: '21:00' },
            tuesday: { open: '09:00', close: '21:00' },
            wednesday: { open: '09:00', close: '21:00' },
            thursday: { open: '09:00', close: '21:00' },
            friday: { open: '09:00', close: '21:00' },
            saturday: { open: '09:00', close: '21:00' },
            sunday: { open: '10:00', close: '20:00' }
        },
        isActive: true
    });

    const [productSearch, setProductSearch] = useState('');
    const [showProductPicker, setShowProductPicker] = useState(false);

    // Fetch store data if editing
    const { data: store, isLoading } = useQuery({
        queryKey: ['admin-store', id],
        queryFn: () => storeApi.getOne(id).then(r => r.data.data),
        enabled: !isNew
    });

    // Fetch all products for picker
    const { data: productsData, isLoading: productsLoading } = useQuery({
        queryKey: ['admin-products-for-store'],
        queryFn: async () => {
            const response = await productApi.getAll({ limit: 200 });
            // Response structure: { data: { success, data: products[] } }
            return response.data?.data || response.data || [];
        }
    });

    const allProducts = Array.isArray(productsData) ? productsData : [];

    // Populate form when store data loads
    useEffect(() => {
        if (store) {
            setFormData({
                name: store.name || '',
                address: store.address || { street: '', city: '', state: '', pincode: '', country: 'India' },
                latitude: store.location?.coordinates?.[1] || '',
                longitude: store.location?.coordinates?.[0] || '',
                phone: store.phone || '',
                email: store.email || '',
                storeType: store.storeType || 'retail',
                products: store.products?.map(p => typeof p === 'object' ? p._id : p) || [],
                openingHours: store.openingHours || formData.openingHours,
                isActive: store.isActive !== false
            });
        }
    }, [store]);

    const saveMutation = useMutation({
        mutationFn: (data) => isNew ? storeApi.create(data) : storeApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-stores']);
            navigate('/admin/stores');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    const toggleProduct = (productId) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.includes(productId)
                ? prev.products.filter(id => id !== productId)
                : [...prev.products, productId]
        }));
    };

    const filteredProducts = allProducts.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase())
    );

    const selectedProducts = allProducts.filter(p => formData.products.includes(p._id));

    if (isLoading && !isNew) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="text-emerald-400 animate-spin" size={32} />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/stores')}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Store className="text-emerald-400" size={28} />
                            {isNew ? 'Add Store' : 'Edit Store'}
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            {isNew ? 'Add a new retail partner' : `Editing: ${store?.name}`}
                        </p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                >
                    {saveMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isNew ? 'Create Store' : 'Save Changes'}
                </button>
            </div>

            {/* Basic Info */}
            <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 space-y-5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Store size={20} className="text-emerald-400" />
                    Store Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                        label="Store Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Wellness Pharmacy Mumbai"
                    />

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-400">Store Type *</label>
                        <select
                            value={formData.storeType}
                            onChange={(e) => setFormData({ ...formData, storeType: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                        >
                            <option value="retail" className="bg-gray-900">Retail Store</option>
                            <option value="wholesale" className="bg-gray-900">Wholesale</option>
                            <option value="pharmacy" className="bg-gray-900">Pharmacy</option>
                            <option value="supermarket" className="bg-gray-900">Supermarket</option>
                            <option value="other" className="bg-gray-900">Other</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                        label="Phone"
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="store@example.com"
                    />
                </div>
            </div>

            {/* Address */}
            <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 space-y-5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MapPin size={20} className="text-emerald-400" />
                    Location
                </h2>

                <Input
                    label="Street Address"
                    required
                    value={formData.address.street}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                    placeholder="123 Main Street, Near Central Mall"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Input
                        label="City"
                        required
                        value={formData.address.city}
                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                        placeholder="Mumbai"
                    />
                    <Input
                        label="State"
                        required
                        value={formData.address.state}
                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                        placeholder="Maharashtra"
                    />
                    <Input
                        label="Pincode"
                        required
                        value={formData.address.pincode}
                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })}
                        placeholder="400001"
                    />
                    <Input
                        label="Country"
                        value={formData.address.country}
                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                        placeholder="India"
                    />
                </div>

                {/* Coordinates */}
                <div className="bg-white/5 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">GPS Coordinates (for "Find Stock" feature)</p>
                        <a
                            href="https://www.google.com/maps"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-400 hover:underline"
                        >
                            Get from Google Maps →
                        </a>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Latitude"
                            required
                            type="number"
                            step="any"
                            value={formData.latitude}
                            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                            placeholder="19.0760"
                        />
                        <Input
                            label="Longitude"
                            required
                            type="number"
                            step="any"
                            value={formData.longitude}
                            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                            placeholder="72.8777"
                        />
                    </div>
                </div>
            </div>

            {/* Products Available */}
            <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Package size={20} className="text-emerald-400" />
                        Products Available
                    </h2>
                    <button
                        type="button"
                        onClick={() => setShowProductPicker(!showProductPicker)}
                        className="flex items-center gap-2 text-sm bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition-colors"
                    >
                        <Plus size={16} />
                        Add Products
                    </button>
                </div>

                {/* Selected Products */}
                {selectedProducts.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {selectedProducts.map(product => (
                            <div
                                key={product._id}
                                className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5"
                            >
                                <span className="text-emerald-300 text-sm">{product.name}</span>
                                <button
                                    type="button"
                                    onClick={() => toggleProduct(product._id)}
                                    className="text-emerald-400/50 hover:text-red-400 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 border-2 border-dashed border-white/10 rounded-xl">
                        <p className="text-gray-500 text-sm">No products selected</p>
                        <p className="text-gray-600 text-xs mt-1">Click "Add Products" to select which products are available at this store</p>
                    </div>
                )}

                {/* Product Picker Modal */}
                {showProductPicker && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-1">
                            {filteredProducts.map(product => (
                                <button
                                    type="button"
                                    key={product._id}
                                    onClick={() => toggleProduct(product._id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors ${formData.products.includes(product._id)
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : 'text-gray-300 hover:bg-white/5'
                                        }`}
                                >
                                    <span>{product.name}</span>
                                    {formData.products.includes(product._id) && (
                                        <Check size={16} className="text-emerald-400" />
                                    )}
                                </button>
                            ))}
                            {productsLoading && (
                                <div className="text-center py-4">
                                    <Loader2 className="animate-spin mx-auto text-emerald-400" size={20} />
                                    <p className="text-gray-500 text-sm mt-2">Loading products...</p>
                                </div>
                            )}
                            {!productsLoading && filteredProducts.length === 0 && allProducts.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-4">No products available. Add products first.</p>
                            )}
                            {!productsLoading && filteredProducts.length === 0 && allProducts.length > 0 && (
                                <p className="text-gray-500 text-sm text-center py-4">No products match "{productSearch}"</p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowProductPicker(false)}
                            className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Done selecting
                        </button>
                    </div>
                )}
            </div>

            {/* Opening Hours */}
            <div className="bg-[#0f1218] rounded-2xl p-6 border border-white/5 space-y-5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock size={20} className="text-emerald-400" />
                    Opening Hours
                </h2>

                <div className="grid gap-3">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                        <div key={day} className="flex items-center gap-4">
                            <span className="w-24 text-sm text-gray-400 capitalize">{day}</span>
                            <input
                                type="time"
                                value={formData.openingHours[day]?.open || '09:00'}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    openingHours: {
                                        ...formData.openingHours,
                                        [day]: { ...formData.openingHours[day], open: e.target.value }
                                    }
                                })}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="time"
                                value={formData.openingHours[day]?.close || '21:00'}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    openingHours: {
                                        ...formData.openingHours,
                                        [day]: { ...formData.openingHours[day], close: e.target.value }
                                    }
                                })}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Submit Button (Mobile) */}
            <div className="md:hidden">
                <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {saveMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isNew ? 'Create Store' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
