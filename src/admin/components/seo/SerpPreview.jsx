/**
 * SERP Preview Component - Google search result preview
 */

import { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';

export default function SerpPreview({ title, description, url }) {
    const [view, setView] = useState('desktop');
    const siteUrl = 'https://hiloproot.com';

    const truncate = (text, max) => {
        if (!text) return '';
        return text.length > max ? text.substring(0, max) + '...' : text;
    };

    const displayTitle = truncate(title || 'Page Title', 60);
    const displayDesc = truncate(description || 'Add a meta description to see how it will appear in search results.', 160);
    const displayUrl = `${siteUrl}${url || '/'}`;

    return (
        <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-700">Google Preview</h4>
                <div className="flex gap-1">
                    <button
                        onClick={() => setView('desktop')}
                        className={`p-1.5 rounded ${view === 'desktop' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    >
                        <Monitor size={16} />
                    </button>
                    <button
                        onClick={() => setView('mobile')}
                        className={`p-1.5 rounded ${view === 'mobile' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    >
                        <Smartphone size={16} />
                    </button>
                </div>
            </div>

            <div className={`bg-white rounded-lg p-4 ${view === 'mobile' ? 'max-w-[360px]' : ''}`}>
                {/* URL breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-1">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">
                        H
                    </div>
                    <div>
                        <span className="text-gray-700">{siteUrl.replace('https://', '')}</span>
                        <div className="text-xs text-gray-500 truncate max-w-[300px]">{displayUrl}</div>
                    </div>
                </div>

                {/* Title */}
                <h3 className={`text-blue-800 hover:underline cursor-pointer font-medium leading-tight mt-2 ${view === 'mobile' ? 'text-base' : 'text-xl'
                    }`}>
                    {displayTitle || <span className="text-gray-400 italic">Enter a title</span>}
                </h3>

                {/* Description */}
                <p className={`text-gray-600 mt-1 ${view === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                    {displayDesc || <span className="text-gray-400 italic">Enter a description</span>}
                </p>
            </div>

            {/* Character warnings */}
            <div className="mt-3 space-y-1">
                {(title?.length || 0) > 60 && (
                    <p className="text-xs text-amber-600">⚠ Title may be truncated in search results</p>
                )}
                {(description?.length || 0) > 160 && (
                    <p className="text-xs text-amber-600">⚠ Description may be truncated in search results</p>
                )}
            </div>
        </div>
    );
}
