import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Environment, Float, Text, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowLeft, Droplets, Sun, Sparkles } from 'lucide-react';
import { products } from '../data/product';
import Lenis from 'lenis';

// --- 3D Experience Components ---

const ProductHeroModel = ({ product, sectionIndex }) => {
    const meshRef = useRef();
    const groupRef = useRef();
    const { viewport } = useThree();

    // Simple mobile detection based on viewport width in 3D units
    const isMobile = viewport.width < 5;

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Smoothly interpolate to target positions based on active section
        // Desktop: Side-to-side. Mobile: Center/Vertical tweaks.

        const targetPos = new THREE.Vector3(0, 0, 0);
        const targetRot = new THREE.Euler(0, 0, 0);

        switch (sectionIndex) {
            case 0: // Hero
                targetPos.set(0, 0, 0);
                targetRot.set(0, state.clock.elapsedTime * 0.2, 0);
                break;
            case 1: // Benefits
                if (isMobile) {
                    targetPos.set(0, 1, -2); // Move up and back on mobile
                    targetRot.set(0.1, 0.5, 0);
                } else {
                    targetPos.set(-2, 0, -1);
                    targetRot.set(0, 0.5, 0.2);
                }
                break;
            case 2: // Ingredients
                if (isMobile) {
                    targetPos.set(0, 1, -2); // Move up and back on mobile
                    targetRot.set(0, -0.5, 0);
                } else {
                    targetPos.set(2, 0, 0);
                    targetRot.set(0, -0.5, -0.1);
                }
                break;
            case 3: // Usage
                targetPos.set(0, isMobile ? 1.5 : -0.5, 0);
                targetRot.set(0.2, state.clock.elapsedTime * 0.5, 0);
                break;
            default:
                break;
        }

        groupRef.current.position.lerp(targetPos, 2.5 * delta);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRot.x, 2.5 * delta);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot.y, 2.5 * delta);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRot.z, 2.5 * delta);
    });

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
                <mesh ref={meshRef} castShadow receiveShadow>
                    <boxGeometry args={[2.2, 3.2, 0.5]} />
                    <meshPhysicalMaterial
                        color={product.themeColor || "#333"}
                        roughness={0.2}
                        metalness={0.1}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                    />

                    <Text
                        position={[0, 0, 0.26]}
                        fontSize={0.25}
                        color="white"
                        maxWidth={2}
                        textAlign="center"
                        anchorX="center"
                        anchorY="middle"
                        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                    >
                        {product.name}
                    </Text>
                </mesh>
            </Float>
            <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={15} blur={2.5} far={4.5} />
        </group>
    );
};

const ImmersiveScene = ({ product, sectionIndex }) => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={40} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />
            <Environment preset="studio" />

            <Float speed={1} rotationIntensity={1} floatIntensity={1} position={[-4, 2, -5]}>
                <mesh>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial color={product.themeColor} transparent opacity={0.2} />
                </mesh>
            </Float>
            <Float speed={1.5} rotationIntensity={1} floatIntensity={1} position={[4, -2, -8]}>
                <mesh>
                    <sphereGeometry args={[1.5, 32, 32]} />
                    <meshStandardMaterial color="white" transparent opacity={0.1} wireframe />
                </mesh>
            </Float>

            <ProductHeroModel product={product} sectionIndex={sectionIndex} />
        </>
    );
};


// --- Main Component ---

const ProductDeepDive = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = useMemo(() => products.find(p => p.id === id) || products[0], [id]);

    // Scroll State
    const [sectionIndex, setSectionIndex] = useState(0);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
        });

        function onScroll(e) {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const newIndex = Math.round(scrollY / viewportHeight);
            setSectionIndex(newIndex);
        }

        lenis.on('scroll', onScroll);

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    if (!product) return <div>Product not found</div>;

    const sections = [
        {
            id: 'hero',
            content: (
                <div className="flex flex-col items-center justify-center text-center h-full max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-black/5 backdrop-blur border border-black/10 text-xs font-bold uppercase tracking-widest mb-6">
                            {product.category}
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight text-neutral-900 leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                            {product.description}
                        </p>
                    </motion.div>
                </div>
            )
        },
        {
            id: 'benefits',
            content: (
                <div className="flex flex-col h-full justify-center w-full md:max-w-xl md:ml-auto md:pr-20">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-white/60 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-lg border border-white/50"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="text-amber-500" />
                            <h2 className="text-3xl font-bold">Why It's Special</h2>
                        </div>
                        <ul className="space-y-6">
                            {product.keyBenefits.map((b, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="min-w-[24px] h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                                        {i + 1}
                                    </div>
                                    <span className="text-lg text-neutral-800 font-medium">{b}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            )
        },
        {
            id: 'ingredients',
            content: (
                <div className="flex flex-col h-full justify-center w-full md:max-w-xl md:pl-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-white/60 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-lg border border-white/50"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Droplets className="text-blue-500" />
                            <h2 className="text-3xl font-bold">Pure Ingredients</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {product.accordion?.INGREDIENTS?.map((ing, i) => (
                                <span key={i} className="px-4 py-2 bg-white rounded-xl shadow-sm text-sm font-semibold text-neutral-600">
                                    {ing.name}
                                </span>
                            )) || <p>See packaging for full list.</p>}
                        </div>
                        <p className="mt-6 text-sm text-neutral-500 italic">
                            *Sourced responsibly from nature's best.
                        </p>
                    </motion.div>
                </div>
            )
        },
        {
            id: 'usage',
            content: (
                <div className="flex flex-col items-center justify-center text-center h-full max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-black/90 backdrop-blur-md p-12 rounded-[3rem] text-white shadow-2xl"
                    >
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <Sun className="text-yellow-400" />
                            <h2 className="text-3xl font-bold">Your Daily Ritual</h2>
                        </div>
                        <div className="space-y-6 text-left">
                            {product.howToUse?.map((step, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <span className="text-2xl font-black text-white/20">0{i + 1}</span>
                                    <p className="text-lg text-white/90">{step}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )
        }
    ];

    return (
        <div className="relative w-full">
            {/* Navigation Controls */}
            <div className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
                <button
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-white transition-all shadow-sm"
                >
                    <ArrowLeft size={16} /> Back
                </button>
            </div>

            {/* Fixed Full-Screen 3D Background */}
            <div className="fixed inset-0 w-full h-full z-0 bg-[#F5F5F0]">
                <Canvas shadows dpr={[1, 2]}>
                    <Suspense fallback={null}>
                        <ImmersiveScene product={product} sectionIndex={sectionIndex} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Scrollable Content Layers */}
            <div className="relative z-10 w-full">
                {sections.map((section, idx) => (
                    <section key={section.id} className="min-h-screen w-full p-6 flex items-center">
                        {section.content}
                    </section>
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-neutral-400 text-xs font-bold uppercase tracking-widest z-20 animate-bounce">
                Scroll Down
            </div>
        </div>
    );
};

export default ProductDeepDive;
