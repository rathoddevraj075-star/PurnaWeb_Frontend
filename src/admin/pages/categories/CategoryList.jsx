/**
 * Category List Page - Premium Dark Design
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { categoryApi } from "../../services/adminApi";
import { Plus, Edit, Trash2, ChevronRight, FolderTree } from 'lucide-react';

export default function CategoryList() {
    const queryClient = useQueryClient();
    const [expandedIds, setExpandedIds] = useState([]);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-categories-tree'],
        queryFn: () => categoryApi.getTree().then(r => r.data.data)
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => categoryApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries(['admin-categories-tree'])
    });

    const toggleExpand = (id) => {
        setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const renderCategory = (category, level = 0) => (
        <div key={category._id}>
            <div
                className={`flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors group`}
                style={{ paddingLeft: `${24 + level * 32}px` }}
            >
                {category.children?.length > 0 ? (
                    <button
                        onClick={() => toggleExpand(category._id)}
                        className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                    >
                        <ChevronRight size={16} className={`transition-transform duration-200 ${expandedIds.includes(category._id) ? 'rotate-90' : ''}`} />
                    </button>
                ) : (
                    <span className="w-6" />
                )}

                {category.image?.url ? (
                    <img src={category.image.url} alt="" className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/10" />
                ) : (
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center ring-1 ring-white/10">
                        <FolderTree size={16} className="text-gray-500" />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">{category.name}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">{category.slug}</p>
                </div>

                <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${category.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                    </span>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${(category.seo?.seoScore || 0) >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            (category.seo?.seoScore || 0) >= 50 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        SEO: {category.seo?.seoScore || 0}%
                    </span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                            to={`/admin/categories/${category._id}`}
                            className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                        >
                            <Edit size={16} />
                        </Link>
                        <button
                            onClick={() => window.confirm(`Delete "${category.name}"?`) && deleteMutation.mutate(category._id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${expandedIds.includes(category._id) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {category.children?.map(child => renderCategory(child, level + 1))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FolderTree className="text-purple-400" />
                        Categories
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Organize your product hierarchy</p>
                </div>
                <Link
                    to="/admin/categories/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20 transition-all font-medium"
                >
                    <Plus size={18} /> Add Category
                </Link>
            </div>

            <div className="bg-[#0f1218] rounded-2xl border border-white/5 shadow-xl shadow-black/20 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-500">Loading...</div>
                ) : data?.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <FolderTree size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No categories found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {data?.map(category => renderCategory(category))}
                    </div>
                )}
            </div>
        </div>
    );
}
