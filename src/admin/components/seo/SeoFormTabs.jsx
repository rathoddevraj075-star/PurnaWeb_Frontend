/**
 * SEO Form Tabs Component - Reusable SEO editor with tabs (Premium Dark Design)
 */

import { useState } from 'react';
import { AlertCircle, CheckCircle, Info, Search, Share2, Settings, Code, Sparkles } from 'lucide-react';
import SerpPreview from './SerpPreview';
import CharacterCounter from './CharacterCounter';

const tabs = [
    { id: 'general', label: 'General', icon: Search },
    { id: 'social', label: 'Social', icon: Share2 },
    { id: 'advanced', label: 'Advanced', icon: Settings },
    { id: 'schema', label: 'Schema', icon: Code },
];

export default function SeoFormTabs({ seo = {}, onChange, onSuggest, entityName = '' }) {
    const [activeTab, setActiveTab] = useState('general');

    const updateField = (path, value) => {
        const keys = path.split('.');
        const newSeo = { ...seo };
        let current = newSeo;

        for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = current[keys[i]] || {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        onChange(newSeo);
    };

    const handleApplySuggestions = async () => {
        if (onSuggest) {
            const suggestions = await onSuggest();
            if (suggestions) {
                onChange({ ...seo, ...suggestions });
            }
        }
    };

    return (
        <div className="bg-white dark:bg-[#0f1218] rounded-2xl border border-gray-800 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-black/20 overflow-hidden text-left">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-white/5 overflow-x-auto bg-gray-50 dark:bg-white/[0.02]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id
                            ? 'text-gray-900 dark:text-white bg-white dark:bg-white/5'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? 'text-emerald-500 dark:text-emerald-400' : ''} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        )}
                    </button>
                ))}
                <div className="flex-1 flex justify-end items-center px-4 min-w-[200px]">
                    {onSuggest && (
                        <button
                            onClick={handleApplySuggestions}
                            className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors border border-emerald-500/20"
                        >
                            <Sparkles size={14} />
                            Auto-Generate SEO
                        </button>
                    )}
                </div>
            </div>

            <div className="p-6">
                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Meta Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                value={seo.metaTitle || ''}
                                onChange={(e) => updateField('metaTitle', e.target.value)}
                                className="w-full bg-white dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
                                placeholder="Enter meta title..."
                            />
                            <div className="mt-1">
                                <CharacterCounter current={seo.metaTitle?.length || 0} min={30} max={60} />
                            </div>
                        </div>

                        {/* Meta Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                                Meta Description
                            </label>
                            <textarea
                                value={seo.metaDescription || ''}
                                onChange={(e) => updateField('metaDescription', e.target.value)}
                                rows={3}
                                className="w-full bg-white dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
                                placeholder="Enter meta description..."
                            />
                            <div className="mt-1">
                                <CharacterCounter current={seo.metaDescription?.length || 0} min={120} max={160} />
                            </div>
                        </div>

                        {/* Focus Keyword */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                                Focus Keyword
                            </label>
                            <input
                                type="text"
                                value={seo.focusKeyword || ''}
                                onChange={(e) => updateField('focusKeyword', e.target.value)}
                                className="w-full bg-white dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
                                placeholder="Primary keyword to optimize for..."
                            />
                        </div>

                        {/* SERP Preview */}
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/5">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Search Engine Preview</h3>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <SerpPreview
                                    title={seo.metaTitle || entityName}
                                    description={seo.metaDescription || ''}
                                    url={seo.canonicalUrl || '/'}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Social Tab */}
                {activeTab === 'social' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Open Graph */}
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Share2 size={18} className="text-blue-500 dark:text-blue-400" /> Open Graph (Facebook, LinkedIn)
                            </h3>
                            <div className="space-y-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">OG Title</label>
                                    <input
                                        type="text"
                                        value={seo.openGraph?.title || ''}
                                        onChange={(e) => updateField('openGraph.title', e.target.value)}
                                        className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                        placeholder="Title for social sharing"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">OG Description</label>
                                    <textarea
                                        value={seo.openGraph?.description || ''}
                                        onChange={(e) => updateField('openGraph.description', e.target.value)}
                                        rows={2}
                                        className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                        placeholder="Description for social sharing"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">OG Image URL</label>
                                    <input
                                        type="text"
                                        value={seo.openGraph?.image || ''}
                                        onChange={(e) => updateField('openGraph.image', e.target.value)}
                                        className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Twitter */}
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Share2 size={18} className="text-sky-500 dark:text-sky-400" /> Twitter Card
                            </h3>
                            <div className="space-y-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">Card Type</label>
                                    <select
                                        value={seo.twitter?.cardType || 'summary_large_image'}
                                        onChange={(e) => updateField('twitter.cardType', e.target.value)}
                                        className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500/50 transition-colors"
                                    >
                                        <option value="summary" className="bg-white dark:bg-gray-900">Summary</option>
                                        <option value="summary_large_image" className="bg-white dark:bg-gray-900">Summary Large Image</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">Twitter Title</label>
                                    <input
                                        type="text"
                                        value={seo.twitter?.title || ''}
                                        onChange={(e) => updateField('twitter.title', e.target.value)}
                                        className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-sky-500/50 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Advanced Tab */}
                {activeTab === 'advanced' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Canonical URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                                Canonical URL
                            </label>
                            <input
                                type="text"
                                value={seo.canonicalUrl || ''}
                                onChange={(e) => updateField('canonicalUrl', e.target.value)}
                                className="w-full bg-white dark:bg-white/5 border border-gray-800 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                                placeholder="/products/example-product"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Leave empty to use the default URL found in settings
                            </p>
                        </div>

                        {/* Robots */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-4">
                                Robots Meta Instructions
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { key: 'index', label: 'Allow indexing' },
                                    { key: 'follow', label: 'Follow links' },
                                    { key: 'noarchive', label: 'No archive', invert: true },
                                    { key: 'nosnippet', label: 'No snippet', invert: true },
                                ].map((opt) => (
                                    <label key={opt.key} className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={opt.invert ? seo.robots?.[opt.key] : (seo.robots?.[opt.key] !== false)}
                                            onChange={(e) => updateField(`robots.${opt.key}`, opt.invert ? e.target.checked : e.target.checked)}
                                            className="w-4 h-4 text-emerald-500 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-emerald-500 focus:ring-offset-gray-900"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-200">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Schema Tab */}
                {activeTab === 'schema' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-start gap-3 p-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20">
                            <Info size={20} className="flex-shrink-0 mt-0.5" />
                            <span className="text-sm">JSON-LD schemas are structured data that help search engines understand your content. We auto-generate standard Product and Article schemas.</span>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={seo.jsonLd?.autoGenerate !== false}
                                    onChange={(e) => updateField('jsonLd.autoGenerate', e.target.checked)}
                                    className="w-5 h-5 text-emerald-500 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-emerald-500 focus:ring-offset-gray-900"
                                />
                                <span className="text-base font-medium text-gray-900 dark:text-white">Auto-generate schema from product data</span>
                            </label>
                        </div>

                        {seo.jsonLd?.autoGenerate === false && (
                            <div className="animate-fade-in">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                                    Custom Schema (JSON-LD)
                                </label>
                                <textarea
                                    value={typeof seo.jsonLd?.customSchema === 'string'
                                        ? seo.jsonLd.customSchema
                                        : JSON.stringify(seo.jsonLd?.customSchema, null, 2) || ''}
                                    onChange={(e) => {
                                        try {
                                            JSON.parse(e.target.value);
                                            updateField('jsonLd.customSchema', e.target.value);
                                        } catch {
                                            updateField('jsonLd.customSchema', e.target.value);
                                        }
                                    }}
                                    rows={12}
                                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-gray-800 dark:text-emerald-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                    placeholder='{"@context": "https://schema.org", "@type": "Product", ...}'
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* SEO Score */}
            {seo.seoScore !== undefined && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {seo.seoScore >= 80 ? (
                                <CheckCircle className="text-emerald-500 dark:text-emerald-400" size={24} />
                            ) : seo.seoScore >= 50 ? (
                                <AlertCircle className="text-amber-500 dark:text-amber-400" size={24} />
                            ) : (
                                <AlertCircle className="text-red-500 dark:text-red-400" size={24} />
                            )}
                            <div>
                                <span className="font-bold text-gray-900 dark:text-white text-lg">{seo.seoScore}%</span>
                                <span className="text-gray-500 dark:text-gray-500 text-sm ml-2">SEO Optimization Score</span>
                            </div>
                        </div>
                        <div className="w-48 h-3 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${seo.seoScore >= 80 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                    seo.seoScore >= 50 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                    }`}
                                style={{ width: `${seo.seoScore}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
