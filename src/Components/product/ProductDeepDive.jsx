import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { motion } from 'framer-motion';
import {
    Environment,
    Float,
    Text,
    ContactShadows,
    PerspectiveCamera,
    Sparkles,
    ScrollControls,
    Scroll,
    useScroll,
    Html
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ArrowLeft, Droplets, Sun, Sparkles as SparklesIcon, Leaf, Star, ChevronDown, MapPin, Loader2 } from 'lucide-react';
import StoreLocator from '../store/StoreLocator';
import { productService } from '../../services/api';

// --- Floating Particles Component ---
const FloatingParticles = ({ color, count = 100 }) => {
    const particles = useRef();

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const spread = 20;
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * spread;
            pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
            pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        if (particles.current) {
            particles.current.rotation.y = state.clock.elapsedTime * 0.02;
            particles.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
        }
    });

    return (
        <points ref={particles}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                color={color}
                transparent
                opacity={0.5}
                sizeAttenuation
            />
        </points>
    );
};

// --- Premium Product Model Controlled by Scroll ---
const ScrollProductModel = ({ product }) => {
    const meshRef = useRef();
    const groupRef = useRef();
    const scroll = useScroll();
    const { viewport } = useThree();
    const isMobile = viewport.width < 5;

    // Load Product Texture
    const imageUrl = product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/300';
    const texture = useLoader(THREE.TextureLoader, imageUrl);
    texture.colorSpace = THREE.SRGBColorSpace;

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Base Rotation (constantly rotating slightly)
        const time = state.clock.elapsedTime;
        const baseRotY = Math.sin(time * 0.3) * 0.1;

        // Interpolate Position
        let targetX = 0;
        let targetY = 0;
        let targetZ = 0;
        let rotX = 0;
        let rotY = baseRotY;
        let rotZ = 0;

        if (isMobile) {
            // Mobile Choreography
            const off = scroll.offset;

            if (off < 0.33) {
                // Hero -> Benefit
                targetY = THREE.MathUtils.lerp(0, 1.5, off * 3);
                targetZ = THREE.MathUtils.lerp(0, -1, off * 3);
            } else if (off < 0.66) {
                // Benefit -> Ing
                targetY = 1.5;
                targetZ = -1;
                rotY += off * Math.PI * 0.5;
            } else {
                // Ing -> Usage
                targetY = THREE.MathUtils.lerp(1.5, 0, (off - 0.66) * 3);
                targetZ = THREE.MathUtils.lerp(-1, 0, (off - 0.66) * 3);
            }

        } else {
            // Desktop Choreography
            if (scroll.offset < 0.33) {
                targetX = THREE.MathUtils.lerp(0, 3.5, scroll.range(0, 1 / 3));
                rotY += scroll.range(0, 1 / 3) * 0.5;
                rotZ = scroll.range(0, 1 / 3) * 0.1;
            } else if (scroll.offset < 0.66) {
                targetX = THREE.MathUtils.lerp(3.5, -3.5, scroll.range(1 / 3, 1 / 3));
                rotY += 0.5 + scroll.range(1 / 3, 1 / 3) * -0.5;
                rotZ = 0.1 - scroll.range(1 / 3, 1 / 3) * 0.2;
            } else {
                targetX = THREE.MathUtils.lerp(-3.5, 0, scroll.range(2 / 3, 1 / 3));
                rotY += scroll.range(2 / 3, 1 / 3) * 0.5;
                rotZ = -0.1 + scroll.range(2 / 3, 1 / 3) * 0.1;
            }
        }

        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.1);

        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotX, 0.1);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotY, 0.1);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, rotZ, 0.1);
    });

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>

                {/* Product Card / Bottle Representation */}
                <mesh ref={meshRef} castShadow receiveShadow>
                    {/* Rounded Box Geometry for a modern "bottle/packaging" look */}
                    <boxGeometry args={[2, 2.5, 0.5]} />
                    <meshPhysicalMaterial
                        color={product.themeColor || '#000000'}
                        metalness={0.1}
                        roughness={0.2}
                        transmission={0.0} // Solid but shiny
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                    />
                </mesh>

                {/* Texture Mapping Plane - Slightly in front */}
                <mesh position={[0, 0, 0.26]}>
                    <planeGeometry args={[1.8, 2.3]} />
                    <meshBasicMaterial
                        map={texture}
                        transparent
                        opacity={1}
                    />
                </mesh>

                {/* Glass Casing / Shine Effect */}
                <mesh position={[0, 0, 0]} castShadow>
                    <boxGeometry args={[2.05, 2.55, 0.55]} />
                    <meshPhysicalMaterial
                        color="white"
                        transmission={0.6}
                        thickness={0.5}
                        roughness={0.1}
                        ior={1.5}
                        clearcoat={1}
                        transparent
                        opacity={0.3}
                    />
                </mesh>

            </Float>
            <ContactShadows position={[0, -2, 0]} opacity={0.7} scale={10} blur={2.5} far={4} />
        </group>
    );
};


// --- Immersive Scene (Enhanced) ---
const Scene = ({ product }) => {
    const categoryName = product.category?.name || 'PRODUCT';

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={45} />

            {/* ENHANCED LIGHTING */}
            <ambientLight intensity={0.8} />
            <spotLight
                position={[10, 10, 10]}
                angle={0.6}
                penumbra={1}
                intensity={2.5}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />
            <pointLight position={[-10, -5, -10]} intensity={1.5} color={product.themeColor || '#000000'} />
            <Environment preset="studio" />

            {/* ENHANCED PARTICLES */}
            <FloatingParticles color={product.themeColor || '#000000'} count={30} />

            <Sparkles
                count={30}
                scale={15}
                size={6}
                speed={0.5}
                opacity={0.8}
                color={product.themeColor || '#000000'}
            />

            {/* BACKGROUND BLOB FOR DEPTH */}
            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2} position={[0, 0, -6]}>
                <mesh scale={9}>
                    <sphereGeometry args={[1, 24, 24]} />
                    <meshBasicMaterial
                        color={product.themeColor || '#000000'}
                        transparent
                        opacity={0.06}
                        depthWrite={false}
                    />
                </mesh>
            </Float>

            {/* Background Typography - Giant Watermark */}
            <Text
                position={[0, 0, -4]}
                fontSize={3}
                color={product.themeColor || '#000000'}
                fillOpacity={0.05}
                font="/fonts/TT Firs Neue Trial Bold.ttf"
                anchorX="center"
                anchorY="middle"
            >
                {categoryName.toUpperCase()}
            </Text>

            <ScrollProductModel product={product} />

            <EffectComposer>
                <Bloom luminanceThreshold={0.85} mipmapBlur intensity={0.6} radius={0.6} />
            </EffectComposer>
        </>
    );
};

// --- DOM Content Component (Inside Scroll html) ---
const DomContent = ({ product, onFindStores }) => {
    const categoryName = product.category?.name || 'Product';

    return (
        <div className="w-full">
            {/* HERO SECTION - Page 1 */}
            <section className="h-screen w-full flex flex-col items-center justify-center p-6 pointer-events-none">
                <div className="text-center max-w-4xl mx-auto pointer-events-auto">
                    <span
                        className="inline-block py-2 px-6 rounded-full text-xs uppercase tracking-[0.25em] mb-6 backdrop-blur-md border border-black/5 shadow-sm"
                        style={{ background: `${product.themeColor}15`, color: product.themeColor, fontWeight: 700 }}
                    >
                        {categoryName}
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-neutral-900 leading-none drop-shadow-sm">
                        {product.name}
                    </h1>
                    <p className="text-lg md:text-2xl text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed">
                        {product.tagline || product.shortDescription || product.description}
                    </p>
                    <div className="mt-16 animate-bounce">
                        <span className="text-xs text-neutral-400 font-bold tracking-[0.2em] bg-white/50 px-3 py-1 rounded-full">SCROLL TO DISCOVER</span>
                        <ChevronDown className="mx-auto mt-2 text-neutral-400" />
                    </div>
                </div>
            </section>

            {/* BENEFITS SECTION - Page 2 */}
            <section className="h-screen w-full flex items-center p-6 md:p-20 pointer-events-none">
                <div className="w-full h-full max-w-7xl mx-auto flex items-center justify-start">
                    <div className="md:w-1/2 w-full pointer-events-auto text-left">
                        <div
                            className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/50 transform transition-all hover:scale-[1.01]"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-neutral-100 to-white shadow-inner">
                                    <SparklesIcon className="w-6 h-6" style={{ color: product.themeColor }} />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">Why It's Special</h2>
                            </div>

                            <ul className="space-y-4">
                                {(product.keyBenefits || []).map((b, i) => (
                                    <li key={i} className="flex gap-4 items-start p-3 hover:bg-white/50 rounded-xl transition-colors">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5 shadow-md"
                                            style={{ background: product.themeColor }}
                                        >
                                            {i + 1}
                                        </div>
                                        <span className="text-xl text-neutral-700 font-medium">{b}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* INGREDIENTS SECTION - Page 3 */}
            <section className="h-screen w-full flex items-center p-6 md:p-20 pointer-events-none">
                <div className="w-full h-full max-w-7xl mx-auto flex items-center justify-end">
                    <div className="md:w-1/2 w-full pointer-events-auto text-right">
                        <div
                            className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/50 transform transition-all hover:scale-[1.01]"
                        >
                            <div className="flex items-center justify-end gap-4 mb-8">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-neutral-100 to-white shadow-inner">
                                    <Leaf className="w-6 h-6" style={{ color: product.themeColor }} />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">Pure Ingredients</h2>
                            </div>

                            {product.heroIngredient && (
                                <div className="mb-8 p-6 rounded-2xl bg-white/60 border border-white/60 shadow-inner">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Star size={14} className="fill-current" style={{ color: product.themeColor }} />
                                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: product.themeColor }}>Hero Ingredient</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 text-neutral-800">{product.heroIngredient.name}</h3>
                                    <p className="text-base text-neutral-600 leading-relaxed">{product.heroIngredient.description}</p>
                                </div>
                            )}

                            <div className="flex flex-wrap justify-end gap-2">
                                {product.accordion?.INGREDIENTS?.map((ing, i) => (
                                    <span
                                        key={i}
                                        className="px-5 py-2.5 bg-white rounded-full text-sm font-semibold text-neutral-700 shadow-sm border border-neutral-100"
                                    >
                                        {ing.name}
                                    </span>
                                )) || <span className="italic text-neutral-500">See packaging for full list</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* USAGE/CTA SECTION - Page 4 */}
            <section className="h-screen w-full flex items-center justify-center p-6 pointer-events-none">
                <div className="w-full max-w-3xl pointer-events-auto">
                    <div
                        className="p-10 md:p-16 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl ring-4 ring-white/20"
                        style={{ background: '#111' }}
                    >
                        {/* Glow effect */}
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30"
                            style={{
                                background: `radial-gradient(circle at 50% 0%, ${product.themeColor}, transparent 70%)`
                            }}
                        />

                        <div className="relative z-10 flex flex-col items-center">
                            <Sun className="w-14 h-14 mb-6 text-white/90" />
                            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Ready to Elevate?</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-xl w-full mb-12 bg-white/5 p-8 rounded-3xl border border-white/10">
                                {product.howToUse?.split('. ').slice(0, 2).map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <span className="text-4xl font-bold opacity-30" style={{ color: product.themeColor }}>0{i + 1}</span>
                                        <p className="text-base text-white/90 leading-relaxed pt-2 font-medium">{step}</p>
                                    </div>
                                )) || null}
                            </div>

                            {/* FIND NEARBY STORES BUTTON */}
                            <button
                                onClick={onFindStores}
                                className="flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold tracking-wide transition-all shadow-xl hover:scale-105"
                                style={{ background: product.themeColor }}
                            >
                                <MapPin className="w-5 h-5" />
                                Find Nearby Stores
                            </button>
                            <div className="mt-6 text-white/50 text-sm font-medium tracking-wide">
                                AVAILABLE AT SELECT RETAILERS
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};


const ProductDeepDive = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showStoreLocator, setShowStoreLocator] = useState(false);

    // Fetch product by slug
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await productService.getProductBySlug(id);
                setProduct(response.data);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.message || 'Product not found');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="h-screen w-full bg-[#f8f6f4] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                    <span className="text-neutral-500 text-sm uppercase tracking-widest">Loading Product...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !product) {
        return (
            <div className="h-screen w-full bg-[#f8f6f4] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
                    <p className="text-neutral-500 mb-6">We couldn't find the product you're looking for.</p>
                    <button onClick={() => navigate('/products')} className="bg-black text-white px-6 py-3 rounded-full">
                        Browse All Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-[#f8f6f4] relative">
            {/* Navigation Overlay */}
            <div className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
                <button
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-3 rounded-full text-sm uppercase tracking-wider hover:bg-white transition-all shadow-lg border border-white/20 font-bold"
                >
                    <ArrowLeft size={16} /> Back
                </button>
            </div>

            {/* Canvas takes full screen, ScrollControls handles scrolling */}
            <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}>
                <Suspense fallback={
                    <Html center>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mb-4"></div>
                            <span className="text-xs font-bold tracking-widest uppercase text-black/50">Loading Experience...</span>
                        </div>
                    </Html>
                }>
                    {/* Pages = 4 sections */}
                    <ScrollControls pages={4} damping={0.25}>

                        {/* 3D Scene that reacts to scroll internally */}
                        <Scene product={product} />

                        {/* DOM Content laid over the 3D scene */}
                        <Scroll html style={{ width: '100%' }}>
                            <DomContent product={product} onFindStores={() => setShowStoreLocator(true)} />
                        </Scroll>

                    </ScrollControls>
                </Suspense>
            </Canvas>

            {/* Store Locator Modal */}
            <StoreLocator
                isOpen={showStoreLocator}
                onClose={() => setShowStoreLocator(false)}
                productName={product.name}
            />
        </div>
    );
};

export default ProductDeepDive;
