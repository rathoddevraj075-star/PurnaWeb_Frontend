import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { Environment, Float, Text, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { products } from '../data/product';
import Lenis from 'lenis';

// -- 3D Components --

const ProductModel = ({ index, activeIndex, product }) => {
    const meshRef = useRef();
    const groupRef = useRef();

    // Animate based on active state
    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const isActive = index === activeIndex;
        const targetScale = isActive ? 1.2 : 0.8;
        const targetOpacity = isActive ? 1 : 0.3;
        const targetZ = isActive ? 0 : -2;

        // Smooth lerp
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 4 * delta);
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 4 * delta);

        // Rotate constantly
        meshRef.current.rotation.y += delta * 0.5;
    });

    return (
        <group ref={groupRef} position={[0, 0, -index * 5]}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh ref={meshRef}>
                    <boxGeometry args={[2, 3, 0.2]} />
                    <meshStandardMaterial
                        color={product.themeColor || "#ff0000"}
                        roughness={0.3}
                        metalness={0.1}
                    />

                    <Text
                        position={[0, 0, 0.11]}
                        fontSize={0.2}
                        color="white"
                        maxWidth={1.8}
                        textAlign="center"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {product.name}
                    </Text>
                </mesh>
            </Float>
            <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
        </group>
    );
};

const Scene = ({ products, activeIndex }) => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <Environment preset="city" />

            <group position={[0, -0.5, 0]}>
                {products.map((product, i) => (
                    (Math.abs(activeIndex - i) <= 2) && (
                        <ProductModel
                            key={product.id}
                            index={i}
                            activeIndex={activeIndex}
                            product={product}
                        />
                    )
                ))}
            </group>
        </>
    );
};


// -- Main Component --


const VariantDetailScroller = () => {
    const { category } = useParams();
    const navigate = useNavigate();

    console.log("VariantDetailScroller Rendered. Category:", category);

    // Init Lenis
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    // Get Data
    const categoryName = useMemo(() => {
        if (!category) return "";
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }, [category]);

    const categoryProducts = useMemo(() => {
        const prods = products.filter(p => p.category === categoryName);
        console.log("Filtered Products:", prods);
        return prods;
    }, [categoryName]);

    // Scroll Logic
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const viewportHeight = window.innerHeight;
            const scrollY = window.scrollY;
            const center = scrollY + (viewportHeight / 2);
            const index = Math.floor(center / viewportHeight);
            const clampedIndex = Math.max(0, Math.min(index, categoryProducts.length - 1));
            setActiveIndex(clampedIndex);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [categoryProducts.length]);

    // Update URL hash without jumping
    useEffect(() => {
        const currentProduct = categoryProducts[activeIndex];
        if (currentProduct) {
            // Optional: window.history.replaceState(null, null, `#${currentProduct.id}`);
        }
    }, [activeIndex, categoryProducts]);


    if (!categoryProducts.length) {
        console.warn("No products found for category:", categoryName);
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Category Not Found</h1>
                    <p>Could not find products for {categoryName} ({category})</p>
                    <button onClick={() => navigate('/products')} className="mt-4 bg-black text-white px-4 py-2 rounded">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-neutral-50 min-h-screen relative">


            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm hover:bg-white transition-all text-sm font-bold uppercase tracking-wider cursor-pointer"
            >
                <ArrowLeft size={16} /> Back
            </button>

            {/* Fixed 3D Canvas Background/Right Panel */}
            <div className="fixed top-0 left-0 w-full h-full z-0 lg:left-[50%] lg:w-[50%] bg-neutral-200">
                <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }} style={{ width: '100%', height: '100%' }}>
                    <Scene products={categoryProducts} activeIndex={activeIndex} />
                </Canvas>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-500 text-xs font-mono uppercase tracking-widest pointer-events-none">
                    Scroll to Explore
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="relative z-10 lg:w-[50%]">
                {categoryProducts.map((product, i) => (
                    <div
                        key={product.id}
                        className="h-screen flex items-end pb-24 lg:pb-0 lg:items-center p-6 sm:p-12 lg:p-20 relative pointer-events-none"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-20%" }}
                            transition={{ duration: 0.8 }}
                            className={`pointer-events-auto bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white/50 w-full max-w-xl mx-auto
                                ${activeIndex === i ? 'opacity-100 scale-100' : 'opacity-50 scale-95 blur-[2px]'}
                                transition-all duration-700
                            `}
                        >
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] mb-4 block">
                                {product.category} — {i + 1}/{categoryProducts.length}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{product.name}</h2>
                            <p className="text-lg text-neutral-600 mb-8 leading-relaxed max-w-md">
                                {product.description}
                            </p>

                            <div className="space-y-6">
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-neutral-100 rounded-full text-xs font-bold text-neutral-500 uppercase">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="h-px bg-neutral-100 w-full" />

                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => navigate(`/products/${product.id}`)}
                                        className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* Progress indicators - Desktop Only */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 hidden lg:flex">
                {categoryProducts.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-black h-8' : 'bg-neutral-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default VariantDetailScroller;
