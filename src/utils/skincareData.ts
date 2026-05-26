import { Treatment, Specialist, BeforeAfterCase } from "../types/clinic";

export const CLINIC_TREATMENTS: Treatment[] = [
  {
    id: "hydrafacial-signature",
    name: "Hope Signature HydraFacial MD",
    category: "facial",
    tagline: "Vortex-Infusion Restoration",
    description: "An elite multi-step hydradermabrasion facial that cleanses, exfoliates, extracts clogged pores, and infuses customized multi-peptides to deliver immediate luminous radiance.",
    benefits: [
      "Deeply vacuums impurities and whiteheads without trauma",
      "Infuses concentrated hyaluronic acid & super-antioxidants",
      "Noticeably plumps tired tissues and restores optimal dewiness"
    ],
    duration: "45 Mins",
    painLevel: "None",
    downtime: "None (Immediate Glow)",
    priceRange: "$$-$$$",
    estimatedPrice: 195,
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    concerns: ["Acne & Clogged Pores", "Dark spots & Pigmentation", "Redness & Reactive Skin"]
  },
  {
    id: "morpheus8-remodel",
    name: "Morpheus8 RF Microneedling",
    category: "laser", // fits clinical device
    tagline: "Fractional Collagen Re-architecting",
    description: "FDA-approved radiofrequency microneedling device designed to heat deep layers of the dermis, triggers aggressive natural collagen synthesis to remodel scar tissue, contours, and sagging skin.",
    benefits: [
      "Fades deep-seated icepick acne scars and boxcar scars",
      "Tightens the structural lower jawline and upper neck area",
      "Stimulates dramatic elastin and structural collagen layers"
    ],
    duration: "75 Mins",
    painLevel: "Moderate",
    downtime: "2-3 Days (Mild Pinkness)",
    priceRange: "$$$$",
    estimatedPrice: 650,
    imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80",
    concerns: ["Scars & Uneven Texture", "Aging, Fine Lines & Wrinkles", "Loss of Firmness & Volume"]
  },
  {
    id: "clear-brilliant",
    name: "Clear & Brilliant Laser Laser Reveal",
    category: "laser",
    tagline: "The Intelligent Red-Carpet Laser",
    description: "A gentle fractional laser treatment that creates millions of microscopic thermal zones in the upper skin layers, shedding old pigment and resurfacing smooth, light-reflective cells.",
    benefits: [
      "Replaces sun-damaged texture with baby-smooth skin",
      "Shrinks enlarged pores and minimizes early crow's feet",
      "Creates an exceptionally cohesive, uniform complexion tone"
    ],
    duration: "45 Mins",
    painLevel: "Mild",
    downtime: "1 Day (Slight Sandpaper Feel)",
    priceRange: "$$$",
    estimatedPrice: 350,
    imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600&q=80",
    concerns: ["Dark spots & Pigmentation", "Aging, Fine Lines & Wrinkles", "Scars & Uneven Texture"]
  },
  {
    id: "botox-refinement",
    name: "Aesthetic Botox Precise Contour",
    category: "injectable",
    tagline: "Expressive Neuromodulator Relaxation",
    description: "Masterful hyper-diluted wrinkle-smoothing micro-injections targeting active lines on the forehead, glabellar space, and surrounding orbits to restore a rested, bright facial framework.",
    benefits: [
      "Stops furrow lines and stubborn frown lines from etching deeper",
      "Maintains natural brows symmetry and animated expressions",
      "Gives a subtly lifted, serene eye and forehead contour"
    ],
    duration: "20 Mins",
    painLevel: "Mild",
    downtime: "None (3 Hour Restriction)",
    priceRange: "$$$",
    estimatedPrice: 280,
    imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80",
    concerns: ["Aging, Fine Lines & Wrinkles", "Loss of Firmness & Volume"]
  },
  {
    id: "dermal-fillers",
    name: "Hyaluronic Acid Dermal Sculpting",
    category: "injectable",
    tagline: "Natural Facial Volume Restoration",
    description: "Artistic, anatomical placement of medical-grade hyaluronic gel (Juvéderm/Restylane) to safely augment weak cheeks, restore hydration to delicate tear troughs, or define lip contours.",
    benefits: [
      "Safely restores deep structural support to hollow mid-face",
      "Imparts natural, pillowy volume & hydration to dry lips",
      "Supports jaw corners and chin projection beautifully"
    ],
    duration: "50 Mins",
    painLevel: "Mild",
    downtime: "1-2 Days (Potential Minor Blush)",
    priceRange: "$$$$",
    estimatedPrice: 590,
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
    concerns: ["Loss of Firmness & Volume", "Aging, Fine Lines & Wrinkles"]
  },
  {
    id: "cell-regen-peel",
    name: "Advanced Cellular Renovation Peel",
    category: "peel",
    tagline: "Medical-Grade Acid Resurfacing",
    description: "A tailored cocktail of clinical salicylic, glycolic, and lactic acids with built-in master antioxidants. Gently digests keratinized dead proteins to resolve stubborn hyperpigmentation and congested pores.",
    benefits: [
      "Fades sun damage patches & stubborn post-inflammatory scars",
      "Triggers rapid chemical cell recycling for ultimate soft texture",
      "Purges deep cystic blackheads and regulates sebum glands"
    ],
    duration: "30 Mins",
    painLevel: "Mild",
    downtime: "3-5 Days (Gentle Flaking)",
    priceRange: "$$",
    estimatedPrice: 180,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    concerns: ["Acne & Clogged Pores", "Dark spots & Pigmentation", "Scars & Uneven Texture"]
  },
  {
    id: "soprano-laser-hair",
    name: "Soprano Titanium Painless Laser",
    category: "laser",
    tagline: "Triple-Wavelength Permanent Smoothness",
    description: "Award-winning in-motion hair removal laser utilizing an actively chilled sapphire tip. Safely treats dark, fair, and sun-exposed skin types with zero burning sensations.",
    benefits: [
      "Permanently halts follicle germination over 6-8 cycles",
      "Built-in ice cooling ensures virtual pain-free pulses",
      "Prevents skin scarring from painful ingrown hairs"
    ],
    duration: "30 Mins",
    painLevel: "None",
    downtime: "None",
    priceRange: "$$",
    estimatedPrice: 140,
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    concerns: ["Scars & Uneven Texture"]
  }
];

export const CLINIC_SPECIALISTS: Specialist[] = [
  {
    id: "dr-hope",
    name: "Dr. Evelyn Hope, MD",
    role: "Lead Aesthetic Physician & Founder",
    bio: "With over 14 years in medical aesthetics, Dr. Hope specializes in customized facial modeling, laser skin rehabilitation, and anti-aging frameworks. She is highly praised for her microscopic precision and deeply natural outcomes.",
    specialty: ["Custom Facial Modeling", "Laser Resurfacing", "Advanced Bio-Remodeling"],
    availability: ["Monday", "Wednesday", "Friday"],
    imageUrl: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "dr-vance",
    name: "Dr. Marcus Vance, DDS",
    role: "Senior Cosmetic Injector",
    bio: "Dr. Vance blends medical dental surgery alignment with aesthetic dermal contouring. He specializes in clinical filler architecture, mid-face restores, and pain-free injections.",
    specialty: ["Anatomical Cheek Sculpting", "Liquid Jawline Support", "Lip Contouring"],
    availability: ["Tuesday", "Thursday", "Saturday"],
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "aesthetician-sophia",
    name: "Sophia Rose, LME",
    role: "Lead Clinical Aesthetician",
    bio: "Sophia is a licensed medical master aesthetician who focuses on custom clinical peels, advanced hydro-therapies, and holistic skin prep regimen. She curates our virtual adviser pathways.",
    specialty: ["Peptide Facials", "Clinical Purifying Peels", "Reactive Skin Repair"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80"
  }
];

export const BEFORE_AFTER_CASES: BeforeAfterCase[] = [
  {
    id: "case-scars",
    title: "Morpheus8 Acne Scar Transformation",
    treatment: "Morpheus8 RF Microneedling",
    concern: "Scars & Uneven Texture",
    timeline: "After 3 sessions (12 weeks)",
    beforeUrl: "https://images.unsplash.com/photo-1620331700684-2579b94cf9b0?auto=format&fit=crop&w=600&h=600&q=20&blur=3", // Representing rough/blurry
    afterUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&h=600&q=80", // Representing clear & brilliant
    description: "Significant deep structural reduction in rolling scar pockets, accompanied by an absolute tightening of facial pores and improvement in general skin bounce."
  },
  {
    id: "case-pigment",
    title: "Luminous Glow Laser Therapy",
    treatment: "Clear & Brilliant Laser Laser Reveal",
    concern: "Dark spots & Pigmentation",
    timeline: "After 2 sessions (6 weeks)",
    beforeUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&h=600&q=20&blur=4", // shadow spots
    afterUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&h=600&q=80",
    description: "Complete dispersion of epidermal red freckles and sun-induced patches, highlighting a glassy, even skin tone and glowing vitality."
  }
];

export const SKINCARE_TIPS = [
  {
    title: "The Ultimate Triple Layer Cleanse",
    content: "For reactive skin or heavy makeup, utilize an oil-based lipid cleanser first to dissolve synthetic filters and pollution, followed by a milk amino-acid cleanser to soothe surface cells.",
    tag: "Cleanse"
  },
  {
    title: "Understanding Copper Peptides",
    content: "While Retinol actively speeds up cellular division, pairing it with low-molecular copper peptides in your night cycles ensures that skin builds high-tensile elastic fiber rather than scaling.",
    tag: "Repair"
  },
  {
    title: "Why SPF is Non-Negotiable Post-Laser",
    content: "Active fractional laser treatments expose raw newly formed dermal tissues. Ensure you apply zinc oxide minerals SPF every 2 hours to avoid post-inflammatory hyperpigmentation (PIH).",
    tag: "Protect"
  }
];
