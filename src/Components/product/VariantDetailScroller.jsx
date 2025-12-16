import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Environment,
    Float,
    Text,
    Image,
    SpotLight,
    Sparkles,
    ScrollControls,
    Scroll,
    useScroll,
    Stars,
    AdaptiveDpr,
    AdaptiveEvents
} from '@react-three/drei';
import { EffectComposer, Noise, Vignette, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ArrowLeft, ArrowDown, MapPin, Maximize2, Share2, Circle } from 'lucide-react';
import Lenis from 'lenis'; // Keeping Lenis if we need global smooth scroll, but ScrollControls handles the canvas
import { productService, categoryService } from '../../services/api';

// --- CUSTOM FONTS & STYLE ---
const FONT_URL = '/fonts/TT Firs Neue Trial Bold.ttf';

// --- 3D COMPONENTS ---

const CinematicTitle = ({ children, position, scale = 1, color = "white", opacity = 1 }) => {
    return (
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
            <Text
                font={FONT_URL}
                position={position}
                scale={scale}
                color={color}
                fontSize={1}
                maxWidth={10}
                lineHeight={1}
                letterSpacing={-0.05}
                anchorX="center"
                anchorY="middle"
                fillOpacity={opacity}
            >
                {children}
            </Text>
        </Float>
    );
};

// The Collection Intro "Object" at Index 0
const CollectionHeroObject = ({ categoryName, themeColor, isMobile }) => {
    return (
        <group position={[0, 0, 0]}>
            <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1}>
                {/* Abstract Ring Structure */}
                <mesh rotation={[Math.PI / 3, 0, 0]} scale={isMobile ? 1.5 : 2.5}>
                    <torusGeometry args={[3, 0.05, 16, 100]} />
                    <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={2} />
                </mesh>
                <mesh rotation={[-Math.PI / 3, 0, 0]} scale={isMobile ? 1.2 : 2}>
                    <torusGeometry args={[2.5, 0.03, 16, 100]} />
                    <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} />
                </mesh>
            </Float>

            <CinematicTitle position={[0, 0.5, 0]} scale={isMobile ? 0.8 : 1.5} color="white">
                {categoryName || "COLLECTION"}
            </CinematicTitle>
            <Text
                font={FONT_URL}
                position={[0, -1, 0]}
                fontSize={0.2}
                letterSpacing={0.2}
                color="white"
                fillOpacity={0.6}
            >
                SCROLL TO EXPLORE
            </Text>
        </group>
    )
}

const FloatingGalleryItem = ({ product, index, totalItems, isMobile }) => {
    const groupRef = useRef();

    // Index 0 is the Hero, so products start at index 1 conceptually for position
    // But in the map loop, 'index' is 0..N of products. 
    // Let's bias position by 1 unit of spacing to make room for Hero.

    const virtualIndex = index + 1; // 1, 2, 3...
    const zPos = -virtualIndex * (isMobile ? 15 : 20);
    const isOdd = virtualIndex % 2 !== 0;

    const xBase = isMobile ? 0 : (isOdd ? 4 : -4);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                (state.mouse.x * 0.1) + (isOdd ? -0.1 : 0.1),
                delta
            );
        }
    });

    return (
        <group ref={groupRef} position={[xBase, 0, zPos]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <Image
                    url={product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/600x800'}
                    scale={isMobile ? [3, 4, 1] : [4, 5, 1]}
                    transparent
                    opacity={0.9}
                    radius={0.2}
                />
            </Float>

            <group position={[isMobile ? 0 : (isOdd ? -3.5 : 3.5), isMobile ? -2.5 : 0, 0.5]}>
                <CinematicTitle scale={isMobile ? 0.4 : 0.5} color={product.themeColor || "#E65800"}>
                    {product.name}
                </CinematicTitle>
                <Text
                    position={[0, -0.6, 0]}
                    fontSize={0.2}
                    color="white"
                    anchorX="center"
                    anchorY="top"
                    maxWidth={isMobile ? 3 : 4}
                    fillOpacity={0.7}
                >
                    {product.shortDescription}
                </Text>
            </group>
        </group>
    );
};

const CameraRig = ({ pageCount, isMobile }) => {
    const scroll = useScroll();
    const { camera } = useThree();

    useFrame((state, delta) => {
        // Scroll 0..1
        // Total distance includes Hero space + all products
        // Hero is at 0. Products start at -20. Last product at -(count * 20).

        const scrollOffset = scroll.offset;
        const totalDistance = (pageCount) * (isMobile ? 15 : 20) + 5;

        const targetZ = 10 - (scrollOffset * totalDistance);

        const parallaxX = state.mouse.x * 2;
        const parallaxY = state.mouse.y * 2;

        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 3 * delta);
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, parallaxX, 1 * delta);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, parallaxY, 1 * delta);

        camera.lookAt(0, 0, targetZ - 20);
    });

    return null;
};


const Scene = ({ products, categoryName, activeIndex }) => {
    const { viewport } = useThree();
    const isMobile = viewport.width < 5;

    // Total Items = 1 Hero + N Products
    const items = [{ type: 'hero' }, ...products];

    return (
        <>
            <color attach="background" args={['#050505']} />
            <Environment preset="night" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <ambientLight intensity={0.2} />
            <SpotLight position={[10, 10, 10]} intensity={1} angle={0.2} penumbra={1} color="#E65800" castShadow />

            {/* Index 0: Category Hero */}
            <CollectionHeroObject categoryName={categoryName} themeColor="#E65800" isMobile={isMobile} />

            {/* Index 1..N: Products */}
            {products.map((product, i) => (
                <FloatingGalleryItem
                    key={product._id || i}
                    product={product}
                    index={i} // 0-based for products array, but logic inside component shifts it to virtual index
                    totalItems={items.length}
                    isMobile={isMobile}
                />
            ))}

            <Sparkles count={200} scale={[20, 20, 100]} size={4} speed={0.4} opacity={0.5} />

            <EffectComposer disableNormalPass multisampling={0}>
                <Bloom luminanceThreshold={0} mipmapBlur intensity={0.4} radius={0.6} />
                <Noise opacity={0.06} />
                <Vignette eskil={false} offset={0.1} darkness={0.5} />
            </EffectComposer>

            <CameraRig pageCount={items.length} isMobile={isMobile} />
        </>
    );
};

// --- DOM OVERLAY ---
const CollectionOverlay = ({ products, activeIndex, pageCount, categoryName }) => {

    // Determine context based on scroll index
    // activeIndex 0 = Hero
    // activeIndex 1 = 1st Product

    const virtualIndex = activeIndex;
    const isHero = virtualIndex === 0;
    const currentProduct = (!isHero && virtualIndex <= products.length) ? products[virtualIndex - 1] : null;

    return (
        <div className="absolute inset-0 pointer-events-none">

            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
                <motion.div
                    className="h-full bg-[#E65800]"
                    style={{ width: `${(activeIndex / pageCount) * 100}%` }}
                />
            </div>

            {/* Footer Context */}
            <AnimatePresence mode="wait">
                {!isHero && currentProduct && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed bottom-0 left-0 w-full p-6 md:p-12 flex justify-between items-end bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-auto"
                        key={currentProduct._id}
                    >
                        <div className="text-white">
                            <div className="text-[#E65800] text-xs font-bold tracking-widest uppercase mb-1">
                                Product {virtualIndex} / {products.length}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black font-mono leading-none mb-2">
                                {currentProduct.name}
                            </h2>
                            <div className="flex gap-2 text-xs md:text-sm text-white/60 uppercase tracking-wider">
                                <span>{currentProduct.category?.name || categoryName}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => window.location.href = `/products/${currentProduct.slug}`}
                                className="bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#E65800] hover:text-white transition-colors rounded-none"
                            >
                                Explore Product
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};


const VariantDetailScroller = () => {
    const { category } = useParams();
    const navigate = useNavigate();

    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Find Category ID
                const categoriesResponse = await categoryService.getCategories();
                const categoryData = categoriesResponse.data.find(
                    c => c.slug === category || c.name.toLowerCase().replace(/\s+/g, '-') === category
                );

                if (categoryData) {
                    const productsResponse = await productService.getProducts({ category: categoryData._id });
                    setCategoryProducts(productsResponse.data || []);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        if (category) fetchProducts();
    }, [category]);

    // Category Name Formatter
    const categoryDisplayName = useMemo(() => {
        if (!category) return "Collection";
        return category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }, [category]);


    // Total Scrollable Pages = Hero (1) + Products (N)
    const pageCount = 1 + categoryProducts.length;

    if (loading) {
        return <div className="h-screen w-full bg-[#050505] flex items-center justify-center text-white/50 animate-pulse">LOADING COLLECTION...</div>;
    }

    return (
        <div className="h-screen w-full bg-[#050505] relative overflow-hidden selection:bg-[#E65800] selection:text-white">

            {/* Header */}
            <div className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center text-white mix-blend-difference pointer-events-none">
                <button onClick={() => navigate(-1)} className="pointer-events-auto flex items-center gap-2 hover:text-[#E65800] transition-colors"><ArrowLeft size={20} /></button>
                <div className="flex gap-4 pointer-events-auto">
                    {/* Reuse Header Buttons if needed */}
                </div>
            </div>

            <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "high-performance" }} camera={{ position: [0, 0, 10], fov: 50 }}>
                <Suspense fallback={null}>
                    <AdaptiveDpr pixelated />
                    <AdaptiveEvents />

                    <ScrollControls pages={pageCount} damping={0.3} style={{ scrollbarWidth: 'none' }}>

                        <ScrollTracker setActiveIndex={setActiveIndex} pageCount={pageCount} />

                        <Scene
                            products={categoryProducts}
                            categoryName={categoryDisplayName}
                            activeIndex={activeIndex}
                        />

                    </ScrollControls>
                </Suspense>
            </Canvas>

            <CollectionOverlay
                products={categoryProducts}
                categoryName={categoryDisplayName}
                activeIndex={activeIndex}
                pageCount={pageCount}
            />

        </div>
    );
};

// Tracks approximate "Page Index" based on scroll measure
const ScrollTracker = ({ setActiveIndex, pageCount }) => {
    const scroll = useScroll();
    useFrame(() => {
        const offset = scroll.offset * (pageCount); // 0 to N
        setActiveIndex(Math.round(offset));
    });
    return null;
};

export default VariantDetailScroller;
