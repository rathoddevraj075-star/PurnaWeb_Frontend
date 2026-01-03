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
import SEO from '../../components/SEO';

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
const DustMotes = ({ count = 30, color = "#000" }) => {
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

        // Fix: Keep Camera mostly centered to avoid perspective distortion ("Not Straight").
        // Instead, we will move the OBJECT (group) to positions.

        // SHOT 1: REVEAL (0.0 - 0.3)
        // Camera: Center, slightly zoomed out.
        // Object: Shifted RIGHT (x=2.5) to clear Left Text. Straight rotation.
        const shot1 = {
            camPos: new THREE.Vector3(0, 0, isMobile ? 12 : 9),
            camLook: new THREE.Vector3(0, 0, 0),
            objPos: new THREE.Vector3(isMobile ? 1.5 : 2.5, 0, 0)
        };

        // SHOT 2: INGREDIENTS (0.3 - 0.6)
        // Camera: Slight side angle for depth? Or just zoom?
        // Let's keep it simple: Center object, Zoom in.
        const shot2 = {
            camPos: new THREE.Vector3(0, 0, isMobile ? 8 : 5),
            camLook: new THREE.Vector3(0, 0, 0),
            objPos: new THREE.Vector3(0, 0, 0)
        };

        // SHOT 3: BENEFIT (0.6 - 0.85)
        // Object: Shifted LEFT (x=-2.5) to clear Right Text.
        const shot3 = {
            camPos: new THREE.Vector3(0, 0, isMobile ? 10 : 7),
            camLook: new THREE.Vector3(0, 0, 0),
            objPos: new THREE.Vector3(isMobile ? -1.5 : -3, 1, 0)
        };

        // SHOT 4: OFFER (0.85 - 1.0)
        // Object: Dead Center.
        // Cam: Center.
        // User said "last one image not in center".
        const shot4 = {
            camPos: new THREE.Vector3(0, 0, isMobile ? 12 : 10),
            camLook: new THREE.Vector3(0, 0, 0), // Look at center = center screen
            objPos: new THREE.Vector3(0, 0.5, 0)  // Move object slightly UP (0.5) to clear very bottom text
        };

        // -- INTERPOLATION LOGIC --
        let targetCamPos = new THREE.Vector3();
        let targetCamLook = new THREE.Vector3();
        let targetObjPos = new THREE.Vector3();

        if (offset < 0.33) {
            const t = offset / 0.33;
            targetCamPos.lerpVectors(shot1.camPos, shot2.camPos, t);
            targetCamLook.lerpVectors(shot1.camLook, shot2.camLook, t);
            targetObjPos.lerpVectors(shot1.objPos, shot2.objPos, t);
        } else if (offset < 0.66) {
            const t = (offset - 0.33) / 0.33;
            targetCamPos.lerpVectors(shot2.camPos, shot3.camPos, t);
            targetCamLook.lerpVectors(shot2.camLook, shot3.camLook, t);
            targetObjPos.lerpVectors(shot2.objPos, shot3.objPos, t);
        } else {
            const t = (offset - 0.66) / 0.34;
            targetCamPos.lerpVectors(shot3.camPos, shot4.camPos, t);
            targetCamLook.lerpVectors(shot3.camLook, shot4.camLook, t);
            targetObjPos.lerpVectors(shot3.objPos, shot4.objPos, t);
        }

        // Apply Camera
        camera.position.lerp(targetCamPos, delta * 3);
        camera.lookAt(targetCamLook);

        // --- OBJECT BEHAVIOR ---
        if (group.current) {
            // Apply Calculated Position
            group.current.position.lerp(targetObjPos, delta * 5); // Smooth object move

            // Add gentle levitation on top of position
            group.current.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

            // Scroll Rotation: Spin the product as we scroll
            group.current.rotation.y = offset * Math.PI * 2;
        }

        // --- LIGHTING DRAMA ---
        if (lightRef.current) {
            lightRef.current.position.x = Math.sin(offset * Math.PI) * 10;
            lightRef.current.position.z = Math.cos(offset * Math.PI) * 10;
            lightRef.current.intensity = 15 + Math.sin(state.clock.elapsedTime) * 2;
        }
    });

    return (
        <>
            <group ref={group}>
                {/* Product Image Plane - High Quality */}
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                    <Image
                        url={product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/600x800'}
                        scale={isMobile ? [4.85, 6, 1] : [6.06, 7.5, 1]}
                        transparent
                        opacity={1}
                    />
                    {/* Dark backing plate for catching rim lights nicely */}
                    <mesh position={[0, 0, -0.05]} scale={isMobile ? [4.95, 6.1, 1] : [6.16, 7.6, 1]}>
                        <planeGeometry />
                        <meshStandardMaterial color="#e5e5e5" roughness={0.2} metalness={0.8} />
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
        <div className="absolute inset-0 pointer-events-none z-10 font-sans text-black px-6 py-12 md:p-24 flex flex-col justify-between">

            {/* TOP UI SPACE (kept for layout balance) */}
            <div className="w-full h-6" />

            {/* CENTER CONTENT ZONES */}
            <div className="relative flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">

                    {/* PHASE 1: REVEAL */}
                    {uiState === 'reveal' && (
                        <motion.div
                            key="reveal"
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute top-32 left-0 md:left-[-2rem] text-left"
                        >
                            <h2 className="text-neutral-600 text-xs md:text-sm font-bold tracking-[0.8em] uppercase mb-4 opacity-70">Object No. 01</h2>
                            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9]">
                                {product.name.split(' ').map((word, i) => (
                                    <span key={i} className="block">{word}</span>
                                ))}
                            </h1>
                        </motion.div>
                    )}

                    {/* PHASE 2: INGREDIENTS */}
                    {uiState === 'ingredients' && (
                        <motion.div key="ingredients" variants={variants} initial="hidden" animate="visible" exit="exit" className="absolute left-0 md:left-[-4rem] top-1/2 -translate-y-1/2 max-w-[300px] text-left">
                            <div className="w-12 h-[2px] bg-black mb-6" />
                            <h3 className="text-3xl md:text-5xl font-bold uppercase leading-none mb-4">Core<br />Matrix</h3>
                            <p className="text-xs md:text-sm leading-relaxed opacity-70 font-mono">
                                {product.ingredientsSummary || "Active botanical compounds extracted for maximum efficacy. Pure. Potent. Field-tested."}
                            </p>
                            <div className="mt-6 flex gap-2">
                                <div className="px-3 py-1 border border-black/20 rounded-full text-[10px] uppercase tracking-wider">Organic</div>
                                <div className="px-3 py-1 border border-black/20 rounded-full text-[10px] uppercase tracking-wider">Vegan</div>
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
                            <div className="flex flex-col md:flex-row items-end justify-between gap-8 pb-12 border-b border-black/10">
                                <div>
                                    <h2 className="text-4xl md:text-6xl font-black uppercase mb-4">{product.name}</h2>
                                    <p className="max-w-md text-sm opacity-60">Ready to integrate this ritual into your daily protocol? Available at select flagship locations.</p>
                                </div>
                                <div className="flex flex-col gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => document.dispatchEvent(new CustomEvent('open-store-locator'))}
                                        className="h-14 px-8 bg-black text-white font-bold uppercase tracking-widest hover:bg-[#E65800] hover:text-white transition-colors flex items-center justify-center gap-3 rounded-sm"
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
            <div className="fixed right-6 top-1/2 -translate-y-1/2 h-32 w-[2px] bg-black/10 hidden md:block">
                <motion.div
                    className="w-full bg-black"
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

    if (loading || !product) return <div className="h-screen w-full bg-white flex items-center justify-center text-black/30 text-xs tracking-widest uppercase">Initializing Artifact...</div>;

    return (
        <>
            <SEO
                seo={product.seo}
                product={product}
                title={product.seo?.metaTitle || `${product.name} | PurnaRoutine`}
                description={product.seo?.metaDescription || product.shortDescription}
                keywords={product.seo?.metaKeywords?.join(', ')}
                image={product.images?.[0]?.url}
                url={`/products/${product.slug}`}
                type="product"
            />
            <div className="h-screen w-full bg-white relative overflow-hidden select-none">

                {/* GLOBAL HDR */}
                <div className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center text-black pointer-events-none">
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
                        <color attach="background" args={['#ffffff']} />
                        <Suspense fallback={null}>
                            <AdaptiveDpr pixelated />
                            <ScrollControls pages={4} damping={0.2}>
                                <CinematicRig product={product} setUiState={setUiState} />
                            </ScrollControls>
                            <EffectComposer disableNormalPass>
                                {/* <Noise opacity={0.06} /> */}
                                {/* <Bloom luminanceThreshold={0.5} mipmapBlur intensity={0.8} radius={0.4} /> */}
                                <Vignette eskil={false} offset={0.1} darkness={0.7} />
                            </EffectComposer>
                        </Suspense>
                    </Canvas>
                </ErrorBoundary>

                <EditorialOverlay uiState={uiState} product={product} />

                <StoreLocator isOpen={showStoreLocator} onClose={() => setShowStoreLocator(false)} productName={product.name} productId={product._id} />

                <style>{`
                .stroke-text {
                    -webkit-text-stroke: 1px black;
                    color: transparent;
                }
            `}</style>
            </div>
        </>
    );
};

export default ProductDeepDive;
