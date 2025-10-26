// script.js - Interactive functionality for Norwell website

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

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('queryModal');
    if (event.target === modal) {
        closeQuery();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeQuery();
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

// Add loading state to images
function addImageLoadingStates() {
    const images = document.querySelectorAll('.image-item img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.alt = 'Image not available';
        });
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
        '.category-card, .feature, .subcategory'
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

// Search functionality (if needed in future)
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            // Implement search logic here
            console.log('Searching for:', query);
        });
    }
}

// Category card hover effects
function initializeCategoryEffects() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Image gallery navigation arrows (optional enhancement)
function addGalleryNavigation() {
    const galleries = document.querySelectorAll('.image-gallery');
    
    galleries.forEach(gallery => {
        const subcategory = gallery.closest('.subcategory');
        
        // Create navigation buttons
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '‹';
        prevBtn.className = 'gallery-nav prev';
        
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '›';
        nextBtn.className = 'gallery-nav next';
        
        // Add event listeners
        prevBtn.addEventListener('click', () => {
            gallery.scrollBy({ left: -300, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            gallery.scrollBy({ left: 300, behavior: 'smooth' });
        });
        
        // Insert navigation buttons
        subcategory.style.position = 'relative';
        subcategory.appendChild(prevBtn);
        subcategory.appendChild(nextBtn);
        
        // Show/hide buttons based on scroll position
        gallery.addEventListener('scroll', () => {
            prevBtn.style.opacity = gallery.scrollLeft > 0 ? '1' : '0.3';
            nextBtn.style.opacity = 
                gallery.scrollLeft < gallery.scrollWidth - gallery.clientWidth ? '1' : '0.3';
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
    initializeSearch();
    initializeCategoryEffects();
    
    // Optional: Add gallery navigation arrows
    // addGalleryNavigation();
    
    console.log('Norwell website initialized successfully!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden
        console.log('Page hidden');
    } else {
        // Page is visible
        console.log('Page visible');
    }
});

// Handle online/offline status
window.addEventListener('online', function() {
    console.log('Connection restored');
    // You could show a message to user about restored connection
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    // You could show a message to user about lost connection
});

// Performance monitoring
window.addEventListener('load', function() {
    setTimeout(function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    }, 0);
});