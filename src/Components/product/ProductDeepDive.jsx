import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Environment,
    Float,
    Image,
    SpotLight,
    ScrollControls,
    useScroll,
    AdaptiveDpr,
    Html
} from '@react-three/drei';
import { EffectComposer, Noise, Vignette, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ArrowLeft, Maximize2, Share2, MapPin, ChevronDown, MoveRight } from 'lucide-react';
import { productService } from '../../services/api';
import StoreLocator from '../store/StoreLocator';

// --- VISUAL ASSETS ---
// "The Void" Aesthetic: Deep, Dark, High Contrast, Volumetric feel.

// --- ERROR BOUNDARY ---
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError(error) { return { hasError: true }; }
    componentDidCatch(error, errorInfo) { console.error("3D Scene Error:", error, errorInfo); }
    render() {
        if (this.state.hasError) return <div className="text-white/30 text-xs p-8 border border-white/5 rounded">Visualization Unavailable</div>;
        return this.props.children;
    }
}

// --- PARTICLES ---
const DustMotes = ({ count = 30, color = "#fff" }) => {
    const { viewport } = useThree();
    const particles = useMemo(() => {
        return new Array(count).fill().map(() => ({
            position: [
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10
            ],
            scale: Math.random() * 0.05 + 0.02,
            speed: Math.random() * 0.2 + 0.1
        }));
    }, [count]);

    const ref = useRef();

    useFrame((state) => {
        if (ref.current) {
            // Subtle floating drift
            ref.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <group ref={ref}>
            {particles.map((p, i) => (
                <mesh key={i} position={p.position}>
                    <dodecahedronGeometry args={[p.scale, 0]} />
                    <meshBasicMaterial color={color} transparent opacity={0.4} />
                </mesh>
            ))}
        </group>
    );
};

// --- CINEMATIC RIG ---
const CinematicRig = ({ product, setUiState }) => {
    const scroll = useScroll();
    const { camera, viewport, size } = useThree();
    const group = useRef();
    const lightRef = useRef();

    // Robust mobile detection
    const isMobile = size.width < 768 || viewport.width < 6;

    // Theme Extraction
    const themeColor = product.themeColor || "#E65800";

    useFrame((state, delta) => {
        const offset = scroll.offset; // 0 (start) -> 1 (end)

        // --- SCROLL DRIVEN STATE ---
        if (offset < 0.25) setUiState('reveal');
        else if (offset < 0.5) setUiState('ingredients');
        else if (offset < 0.8) setUiState('benefit');
        else setUiState('offer');

        // --- CAMERA CHOREOGRAPHY ("The Shot List") ---

        // Shot 1: "The Monolith" (0.0 - 0.3)
        // Low angle, looking up at hero.
        const shot1 = { pos: new THREE.Vector3(0, -2, isMobile ? 12 : 9), look: new THREE.Vector3(0, 1, 0) };

        // Shot 2: "The Analysis" (0.3 - 0.6)
        // Side profile, extreme close up.
        const shot2 = { pos: new THREE.Vector3(isMobile ? 3 : 5, 0, isMobile ? 8 : 4), look: new THREE.Vector3(0, 0, 0) };

        // Shot 3: "The Promise" (0.6 - 0.85)
        // Top-down / Dutch angle, artistic.
        const shot3 = { pos: new THREE.Vector3(isMobile ? -2 : -4, 3, isMobile ? 10 : 6), look: new THREE.Vector3(0, -1, 0) };

        // Shot 4: "The Offering" (0.85 - 1.0)
        // Center frame, balanced, ready to buy.
        const shot4 = { pos: new THREE.Vector3(0, 0, isMobile ? 13 : 10), look: new THREE.Vector3(0, 0, 0) };

        // -- INTERPOLATION LOGIC --
        let targetPos = new THREE.Vector3();
        let targetLook = new THREE.Vector3();

        if (offset < 0.33) {
            const t = offset / 0.33;
            targetPos.lerpVectors(shot1.pos, shot2.pos, t);
            targetLook.lerpVectors(shot1.look, shot2.look, t);
        } else if (offset < 0.66) {
            const t = (offset - 0.33) / 0.33;
            targetPos.lerpVectors(shot2.pos, shot3.pos, t);
            targetLook.lerpVectors(shot2.look, shot3.look, t);
        } else {
            const t = (offset - 0.66) / 0.34;
            targetPos.lerpVectors(shot3.pos, shot4.pos, t);
            targetLook.lerpVectors(shot3.look, shot4.look, t);
        }

        // Smooth Camera Movement (Damping)
        camera.position.lerp(targetPos, delta * 3);

        // Smooth LookAt requires a dummy object or simple vector lerp, 
        // but camera.lookAt updates matrix instantly. We lerp the *target* then look.
        // We can stick to standard easing for 'lookAt' targets?
        // For simplicity and smoothness in r3f:
        const currentLook = new THREE.Vector3(0, 0, 0); // approximating center focus
        // Actually, let's just look at 0,0,0 always but with slight offset for framing?
        // No, the shot list 'look' vectors are better.

        // Simple lookAt 0,0,0 is safest to avoid gimble locks or snappy rotations.
        // Let's bias the look target slightly based on the phase.
        camera.lookAt(0, 0, 0);


        // --- OBJECT BEHAVIOR ---
        if (group.current) {
            // Constant gentle levitation
            group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;

            // Scroll Rotation: Spin the product as we scroll to show off 3D nature
            group.current.rotation.y = offset * Math.PI * 2;

            // Mouse interaction (Parallax)
            // group.current.rotation.x = state.mouse.y * 0.1;
            // group.current.rotation.z = state.mouse.x * 0.1;
        }

        // --- LIGHTING DRAMA ---
        if (lightRef.current) {
            // Move the spotlight around to create moving shadows/highlights
            lightRef.current.position.x = Math.sin(offset * Math.PI) * 10;
            lightRef.current.position.z = Math.cos(offset * Math.PI) * 10;
            lightRef.current.intensity = 15 + Math.sin(state.clock.elapsedTime) * 2; // Pulse
        }
    });

    return (
        <>
            <group ref={group}>
                {/* Product Image Plane - High Quality */}
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                    <Image
                        url={product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/600x800'}
                        scale={isMobile ? [4.5, 6, 1] : [5.5, 7.5, 1]}
                        transparent
                        opacity={1}
                    />
                    {/* Dark backing plate for catching rim lights nicely */}
                    <mesh position={[0, 0, -0.05]} scale={isMobile ? [4.6, 6.1, 1] : [5.6, 7.6, 1]}>
                        <planeGeometry />
                        <meshStandardMaterial color="#000" roughness={0.2} metalness={0.8} />
                    </mesh>
                </Float>
            </group>

            {/* VOLUMETRIC-STYLE LIGHTING */}
            <SpotLight
                ref={lightRef}
                position={[5, 10, 5]}
                angle={0.4}
                penumbra={0.5}
                color={themeColor}
                distance={40}
                decay={2}
            />

            {/* Rim Light for separation */}
            <SpotLight position={[-10, 5, -5]} angle={0.5} intensity={10} color="#ffffff" />

            {/* Fill Light (Subtle) */}
            <ambientLight intensity={0.2} />

            <DustMotes color={themeColor} />

            {/* ENVIRONMENT: Studio Gloom */}
            {/* We use a very low intensity env map just for reflections on the "black glass" backing */}
            <Environment preset="city" opacity={0.2} blur={1} />
        </>
    );
};


// --- UI OVERLAY (The "Editorial" Layer) ---
const EditorialOverlay = ({ uiState, product }) => {

    // TEXT CONTENT
    const benefitWords = (product.benefitsSummary || "PURE . POWER").split(' ');
    const benefitMain = benefitWords[0];
    const benefitSub = benefitWords.slice(1).join(' ');

    const variants = {
        hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, y: -50, filter: 'blur(10px)', transition: { duration: 0.5 } }
    };

    return (
        <div className="absolute inset-0 pointer-events-none z-10 font-sans text-white mix-blend-difference px-6 py-12 md:p-24 flex flex-col justify-between">

            {/* TOP NAVIGATION / HUD */}
            <div className="w-full flex justify-between items-start opacity-50">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Project / Deep Dive</span>
                    <span className="text-[10px] font-mono">ID: {product.slug?.substring(0, 6).toUpperCase()} // v.1.0</span>
                </div>
                <div className="hidden md:flex gap-8">
                    <span className="text-[10px] uppercase tracking-widest animate-pulse">Live Render</span>
                </div>
            </div>

            {/* CENTER CONTENT ZONES */}
            <div className="relative flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">

                    {/* PHASE 1: REVEAL */}
                    {uiState === 'reveal' && (
                        <motion.div key="reveal" variants={variants} initial="hidden" animate="visible" exit="exit" className="absolute text-center">
                            <h2 className="text-[#F3F3F3] text-xs md:text-sm font-bold tracking-[0.8em] uppercase mb-6">Object No. 01</h2>
                            <h1 className="text-5xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] md:leading-[0.8]">
                                {product.name.split(' ').map((word, i) => (
                                    <span key={i} className="block">{word}</span>
                                ))}
                            </h1>
                            <div className="mt-8 flex justify-center">
                                <ChevronDown className="w-6 h-6 opacity-50 animate-bounce" />
                            </div>
                        </motion.div>
                    )}

                    {/* PHASE 2: INGREDIENTS */}
                    {uiState === 'ingredients' && (
                        <motion.div key="ingredients" variants={variants} initial="hidden" animate="visible" exit="exit" className="absolute left-0 md:left-[-4rem] top-1/2 -translate-y-1/2 max-w-[300px] text-left">
                            <div className="w-12 h-[2px] bg-white mb-6" />
                            <h3 className="text-3xl md:text-5xl font-bold uppercase leading-none mb-4">Core<br />Matrix</h3>
                            <p className="text-xs md:text-sm leading-relaxed opacity-70 font-mono">
                                {product.ingredientsSummary || "Active botanical compounds extracted for maximum efficacy. Pure. Potent. Field-tested."}
                            </p>
                            <div className="mt-6 flex gap-2">
                                <div className="px-3 py-1 border border-white/20 rounded-full text-[10px] uppercase tracking-wider">Organic</div>
                                <div className="px-3 py-1 border border-white/20 rounded-full text-[10px] uppercase tracking-wider">Vegan</div>
                            </div>
                        </motion.div>
                    )}

                    {/* PHASE 3: BENEFIT */}
                    {uiState === 'benefit' && (
                        <motion.div key="benefit" variants={variants} initial="hidden" animate="visible" exit="exit" className="absolute right-0 md:right-[-4rem] top-1/2 -translate-y-1/2 text-right">
                            <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-50 mb-4">Observed Effect</h3>
                            <div className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                <span className="block text-transparent stroke-text">{benefitMain}</span>
                                <span className="block">{benefitSub}</span>
                            </div>
                        </motion.div>
                    )}

                    {/* PHASE 4: OFFER (The Purchase) */}
                    {uiState === 'offer' && (
                        <motion.div key="offer" variants={variants} initial="hidden" animate="visible" exit="exit" className="absolute bottom-0 w-full pointer-events-auto">
                            <div className="flex flex-col md:flex-row items-end justify-between gap-8 pb-12 border-b border-white/10">
                                <div>
                                    <h2 className="text-4xl md:text-6xl font-black uppercase mb-4">{product.name}</h2>
                                    <p className="max-w-md text-sm opacity-60">Ready to integrate this ritual into your daily protocol? Available at select flagship locations.</p>
                                </div>
                                <div className="flex flex-col gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => document.dispatchEvent(new CustomEvent('open-store-locator'))}
                                        className="h-14 px-8 bg-white text-black font-bold uppercase tracking-widest hover:bg-[#E65800] hover:text-white transition-colors flex items-center justify-center gap-3 rounded-sm"
                                    >
                                        <MapPin size={18} /> Locate Stock
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* SCROLL INDICATOR BAR */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 h-32 w-[2px] bg-white/10 hidden md:block">
                <motion.div
                    className="w-full bg-white"
                    animate={{
                        height: uiState === 'reveal' ? '25%' : uiState === 'ingredients' ? '50%' : uiState === 'benefit' ? '75%' : '100%'
                    }}
                />
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
const ProductDeepDive = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uiState, setUiState] = useState('reveal'); // reveal, ingredients, benefit, offer
    const [showStoreLocator, setShowStoreLocator] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // FETCHING
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await productService.getProductBySlug(id);
                setProduct(response.data || response);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        if (id) fetchProduct();

        // Event for locator
        const openLocator = () => setShowStoreLocator(true);
        document.addEventListener('open-store-locator', openLocator);
        return () => document.removeEventListener('open-store-locator', openLocator);
    }, [id]);

    // HANDLERS
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
            try { await navigator.share({ title: product?.name, url: window.location.href }); } catch (err) { }
        } else { alert('Link Copied'); }
    };

    if (loading || !product) return <div className="h-screen w-full bg-[#050505] flex items-center justify-center text-white/30 text-xs tracking-widest uppercase">Initializing Artifact...</div>;

    return (
        <div className="h-screen w-full bg-[#030303] relative overflow-hidden select-none">

            {/* GLOBAL HDR */}
            <div className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center text-white mix-blend-difference pointer-events-none">
                <button onClick={() => navigate(-1)} className="pointer-events-auto flex items-center gap-2 hover:opacity-50 transition-opacity">
                    <ArrowLeft size={20} /> <span className="hidden md:inline text-xs font-bold tracking-widest uppercase">Return</span>
                </button>
                <div className="flex gap-4 pointer-events-auto opacity-50">
                    <button onClick={handleMaximize} className="hover:opacity-100"><Maximize2 size={20} /></button>
                    <button onClick={handleShare} className="hover:opacity-100"><Share2 size={20} /></button>
                </div>
            </div>

            <ErrorBoundary>
                <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "high-performance" }} camera={{ fov: 45 }}>
                    <color attach="background" args={['#030303']} />
                    <Suspense fallback={null}>
                        <AdaptiveDpr pixelated />
                        <ScrollControls pages={4} damping={0.2}>
                            <CinematicRig product={product} setUiState={setUiState} />
                        </ScrollControls>
                        <EffectComposer disableNormalPass>
                            <Noise opacity={0.06} />
                            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={0.8} radius={0.4} />
                            <Vignette eskil={false} offset={0.1} darkness={0.7} />
                        </EffectComposer>
                    </Suspense>
                </Canvas>
            </ErrorBoundary>

            <EditorialOverlay uiState={uiState} product={product} />

            <StoreLocator isOpen={showStoreLocator} onClose={() => setShowStoreLocator(false)} productName={product.name} />

            <style>{`
                .stroke-text {
                    -webkit-text-stroke: 1px white;
                    color: transparent;
                }
            `}</style>
        </div>
    );
};

export default ProductDeepDive;
