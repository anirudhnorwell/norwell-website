// script.js - Interactive functionality for Norwell website

// Slideshow functionality
let slideIndex = 1;
let slideTimer;

// Initialize slideshow when page loads
window.addEventListener('load', function() {
    // Wait a bit for DOM to be fully ready
    setTimeout(function() {
        showSlides(slideIndex);
        // Auto-advance slides every 4 seconds
        slideTimer = setInterval(function() {
            changeSlide(1);
        }, 4000);
    }, 100);
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
});

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
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
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

// Image enlargement functions
function enlargeImage(img) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    if (modal && modalImg) {
        modal.style.display = 'block';
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
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