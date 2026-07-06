// script.js - Interactive functionality for Norwell website

// Slideshow functionality
let slideIndex = 1;
let slideTimer;

// Slideshow removed for modern site experience

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize FAQ toggle functionality
    initFAQ();

    // Navbar scroll effect
    initNavbarScroll();

    // Product card reveal animations
    initProductCards();

    // Wait for asset manifest to be available before rendering
    function tryRender() {
        var pageKey = document.body.getAttribute('data-page');
        if (pageKey && getCatalogPage(pageKey)) {
            renderCollectionPage(pageKey);
        } else if (pageKey) {
            // Manifest not loaded yet, retry
            console.log('Manifest not loaded yet, retrying...');
            setTimeout(tryRender, 100);
        } else {
            var productKey = document.body.getAttribute('data-product');
            if (productKey && PRODUCT_REGISTRY[productKey]) {
                window.productConfig = PRODUCT_REGISTRY[productKey];
                renderProductPage(window.productConfig);
            } else if (window.productConfig) {
                renderProductPage(window.productConfig);
            } else {
                enhanceProductDetailPages();
            }
        }
    }
    
    tryRender();
});

window.addEventListener('hashchange', function() {
    var pageKey = document.body.getAttribute('data-page');
    if (pageKey && getCatalogPage(pageKey)) {
        renderCollectionPage(pageKey);
    }
});

// Navbar shrink on scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// Animate product cards on scroll
function initProductCards() {
    const cards = document.querySelectorAll('.product-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, i) {
            if (entry.isIntersecting) {
                setTimeout(function() {
                    entry.target.classList.add('visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    cards.forEach(function(card) {
        observer.observe(card);
    });
}

// Build thumbnail strip for product galleries
function buildThumbnailStrip(containerId, images, onSelect) {
    const container = document.getElementById(containerId);
    if (!container || !images || !images.length) return;

    container.innerHTML = '';
    images.forEach(function(src, index) {
        const btn = document.createElement('button');
        btn.className = 'thumbnail-btn' + (index === 0 ? ' active' : '');
        btn.type = 'button';
        btn.setAttribute('aria-label', 'View image ' + (index + 1));
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        btn.appendChild(img);
        btn.addEventListener('click', function() {
            onSelect(index);
        });
        container.appendChild(btn);
    });
}

function updateThumbnailActive(containerId, activeIndex) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const buttons = container.querySelectorAll('.thumbnail-btn');
    buttons.forEach(function(btn, i) {
        btn.classList.toggle('active', i === activeIndex);
    });
}

// ─── Product Registry ───
var PRODUCT_REGISTRY = {
    classic: {
        shortName: 'Classic',
        name: 'Classic Stainless Steel Bottle',
        tagline: 'The timeless Norwell Classic — food-grade steel for everyday hydration at the office, gym, or on the road.',
        category: 'Water Bottles',
        categoryLink: 'bottles.html',
        parentLabel: 'Bottles',
        badge: 'Popular',
        accent: 'splash-blue',
        interest: 'bottles',
        heroImage: 'images/Bottles/Fridge Bottles/Classic/Drinking Man.png',
        images: [
            'images/Bottles/Fridge Bottles/Classic/Main.jpg',
            'images/Bottles/Fridge Bottles/Classic/Classic-1.jpg',
            'images/Bottles/Fridge Bottles/Classic/Classic-3.jpg',
            'images/Bottles/Fridge Bottles/Classic/Classic-4.jpg',
            'images/Bottles/Fridge Bottles/Classic/Classic-5.jpg',
            'images/Bottles/Fridge Bottles/Classic/Drinking Man.png',
            'images/Bottles/Fridge Bottles/Classic/HoldinhinHand.png',
            'images/Bottles/Fridge Bottles/Classic/OfficeBottle.png'
        ]
    },
    curvy: {
        shortName: 'Curvy',
        name: 'Curvy Stainless Steel Bottle',
        tagline: 'Ergonomic curvy silhouette with a sleek grip — designed for gym, travel, and daily hydration.',
        category: 'Water Bottles',
        categoryLink: 'bottles.html',
        parentLabel: 'Bottles',
        accent: 'splash-teal',
        interest: 'bottles',
        heroImage: 'images/Bottles/Fridge Bottles/Curvy/Curvy-4.jpg',
        images: [
            'images/Bottles/Fridge Bottles/Curvy/Main.jpg',
            'images/Bottles/Fridge Bottles/Curvy/Curvy-1.jpg',
            'images/Bottles/Fridge Bottles/Curvy/Curvy-3.jpg',
            'images/Bottles/Fridge Bottles/Curvy/Curvy-4.jpg',
            'images/Bottles/Fridge Bottles/Curvy/Curvy-5.jpg',
            'images/Bottles/Fridge Bottles/Curvy/Box.jpg'
        ]
    },
    curvyblack: {
        shortName: 'Curvy Black',
        name: 'Curvy Black Stainless Steel Bottle',
        tagline: 'Bold matte-black finish on premium food-grade steel — style meets durability.',
        category: 'Water Bottles',
        categoryLink: 'bottles.html',
        parentLabel: 'Bottles',
        badge: 'Premium',
        accent: 'splash-dark',
        interest: 'bottles',
        heroImage: 'images/Bottles/Gym Bottles/CurvyB/CV Bl GymGirl.png',
        images: [
            'images/Bottles/Gym Bottles/CurvyB/Main.png',
            'images/Bottles/Gym Bottles/CurvyB/Curvy-4-Dimension.png',
            'images/Bottles/Gym Bottles/CurvyB/CV Bl GymGirl.png',
            'images/Bottles/Gym Bottles/CurvyB/In Gym.png',
            'images/Bottles/Gym Bottles/CurvyB/Package.png'
        ]
    },
    curvybsc: {
        shortName: 'Curvy BSC',
        name: 'Curvy BSC Sports Cap Bottle',
        tagline: 'Premium curvy bottle with sports cap — engineered for active lifestyles and all-day hydration.',
        category: 'Water Bottles',
        categoryLink: 'bottles.html',
        parentLabel: 'Bottles',
        badge: 'New',
        accent: 'splash-teal',
        interest: 'bottles',
        heroImage: 'images/Bottles/Fridge Bottles/CurvyBSC/Open .jpg',
        images: [
            'images/Bottles/Fridge Bottles/CurvyBSC/Main.jpeg',
            'images/Bottles/Fridge Bottles/CurvyBSC/Open .jpg',
            'images/Bottles/Fridge Bottles/CurvyBSC/Features.jpg',
            'images/Bottles/Fridge Bottles/CurvyBSC/FeaturesFamily.jpg',
            'images/Bottles/Fridge Bottles/CurvyBSC/Dimension.jpg',
            'images/Bottles/Fridge Bottles/CurvyBSC/In hand curvy bottle.jpeg',
            'images/Bottles/Fridge Bottles/CurvyBSC/Office CurvyBottle.jpeg',
            'images/Bottles/Fridge Bottles/CurvyBSC/Package.png',
            'images/Bottles/Fridge Bottles/CurvyBSC/PackageImage.jpg'
        ]
    },
    flora: {
        shortName: 'Flora',
        name: 'Flora Stainless Steel Bottle',
        tagline: 'Elegant floral design on food-grade steel — for the style-conscious professional.',
        category: 'Water Bottles',
        categoryLink: 'bottles.html',
        parentLabel: 'Bottles',
        accent: 'splash-pink',
        interest: 'bottles',
        heroImage: 'images/Bottles/Fridge Bottles/Flora/Office.png',
        images: [
            'images/Bottles/Fridge Bottles/Flora/Main.jpg',
            'images/Bottles/Fridge Bottles/Flora/Flora-1.jpg',
            'images/Bottles/Fridge Bottles/Flora/Flora-3.jpg',
            'images/Bottles/Fridge Bottles/Flora/Flora-4.jpg',
            'images/Bottles/Fridge Bottles/Flora/Flora-5.jpg',
            'images/Bottles/Fridge Bottles/Flora/Box.png',
            'images/Bottles/Fridge Bottles/Flora/Office.png'
        ]
    },
    sports: {
        shortName: 'Sports',
        name: 'Sports Stainless Steel Bottle',
        tagline: 'Built for workouts with an easy-sip cap — leak-proof steel hydration for the gym and field.',
        category: 'Water Bottles',
        categoryLink: 'bottles.html',
        parentLabel: 'Bottles',
        badge: 'Gym',
        accent: 'splash-aqua',
        interest: 'bottles',
        heroImage: 'images/Bottles/Fridge Bottles/Sports/SportBottleBox.jpeg',
        images: [
            'images/Bottles/Fridge Bottles/Sports/Main.jpg',
            'images/Bottles/Fridge Bottles/Sports/Sports-1.jpg',
            'images/Bottles/Fridge Bottles/Sports/Sports-3.jpg',
            'images/Bottles/Fridge Bottles/Sports/Sports-4.jpg',
            'images/Bottles/Fridge Bottles/Sports/Sports-5.jpg',
            'images/Bottles/Fridge Bottles/Sports/SportBottleBox.jpeg'
        ]
    },
    sportsblack: {
        shortName: 'Sports Pro',
        name: 'Sports Pro Black Cap Bottle',
        tagline: 'Pro-grade sports bottle with black cap — rugged steel for intense training sessions.',
        category: 'Water Bottles',
        categoryLink: 'bottles.html',
        parentLabel: 'Bottles',
        accent: 'splash-indigo',
        interest: 'bottles',
        heroImage: 'images/Bottles/Sipper Bottles/SportsBlackCap/Gym.png',
        images: [
            'images/Bottles/Sipper Bottles/SportsBlackCap/Main.png',
            'images/Bottles/Sipper Bottles/SportsBlackCap/Gym.png',
            'images/Bottles/Sipper Bottles/SportsBlackCap/Hometable.png',
            'images/Bottles/Sipper Bottles/SportsBlackCap/InHand.png',
            'images/Bottles/Sipper Bottles/SportsBlackCap/Office.png',
            'images/Bottles/Sipper Bottles/SportsBlackCap/Package.png',
            'images/Bottles/Sipper Bottles/SportsBlackCap/SportsBlackCapDimen.png'
        ]
    },
    'dustbin-perforated': {
        shortName: 'Perforated',
        name: 'Perforated Stainless Steel Dustbin',
        tagline: 'Ventilated perforated design for kitchens, offices, and living spaces.',
        category: 'Dustbins',
        categoryLink: 'dustbin.html',
        parentLabel: 'Dustbins',
        interest: 'dustbins',
        heroImage: 'images/Dustbin/DustbinPerforated/Kitchen.png',
        features: [
            'High-quality stainless steel construction',
            'Perforated body with circular holes for ventilation',
            'Rust-resistant and durable finish',
            'Ideal for kitchen, office, and room use',
            'Easy to clean and maintain',
            'Modern minimalist design',
            'Hygienic waste disposal',
            'Compact footprint for any space'
        ],
        images: [
            'images/Dustbin/DustbinPerforated/Main.png',
            'images/Dustbin/DustbinPerforated/Dustbin-Perforated-2 BL.png',
            'images/Dustbin/DustbinPerforated/Dustbin-Perforated-3-BL.png',
            'images/Dustbin/DustbinPerforated/Kitchen.png',
            'images/Dustbin/DustbinPerforated/Office.png',
            'images/Dustbin/DustbinPerforated/Room.png'
        ]
    },
    'dustbin-perfpedal': {
        shortName: 'Perforated Pedal',
        name: 'Perforated Pedal Dustbin',
        tagline: 'Hands-free foot-pedal operation with ventilated perforated steel body.',
        category: 'Dustbins',
        categoryLink: 'dustbin.html',
        parentLabel: 'Dustbins',
        badge: 'Hands-Free',
        interest: 'dustbins',
        heroImage: 'images/Dustbin/DustbinPerfWithPeddal/Main1.jpg',
        features: [
            'High-quality stainless steel',
            'Perforated body with circular holes for a modern, ventilated look',
            'Foot-pedal mechanism for touch-free operation',
            'Rust-resistant and durable',
            'Ideal for kitchen and bathroom',
            'Easy liner replacement',
            'Hygienic hands-free disposal',
            'Premium pedal mechanism'
        ],
        images: [
            'images/Dustbin/DustbinPerfWithPeddal/Main.png',
            'images/Dustbin/DustbinPerfWithPeddal/Main1.jpg',
            'images/Dustbin/DustbinPerfWithPeddal/Dustbin-Perforated with lid-2.jpg',
            'images/Dustbin/DustbinPerfWithPeddal/Dustbin-Perforated with lid-3.jpg',
            'images/Dustbin/DustbinPerfWithPeddal/Dustbin-Perforated with lid-4.jpg'
        ]
    },
    'dustbin-smoothpedal': {
        shortName: 'Smooth Pedal',
        name: 'Smooth Finish Pedal Dustbin',
        tagline: 'Sleek smooth-finish steel bin with reliable foot-pedal mechanism.',
        category: 'Dustbins',
        categoryLink: 'dustbin.html',
        parentLabel: 'Dustbins',
        interest: 'dustbins',
        heroImage: 'images/Dustbin/DustbinSmoothwithpeddal/Dustbin-Smooth finish- 3.jpg',
        features: [
            'High-quality stainless steel',
            'Smooth premium finish',
            'Foot-pedal for hands-free operation',
            'Rust-resistant and durable',
            'Perfect for modern kitchens',
            'Easy to clean surface',
            'Soft-close pedal mechanism',
            'Compact and elegant design'
        ],
        images: [
            'images/Dustbin/DustbinSmoothwithpeddal/Main.jpg',
            'images/Dustbin/DustbinSmoothwithpeddal/Dustbin-Smooth finish- 2.jpg',
            'images/Dustbin/DustbinSmoothwithpeddal/Dustbin-Smooth finish- 3.jpg',
            'images/Dustbin/DustbinSmoothwithpeddal/Dustbin-Smooth finish- 4.jpg'
        ]
    },
    'dustbin-swing': {
        shortName: 'Swing Lid',
        name: 'Swing Lid Stainless Steel Dustbin',
        tagline: 'Classic swing-top lid for quick, hygienic waste disposal anywhere.',
        category: 'Dustbins',
        categoryLink: 'dustbin.html',
        parentLabel: 'Dustbins',
        interest: 'dustbins',
        heroImage: 'images/Dustbin/Swing/Main.png',
        features: [
            'High-quality stainless steel',
            'Rust-resistant and durable',
            'Swing-top lid for easy access',
            'Ideal for bathroom and office',
            'Easy to clean',
            'Compact design',
            'Silent swing mechanism',
            'Long-lasting build quality'
        ],
        images: [
            'images/Dustbin/Swing/Main.png'
        ]
    },
    'lunchbox-tiffin30': {
        shortName: 'Tiffin 30',
        name: 'Tiffin 30 Lunch Box',
        tagline: 'Classic multi-tier stainless steel tiffin for everyday office and school meals.',
        category: 'Lunch Boxes',
        categoryLink: 'lunchbox.html',
        parentLabel: 'Lunch Boxes',
        badge: 'Best Seller',
        interest: 'lunchboxes',
        heroImage: 'images/LunchBox/Tiffini30/Tiffin-3.jpg',
        features: [
            'Food-grade stainless steel construction',
            'Multi-tier compartments for complete meals',
            'Leak-proof seal between tiers',
            'Rust-resistant and durable',
            'Easy to clean and maintain',
            'Perfect for office and school',
            'Lightweight and portable',
            'Keeps food fresh for hours'
        ],
        images: [
            'images/LunchBox/Tiffini30/Main.jpg',
            'images/LunchBox/Tiffini30/Tiffin-2.jpg',
            'images/LunchBox/Tiffini30/Tiffin-3.jpg',
            'images/LunchBox/Tiffini30/Tiffin-4.jpg'
        ]
    },
    'lunchbox-steellidblack': {
        shortName: 'Steel Lid Black',
        name: 'Steel Lid Black Tiffin Box',
        tagline: 'Premium black steel lid tiffin with leak-proof seal — sophisticated and durable.',
        category: 'Lunch Boxes',
        categoryLink: 'lunchbox.html',
        parentLabel: 'Lunch Boxes',
        interest: 'lunchboxes',
        heroImage: 'images/LunchBox/TiffinSteellidBlack/Tiffin (Steel lid) Black-3.jpg',
        features: [
            'Food-grade stainless steel construction',
            'Sophisticated black steel lid',
            'Leak-proof seal design',
            'Rust-resistant and durable',
            'Multi-compartment storage',
            'Perfect for office lunches',
            'Easy to clean',
            'Premium finish'
        ],
        images: [
            'images/LunchBox/TiffinSteellidBlack/Main.jpg',
            'images/LunchBox/TiffinSteellidBlack/Tiffin (Steel lid) Black-2.jpg',
            'images/LunchBox/TiffinSteellidBlack/Tiffin (Steel lid) Black-3.jpg',
            'images/LunchBox/TiffinSteellidBlack/Tiffin (Steel lid) Black-4.jpg'
        ]
    },
    'lunchbox-steellidblue': {
        shortName: 'Steel Lid Blue',
        name: 'Steel Lid Blue Tiffin Box',
        tagline: 'Vibrant blue steel lid with leak-proof seal — fresh style for daily meals.',
        category: 'Lunch Boxes',
        categoryLink: 'lunchbox.html',
        parentLabel: 'Lunch Boxes',
        interest: 'lunchboxes',
        heroImage: 'images/LunchBox/TiffinSteellidBlue/Tiffin (Steel lid) Blue-3.jpg',
        features: [
            'Food-grade stainless steel construction',
            'Elegant blue steel lid',
            'Leak-proof seal design',
            'Rust-resistant and durable',
            'Multi-compartment storage',
            'Perfect for school and office',
            'Easy to clean',
            'Vibrant premium finish'
        ],
        images: [
            'images/LunchBox/TiffinSteellidBlue/Main.jpg',
            'images/LunchBox/TiffinSteellidBlue/Tiffin (Steel lid) Blue-2.jpg',
            'images/LunchBox/TiffinSteellidBlue/Tiffin (Steel lid) Blue-3.jpg',
            'images/LunchBox/TiffinSteellidBlue/Tiffin (Steel lid) Blue-4.jpg'
        ]
    },
    combo: {
        shortName: 'Combo Sets',
        name: 'Premium Steel Combo Sets',
        tagline: 'Curated bundles combining our best-selling bottles and lunch boxes — perfect for families, corporate gifting, and wholesale orders.',
        category: 'Combo Sets',
        categoryLink: 'combo.html',
        parentLabel: 'Combos',
        badge: 'Bundle Offer',
        accent: 'splash-teal',
        interest: 'combos',
        heroImage: 'images/Combo/Main.jpg',
        features: [
            'Bottle + lunch box combinations at bundle pricing',
            'Food-grade stainless steel across all items',
            'Ideal for offices, schools, and home kitchens',
            'Custom combo options for bulk orders',
            'Premium packaging for gifting',
            'Wholesale pricing available',
            'Rust-resistant and durable',
            'Eco-friendly and sustainable'
        ],
        images: [
            'images/Combo/Main.jpg',
            'images/Combo/Combo-Classic.jpg',
            'images/Combo/Combo-Curvy.jpg',
            'images/Combo/Combo-Flora.jpg',
            'images/Combo/Combo-Sports.jpg',
            'images/Combo/Length.jpg'
        ]
    }
};

var PAGE_DATA = {
    bottles: {
        heroImage: 'images/Bottles/Fridge Bottles/CurvyBSC/Open .jpg',
        heroTitle: 'Modern Stainless Steel Bottles',
        heroSubtitle: 'Browse fridge, gym, hot & cold, sipper and travel bottles in a futuristic premium layout.',
        heroDescription: 'Select a category and explore each bottle with responsive zoom visuals, thumbnails, and fast quote tools.',
        categories: [
            {
                id: 'fridge',
                label: 'Fridge Bottles',
                description: 'Chilled hydration for home and office with sleek stainless steel finishes.',
                products: [
                    {
                        id: 'classic',
                        title: 'Classic Stainless Bottle',
                        subtitle: 'Timeless fridge-ready hydration.',
                        description: 'A clean, polished steel bottle built for chilled storage and everyday use. Ideal for work desks, school bags, and pantry shelves.',
                        usage: 'Perfect for chilled water, juices, and quick refreshment during long days indoors.',
                        features: [
                            'Food-grade stainless steel',
                            'Rust-resistant finish',
                            'Wide-mouth design for easy filling',
                            'Fits fridge racks and car holders',
                            'Lightweight yet durable',
                            'Easy to clean and maintain'
                        ],
                        thumbnail: 'images/Bottles/Fridge Bottles/Classic/Thumbnail.png',
                        images: [
                            'images/Bottles/Fridge Bottles/Classic/Main.jpg',
                            'images/Bottles/Fridge Bottles/Classic/Drinking Man.png',
                            'images/Bottles/Fridge Bottles/Classic/HoldinhinHand.png'
                        ],
                        interest: 'bottles'
                    },
                    {
                        id: 'curvy',
                        title: 'Curvy Stainless Bottle',
                        subtitle: 'Ergonomic bottle for chilled and active days.',
                        description: 'Curvy design gives a premium grip and stylish silhouette, while premium steel preserves temperature and taste.',
                        usage: 'Great for chilled beverages, gym sessions, and everyday carrying with style.',
                        features: [
                            'Ergonomic lightweight body',
                            'Premium stainless finish',
                            'Secure twist cap',
                            'Travel-friendly shape',
                            'Food-safe and odor resistant'
                        ],
                        thumbnail: 'images/Bottles/Fridge Bottles/Curvy/Thumbnail.jpg',
                        images: [
                            'images/Bottles/Fridge Bottles/Curvy/Main.jpg',
                            'images/Bottles/Fridge Bottles/Curvy/Curvy-4.jpg',
                            'images/Bottles/Fridge Bottles/Curvy/Curvy-5.jpg'
                        ],
                        interest: 'bottles'
                    },
                    {
                        id: 'curvybsc',
                        title: 'CurvyBSC Sports Bottle',
                        subtitle: 'Premium bottle for active chilled hydration.',
                        description: 'A dynamic curvy bottle built for performance and fridge-friendly storage with premium steel durability.',
                        usage: 'Great for gym bags, travel, and chilled daily use.',
                        features: [
                            'Premium stainless construction',
                            'Sports-cap ready',
                            'Sleek curved body',
                            'Easy to carry',
                            'Temperature-stable steel'
                        ],
                        thumbnail: 'images/Bottles/Fridge Bottles/CurvyBSC/Thumbnail.jpg',
                        images: [
                            'images/Bottles/Fridge Bottles/CurvyBSC/Main.jpeg',
                            'images/Bottles/Fridge Bottles/CurvyBSC/Open .jpg',
                            'images/Bottles/Fridge Bottles/CurvyBSC/Features.jpg'
                        ],
                        interest: 'bottles'
                    },
                    {
                        id: 'flora',
                        title: 'Flora Pattern Bottle',
                        subtitle: 'Stylish gloss for fridge and daily carry.',
                        description: 'A floral-inspired steel bottle designed for those who want modern style and safe chilled hydration together.',
                        usage: 'Perfect for office desks, travel bags, and everyday modern lifestyle use.',
                        features: [
                            'Food-grade steel with floral accents',
                            'Leak-resistant cap',
                            'Attractive matte finish',
                            'Easy to clean',
                            'Everyday durability'
                        ],
                        thumbnail: 'images/Bottles/Fridge Bottles/Flora/Thumbnail.jpg',
                        images: [
                            'images/Bottles/Fridge Bottles/Flora/Main.jpg',
                            'images/Bottles/Fridge Bottles/Flora/Office.png',
                            'images/Bottles/Fridge Bottles/Flora/Flora-4.jpg'
                        ],
                        interest: 'bottles'
                    },
                    {
                        id: 'sports',
                        title: 'Sports Stainless Bottle',
                        subtitle: 'Performance-ready hydration for workouts.',
                        description: 'Rugged bottle with a functional cap designed to keep your drink secure during training and outdoor activity.',
                        usage: 'Best suited for gym bags, outdoor training, and sweat sessions.',
                        features: [
                            'Durable sports cap',
                            'Leak-resistant seal',
                            'Easy grip texture',
                            'Food-grade stainless steel',
                            'Quick refill access'
                        ],
                        thumbnail: 'images/Bottles/Fridge Bottles/Sports/Thumbnail.jpg',
                        images: [
                            'images/Bottles/Fridge Bottles/Sports/Main.jpg',
                            'images/Bottles/Fridge Bottles/Sports/Sports-4.jpg',
                            'images/Bottles/Fridge Bottles/Sports/Sports-5.jpg'
                        ],
                        interest: 'bottles'
                    }
                ]
            },
            {
                id: 'gym',
                label: 'Gym Bottles',
                description: 'Sporty steel bottles engineered for intense training and quick hydration.',
                products: [
                    {
                        id: 'sports',
                        title: 'Sports Black Cap Bottle',
                        subtitle: 'Performance bottle with a solid cap.',
                        description: 'Built for active days, this bottle combines a robust cap and sleek steel body for dependable hydration.',
                        usage: 'Best suited for gym bags, outdoor training, and sweat sessions.',
                        features: [
                            'Durable sports cap',
                            'Leak-resistant seal',
                            'Easy grip texture',
                            'Food-grade stainless steel',
                            'Quick refill access'
                        ],
                        thumbnail: 'images/Bottles/Gym Bottles/SportsBlackCap/Thumbnail.png',
                        images: [
                            'images/Bottles/Gym Bottles/SportsBlackCap/Main.png',
                            'images/Bottles/Gym Bottles/SportsBlackCap/Gym.png',
                            'images/Bottles/Gym Bottles/SportsBlackCap/Hometable.png',
                            'images/Bottles/Gym Bottles/SportsBlackCap/InHand.png',
                            'images/Bottles/Gym Bottles/SportsBlackCap/Package.png'
                        ],
                        interest: 'bottles'
                    },
                    {
                        id: 'curvyblack',
                        title: 'Curvy Black Sports Bottle',
                        subtitle: 'Matte black finish meets sport-ready design.',
                        description: 'Bold, athletic bottle built for performance and style with a premium matte steel body.',
                        usage: 'Ideal for gym routines, cycling, and daily active lifestyles.',
                        features: [
                            'Matte black premium finish',
                            'Ergonomic shape',
                            'Sporty spout cap',
                            'Rust-free steel',
                            'Easy to hold'
                        ],
                        thumbnail: 'images/Bottles/Gym Bottles/CurvyB/Thumbnail.png',
                        images: [
                            'images/Bottles/Gym Bottles/CurvyB/Main.png',
                            'images/Bottles/Gym Bottles/CurvyB/CV Bl GymGirl.png',
                            'images/Bottles/Gym Bottles/CurvyB/Man Holding.png'
                        ],
                        interest: 'bottles'
                    }
                ]
            },
            {
                id: 'hotcold',
                label: 'Hot and Cold Bottles',
                description: 'Insulated bottles built to hold hot or cold beverages with premium corrosion resistance.',
                products: [
                    {
                        id: 'climatepro',
                        title: 'ClimatePro Matt Steel',
                        subtitle: 'High-performance hot and cold thermos.',
                        description: 'Twin-layer insulation keeps beverages hot or cold for hours, with a matte steel body that feels modern and sturdy.',
                        usage: 'Best for travel, office, and outdoor use where temperature retention matters.',
                        features: [
                            'Twin-wall insulation',
                            'Temperature-lock cap',
                            'Premium matte finish',
                            'Food-grade stainless steel',
                            'Durable design'
                        ],
                        thumbnail: 'images/Bottles/Hot and Cold Bottles/ClimatePro-MattSteel/ChatGPT Image Jul 1, 2026, 10_30_33 PM.png',
                        images: [
                            'images/Bottles/Hot and Cold Bottles/ClimatePro-MattSteel/ChatGPT Image Jul 1, 2026, 10_30_33 PM.png',
                            'images/Bottles/Hot and Cold Bottles/ClimatePro-MattSteel/ChatGPT Image Jul 1, 2026, 10_43_49 PM.png',
                            'images/Bottles/Hot and Cold Bottles/ClimatePro-MattSteel/ChatGPT Image Jul 1, 2026, 10_50_52 PM.png'
                        ],
                        interest: 'bottles'
                    },
                    {
                        id: 'dualcore',
                        title: 'DualCore Military Bottle',
                        subtitle: 'All-weather bottle built for rugged travel.',
                        description: 'A tough travel bottle with premium steel and insulated performance for hot and cold beverages on the move.',
                        usage: 'Perfect for adventure travel, hikes, and long commutes.',
                        features: [
                            'Insulated thermal core',
                            'Durable exterior',
                            'Comfort grip design',
                            'Rust-resistant steel',
                            'Ideal for beverages on the go'
                        ],
                        thumbnail: 'images/Bottles/Travel Bottles/DualCore-Green/Thumbnail.png',
                        images: [
                            'images/Bottles/Travel Bottles/DualCore-Green/Thumbnail.png',
                            'images/Bottles/Travel Bottles/DualCore-Black/Thumbnail.png',
                            'images/Bottles/Travel Bottles/DualCore-NavyBlue/DualCOre-NavyBlue.png'
                        ],
                        interest: 'bottles'
                    }
                ]
            },
            {
                id: 'sipper',
                label: 'Sipper Bottles',
                description: 'Easy-sip designs with spill-resistant caps and ergonomic handles.',
                products: [
                    {
                        id: 'curvyb',
                        title: 'Curvy Sipper Bottle',
                        subtitle: 'Comfort grip with quick-sip cap.',
                        description: 'A versatile sipper bottle built for travel, workout breaks, and everyday refreshment.',
                        usage: 'Great for short trips, workouts, and daily hydration at a glance.',
                        features: [
                            'Sipper sports cap',
                            'Ergonomic body',
                            'Food-grade steel',
                            'Leak-resistant design',
                            'Modern finish'
                        ],
                        thumbnail: 'images/Bottles/Sipper Bottles/CurvyB/Thumbnail.png',
                        images: [
                            'images/Bottles/Sipper Bottles/CurvyB/Main.png',
                            'images/Bottles/Sipper Bottles/CurvyB/Curvy-4-Dimension.png',
                            'images/Bottles/Sipper Bottles/CurvyB/Package.png'
                        ],
                        interest: 'bottles'
                    },
                    {
                        id: 'sportsblackcap',
                        title: 'Sports Black Cap Bottle',
                        subtitle: 'Performance bottle with a solid sipper cap.',
                        description: 'Built for active days, this bottle combines a robust cap and sleek steel body for dependable hydration.',
                        usage: 'Ideal for the gym, outdoor training, and daily commute.',
                        features: [
                            'Sports cap mouthpiece',
                            'Premium steel body',
                            'Leak-resistant performance',
                            'Comfort grip',
                            'Easy to clean'
                        ],
                        thumbnail: 'images/Bottles/Sipper Bottles/SportsBlackCap/Thumbnail.png',
                        images: [
                            'images/Bottles/Sipper Bottles/SportsBlackCap/Main.png',
                            'images/Bottles/Sipper Bottles/SportsBlackCap/Gym.png',
                            'images/Bottles/Sipper Bottles/SportsBlackCap/Office.png'
                        ],
                        interest: 'bottles'
                    }
                ]
            },
            {
                id: 'travel',
                label: 'Travel Bottles',
                description: 'Robust travel bottles that look premium and keep hydration reliable on the move.',
                products: [
                    {
                        id: 'travelfront',
                        title: 'Travel ClimatePro Black',
                        subtitle: 'Bold travel bottle with insulated core.',
                        description: 'A strong, travel-grade bottle with an insulated interior and long-lasting steel finish.',
                        usage: 'Best for flights, road trips, and long journeys.',
                        features: [
                            'Insulated core',
                            'Strong steel shell',
                            'Travel-ready design',
                            'Leak-resistant cap',
                            'Comfort grip'
                        ],
                        thumbnail: 'images/Bottles/Travel Bottles/ClimatePro-Black/Thumbnail.png',
                        images: [
                            'images/Bottles/Travel Bottles/ClimatePro-Black/Thumbnail.png',
                            'images/Bottles/Travel Bottles/ClimatePro-CrocodilePattern/Thumbnail.png',
                            'images/Bottles/Travel Bottles/ClimatePro-MattSteel/ChatGPT Image Jul 1, 2026, 10_59_11 PM.png'
                        ],
                        interest: 'bottles'
                    }
                ]
            }
        ]
    },
    lunchboxes: {
        heroImage: 'images/LunchBox/Tiffini30/Tiffin-3.jpg',
        heroTitle: 'Stainless Steel Lunch Boxes',
        heroSubtitle: 'Explore modern lunch box collections with premium steel construction and organized meal storage.',
        heroDescription: 'Choose the right lunch box for office, school, and travel with a clean navigation experience and product gallery.',
        categories: [
            {
                id: 'classic',
                label: 'Classic Tiered',
                description: 'Multi-tier steel tiffins built for everyday meals.',
                products: [
                    {
                        id: 'tiffin30',
                        title: 'Tiffin 30',
                        subtitle: 'Classic multi-tier lunch box.',
                        description: 'A reliable stainless steel lunch box with multiple compartments for complete meals on the go.',
                        usage: 'Perfect for office meals, school lunches, and outdoor picnics.',
                        features: [
                            'Multi-tier stainless steel design',
                            'Food-grade construction',
                            'Secure stacking mechanism',
                            'Easy to clean',
                            'Durable and reusable'
                        ],
                        images: [
                            'images/LunchBox/Tiffini30/Main.jpg',
                            'images/LunchBox/Tiffini30/Tiffin-3.jpg',
                            'images/LunchBox/Tiffini30/Tiffin-4.jpg'
                        ],
                        interest: 'lunchboxes'
                    }
                ]
            },
            {
                id: 'blacklid',
                label: 'Black Lid',
                description: 'Sleek lunch boxes with a bold black steel lid.',
                products: [
                    {
                        id: 'steellidblack',
                        title: 'Steel Lid Black',
                        subtitle: 'Premium black lid lunch box.',
                        description: 'A stylish lunch box with a black steel lid, designed for premium presentation and food safety.',
                        usage: 'Ideal for office lunches, business meals, and refined daily dining.',
                        features: [
                            'Premium steel lid',
                            'Leak-resistant seal',
                            'Easy to carry',
                            'Food-grade interior',
                            'Stylish appearance'
                        ],
                        images: [
                            'images/LunchBox/TiffinSteellidBlack/Main.jpg',
                            'images/LunchBox/TiffinSteellidBlack/Tiffin (Steel lid) Black-3.jpg',
                            'images/LunchBox/TiffinSteellidBlack/Tiffin (Steel lid) Black-4.jpg'
                        ],
                        interest: 'lunchboxes'
                    }
                ]
            },
            {
                id: 'bluelid',
                label: 'Blue Lid',
                description: 'Vibrant lunch boxes with steel lids for fresh style.',
                products: [
                    {
                        id: 'steellidblue',
                        title: 'Steel Lid Blue',
                        subtitle: 'Fresh blue lunch companion.',
                        description: 'A color-rich stainless steel lunch box with strong seal and modern design for daily meals.',
                        usage: 'Great for school, travel, and office meal prep.',
                        features: [
                            'Food-grade stainless steel',
                            'Leak-resistant lid',
                            'Durable blue finish',
                            'Compact stackable layers',
                            'Easy to wash'
                        ],
                        images: [
                            'images/LunchBox/TiffinSteellidBlue/Main.jpg',
                            'images/LunchBox/TiffinSteellidBlue/Tiffin (Steel lid) Blue-3.jpg',
                            'images/LunchBox/TiffinSteellidBlue/Tiffin (Steel lid) Blue-4.jpg'
                        ],
                        interest: 'lunchboxes'
                    }
                ]
            }
        ]
    },
    dustbins: {
        heroImage: 'images/Dustbin/DustbinPerforated/Kitchen.png',
        heroTitle: 'Stainless Steel Dustbins',
        heroSubtitle: 'Shop premium dustbins with perforated, pedal, smooth and swing lid designs.',
        heroDescription: 'Find the right bin for kitchen, office, bathroom, or lounge with an immersive product experience.',
        categories: [
            {
                id: 'perforated',
                label: 'Perforated',
                description: 'Stylish ventilated bins for kitchens and living spaces.',
                products: [
                    {
                        id: 'perforated-bin',
                        title: 'Perforated Dustbin',
                        subtitle: 'Airy, hygienic bin option.',
                        description: 'A ventilated steel dustbin that combines a premium look with practical kitchen hygiene.',
                        usage: 'Perfect for kitchen waste, office trash, and common spaces.',
                        features: [
                            'Perforated stainless steel body',
                            'Rust-resistant finish',
                            'Easy to clean',
                            'Modern kitchen styling',
                            'Lightweight yet sturdy'
                        ],
                        images: [
                            'images/Dustbin/DustbinPerforated/Main.png',
                            'images/Dustbin/DustbinPerforated/Kitchen.png',
                            'images/Dustbin/DustbinPerforated/Office.png'
                        ],
                        interest: 'dustbins'
                    }
                ]
            },
            {
                id: 'pedal',
                label: 'Pedal',
                description: 'Foot-controlled bins for hygienic and hands-free disposal.',
                products: [
                    {
                        id: 'pedal-bin',
                        title: 'Perforated Pedal Bin',
                        subtitle: 'Hands-free disposal with premium styling.',
                        description: 'A perforated steel bin with a foot pedal for clean disposal and easy operation.',
                        usage: 'Ideal for kitchens, offices, and bathrooms where hygiene matters.',
                        features: [
                            'Foot-pedal operation',
                            'Perforated steel body',
                            'Rust-resistant',
                            'Easy maintenance',
                            'Stable base'
                        ],
                        images: [
                            'images/Dustbin/DustbinPerfWithPeddal/Main.png',
                            'images/Dustbin/DustbinPerfWithPeddal/Dustbin-Perforated-3-BL.png',
                            'images/Dustbin/DustbinPerfWithPeddal/Kitchen.png'
                        ],
                        interest: 'dustbins'
                    }
                ]
            },
            {
                id: 'smoothpedal',
                label: 'Smooth Pedal',
                description: 'Premium smooth bins with silent pedal operation.',
                products: [
                    {
                        id: 'smooth-pedal-bin',
                        title: 'Smooth Pedal Dustbin',
                        subtitle: 'Sleek, quiet, and modern.',
                        description: 'A soft-close steel bin designed for high-end kitchens and offices with a quiet pedal mechanism.',
                        usage: 'Great in upscale kitchens, hotel suites, and professional reception areas.',
                        features: [
                            'Soft-close pedal',
                            'Smooth steel finish',
                            'Rust-resistant',
                            'Easy to clean',
                            'Elegant design'
                        ],
                        images: [
                            'images/Dustbin/DustbinSmoothwithpeddal/Main.jpg',
                            'images/Dustbin/DustbinSmoothwithpeddal/Dustbin-Smooth finish- 2.jpg',
                            'images/Dustbin/DustbinSmoothwithpeddal/Dustbin-Smooth finish- 3.jpg'
                        ],
                        interest: 'dustbins'
                    }
                ]
            },
            {
                id: 'swing',
                label: 'Swing Lid',
                description: 'Classic swing-top bins for easy access and simple use.',
                products: [
                    {
                        id: 'swing-bin',
                        title: 'Swing Lid Dustbin',
                        subtitle: 'Convenient access with a smooth swing lid.',
                        description: 'A timeless steel bin with swing-top lid that blends into bathrooms, kitchens, and shared spaces.',
                        usage: 'Perfect for bathrooms, utility rooms, and casual use areas.',
                        features: [
                            'Swing-top lid',
                            'Durable steel body',
                            'Easy disposal',
                            'Rust-resistant finish',
                            'Compact footprint'
                        ],
                        images: [
                            'images/Dustbin/Swing/Main.png'
                        ],
                        interest: 'dustbins'
                    }
                ]
            }
        ]
    },
    combos: {
        heroImage: 'images/Combo/Main.jpg',
        heroTitle: 'Premium Combo Sets',
        heroSubtitle: 'Select curated bottle and lunch box bundles with premium packaging and practical features.',
        heroDescription: 'Choose from gift-ready bundles and office combo sets with a futuristic product selector.',
        categories: [
            {
                id: 'family',
                label: 'Family Bundles',
                description: 'Bundles designed for families and group use.',
                products: [
                    {
                        id: 'combo-classic',
                        title: 'Classic Combo Set',
                        subtitle: 'Bottle and lunch box bundle for everyday family use.',
                        description: 'A practical combo with a classic bottle and tiered lunch box for balanced meals and hydration.',
                        usage: 'Great for family meal prep, travel packs, and weekday lunches.',
                        features: [
                            'Bottle + lunch box bundle',
                            'Food-grade steel components',
                            'Ideal for everyday use',
                            'Wide compatibility and durability'
                        ],
                        images: [
                            'images/Combo/Combo-Classic.jpg',
                            'images/Combo/Main.jpg'
                        ],
                        interest: 'combos'
                    }
                ]
            },
            {
                id: 'office',
                label: 'Office Sets',
                description: 'Smart combo sets for desk lunches and business gifting.',
                products: [
                    {
                        id: 'combo-curvy',
                        title: 'Curvy Office Combo',
                        subtitle: 'Professional bundle for office hydration and meals.',
                        description: 'A sleek combo pairing a modern bottle with a premium lunch box suited for corporate use.',
                        usage: 'Ideal for daily office lunches, meetings, and gifting teams.',
                        features: [
                            'Corporate-ready styling',
                            'Premium steel build',
                            'Complete hydration and meal storage',
                            'Gifting-friendly bundle'
                        ],
                        images: [
                            'images/Combo/Combo-Curvy.jpg',
                            'images/Combo/Main.jpg'
                        ],
                        interest: 'combos'
                    }
                ]
            },
            {
                id: 'gift',
                label: 'Gift Sets',
                description: 'Premium curated combos ideal for gifting and special occasions.',
                products: [
                    {
                        id: 'combo-flora',
                        title: 'Flora Gift Combo',
                        subtitle: 'Elegant combo set with a floral-inspired bottle and lunch box.',
                        description: 'A stylish gift set crafted for refined presentations and memorable giving.',
                        usage: 'Perfect for gifts, celebrations, and premium corporate bundles.',
                        features: [
                            'Gift-ready bundle',
                            'Premium steel items',
                            'Stylish design',
                            'Perfect for special occasions'
                        ],
                        images: [
                            'images/Combo/Combo-Flora.jpg',
                            'images/Combo/Main.jpg'
                        ],
                        interest: 'combos'
                    }
                ]
            }
        ]
    }
};

function findPageData(pageKey) {
    return PAGE_DATA[pageKey] || null;
}

function normalizeImagePath(src) {
    if (!src || typeof src !== 'string') return src;
    return src
        .replace(/^images\/Bottles\/Classic\//, 'images/Bottles/Fridge Bottles/Classic/')
        .replace(/^images\/Bottles\/Curvy\//, 'images/Bottles/Fridge Bottles/Curvy/')
        .replace(/^images\/Bottles\/CurvyBSC\//, 'images/Bottles/Fridge Bottles/CurvyBSC/')
        .replace(/^images\/Bottles\/FloraBlackLogo\//, 'images/Bottles/Fridge Bottles/Flora/')
        .replace(/^images\/Bottles\/Sports\//, 'images/Bottles/Fridge Bottles/Sports/');
}

function renderCollectionPage(pageKey) {
    var page = findPageData(pageKey);
    var root = document.getElementById('pageRoot');
    if (!page || !root) return;

    window.currentPageState = {
        pageKey: pageKey,
        categoryId: page.categories[0].id,
        productId: page.categories[0].products[0].id
    };

    var requestedCategory = window.location.hash ? window.location.hash.substring(1) : '';
    if (requestedCategory && page.categories.some(function(category) { return category.id === requestedCategory; })) {
        window.currentPageState.categoryId = requestedCategory;
    }

    root.innerHTML =
        '<section class="product-hero-banner" style="background-image:url(\'' + normalizeImagePath(page.heroImage) + '\')">' +
            '<div class="product-hero-gradient"></div>' +
            '<div class="product-hero-grid"></div>' +
            '<div class="product-hero-inner">' +
                '<nav class="breadcrumb"><a href="index.html">Home</a><span>/</span><span class="current">' + page.heroTitle + '</span></nav>' +
                '<span class="section-badge">Collection</span>' +
                '<h1 class="product-hero-title">' + page.heroTitle + '</h1>' +
                '<p class="product-hero-tagline">' + page.heroSubtitle + '</p>' +
            '</div>' +
        '</section>' +
        '<section class="product-category-section">' +
            '<div class="section-content">' +
                '<div class="section-header">' +
                    '<span class="section-badge">Categories</span>' +
                    '<h2 class="section-title">Choose a Category</h2>' +
                    '<p class="section-subtitle">' + page.heroDescription + '</p>' +
                '</div>' +
                '<div class="category-tabs" id="categoryTabs"></div>' +
                '<div class="product-grid" id="categoryProducts"></div>' +
            '</div>' +
        '</section>' +
        '<section class="product-showcase-section">' +
            '<div class="product-showcase">' +
                '<div class="product-gallery-panel">' +
                    '<div class="futuristic-display">' +
                        '<div class="display-ring"></div>' +
                        '<div class="display-glow"></div>' +
                        '<img id="productMainImage" src="" alt="Product image" />' +
                    '</div>' +
                    '<div class="thumbnail-strip" id="productThumbnails"></div>' +
                    '<div class="gallery-nav-row">' +
                        '<button type="button" class="nav-arrow left" onclick="changeProductImage(-1)" aria-label="Previous">‹</button>' +
                        '<span class="img-counter" id="imgCounter">0 / 0</span>' +
                        '<button type="button" class="nav-arrow right" onclick="changeProductImage(1)" aria-label="Next">›</button>' +
                    '</div>' +
                '</div>' +
                '<div class="product-info-panel">' +
                    '<div class="info-glass-card">' +
                        '<span class="product-detail-badge">' + page.heroTitle + '</span>' +
                        '<h2 id="productTitle" class="product-info-title"></h2>' +
                        '<p id="productDescription" class="info-desc"></p>' +
                        '<ul id="productFeatureList" class="feature-list"></ul>' +
                        '<div id="productUsage" class="info-desc"></div>' +
                        '<div class="product-tags"><span>Food-Grade</span><span>Rust-Free</span><span>Eco-Friendly</span></div>' +
                        '<div class="product-detail-actions">' +
                            '<button type="button" class="btn-primary" onclick="openQuery()">Get Quote</button>' +
                            '<a id="btnWhatsApp" class="btn-outline" href="https://wa.me/919999809260" target="_blank">WhatsApp Us</a>' +
                            '<a class="btn-outline" href="tel:+919999809260">Call Now</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</section>';

    buildCategoryTabs(page);
    setCollectionCategory(window.currentPageState.categoryId);
}

function buildCategoryTabs(page) {
    var tabs = document.getElementById('categoryTabs');
    if (!tabs) return;
    tabs.innerHTML = page.categories.map(function(category, index) {
        return '<button type="button" class="category-tab' + (index === 0 ? ' active' : '') + '" onclick="setCollectionCategory(\'' + category.id + '\')">' + category.label + '</button>';
    }).join('');
}

function setCollectionCategory(categoryId) {
    var page = findPageData(window.currentPageState.pageKey);
    if (!page) return;
    var category = page.categories.find(function(item) { return item.id === categoryId; });
    if (!category) return;

    window.currentPageState.categoryId = categoryId;
    window.currentPageState.productId = category.products[0].id;

    document.querySelectorAll('.category-tab').forEach(function(tab) {
        tab.classList.toggle('active', tab.textContent === category.label);
    });

    var productGrid = document.getElementById('categoryProducts');
    if (!productGrid) return;
    productGrid.innerHTML = category.products.map(function(product, index) {
        var thumb = normalizeImagePath(product.thumbnail || product.images[0]);
        return '<article class="product-card' + (index === 0 ? ' active' : '') + '" onclick="selectProduct(\'' + product.id + '\')">' +
            '<div class="product-card-image">' +
                '<img src="' + thumb + '" alt="' + product.title + '" />' +
            '</div>' +
            '<div class="product-card-body">' +
                '<h3>' + product.title + '</h3>' +
                '<p>' + product.subtitle + '</p>' +
            '</div>' +
        '</article>';
    }).join('');

    selectProduct(window.currentPageState.productId);
    if (window.history && typeof window.history.replaceState === 'function') {
        window.history.replaceState(null, '', window.currentPageState.pageKey + '.html#' + categoryId);
    }
}

function selectProduct(productId) {
    var page = findPageData(window.currentPageState.pageKey);
    if (!page) return;
    var category = page.categories.find(function(item) { return item.id === window.currentPageState.categoryId; });
    if (!category) return;
    var product = category.products.find(function(item) { return item.id === productId; });
    if (!product) return;

    window.currentPageState.productId = productId;
    document.querySelectorAll('.product-card').forEach(function(card) {
        card.classList.toggle('active', card.getAttribute('onclick').includes('\'' + productId + '\''));
    });

    var normalizedImages = product.images.map(normalizeImagePath);
    window.bottleImages = normalizedImages.slice();
    window.currentImageIndex = 0;

    var title = document.getElementById('productTitle');
    var description = document.getElementById('productDescription');
    var usage = document.getElementById('productUsage');
    var features = document.getElementById('productFeatureList');
    var whatsappLink = document.getElementById('btnWhatsApp');

    if (title) title.textContent = product.title;
    if (description) description.textContent = product.description;
    if (usage) usage.textContent = 'General Usage: ' + product.usage;
    if (features) {
        features.innerHTML = product.features.map(function(feature) {
            return '<li>' + feature + '</li>';
        }).join('');
    }
    if (whatsappLink) {
        whatsappLink.href = 'https://wa.me/919999809260?text=' + encodeURIComponent('Hello Norwell, I am interested in the ' + product.title + ' (' + page.heroTitle + '). Please share a quote.');
    }

    window.bottleImages = normalizedImages.slice();
    window.currentImageIndex = 0;
    setProductImage(0);
    setQuoteInterest(product.interest || window.currentPageState.pageKey);
}

function setQuoteInterest(interest) {
    var interestInput = document.getElementById('productInterest');
    if (interestInput) {
        interestInput.value = interest;
    }
}

// ─── Futuristic Product Page Renderer ───
var DEFAULT_BOTTLE_FEATURES = [
    'Food-grade stainless steel construction',
    'Rust-resistant and durable',
    'Leak-proof cap design',
    'Ergonomic and sleek design',
    'Perfect for gym, travel, office, or outdoor use',
    'Easy to clean and maintain',
    'Eco-friendly and sustainable',
    'Fits in most bags and car holders'
];

function renderProductPage(config) {
    var root = document.getElementById('productPageRoot');
    if (!root || !config) return;

    var images = (config.images || []).map(normalizeImagePath);
    var features = config.features || DEFAULT_BOTTLE_FEATURES;
    var hero = normalizeImagePath(config.heroImage || (images.length ? images[0] : ''));
    var parentLink = config.categoryLink || 'index.html';
    var parentLabel = config.parentLabel || 'Products';
    var badgeHtml = config.badge ? '<span class="product-hero-badge">' + config.badge + '</span>' : '';
    var accent = config.accent ? ' ' + config.accent : '';

    root.innerHTML =
        '<section class="product-hero-banner" style="background-image:url(\'' + hero + '\')">' +
            '<div class="product-hero-gradient"></div>' +
            '<div class="product-hero-grid"></div>' +
            '<div class="product-hero-inner">' +
                '<nav class="breadcrumb">' +
                    '<a href="index.html">Home</a><span>/</span>' +
                    '<a href="' + parentLink + '">' + parentLabel + '</a><span>/</span>' +
                    '<span class="current">' + config.shortName + '</span>' +
                '</nav>' +
                badgeHtml +
                '<h1 class="product-hero-title">' + config.name + '</h1>' +
                '<p class="product-hero-tagline">' + (config.tagline || '') + '</p>' +
            '</div>' +
        '</section>' +
        '<section class="product-showcase-section">' +
            '<div class="product-showcase">' +
                '<div class="product-gallery-panel">' +
                    '<div class="futuristic-display' + accent + '">' +
                        '<div class="display-ring"></div>' +
                        '<div class="display-glow"></div>' +
                        '<img id="mainBottleImage" src="' + images[0] + '" alt="' + config.name + '" />' +
                    '</div>' +
                    '<div class="thumbnail-strip" id="productThumbnails"></div>' +
                    '<div class="gallery-nav-row">' +
                        '<button type="button" class="nav-arrow left" id="prevImg" aria-label="Previous">‹</button>' +
                        '<span class="img-counter" id="imgCounter">1 / ' + images.length + '</span>' +
                        '<button type="button" class="nav-arrow right" id="nextImg" aria-label="Next">›</button>' +
                    '</div>' +
                '</div>' +
                '<div class="product-info-panel">' +
                    '<div class="info-glass-card">' +
                        '<span class="product-detail-badge">' + config.category + '</span>' +
                        '<h2 class="product-info-title">' + config.name + '</h2>' +
                        '<p class="info-desc">' + (config.tagline || '') + '</p>' +
                        '<ul class="feature-list">' + features.map(function(f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' +
                        '<div class="product-tags">' +
                            '<span>Food-Grade</span><span>Rust-Free</span><span>Eco-Friendly</span>' +
                        '</div>' +
                        '<div class="product-detail-actions">' +
                            '<button type="button" class="btn-primary" onclick="openQuery()">Request Quote</button>' +
                            '<a href="https://wa.me/919999809260" class="btn-outline" target="_blank">WhatsApp Us</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</section>' +
        '<section class="product-lifestyle-section">' +
            '<div class="lifestyle-header">' +
                '<span class="section-badge">Gallery</span>' +
                '<h2>See It In Action</h2>' +
                '<p class="section-subtitle">Swipe through high-resolution product & lifestyle shots</p>' +
            '</div>' +
            '<div class="lifestyle-scroll" id="lifestyleGallery"></div>' +
        '</section>';

    window.bottleImages = images;
    window.currentImageIndex = 0;

    buildThumbnailStrip('productThumbnails', images, function(i) {
        setProductImage(i);
    });

    document.getElementById('prevImg').addEventListener('click', function() { changeProductImage(-1); });
    document.getElementById('nextImg').addEventListener('click', function() { changeProductImage(1); });

    var lifestyle = document.getElementById('lifestyleGallery');
    images.forEach(function(src, i) {
        var item = document.createElement('button');
        item.className = 'lifestyle-card';
        item.type = 'button';
        item.innerHTML = '<img src="' + src + '" alt="Gallery image ' + (i + 1) + '" loading="lazy" />';
        item.addEventListener('click', function() { setProductImage(i); });
        lifestyle.appendChild(item);
    });

    var interest = document.getElementById('productInterest');
    if (interest && config.interest) interest.value = config.interest;
}

function setProductImage(index) {
    if (!window.bottleImages || !window.bottleImages.length) return;
    window.currentImageIndex = index;
    var main = document.getElementById('mainBottleImage');
    if (main) main.src = window.bottleImages[index];
    updateThumbnailActive('productThumbnails', index);
    updateImgCounter(index, window.bottleImages.length);
}

function changeProductImage(direction) {
    if (!window.bottleImages) return;
    var next = window.currentImageIndex + direction;
    if (next < 0) next = window.bottleImages.length - 1;
    if (next >= window.bottleImages.length) next = 0;
    setProductImage(next);
}

function changeBottleImage(direction) {
    changeProductImage(direction);
}

function updateImgCounter(i, total) {
    var el = document.getElementById('imgCounter');
    if (el) el.textContent = (i + 1) + ' / ' + total;
}

// Add quote CTAs to legacy product detail pages
function enhanceProductDetailPages() {
    if (document.getElementById('productPageRoot')) return;
    const messageSide = document.querySelector('.bottle-detail-section .bottle-message-side');
    if (!messageSide || messageSide.querySelector('.product-detail-actions')) return;

    const actions = document.createElement('div');
    actions.className = 'product-detail-actions';
    actions.innerHTML = '<button class="btn-primary" onclick="openQuery()">Request Quote</button>' +
        '<a href="https://wa.me/919999809260" class="btn-outline" target="_blank">WhatsApp Us</a>';
    messageSide.appendChild(actions);

    const detailSection = document.querySelector('.bottle-detail-section');
    if (detailSection && !detailSection.querySelector('.breadcrumb')) {
        const container = document.createElement('div');
        container.className = 'shop-container';
        container.style.marginBottom = '40px';
        const nav = document.createElement('nav');
        nav.className = 'breadcrumb';
        nav.innerHTML = '<a href="index.html">Home</a><span>/</span><span class="current">' +
            document.title.split('|')[0].trim().split('-')[0].trim() + '</span>';
        container.appendChild(nav);
        detailSection.insertBefore(container, detailSection.firstChild);
    }
}

// Change slide by n
function changeSlide(n) {
    clearInterval(slideTimer);
    showSlides(slideIndex += n);
    // Restart auto-advance
    slideTimer = setInterval(function() {
        changeSlide(1);
    }, 4000);
}

// Show specific slide
function currentSlide(n) {
    clearInterval(slideTimer);
    showSlides(slideIndex = n);
    // Restart auto-advance
    slideTimer = setInterval(function() {
        changeSlide(1);
    }, 4000);
}

// Display slides
function showSlides(n) {
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    if (!slides || slides.length === 0) {
        console.log("No slides found, retrying...");
        setTimeout(function() {
            showSlides(n);
        }, 100);
        return;
    }
    
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
        slides[i].style.display = "none";
    }
    
    // Remove active class from all dots
    if (dots) {
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("active");
        }
    }
    
    // Show current slide
    if (slides[slideIndex-1]) {
        slides[slideIndex-1].style.display = "flex";
        slides[slideIndex-1].classList.add("active");
    }
    
    if (dots && dots[slideIndex-1]) {
        dots[slideIndex-1].classList.add("active");
    }
}

// Toggle dropdown on click
function toggleDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    const dropdown = event.target.closest('.dropdown');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });
});

// Scroll gallery function
function scrollGallery(galleryId, direction) {
    const gallery = document.getElementById(galleryId + '-gallery');
    if (gallery) {
        const scrollAmount = 300;
        gallery.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Scroll to Products Section
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Navigation functionality
function initNavigation() {
    initTopCategoryDropdown();

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close mobile menu when a link is clicked
            const navMenu = document.querySelector('.nav-menu');
            const backdrop = document.querySelector('.mobile-menu-backdrop');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                // Also remove backdrop and restore body scroll
                if (backdrop) {
                    backdrop.classList.remove('active');
                }
                document.body.style.overflow = 'auto';
            }
            
            // Only handle smooth scrolling for hash links
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Get the target section
                const targetId = href;
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Smooth scroll to section
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Update active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

function initTopCategoryDropdown() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    const bottleAnchor = navMenu.querySelector('a[href^="bottles.html"]');
    if (!bottleAnchor) return;

    const bottleItem = bottleAnchor.closest('li');
    if (!bottleItem) return;

    if (!bottleItem.classList.contains('dropdown')) {
        bottleItem.classList.add('dropdown');
        bottleAnchor.href = 'bottles.html#fridge';
        bottleAnchor.addEventListener('click', function(event) {
            event.preventDefault();
            bottleItem.classList.toggle('active');
        });

        const categories = [
            { label: 'Fridge Bottles', hash: 'fridge' },
            { label: 'Gym Bottles', hash: 'gym' },
            { label: 'Hot and Cold Bottles', hash: 'hotcold' },
            { label: 'Sipper Bottles', hash: 'sipper' },
            { label: 'Travel Bottles', hash: 'travel' }
        ];

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu';
        dropdownMenu.innerHTML = categories.map(function(category) {
            return '<li><a href="bottles.html#' + category.hash + '">' + category.label + '</a></li>';
        }).join('');

        bottleItem.appendChild(dropdownMenu);
    }
}

// FAQ toggle functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            // Toggle active class
            this.classList.toggle('active');
        });
    });
}

// Mobile menu toggle functionality
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const backdrop = document.querySelector('.mobile-menu-backdrop');
    
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
    
    if (backdrop) {
        backdrop.classList.toggle('active');
    }
    
    // Prevent body scroll when menu is open
    if (navMenu && navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Close mobile menu when clicking on the X button (::before pseudo-element)
document.addEventListener('click', function(e) {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && navMenu.classList.contains('active')) {
        const rect = navMenu.getBoundingClientRect();
        // Check if click is in the top-right area where X button is
        if (e.clientX > rect.right - 60 && e.clientX < rect.right - 10 && 
            e.clientY > rect.top + 10 && e.clientY < rect.top + 60) {
            toggleMobileMenu();
        }
    }
});

// Modal functionality
function openQuery() {
    const modal = document.getElementById('queryModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeQuery() {
    const modal = document.getElementById('queryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Subcategory navigation functions
function showSubcategoryDetails(categoryId) {
    // Hide the selection grid
    const selectionSection = document.querySelector('.subcategory-selection');
    if (selectionSection) {
        selectionSection.style.display = 'none';
    }
    
    // Show the specific category details
    const detailsSection = document.getElementById(categoryId + '-details');
    if (detailsSection) {
        detailsSection.style.display = 'block';
        // Smooth scroll to the details section
        detailsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function hideSubcategoryDetails() {
    // Hide all detail sections
    const detailSections = document.querySelectorAll('.subcategory-details');
    detailSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selection grid
    const selectionSection = document.querySelector('.subcategory-selection');
    if (selectionSection) {
        selectionSection.style.display = 'block';
        // Smooth scroll to the selection section
        selectionSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Image enlargement functions with zoom and thumbnail navigation
function enlargeImage(img) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    if (modal && modalImg) {
        // Get all images from the same gallery
        const gallery = img.closest('.product-gallery-panel');
        let images = [];
        let currentIndex = 0;
        
        if (gallery) {
            const thumbnails = gallery.querySelectorAll('.thumbnail-btn img');
            const mainImg = gallery.querySelector('#mainBottleImage');
            if (mainImg) images.push(mainImg.src);
            thumbnails.forEach(thumb => {
                if (thumb.src && !images.includes(thumb.src)) {
                    images.push(thumb.src);
                }
            });
            currentIndex = images.indexOf(img.src);
            if (currentIndex === -1 && mainImg) currentIndex = 0;
        } else {
            images = [img.src];
            currentIndex = 0;
        }
        
        window.modalImages = images;
        window.modalCurrentIndex = currentIndex;
        
        modal.style.display = 'block';
        modalImg.src = images[currentIndex];
        modalImg.alt = img.alt;
        modalImg.classList.remove('zoomed');
        document.body.style.overflow = 'hidden';
        
        // Build modal thumbnails
        buildModalThumbnails(images, currentIndex);
    }
}

function buildModalThumbnails(images, currentIndex) {
    const container = document.getElementById('modalThumbnails');
    if (!container) return;
    
    container.innerHTML = '';
    images.forEach((src, index) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.className = 'modal-thumbnail' + (index === currentIndex ? ' active' : '');
        thumb.onclick = function() {
            setModalImage(index);
        };
        container.appendChild(thumb);
    });
}

function setModalImage(index) {
    const modalImg = document.getElementById('modalImage');
    if (!modalImg || !window.modalImages) return;
    
    if (index < 0) index = window.modalImages.length - 1;
    if (index >= window.modalImages.length) index = 0;
    
    window.modalCurrentIndex = index;
    modalImg.src = window.modalImages[index];
    modalImg.classList.remove('zoomed');
    
    // Update thumbnail active state
    const thumbnails = document.querySelectorAll('.modal-thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function toggleImageZoom() {
    const modalImg = document.getElementById('modalImage');
    if (modalImg) {
        modalImg.classList.toggle('zoomed');
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        window.modalImages = null;
        window.modalCurrentIndex = 0;
    }
}

// Quote form handling
function handleQuoteForm() {
    const form = document.getElementById('quoteForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Create WhatsApp message
            const message = `Hello Norwell,\n\nI'm interested in getting a quote for your products.\n\nContact Details:\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nCompany: ${data.company || 'N/A'}\n\nProduct Interest: ${data.productInterest}\nQuantity: ${data.quantity || 'Not specified'}\n\nMessage: ${data.message || 'No additional message'}\n\nPlease provide me with a detailed quote.\n\nThank you!`;
            
            // Open WhatsApp with pre-filled message
            const whatsappUrl = `https://wa.me/919999809260?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            // Close modal
            closeQuery();
            
            // Show success message
            alert('Thank you! Your quote request has been prepared. You will now be redirected to WhatsApp to send the message.');
        });
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('queryModal');
    const imageModal = document.getElementById('imageModal');
    
    if (event.target === modal) {
        closeQuery();
    }
    
    if (event.target === imageModal) {
        closeImageModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeQuery();
        hideSubcategoryDetails();
        closeImageModal();
    }
});

// Smooth scrolling for image galleries
function initializeImageGalleries() {
    const galleries = document.querySelectorAll('.image-gallery');
    
    galleries.forEach(gallery => {
        let isDown = false;
        let startX;
        let scrollLeft;

        gallery.addEventListener('mousedown', (e) => {
            isDown = true;
            gallery.classList.add('active');
            startX = e.pageX - gallery.offsetLeft;
            scrollLeft = gallery.scrollLeft;
        });

        gallery.addEventListener('mouseleave', () => {
            isDown = false;
            gallery.classList.remove('active');
        });

        gallery.addEventListener('mouseup', () => {
            isDown = false;
            gallery.classList.remove('active');
        });

        gallery.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - gallery.offsetLeft;
            const walk = (x - startX) * 2;
            gallery.scrollLeft = scrollLeft - walk;
        });

        // Touch events for mobile
        gallery.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - gallery.offsetLeft;
            scrollLeft = gallery.scrollLeft;
        });

        gallery.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - gallery.offsetLeft;
            const walk = (x - startX) * 2;
            gallery.scrollLeft = scrollLeft - walk;
        });
    });
}

// Image lazy loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Add loading state to images (skip product card images for instant display)
function addImageLoadingStates() {
    const images = document.querySelectorAll('.image-item img, .subcategory-image img, .category-image img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.alt = 'Image not available';
        });
        
        // Set initial opacity to 0
        img.style.opacity = '0';
    });
}

// Animate elements on scroll
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });

    const animatedElements = document.querySelectorAll(
        '.category-card, .subcategory-card, .feature, .subcategory, .product-item, .stat-circle'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Mobile navigation toggle
function initializeMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// Category card hover effects
function initializeCategoryEffects() {
    const categoryCards = document.querySelectorAll('.category-card, .subcategory-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeImageGalleries();
    initializeLazyLoading();
    addImageLoadingStates();
    initializeScrollAnimations();
    initializeMobileNav();
    initializeCategoryEffects();
    handleQuoteForm();
    
    console.log('Norwell website initialized successfully!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// Handle online/offline status
window.addEventListener('online', function() {
    console.log('Connection restored');
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
});

// Performance monitoring
window.addEventListener('load', function() {
    setTimeout(function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    }, 0);
});

// Dynamic catalog renderer backed by asset-manifest.js.
// The manifest is generated from the images directory so product cards and
// galleries follow the filesystem instead of brittle hardcoded image lists.

var PRODUCT_PAGE_FILES = {
    bottles: 'bottles.html',
    dustbins: 'dustbin.html',
    lunchboxes: 'lunchbox.html',
    combos: 'combo.html'
};

var PRODUCT_PAGE_ALIASES = {
    classic: 'bottles/fridge-bottles/classic',
    curvy: 'bottles/fridge-bottles/curvy',
    curvyblack: 'bottles/gym-bottles/curvyb',
    curvybsc: 'bottles/fridge-bottles/curvybsc',
    flora: 'bottles/fridge-bottles/flora',
    sports: 'bottles/fridge-bottles/sports',
    sportsblack: 'bottles/sipper-bottles/sportsblackcap',
    'dustbin-perforated': 'dustbins/all/dustbinperforated',
    'dustbin-perfpedal': 'dustbins/all/dustbinperfwithpeddal',
    'dustbin-smoothpedal': 'dustbins/all/dustbinsmoothwithpeddal',
    'dustbin-swing': 'dustbins/all/swing',
    'lunchbox-tiffin30': 'lunchboxes/all/tiffini30',
    'lunchbox-steellidblack': 'lunchboxes/all/tiffinsteellidblack',
    'lunchbox-steellidblue': 'lunchboxes/all/tiffinsteellidblue'
};

function getCatalogManifest() {
    console.log('Getting catalog manifest:', window.NORWELL_ASSET_MANIFEST);
    return window.NORWELL_ASSET_MANIFEST || { pages: [] };
}

function getCatalogPages() {
    var pages = getCatalogManifest().pages || [];
    console.log('Catalog pages:', pages);
    return pages;
}

function getCatalogPage(pageKey) {
    var page = getCatalogPages().find(function(page) {
        return page.key === pageKey;
    }) || null;
    console.log('Found page for key', pageKey, ':', page);
    return page;
}

function getAllCatalogProducts() {
    var products = [];
    getCatalogPages().forEach(function(page) {
        (page.categories || []).forEach(function(category) {
            (category.products || []).forEach(function(product) {
                products.push(Object.assign({}, product, {
                    pageTitle: page.title,
                    categoryName: category.name,
                    categoryId: category.id
                }));
            });
        });
    });
    return products;
}

function findCatalogProduct(productKey, pageKey, categoryId) {
    var products = getAllCatalogProducts();
    var alias = PRODUCT_PAGE_ALIASES[productKey];
    if (alias) {
        var parts = alias.split('/');
        return products.find(function(product) {
            return product.pageKey === parts[0] && product.categoryId === parts[1] && product.id === parts[2];
        }) || null;
    }

    var query = new URLSearchParams(window.location.search);
    var queryProduct = query.get('product');
    var key = productKey || queryProduct;
    if (!key) return null;

    return products.find(function(product) {
        return product.id === key &&
            (!pageKey || product.pageKey === pageKey) &&
            (!categoryId || product.categoryId === categoryId);
    }) || products.find(function(product) {
        return product.id === key;
    }) || null;
}

function getProductUrl(product) {
    return 'product.html?page=' + encodeURIComponent(product.pageKey) +
        '&category=' + encodeURIComponent(product.categoryId) +
        '&product=' + encodeURIComponent(product.id);
}

function getCategoryUrl(pageKey, categoryId) {
    return (PRODUCT_PAGE_FILES[pageKey] || 'index.html') + '#' + encodeURIComponent(categoryId);
}

function formatCatalogName(name) {
    return String(name || '')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getPrimaryImage(product) {
    return product.thumbnail || product.hero || (product.images && product.images[0]) || '';
}

function getGalleryImages(product) {
    var primary = getPrimaryImage(product);
    return (product.images || []).filter(function(src) {
        return src && src !== primary;
    });
}

function buildProductCopy(product) {
    var name = formatCatalogName(product.name);
    var category = formatCatalogName(product.categoryName || product.pageTitle);
    return {
        title: name,
        description: name + ' is part of the Norwell ' + category + ' collection, built for durable everyday use with a premium stainless steel finish.',
        features: [
            'Premium stainless steel construction',
            'Food-grade and reusable design',
            'Rust-resistant finish',
            'Easy to clean and maintain',
            'Designed for daily home, office, and travel use'
        ]
    };
}

function escapeHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderMissingAssets(messages) {
    // Hide missing assets messages as requested
    return '';
}

function findPageData(pageKey) {
    var page = getCatalogPage(pageKey);
    if (!page) return null;
    return {
        heroImage: page.key === 'bottles' ? 'images/Hero.png' : findPageHero(page),
        heroTitle: page.title,
        heroSubtitle: 'Browse the ' + page.title + ' collection.',
        heroDescription: 'Select a category and choose a product to view details, features, and the full image gallery.',
        categories: page.categories.map(function(category) {
            return {
                id: category.id,
                label: category.name,
                description: 'Products in ' + category.name + '.',
                products: category.products.map(function(product) {
                    var copy = buildProductCopy(Object.assign({}, product, {
                        pageTitle: page.title,
                        categoryName: category.name,
                        categoryId: category.id
                    }));
                    return Object.assign({}, product, {
                        title: copy.title,
                        subtitle: category.name,
                        description: copy.description,
                        features: copy.features,
                        thumbnail: getPrimaryImage(product),
                        categoryId: category.id,
                        pageKey: page.key
                    });
                })
            };
        })
    };
}

function findPageHero(page) {
    var hero = '';
    (page.categories || []).some(function(category) {
        return (category.products || []).some(function(product) {
            hero = product.hero || product.thumbnail || (product.images && product.images[0]) || '';
            return Boolean(hero);
        });
    });
    return hero || 'images/Hero.png';
}

function renderCollectionPage(pageKey) {
    var page = getCatalogPage(pageKey);
    var root = document.getElementById('pageRoot');
    if (!page || !root) {
        console.error('Page not found or root element missing:', pageKey, page, root);
        return;
    }

    console.log('Rendering page:', pageKey, 'with categories:', page.categories);

    var pageLinks = {
        bottles: 'bottles.html',
        lunchboxes: 'lunchbox.html',
        dustbins: 'dustbin.html',
        combos: 'combo.html'
    };

    // Map hash fragments to category IDs for backward compatibility
    var categoryMapping = {
        'fridge': 'fridge-bottles',
        'gym': 'gym-bottles',
        'hot-and-cold': 'hot-and-cold-bottles',
        'sipper': 'sipper-bottles',
        'travel': 'travel-bottles',
        'all': 'all'
    };

    var requestedCategory = decodeURIComponent(window.location.hash ? window.location.hash.substring(1) : '');
    // Apply mapping if exists
    requestedCategory = categoryMapping[requestedCategory] || requestedCategory;
    
    var selectedCategory = (page.categories || []).find(function(category) {
        return category.id === requestedCategory;
    }) || page.categories[0];
    
    console.log('Selected category:', selectedCategory);
    
    if (!selectedCategory) {
        root.innerHTML = '<section class="shop-section"><div class="shop-container"><h1 class="section-title">No products found</h1></div></section>';
        return;
    }

    var missingAssets = [];
    var heroImage = page.key === 'bottles' ? 'images/Hero.png' : findPageHero(page);

    root.innerHTML =
        '<section class="product-hero-banner" style="background-image:url(\'' + escapeHtml(heroImage) + '\')">' +
            '<div class="product-hero-gradient"></div>' +
            '<div class="product-hero-grid"></div>' +
            '<div class="product-hero-inner">' +
                '<nav class="breadcrumb"><a href="index.html">Home</a><span>/</span><a href="' + escapeHtml(pageLinks[page.key]) + '">' + escapeHtml(page.title) + '</a><span>/</span><span class="current">' + escapeHtml(selectedCategory.name) + '</span></nav>' +
                '<span class="section-badge">Collection</span>' +
                '<h1 class="product-hero-title">' + escapeHtml(selectedCategory.name) + '</h1>' +
                '<p class="product-hero-tagline">Choose a product to view its image gallery, features, and description.</p>' +
            '</div>' +
        '</section>' +
        '<section class="product-category-section shop-section">' +
            '<div class="section-content">' +
                '<div class="category-tabs" id="categoryTabs"></div>' +
                '<div id="missingAssetsRoot"></div>' +
                '<div class="product-grid" id="categoryProducts"></div>' +
            '</div>' +
        '</section>';

    buildCategoryTabsFromManifest(page, selectedCategory.id);
    renderCategoryProducts(page, selectedCategory, missingAssets);

    var missingRoot = document.getElementById('missingAssetsRoot');
    if (missingRoot) missingRoot.innerHTML = renderMissingAssets(missingAssets);
}

function buildCategoryTabsFromManifest(page, selectedCategoryId) {
    var tabs = document.getElementById('categoryTabs');
    if (!tabs) return;
    tabs.innerHTML = (page.categories || []).map(function(category) {
        return '<button type="button" class="category-tab' + (category.id === selectedCategoryId ? ' active' : '') + '" data-category-id="' + escapeHtml(category.id) + '">' + escapeHtml(category.name) + '</button>';
    }).join('');

    // Add click handlers to tabs
    tabs.querySelectorAll('.category-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            var categoryId = this.getAttribute('data-category-id');
            window.location.hash = categoryId;
            renderCollectionPage(page.key);
        });
    });
}

function renderCategoryProducts(page, category, missingAssets) {
    var productGrid = document.getElementById('categoryProducts');
    if (!productGrid) return;

    console.log('Rendering products for category:', category.name, 'with', (category.products || []).length, 'products');

    productGrid.innerHTML = (category.products || []).map(function(product) {
        var enriched = Object.assign({}, product, {
            pageTitle: page.title,
            categoryName: category.name,
            categoryId: category.id
        });
        var image = getPrimaryImage(enriched);
        console.log('Product:', product.name, 'image:', image, 'thumbnail:', product.thumbnail);
        if (!product.thumbnail) {
            missingAssets.push('Missing Thumbnail image in ' + product.dir);
        }
        if (!image) {
            missingAssets.push('No usable images found in ' + product.dir);
        }

        return '<article class="product-card visible">' +
            '<a class="product-card-link" href="' + escapeHtml(getProductUrl(enriched)) + '">' +
                '<div class="product-card-image">' +
                    (image ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(formatCatalogName(product.name)) + '" loading="lazy" />' : '<div class="image-missing">Image missing</div>') +
                '</div>' +
                '<div class="product-card-body">' +
                    '<h3>' + escapeHtml(formatCatalogName(product.name)) + '</h3>' +
                    '<p>' + escapeHtml(category.name) + '</p>' +
                    '<span class="product-card-cta">View Details</span>' +
                '</div>' +
            '</a>' +
        '</article>';
    }).join('');
}

function renderProductPage(config) {
    var root = document.getElementById('productPageRoot');
    if (!root) return;

    var query = new URLSearchParams(window.location.search);
    var pageKey = query.get('page');
    var categoryId = query.get('category');
    var productKey = document.body.getAttribute('data-product') || query.get('product');
    var product = findCatalogProduct(productKey, pageKey, categoryId);
    if (!product && config && config.shortName) {
        product = findCatalogProduct(config.shortName.toLowerCase(), pageKey, categoryId);
    }

    if (!product) {
        root.innerHTML = '<section class="shop-section"><div class="shop-container"><h1 class="section-title">Product not found</h1><p class="section-subtitle">The requested product does not match a folder in the current asset manifest.</p></div></section>';
        return;
    }

    var copy = buildProductCopy(product);
    var primary = getPrimaryImage(product);
    var gallery = getGalleryImages(product);
    var missingAssets = [];
    if (!product.thumbnail) missingAssets.push('Missing Thumbnail image in ' + product.dir);
    if (!primary) missingAssets.push('No usable images found in ' + product.dir);

    root.innerHTML =
        '<section class="shop-section product-detail-section">' +
            '<div class="shop-container">' +
                '<nav class="breadcrumb"><a href="index.html">Home</a><span>/</span><a href="' + escapeHtml(getCategoryUrl(product.pageKey, product.categoryId)) + '">' + escapeHtml(formatCatalogName(product.categoryName || product.pageTitle)) + '</a><span>/</span><span class="current">' + escapeHtml(copy.title) + '</span></nav>' +
                renderMissingAssets(missingAssets) +
                '<div class="product-showcase product-detail-layout">' +
                    '<div class="product-gallery-panel">' +
                        '<div class="futuristic-display product-main-display">' +
                            (primary ? '<img id="mainBottleImage" src="' + escapeHtml(primary) + '" alt="' + escapeHtml(copy.title) + '" />' : '<div class="image-missing">Image missing</div>') +
                        '</div>' +
                        '<div class="thumbnail-strip" id="productThumbnails"></div>' +
                    '</div>' +
                    '<div class="product-info-panel">' +
                        '<div class="info-glass-card">' +
                            '<span class="product-detail-badge">' + escapeHtml(formatCatalogName(product.categoryName || product.pageTitle)) + '</span>' +
                            '<h1 class="product-info-title">' + escapeHtml(copy.title) + '</h1>' +
                            '<p class="info-desc">' + escapeHtml(copy.description) + '</p>' +
                            '<h3 class="detail-subtitle">Features</h3>' +
                            '<ul class="feature-list">' + copy.features.map(function(feature) { return '<li>' + escapeHtml(feature) + '</li>'; }).join('') + '</ul>' +
                            '<div class="product-detail-actions">' +
                                '<button type="button" class="btn-primary" onclick="openQuery()">Request Quote</button>' +
                                '<a href="https://wa.me/919999809260" class="btn-outline" target="_blank">WhatsApp Us</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</section>';

    window.bottleImages = [primary].concat(gallery).filter(Boolean);
    window.currentImageIndex = 0;
    buildThumbnailStrip('productThumbnails', gallery, function(index) {
        setProductImage(index + 1);
    });

    // Add click handler to main image for modal
    var mainImg = document.getElementById('mainBottleImage');
    if (mainImg) {
        mainImg.style.cursor = 'pointer';
        mainImg.addEventListener('click', function() {
            enlargeImage(this);
        });
    }

    var interest = document.getElementById('productInterest');
    if (interest) interest.value = product.pageKey === 'lunchboxes' ? 'lunchboxes' : product.pageKey;
}

function initTopCategoryDropdown() {
    var navMenus = document.querySelectorAll('.nav-menu');
    if (!navMenus.length) return;

    var pageLinks = {
        bottles: 'bottles.html',
        lunchboxes: 'lunchbox.html',
        dustbins: 'dustbin.html',
        combos: 'combo.html'
    };

    navMenus.forEach(function(navMenu) {
        getCatalogPages().forEach(function(page) {
            var anchor = navMenu.querySelector('a[href="' + pageLinks[page.key] + '"], a[href^="' + pageLinks[page.key] + '#"]');
            if (!anchor) return;
            var item = anchor.closest('li');
            if (!item || item.dataset.catalogDropdown === 'true') return;
            item.dataset.catalogDropdown = 'true';
            item.classList.add('dropdown');
            anchor.href = getCategoryUrl(page.key, (page.categories[0] || {}).id || 'all');
            anchor.addEventListener('click', function(event) {
                if (window.innerWidth <= 768) {
                    event.preventDefault();
                    item.classList.toggle('active');
                }
            });
            var dropdownMenu = document.createElement('ul');
            dropdownMenu.className = 'dropdown-menu';
            dropdownMenu.innerHTML = (page.categories || []).map(function(category) {
                return '<li><a href="' + escapeHtml(getCategoryUrl(page.key, category.id)) + '">' + escapeHtml(category.name) + '</a></li>';
            }).join('');
            item.appendChild(dropdownMenu);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var productRoot = document.getElementById('productPageRoot');
    if (productRoot && !productRoot.children.length && new URLSearchParams(window.location.search).get('product')) {
        renderProductPage();
    }
});
