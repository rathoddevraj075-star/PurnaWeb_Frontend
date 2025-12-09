export const products = [
  {
    id: "herbal-toothpaste",
    name: "Complete Care Herbal Toothpaste",
    category: "Oral Care",
    tagline: "Natural protection for strong teeth and healthy gums.",
    price: 8,
    tags: ["Fluoride-Free", "Clove", "Neem", "Mint"],
    description:
      "Experience the power of nature with our Complete Care Herbal Toothpaste. Formulated with a potent blend of Neem, Clove, and Mint, it fights bacteria, strengthens gums, and leaves your breath feeling fresh all day long. Free from harmful chemicals and fluoride.",
    keyBenefits: [
      "Fights cavity-causing bacteria",
      "Strengthens gums and teeth",
      "Long-lasting fresh breath",
      "Reduces plaque and tartar",
      "100% Vegetarian & Fluoride-Free",
    ],
    heroIngredient: {
      name: "Clove & Neem",
      description: "A powerful duo: Neem fights bacteria while Clove relieves toothache and strengthens gums.",
      image: "https://images.unsplash.com/photo-1623817923363-4d4352723048?q=80&w=1000&auto=format&fit=crop" // Placeholder
    },
    howToUse: [
      "Squeeze a pea-sized amount onto your toothbrush.",
      "Brush thoroughly for at least two minutes.",
      "Rinse mouth with water.",
      "Use twice daily for best results."
    ],
    suitableFor: [
      "Sensitive Teeth",
      "Bleeding Gums",
      "Daily Oral Hygiene"
    ],
    crossSell: ["copper-tongue-cleaner", "neem-basil-soap"],
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop", // Placeholder for toothpaste
      "https://images.unsplash.com/photo-1556228720-1957be83f304?q=80&w=1887&auto=format&fit=crop",
    ],
    features: [
      {
        icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/nogmo-2.png?v=1737037297&width=1000",
        title: "NEEM",
        text: "Antibacterial properties that fight germs and prevent cavities.",
      },
      {
        icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/eng-ico.png?v=1737042253&width=1000",
        title: "CLOVE",
        text: "Natural analgesic that helps relieve tooth pain and strengthen gums.",
      },
      {
        icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/vegan-2.png?v=1737037101&width=1000",
        title: "MINT",
        text: "Provides a refreshing cooling sensation and combats bad breath.",
      },
    ],
    supplements: [], // Not applicable
    accordion: {
      BENEFITS: [
        {
          title: "Prevents Cavities",
          description: "Neem and Clove work together to fight bacteria that cause cavities and decay.",
        },
        {
          title: "Soothes Gums",
          description: "Anti-inflammatory properties help reduce gum swelling and bleeding.",
        },
        {
          title: "Natural Whitening",
          description: "Gently removes surface stains without damaging enamel.",
        },
      ],
      INGREDIENTS: [
        { name: "Neem Extract" },
        { name: "Clove Oil" },
        { name: "Peppermint Oil" },
        { name: "Calcium Carbonate" },
        { name: "Xylitol" },
      ],
    },
    testimonials: [
      {
        id: 1,
        image: "/images/collagen-picture-1.jpg",
        text: `"My gums feel so much healthier, and I love the natural taste!"`,
        author: "Sarah J.",
      },
    ],
    themeColor: "#1F4D2B", // Dark Green
    featuresVideo: {
      src: "", // Placeholder
      poster: "",
    },
    scrollingBanner: {
      text: "Natural Protection • Fresh Breath • Healthy Gums •",
      ctaText: "Shop Now",
      ctaLink: "/products/herbal-toothpaste",
      image: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?q=80&w=2000&auto=format&fit=crop",
    },
  },
  {
    id: "copper-tongue-cleaner",
    name: "Pure Copper Tongue Cleaner",
    category: "Oral Care",
    tagline: "The ancient secret to oral hygiene and fresh breath.",
    price: 12,
    tags: ["100% Copper", "Ayurvedic", "Antibacterial"],
    description:
      "Scrape away toxins and bacteria with our 100% Pure Copper Tongue Cleaner. Designed for comfort and effectiveness, it improves taste sensation, fights bad breath, and promotes overall oral health according to Ayurvedic tradition.",
    keyBenefits: [
      "Removes bacteria and toxins (Ama)",
      "Eliminates bad breath",
      "Improves sense of taste",
      "Promotes oral hygiene",
      "Durable & naturally antibacterial",
    ],
    heroIngredient: {
      name: "100% Pure Copper",
      description: "Copper is naturally antimicrobial, making it the most hygienic material for tongue cleaning.",
      image: "https://images.unsplash.com/photo-1617109056804-9277f523588e?q=80&w=1000&auto=format&fit=crop" // Placeholder
    },
    howToUse: [
      "Hold the cleaner by the handles.",
      "Place the curved edge at the back of your tongue.",
      "Gently pull forward to scrape off coating.",
      "Rinse and repeat 3-4 times.",
      "Wash cleaner with water after use."
    ],
    suitableFor: [
      "Everyone",
      "Bad Breath Issues",
      "Ayurvedic Practitioners"
    ],
    crossSell: ["herbal-toothpaste", "kumkumadi-face-oil"],
    images: [
      "https://images.unsplash.com/photo-1606208678220-44933923c5e2?q=80&w=1887&auto=format&fit=crop", // Placeholder
      "https://images.unsplash.com/photo-1599665324082-7e92b3223035?q=80&w=1887&auto=format&fit=crop",
    ],
    features: [
      {
        icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/nogmo-2.png?v=1737037297&width=1000",
        title: "PURE COPPER",
        text: "Naturally resistant to bacteria and easy to clean.",
      },
      {
        icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/eng-ico.png?v=1737042253&width=1000",
        title: "ERGONOMIC",
        text: "Designed for a comfortable grip and effective cleaning.",
      },
    ],
    supplements: [],
    accordion: {
      BENEFITS: [
        {
          title: "Detoxifies",
          description: "Removes 'Ama' or toxic buildup from the tongue surface.",
        },
        {
          title: "Better Digestion",
          description: "Activates saliva production which aids in digestion.",
        },
      ],
      "CARE INSTRUCTIONS": [
        "Rinse with warm water after every use.",
        "Occasionally clean with lemon and salt to restore shine.",
        "Dry thoroughly to prevent oxidation spots (natural for copper).",
      ],
    },
    testimonials: [
      {
        id: 1,
        image: "/images/collagen-picture-1.jpg",
        text: `"I can't start my day without it. My mouth feels so much fresher!"`,
        author: "Mike T.",
      },
    ],
    themeColor: "#B87333", // Copper
    featuresVideo: { src: "", poster: "" },
    scrollingBanner: {
      text: "Detoxify • Refresh • Taste Better •",
      ctaText: "Shop Now",
      ctaLink: "/products/copper-tongue-cleaner",
      image: "https://images.unsplash.com/photo-1571781926291-280553fd1e56?q=80&w=2000&auto=format&fit=crop",
    },
  },
  {
    id: "neem-basil-soap",
    name: "Purifying Neem & Basil Soap",
    category: "Body Care",
    tagline: "Deep cleanse with the power of Ayurveda.",
    price: 6,
    tags: ["Handmade", "Antibacterial", "Moisturizing"],
    description:
      "A gentle yet effective handmade soap enriched with the goodness of Neem and Basil. It cleanses deeply, fights acne-causing bacteria, and soothes irritated skin, leaving it soft, fresh, and healthy.",
    keyBenefits: [
      "Deeply cleanses pores",
      "Fights acne and breakouts",
      "Soothes skin irritation",
      "Antibacterial & Antifungal",
      "Non-drying formula",
    ],
    heroIngredient: {
      name: "Neem Oil",
      description: "Renowned in Ayurveda for its purifying and healing properties, clearing skin infections and acne.",
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000&auto=format&fit=crop"
    },
    howToUse: [
      "Wet skin with water.",
      "Lather soap in hands or on a washcloth.",
      "Gently massage onto skin.",
      "Rinse thoroughly."
    ],
    suitableFor: [
      "Oily/Acne-Prone Skin",
      "Sensitive Skin",
      "Daily Bathing"
    ],
    crossSell: ["herbal-toothpaste", "kumkumadi-face-oil"],
    images: [
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=1887&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?q=80&w=1887&auto=format&fit=crop",
    ],
    features: [
      {
        icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/nogmo-2.png?v=1737037297&width=1000",
        title: "NEEM",
        text: "Purifies skin and fights bacteria.",
      },
      {
        icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/eng-ico.png?v=1737042253&width=1000",
        title: "BASIL",
        text: "Soothes inflammation and adds a refreshing scent.",
      },
    ],
    supplements: [],
    accordion: {
      BENEFITS: [
        { title: "Clear Skin", description: "Helps reduce acne and blemishes." },
        { title: "Hydrating", description: "Contains natural oils that prevent dryness." },
      ],
      INGREDIENTS: [
        { name: "Saponified Coconut Oil" },
        { name: "Neem Oil" },
        { name: "Basil Extract" },
        { name: "Essential Oils" },
      ],
    },
    testimonials: [
      {
        id: 1,
        image: "/images/collagen-picture-1.jpg",
        text: `"Best soap for my back acne. Cleared it up in weeks!"`,
        author: "Jessica R.",
      },
    ],
    themeColor: "#4CAF50", // Green
    featuresVideo: { src: "", poster: "" },
    scrollingBanner: {
      text: "Purify • Soothe • Refresh •",
      ctaText: "Shop Now",
      ctaLink: "/products/neem-basil-soap",
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=2000&auto=format&fit=crop",
    },
  },
  {
    id: "kumkumadi-face-oil",
    name: "Radiance Kumkumadi Oil",
    category: "Skin Care",
    tagline: "Ayurvedic elixir for glowing, youthful skin.",
    price: 45,
    tags: ["Saffron", "Anti-Aging", "Brightening"],
    description:
      "A luxurious blend of Saffron and 24 ayurvedic herbs, Kumkumadi Oil is a miraculous beauty fluid that brightens skin, reduces dark circles, and repairs pigmentation for a golden glow.",
    keyBenefits: [
      "Brightens skin tone",
      "Reduces dark spots & pigmentation",
      "Diminishes fine lines",
      "Hydrates and nourishes",
      "Improves skin texture",
    ],
    heroIngredient: {
      name: "Saffron (Kesar)",
      description: "The most expensive spice in the world, known for its ability to improve complexion and add a golden glow.",
      image: "https://images.unsplash.com/photo-1590739225287-bd2f51a8e63d?q=80&w=1000&auto=format&fit=crop"
    },
    howToUse: [
      "Cleanse face thoroughly.",
      "Take 3-4 drops of oil on your palm.",
      "Apply over face and neck.",
      "Massage gently in upward strokes.",
      "Leave overnight for best results."
    ],
    suitableFor: [
      "Dull Skin",
      "Pigmentation",
      "Anti-Aging"
    ],
    crossSell: ["neem-basil-soap", "copper-tongue-cleaner"],
    images: [
      "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=1887&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=1887&auto=format&fit=crop",
    ],
    features: [
      {
        icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/nogmo-2.png?v=1737037297&width=1000",
        title: "SAFFRON",
        text: "Brightens and evens out skin tone.",
      },
      {
        icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/eng-ico.png?v=1737042253&width=1000",
        title: "SANDALWOOD",
        text: "Cools and soothes the skin.",
      },
    ],
    supplements: [],
    accordion: {
      BENEFITS: [
        { title: "Radiant Glow", description: "Restores natural brightness to dull skin." },
        { title: "Even Tone", description: "Helps fade dark spots and blemishes." },
      ],
      INGREDIENTS: [
        { name: "Saffron" },
        { name: "Sandalwood" },
        { name: "Manjistha" },
        { name: "Sesame Oil" },
      ],
    },
    testimonials: [
      {
        id: 1,
        image: "/images/collagen-picture-1.jpg",
        text: `"My skin has never looked this radiant. It's liquid gold!"`,
        author: "Ananya M.",
      },
    ],
    themeColor: "#FF9800", // Saffron Orange
    featuresVideo: { src: "", poster: "" },
    scrollingBanner: {
      text: "Glow • Repair • Rejuvenate •",
      ctaText: "Shop Now",
      ctaLink: "/products/kumkumadi-face-oil",
      image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?q=80&w=2000&auto=format&fit=crop",
    },
  },
];
