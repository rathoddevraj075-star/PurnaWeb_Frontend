import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import {
    useTexture,
    Environment,
    Float,
    Text,
    Image,
    ScrollControls,
    useScroll,
    MeshTransmissionMaterial,
    Lightformer,
    shaderMaterial,
    CubeCamera
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ArrowLeft, ArrowRight, Layers, Maximize } from 'lucide-react';
import { productService, categoryService } from '../../services/api';
import SEO from '../../components/SEO';

// --- CONSTANTS ---
const FONT_URL = '/fonts/TT Firs Neue Trial Bold.ttf';

// --- SHADERS ---

// Liquid Chrome Shader
// Uses noise to displace vertices and analytical normals for crisp reflections
const MercuryMaterial = shaderMaterial(
    {
        uTime: 0,
        uEnvMap: null,
        uResolution: new THREE.Vector2(0, 0),
        uMouse: new THREE.Vector2(0, 0),
        uColor: new THREE.Color('#ffffff')
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    uniform float uTime;
    uniform vec2 uMouse;

    // Simplex Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Liquid Motion
        float noise = snoise(uv * 1.5 + uTime * 0.1);
        float noise2 = snoise(uv * 3.0 - uTime * 0.2);
        
        // Combine layers
        float displacement = (noise * 1.0 + noise2 * 0.5) * 0.8;
        
        // Mouse Ripple
        float dist = distance(uv, uMouse);
        float ripple = sin(dist * 15.0 - uTime * 3.0) * exp(-dist * 3.0) * 0.2;
        
        pos.z += displacement + ripple;
        
        // Compute Normal analytically (approximate)
        float d = 0.01;
        float n1 = snoise((uv + vec2(d,0)) * 1.5 + uTime*0.1);
        float n2 = snoise((uv + vec2(0,d)) * 1.5 + uTime*0.1);
        vec3 t1 = normalize(vec3(d, 0.0, n1 - noise));
        vec3 t2 = normalize(vec3(0.0, d, n2 - noise));
        vNormal = cross(t1, t2);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
        vPosition = pos;
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    uniform sampler2D uEnvMap;
    uniform vec3 uColor;

    void main() {
        vec3 viewDir = normalize(vViewPosition);
        vec3 normal = normalize(vNormal);
        
        // Fresnel
        float fresnel = pow(1.0 - dot(viewDir, normal), 3.0);
        
        // Fake Reflection (Matcap style or Environment mapping)
        // Since we don't have access to the real scene cubemap easily in shaderMaterial without convoluted setup,
        // we'll calculate a procedural metallic look.
        
        vec3 reflectDir = reflect(-viewDir, normal);
        
        // Procedural Studio Light reflection
        float light = dot(reflectDir, normalize(vec3(0.5, 1.0, 0.5)));
        light = pow(max(0.0, light), 10.0); // Specular highlight
        
        // Base Metal Color
        vec3 metalColor = mix(vec3(0.1), vec3(0.9), fresnel);
        metalColor += light * 2.0; // intense reflection
        
        // Tint
        metalColor *= uColor;

        gl_FragColor = vec4(metalColor, 1.0);
    }
    `
);
extend({ MercuryMaterial });

// --- 3D COMPONENTS ---

const MercuryBackground = ({ activeColor }) => {
    const materialRef = useRef();
    const { viewport, mouse } = useThree();

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uTime = state.clock.elapsedTime;
            // Map mouse -1..1 to 0..1 UV space
            const u = (mouse.x + 1) / 2;
            const v = (mouse.y + 1) / 2;
            materialRef.current.uMouse.lerp(new THREE.Vector2(u, v), delta * 2);

            // Subtle tint based on project
            /* materialRef.current.uColor.lerp(new THREE.Color(activeColor || "#ffffff"), delta); */
            // Force Silver/Chrome for high end look
            materialRef.current.uColor.lerp(new THREE.Color("#e0e0e0"), delta);
        }
    });

    return (
        <mesh position={[0, 0, -8]} scale={[viewport.width * 1.2, viewport.height * 1.2, 1]}>
            <planeGeometry args={[1, 1, 128, 128]} />
            <mercuryMaterial ref={materialRef} />
        </mesh>
    );
};

const ProductPrism = ({ product, index, activeIndex }) => {
    const isActive = activeIndex === index;
    const group = useRef();

    useFrame((state, delta) => {
        // Subtle float
        group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.2;

        // Rotate if active
        // if(isActive) group.current.rotation.y += delta * 0.1;
    });

    return (
        <group ref={group}>
            {/* The Glass Prism Base */}
            <mesh position={[0, -0.5, -0.5]} scale={[4, 5.5, 0.5]}>
                <boxGeometry />
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={0.5}
                    chromaticAberration={0.05}
                    anisotropy={0.1}
                    distortion={0.1}
                    distortionScale={0.1}
                    temporalDistortion={0.1}
                    roughness={0}
                    ior={1.5}
                    color="#ffffff"
                />
            </mesh>

            {/* The Product Image */}
            <Image
                url={product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/600x800'}
                scale={[4, 5.5, 1]}
                position={[0, 0, 0.1]}
                transparent
                toneMapped={false}
            />

            {/* Reflection on floor? No, mercury background handles environment. */}
        </group>
    );
};

const MercuryScene = ({ products, activeIndex, setActiveIndex }) => {
    const { width } = useThree((state) => state.viewport);
    const scroll = useScroll();
    const group = useRef();

    // Layout
    const GAP = 6;

    useFrame((state, delta) => {
        // Scroll Logic
        const offset = scroll.offset * (products.length - 1);
        setActiveIndex(Math.round(offset));

        const targetX = -offset * GAP;
        group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, delta * 6);
    });

    return (
        <group ref={group} position={[width < 5 ? 0 : 2, 0, 0]}>
            {products.map((product, i) => (
                <group key={i} position={[i * GAP, 0, 0]}>
                    <ProductPrism product={product} index={i} activeIndex={activeIndex} />
                </group>
            ))}
        </group>
    );
};

const LightingRig = () => {
    return (
        <>
            <Environment preset="studio" />

            {/* Custom Lightformers for nice reflections on the mercury */}
            <Environment resolution={256}>
                <group rotation={[-Math.PI / 3, 0, 1]}>
                    <Lightformer form="rect" intensity={4} position={[10, 0, 1]} scale={10} color="white" />
                    <Lightformer form="ring" intensity={2} position={[-5, 2, -1]} scale={10} color="white" />
                    <Lightformer form="circle" intensity={2} position={[0, 5, -2]} scale={2} color="#ff0000" /> {/* Red accent */}
                </group>
            </Environment>

            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        </>
    )
}

// --- DOM UI ---

const ChromeUI = ({ products, activeIndex }) => {
    const activeProduct = products[activeIndex] || products[0];

    return (
        <div className="absolute inset-0 pointer-events-none p-6 md:p-12 flex flex-col justify-between text-white mix-blend-difference">

            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <h1 className="text-sm font-bold tracking-[0.3em] uppercase opacity-70 mb-2">Purna Routine</h1>
                    <div className="w-12 h-[2px] bg-white" />
                </div>

                <div className="flex gap-4 opacity-50 text-xs font-mono">
                    <span>INDEX.{activeIndex + 1}</span>
                    <span>/</span>
                    <span>TOTAL.{products.length}</span>
                </div>
            </div>

            {/* Center Float Title? No, stick to consistent layout but stylized */}

            {/* Bottom Panel */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                <div className="max-w-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeProduct?._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-4">
                                {activeProduct?.name}
                            </h2>
                            <p className="text-lg md:text-xl font-light opacity-80 max-w-lg">
                                {activeProduct?.shortDescription}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="pointer-events-auto">
                    <button
                        onClick={() => window.location.href = `/products/${activeProduct?.slug}`}
                        className="group w-24 h-24 border border-white/30 rounded-full flex flex-col items-center justify-center hover:bg-white hover:text-black transition-all duration-500"
                    >
                        <Maximize size={24} className="mb-1 group-hover:scale-125 transition-transform" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Open</span>
                    </button>
                </div>
            </div>

        </div>
    );
};

const VariantDetailScroller = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categoryData, setCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    // Fetch
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

    // Theme color for internal ref if needed
    const activeColor = useMemo(() => products[activeIndex]?.themeColor, [products, activeIndex]);

    if (loading) return <div className="h-screen w-full bg-black flex items-center justify-center text-white/50 font-bold tracking-widest uppercase">Loading Chrome...</div>;

    return (
        <>
            <SEO
                seo={categoryData?.seo}
                title={categoryData?.seo?.metaTitle || `${categoryData?.name || 'Collection'} | Immersive View`}
                url={`/categories/${category}`}
            />
            <div className="h-screen w-full bg-[#050505] relative overflow-hidden">

                {/* Close Button */}
                <div className="fixed top-8 left-8 z-50 pointer-events-auto mix-blend-difference">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white hover:opacity-50 transition-opacity">
                        <ArrowLeft size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest">Back</span>
                    </button>
                </div>

                <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 45 }}>
                    <Suspense fallback={null}>
                        {/* The Infinite Mercury Sea */}
                        <MercuryBackground activeColor={activeColor} />

                        <LightingRig />

                        <ScrollControls horizontal pages={products.length > 0 ? products.length : 1} damping={0.2} style={{ scrollbarWidth: 'none' }}>
                            <MercuryScene products={products} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
                        </ScrollControls>

                        <EffectComposer>
                            <Noise opacity={0.05} />
                            <Bloom luminanceThreshold={0.5} intensity={0.5} radius={0.5} />
                        </EffectComposer>
                    </Suspense>
                </Canvas>

                <ChromeUI products={products} activeIndex={activeIndex} />

            </div>
        </>
    );
};

export default VariantDetailScroller;
