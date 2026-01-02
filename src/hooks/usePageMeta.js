/**
 * usePageMeta Hook - Fetch SEO meta for static pages
 * Fetches page-specific meta from the API
 */

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function usePageMeta(pageSlug) {
    return useQuery({
        queryKey: ['page-meta', pageSlug],
        queryFn: async () => {
            try {
                const response = await axios.get(`${API_BASE}/page-meta/public/${pageSlug}`);
                return response.data.data;
            } catch (error) {
                // Return null if page meta not found (404)
                if (error.response?.status === 404) {
                    return null;
                }
                throw error;
            }
        },
        staleTime: 1000 * 60 * 10, // Cache for 10 minutes
        retry: false, // Don't retry on 404
        refetchOnWindowFocus: false
    });
}
