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
    ScrollControls,
    useScroll,
    Stars,
    AdaptiveDpr,
    Sparkles,
    Html
} from '@react-three/drei';
import { EffectComposer, Noise, Vignette, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ArrowLeft, ShoppingBag, Maximize2, Share2, MapPin, ChevronDown } from 'lucide-react';
import { productService } from '../../services/api';
import StoreLocator from '../store/StoreLocator';

// --- FONTS ---
const FONT_URL = '/fonts/TT Firs Neue Trial Bold.ttf';

// --- 3D ASSETS ---

// --- ERROR BOUNDARY ---
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("3D Scene Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div className="text-white/50 text-xs p-4 border border-white/10 rounded">3D View Unavailable</div>;
        }

        return this.props.children;
    }
}

const IngredientParticle = ({ index, color }) => {
    const ref = useRef();
    // Random initial positions
    const [pos] = useState(() => [
        (Math.random() - 0.5) * 10,
        -10 - Math.random() * 10, // Start below viewport
        (Math.random() - 0.5) * 5
    ]);

    useFrame((state) => {
        if (!ref.current) return;
        // Float UP continuously - SLOWER SPEED
        const t = state.clock.elapsedTime;
        ref.current.position.y = pos[1] + ((t * (0.1 + Math.random() * 0.1)) % 25); // Significantly slower
        ref.current.rotation.x += 0.005;
        ref.current.rotation.y += 0.01;
    });

    return (
        <mesh ref={ref} position={pos} scale={0.1 + Math.random() * 0.1}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
        </mesh>
    );
}

// The Scroll-Driven Director
const SpotlightScene = ({ product, setUiState }) => {
    const scroll = useScroll();
    const { camera, viewport, size } = useThree();

    // More robust mobile check: checks viewport width AND actual screen width
    const isMobile = viewport.width < 5 || size.width < 768;

    // Refs for lights to animate intensities
    const rimLightRef = useRef();
    const fillLightRef = useRef();
    const studioLightRef = useRef();

    const themeColor = product.themeColor || "#E65800";

    useFrame((state, delta) => {
        const offset = scroll.offset; // 0 to 1

        // -- LIGHTING LOGIC --
        if (rimLightRef.current) {
            rimLightRef.current.intensity = THREE.MathUtils.lerp(15, 2, offset);
        }

        if (fillLightRef.current) {
            const targetFill = offset > 0.15 ? 3 : 0;
            fillLightRef.current.intensity = THREE.MathUtils.lerp(fillLightRef.current.intensity, targetFill, 2 * delta);
        }

        if (studioLightRef.current) {
            const targetStudio = offset > 0.8 ? 2 : 0;
            studioLightRef.current.intensity = THREE.MathUtils.lerp(studioLightRef.current.intensity, targetStudio, 2 * delta);
        }

        // -- CAMERA LOGIC --
        // Adjusted for mobile to be further back so the product fits
        const baseZ = isMobile ? 14 : 9;

        // p1: Low angle, looking up
        const p1_pos = new THREE.Vector3(0, -3, baseZ - 3);

        // p2: Center level
        const p2_pos = new THREE.Vector3(0, 0, baseZ);

        // p4: Standard shot
        const p4_pos = new THREE.Vector3(0, 0, baseZ + (isMobile ? 2 : 0)); // Pull back more on mobile end state

        // Lerping position based on simple curves
        if (offset < 0.5) {
            // Lerp P1 -> P2
            const t = offset * 2; // 0..1
            camera.position.lerpVectors(p1_pos, p2_pos, t);
        } else {
            // Lerp P2 -> P4
            const t = (offset - 0.5) * 2; // 0..1
            camera.position.lerpVectors(p2_pos, p4_pos, t);
        }

        // Always look at center (simplification for smoothness)
        camera.lookAt(0, 0, 0);

        // -- UI STATE UPDATES --
        if (offset < 0.2) setUiState('reveal');
        else if (offset < 0.5) setUiState('ingredients');
        else if (offset < 0.85) setUiState('benefit');
        else setUiState('offer');

    });

    return (
        <>
            <color attach="background" args={['#050505']} />
            <ambientLight intensity={0.1} />

            {/* RIM LIGHT (Back) */}
            <SpotLight
                ref={rimLightRef}
                position={[0, 5, -5]}
                angle={0.6}
                penumbra={1}
                color={themeColor}
                distance={30}
            />

            {/* FILL LIGHT (Front-Left) */}
            <SpotLight
                ref={fillLightRef}
                position={[-5, 2, 8]}
                angle={0.6}
                penumbra={1}
                color="#ffffff"
            />

            {/* STUDIO LIGHT (Top-Right) */}
            <SpotLight
                ref={studioLightRef}
                position={[5, 5, 8]}
                angle={0.4}
                penumbra={0.5}
                color="#ffffff"
                castShadow
            />

            {/* The Hero Product */}
            <group>
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                    <Image
                        url={product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/600x800'}
                        scale={isMobile ? [4, 5, 1] : [5, 6.5, 1]} // Scale up slightly
                        transparent
                        opacity={1}
                        radius={0.1}
                    />
                    {/* Backing for rim light catch */}
                    <mesh position={[0, 0, -0.05]} scale={isMobile ? [4.1, 5.1, 1] : [5.1, 6.6, 1]}>
                        <planeGeometry />
                        <meshStandardMaterial color="#111" roughness={0.4} metalness={0.9} />
                    </mesh>
                </Float>
            </group>

            {/* Particle Eruption */}
            <group>
                {Array.from({ length: 40 }).map((_, i) => (
                    <IngredientParticle key={i} index={i} color={themeColor} />
                ))}
            </group>

            <EffectComposer disableNormalPass multisampling={0}>
                <Bloom luminanceThreshold={0.5} mipmapBlur intensity={0.8} radius={0.4} />
                <Noise opacity={0.05} />
                <Vignette eskil={false} offset={0.1} darkness={0.6} />
            </EffectComposer>
        </>
    );
}

// --- DOM OVERLAY ---
const ScrollOverlay = ({ uiState, product, scroll }) => {

    const variants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
    };

    // Safely get benefits - prefer summary, fall back to array
    const benefitsText = product.benefitsSummary ||
        (Array.isArray(product.benefits) ? product.benefits.map(b => b.title).join(' ') : '') ||
        "PURE POWER";
    const benefitWords = benefitsText.split(' ');
    const benefit1 = benefitWords[0] || "PURE";
    const benefit2 = benefitWords.slice(1).join(' ') || "POWER";

    // Safely get ingredients - prefer summary, fall back to array
    const ingredientsText = product.ingredientsSummary ||
        (Array.isArray(product.ingredients) ? product.ingredients.map(i => i.name).join(', ') : '') ||
        "A potent blend of organic botanicals selected for maximum efficacy.";

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 text-center z-10">

            {/* PHASE 1: REVEAL */}
            <AnimatePresence>
                {uiState === 'reveal' && (
                    <motion.div
                        initial="hidden" animate="visible" exit="hidden" variants={variants}
                        className="absolute bottom-24 md:bottom-20 w-full"
                    >
                        <h2 className="text-[#E65800] text-xs md:text-sm font-bold tracking-[0.5em] uppercase mb-4 animate-pulse">
                            Introducing
                        </h2>
                        <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-widest leading-none drop-shadow-2xl">
                            {product.name}
                        </h1>
                        <ChevronDown className="text-white/50 w-6 h-6 md:w-8 md:h-8 mt-6 animate-bounce mx-auto" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PHASE 2: INGREDIENTS */}
            <AnimatePresence>
                {uiState === 'ingredients' && (
                    <motion.div
                        initial="hidden" animate="visible" exit="hidden" variants={variants}
                        className="absolute left-6 md:left-24 top-1/2 -translate-y-1/2 text-left max-w-[200px] md:max-w-md"
                    >
                        <div className="h-px w-12 md:w-20 bg-[#E65800] mb-4" />
                        <h3 className="text-white text-2xl md:text-5xl font-bold mb-4 leading-tight">
                            Powered By<br />Nature's Best
                        </h3>
                        <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                            {ingredientsText}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PHASE 3: BENEFIT */}
            <AnimatePresence>
                {uiState === 'benefit' && (
                    <motion.div
                        initial="hidden" animate="visible" exit="hidden" variants={variants}
                        className="absolute right-6 md:right-24 top-1/2 -translate-y-1/2 text-right"
                    >
                        <h3 className="text-[#E65800] text-4xl md:text-7xl font-black uppercase mb-2 opacity-90 leading-none">
                            {benefit1}
                        </h3>
                        <h3 className="text-white text-4xl md:text-7xl font-black uppercase mb-4 leading-none">
                            {benefit2 || "EFFICIENCY"}
                        </h3>
                        <div className="h-px w-12 md:w-20 bg-white/50 ml-auto mt-4" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PHASE 4: OFFER (The Shrine) */}
            <AnimatePresence>
                {uiState === 'offer' && (
                    <motion.div
                        initial="hidden" animate="visible" exit="hidden" variants={variants}
                        className="absolute bottom-0 left-0 w-full p-6 md:p-12 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto"
                    >
                        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-end justify-between gap-6 md:gap-12">
                            <div className="text-left flex-1">
                                <h2 className="text-3xl md:text-5xl text-white font-black mb-2">{product.name}</h2>
                                <p className="text-white/60 text-xs md:text-sm max-w-lg line-clamp-3 md:line-clamp-none">
                                    {product.shortDescription || product.description}
                                </p>
                            </div>

                            <div className="w-full md:w-auto flex flex-col gap-3 min-w-[200px]">
                                <button
                                    className="bg-white text-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-[#E65800] hover:text-white transition-all w-full md:w-auto text-sm md:text-base rounded flex items-center justify-center gap-2"
                                    onClick={() => document.dispatchEvent(new CustomEvent('open-store-locator'))}
                                >
                                    <MapPin size={18} /> Find Nearby Stores
                                </button>
                                <button className="text-white/50 text-[10px] md:text-xs uppercase tracking-widest hover:text-white transition-colors">
                                    View Full Details
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};


const ProductDeepDive = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uiState, setUiState] = useState('reveal');
    const [showStoreLocator, setShowStoreLocator] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await productService.getProductBySlug(id);
                setProduct(response.data || response);
            } catch (err) {
                console.error('Error fetching details:', err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();

        const openLocator = () => setShowStoreLocator(true);
        document.addEventListener('open-store-locator', openLocator);
        return () => document.removeEventListener('open-store-locator', openLocator);
    }, [id]);

    const handleMaximize = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product?.name || 'Purna Product',
                    text: `Check out ${product?.name}`,
                    url: window.location.href,
                });
            } catch (err) { console.log(err); }
        } else {
            alert('Link Copied to Clipboard');
        }
    };

    if (loading || !product) {
        return <div className="h-screen w-full bg-[#050505] flex items-center justify-center text-white/50 animate-pulse text-xs tracking-widest">INITIALIZING...</div>;
    }

    return (
        <div className="h-screen w-full bg-[#050505] relative overflow-hidden select-none font-sans">

            {/* Functionality Header */}
            <div className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center text-white mix-blend-difference pointer-events-none">
                <button
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto flex items-center gap-2 hover:text-[#E65800] transition-colors"
                >
                    <ArrowLeft size={24} />
                    <span className="hidden md:inline text-xs font-bold tracking-widest uppercase">BACK</span>
                </button>
                <div className="flex gap-4 pointer-events-auto">
                    <button onClick={handleMaximize} className="opacity-50 hover:opacity-100 transition-opacity"><Maximize2 size={20} /></button>
                    <button onClick={handleShare} className="opacity-50 hover:opacity-100 transition-opacity"><Share2 size={20} /></button>
                </div>
            </div>

            <ErrorBoundary>
                <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "high-performance" }} camera={{ position: [0, 0, 10], fov: 45 }}>
                    <Suspense fallback={null}>
                        <AdaptiveDpr pixelated />

                        <ScrollControls pages={4} damping={0.3}>
                            <SpotlightScene product={product} setUiState={setUiState} />
                        </ScrollControls>
                    </Suspense>
                </Canvas>
            </ErrorBoundary>

            <ScrollOverlay uiState={uiState} product={product} />

            <StoreLocator
                isOpen={showStoreLocator}
                onClose={() => setShowStoreLocator(false)}
                productName={product.name}
            />

        </div>
    );
};

export default ProductDeepDive;
