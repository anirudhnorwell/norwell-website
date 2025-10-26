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
            const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(message)}`;
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
    if (event.target === modal) {
        closeQuery();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeQuery();
        hideSubcategoryDetails();
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
        '.category-card, .subcategory-card, .feature, .subcategory'
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