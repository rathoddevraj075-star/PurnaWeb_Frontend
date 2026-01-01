/**
 * SEO Component - Dynamic meta tags for pages
 * Uses useEffect for direct DOM manipulation (reliable with React 18 + Vite)
 */

import { useEffect } from 'react';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://purnaroutine.com';
const SITE_NAME = 'PurnaRoutine';
const DEFAULT_IMAGE = '/og-image.jpg';

export default function SEO({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    seo = {}, // Full SEO object from API
    product = null, // Product data for product pages
    noindex = false
}) {
    // Derive values from seo object if available
    const metaTitle = title || seo?.metaTitle || SITE_NAME;
    const metaDescription = description || seo?.metaDescription || '';
    const metaKeywords = keywords || seo?.metaKeywords?.join(', ') || '';
    const canonicalUrl = url || seo?.canonicalUrl || '';

    // Open Graph data
    const ogTitle = seo?.openGraph?.title || metaTitle;
    const ogDescription = seo?.openGraph?.description || metaDescription;
    const ogImage = image || seo?.openGraph?.image || DEFAULT_IMAGE;
    const ogType = seo?.openGraph?.type || type;

    // Twitter Card data
    const twitterTitle = seo?.twitter?.title || ogTitle;
    const twitterDescription = seo?.twitter?.description || ogDescription;
    const twitterImage = seo?.twitter?.image || ogImage;
    const twitterCardType = seo?.twitter?.cardType || 'summary_large_image';

    // Robots directive
    const robotsIndex = seo?.robots?.index !== false && !noindex;
    const robotsFollow = seo?.robots?.follow !== false;
    const robotsContent = `${robotsIndex ? 'index' : 'noindex'}, ${robotsFollow ? 'follow' : 'nofollow'}`;

    // Full URL for canonical and OG
    const fullCanonicalUrl = canonicalUrl.startsWith('http')
        ? canonicalUrl
        : `${SITE_URL}${canonicalUrl}`;
    const fullOgImage = ogImage.startsWith('http')
        ? ogImage
        : `${SITE_URL}${ogImage}`;

    useEffect(() => {
        // Update document title
        document.title = metaTitle;

        // Helper function to update or create meta tag
        const updateMetaTag = (selector, attribute, value) => {
            if (!value) return;
            let element = document.querySelector(selector);
            if (!element) {
                element = document.createElement('meta');
                if (selector.includes('property=')) {
                    element.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
                } else if (selector.includes('name=')) {
                    element.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
                }
                document.head.appendChild(element);
            }
            element.setAttribute('content', value);
        };

        // Helper function to update or create link tag
        const updateLinkTag = (rel, href) => {
            if (!href) return;
            let element = document.querySelector(`link[rel="${rel}"]`);
            if (!element) {
                element = document.createElement('link');
                element.setAttribute('rel', rel);
                document.head.appendChild(element);
            }
            element.setAttribute('href', href);
        };

        // Update meta tags
        updateMetaTag('meta[name="description"]', 'content', metaDescription);
        updateMetaTag('meta[name="keywords"]', 'content', metaKeywords);
        updateMetaTag('meta[name="robots"]', 'content', robotsContent);

        // Open Graph tags
        updateMetaTag('meta[property="og:type"]', 'content', ogType);
        updateMetaTag('meta[property="og:title"]', 'content', ogTitle);
        updateMetaTag('meta[property="og:description"]', 'content', ogDescription);
        updateMetaTag('meta[property="og:image"]', 'content', fullOgImage);
        updateMetaTag('meta[property="og:site_name"]', 'content', SITE_NAME);
        if (canonicalUrl) {
            updateMetaTag('meta[property="og:url"]', 'content', fullCanonicalUrl);
        }

        // Twitter Card tags
        updateMetaTag('meta[name="twitter:card"]', 'content', twitterCardType);
        updateMetaTag('meta[name="twitter:title"]', 'content', twitterTitle);
        updateMetaTag('meta[name="twitter:description"]', 'content', twitterDescription);
        updateMetaTag('meta[name="twitter:image"]', 'content', fullOgImage);

        // Canonical link
        if (canonicalUrl) {
            updateLinkTag('canonical', fullCanonicalUrl);
        }

        // Product-specific structured data
        if (product && seo?.jsonLd?.autoGenerate !== false) {
            const jsonLdScript = document.querySelector('script[type="application/ld+json"][data-seo-product]');
            const jsonLdData = {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": product.name,
                "description": metaDescription || product.description,
                "image": product.images?.[0]?.url ? `${SITE_URL}${product.images[0].url}` : fullOgImage,
                "brand": {
                    "@type": "Brand",
                    "name": product.brand || SITE_NAME
                },
                "offers": {
                    "@type": "Offer",
                    "availability": "https://schema.org/InStock"
                }
            };

            if (jsonLdScript) {
                jsonLdScript.textContent = JSON.stringify(jsonLdData);
            } else {
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.setAttribute('data-seo-product', 'true');
                script.textContent = JSON.stringify(jsonLdData);
                document.head.appendChild(script);
            }
        }

        // Cleanup function to reset to defaults when component unmounts
        return () => {
            document.title = SITE_NAME + ' | Wellness Essentials';
        };
    }, [
        metaTitle, metaDescription, metaKeywords, robotsContent,
        ogType, ogTitle, ogDescription, fullOgImage,
        twitterCardType, twitterTitle, twitterDescription,
        canonicalUrl, fullCanonicalUrl, product
    ]);

    // This component doesn't render anything visible
    return null;
}
