import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import {
    useTexture,
    Environment,
    Float,
    Image,
    ScrollControls,
    useScroll,
    MeshTransmissionMaterial,
    ContactShadows,
    Text,
    Html // Using Html for sharp text labels in 3D
} from '@react-three/drei';
import { EffectComposer, Noise, Vignette, DepthOfField } from '@react-three/postprocessing';
import { ArrowLeft, Maximize, Circle } from 'lucide-react';
import { productService, categoryService } from '../../services/api';
import SEO from '../../components/SEO';

// --- CONSTANTS & CONFIG ---
const THEME = {
    background: '#f0f2f5', // Soft Cloud White/Grey
    text: '#1a1a1a',
    accent: '#4a90e2'
};

const REVEAL_CONFIG = {
    gap: 12,        // Vertical distance between items in scroll space
    spread: 3,      // Visual vertical spread
    depth: 4,       // Depth spacing
};

// --- 3D COMPONENTS ---

const Background = () => {
    return (
        <color attach="background" args={[THEME.background]} />
    );
};

const RevealScene = ({ products, activeIndex, setActiveIndex }) => {
    // We no longer use useScroll(). We track the "Visual" index locally.
    const smoothedIndex = useRef(activeIndex);

    useFrame((state, delta) => {
        // Smoothly interpolate the visual index towards the integer activeIndex
        // This guarantees we never stop "in between" because activeIndex is always an integer.
        // We use a spring-like lerp for "snappines"
        const speed = 6;
        smoothedIndex.current = THREE.MathUtils.lerp(smoothedIndex.current, activeIndex, delta * speed);
    });

    return (
        <group>
            {products.map((product, i) => (
                <KineticItem
                    key={i}
                    product={product}
                    index={i}
                    currentAnimatedIndex={smoothedIndex} // Pass ref
                />
            ))}
        </group>
    );
};

const KineticItem = ({ product, index, currentAnimatedIndex }) => {
    const group = useRef();

    useFrame((state, delta) => {
        // Read the current smoothed float index from the shared ref
        const currentScrollIndex = currentAnimatedIndex.current;

        const diff = index - currentScrollIndex;

        // --- ANIMATION LOGIC (STACK COVER) ---

        // Config
        const EXIT_DEPTH = -5;
        const ENTER_OFFSET = 12;

        let targetY = 0;
        let targetZ = 0;
        let targetRotX = 0;
        let targetScale = 1;
        let targetOpacity = 1;

        if (diff > 0) {
            // FUTURE ITEMS (Below)
            // Slide up from bottom
            targetY = -diff * ENTER_OFFSET;
            targetZ = 0;
            targetOpacity = 1;

        } else {
            // PAST ITEMS (Behind)
            // Recede deep back
            targetY = diff * 0.5;
            targetZ = diff * 5;
            targetScale = 1 - (Math.abs(diff) * 0.15);
            targetOpacity = 1 - (Math.abs(diff) * 0.5);
        }

        targetOpacity = Math.max(0, Math.min(1, targetOpacity));

        const lerpSpeed = 10;
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, delta * lerpSpeed);
        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, delta * lerpSpeed);
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, delta * lerpSpeed);
        group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, delta * lerpSpeed));
    });

    return (
        <group ref={group}>
            <group>
                <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                    {/* Product Image - Full Bleed, No Border */}
                    <Image
                        url={product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/600x800'}
                        scale={[3.84, 4.8]}
                        position={[0, 0, 0]}
                        transparent
                        toneMapped={false}
                    />
                </Float>
            </group>
        </group>
    );
};

// --- DOM UI ---

const OverlayUI = ({ products, activeIndex, onBack }) => {
    const activeProduct = products[activeIndex] || {};

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-16 text-[#1a1a1a]">

            {/* Top Bar */}
            <div className="flex justify-between items-center pointer-events-auto">
                <button onClick={onBack} className="flex items-center gap-3 group">
                    <div className="p-3 rounded-full bg-white/80 backdrop-blur-md shadow-sm group-hover:scale-110 transition-transform">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-semibold tracking-wider text-sm uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                        Back to Collection
                    </span>
                </button>

                <div className="text-right">
                    <h1 className="text-2xl font-bold tracking-tighter uppercase">{activeProduct.category?.name || 'Collection'}</h1>
                    <p className="text-xs font-mono opacity-50 tracking-widest mt-1">
                        {String(activeIndex + 1).padStart(2, '0')} — {String(products.length).padStart(2, '0')}
                    </p>
                </div>
            </div>

            {/* Bottom Content Area */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-12">

                {/* Product Info */}
                <div className="max-w-xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeProduct._id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full border border-black/10 bg-white/50 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-black/60">
                                    {activeProduct.type || 'Product'}
                                </span>
                                {activeProduct.isNew && (
                                    <span className="px-3 py-1 rounded-full bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest">
                                        New Arrival
                                    </span>
                                )}
                            </div>

                            <h2 className="text-5xl md:text-7xl font-light tracking-tighter mb-4 leading-[0.9]">
                                {activeProduct.name}
                            </h2>

                            <p className="text-sm md:text-base opacity-70 leading-relaxed max-w-md font-medium">
                                {activeProduct.shortDescription}
                            </p>

                            {/* Price Tag styling */}
                            <div className="mt-6 flex items-baseline gap-2">
                                <span className="text-2xl font-bold">
                                    ₹{activeProduct.variants?.[0]?.price || 'N/A'}
                                </span>
                                {activeProduct.variants?.[0]?.comparePrice && (
                                    <span className="text-sm line-through opacity-40">
                                        ₹{activeProduct.variants[0].comparePrice}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Call to Action */}
                <div className="pointer-events-auto">
                    <button
                        onClick={() => window.location.href = `/products/${activeProduct?.slug}`}
                        className="group relative px-10 py-6 bg-[#1a1a1a] text-white overflow-hidden rounded-2xl flex items-center justify-center gap-3 hover:bg-black transition-colors"
                    >
                        <span className="relative z-10 font-bold uppercase tracking-widest text-sm">View Details</span>
                        <Maximize className="w-4 h-4 relative z-10 group-hover:scale-125 transition-transform" />
                    </button>
                </div>

            </div>

            {/* Scroll Indicator */}
            <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-2 items-center">
                <div className="h-16 w-[1px] bg-black/10" />
                <span className="text-[10px] uppercase rotate-90 tracking-widest opacity-40 origin-center whitespace-nowrap">Scroll to Explore</span>
                <div className="h-16 w-[1px] bg-black/10" />
            </div>

        </div>
    );
};

// --- MAIN COMPONENT ---

const VariantDetailScroller = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categoryData, setCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    // Cooldown state for prevent rapid-fire scrolling (optional but good for UX)
    const lastScrollTime = useRef(0);

    // --- DISCRETE SCROLL HANDLER ---
    useEffect(() => {
        const handleWheel = (e) => {
            const now = Date.now();
            // Optional cooldown: 50ms to prevent inertial bounce, but user wants sensitivity.
            // Let's rely on threshold.

            if (now - lastScrollTime.current > 50) {
                // Threshold
                if (Math.abs(e.deltaY) > 20) {
                    const direction = Math.sign(e.deltaY);

                    setActiveIndex(prev => {
                        const next = prev + direction;
                        // Clamp
                        return Math.max(0, Math.min(products.length - 1, next));
                    });

                    lastScrollTime.current = now;
                }
            }
        };

        // Add passive: false to allow potentialpreventDefault() if needed, 
        // though we are just hijacking the logic here.
        window.addEventListener('wheel', handleWheel, { passive: false });
        // Also handle keyboard?
        const handleKey = (e) => {
            if (e.key === 'ArrowDown') setActiveIndex(prev => Math.min(products.length - 1, prev + 1));
            if (e.key === 'ArrowUp') setActiveIndex(prev => Math.max(0, prev - 1));
        }
        window.addEventListener('keydown', handleKey);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKey);
        };
    }, [products.length]); // Re-bind if products count changes (rare after load)

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const categoriesResponse = await categoryService.getCategories();
                const categoryData = categoriesResponse.data.find(
                    c => c.slug === category || c.name.toLowerCase().replace(/\s+/g, '-') === category
                );

                if (categoryData) {
                    setCategoryData(categoryData);
                    const productsResponse = await productService.getProducts({ category: categoryData._id });
                    setProducts(productsResponse.data || []);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        if (category) fetchProducts();
    }, [category]);

    if (loading) return (
        <div className="h-screen w-full bg-[#f0f2f5] flex flex-col items-center justify-center gap-4">
            <div className="w-6 h-6 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest opacity-50">Loading Experience...</span>
        </div>
    );

    return (
        <>
            <SEO
                seo={categoryData?.seo}
                title={categoryData?.seo?.metaTitle || `${categoryData?.name || 'Collection'} | Showcase`}
                url={`/categories/${category}`}
            />

            <div className="h-screen w-full bg-[#f0f2f5] relative overflow-hidden font-sans text-[#1a1a1a]">

                <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 35 }}>
                    <Suspense fallback={null}>
                        <Background />

                        {/* Soft Studio Lighting */}
                        <ambientLight intensity={0.7} />
                        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={1.5} castShadow shadow-bias={-0.0001} />
                        <Environment preset="city" />

                        {/* NO SCROLL CONTROLS - Custom Handler */}
                        <RevealScene products={products} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

                        {/* Post Processing for "Dreamy" look */}
                        <EffectComposer>
                            <Noise opacity={0.04} />
                            <Vignette eskil={false} offset={0.1} darkness={0.3} />
                        </EffectComposer>
                    </Suspense>
                </Canvas>

                <OverlayUI products={products} activeIndex={activeIndex} onBack={() => navigate('/')} />

            </div>
        </>
    );
};

export default VariantDetailScroller;
