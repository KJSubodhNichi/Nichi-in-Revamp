/**
 * @fileoverview Contains essential JavaScript functionalities for website interactivity.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize all core functionalities on DOM load.
    initMobileNavigation();
    initBackToTop();
    initIndustryCarousel(); // Existing carousel
    initLogoCarousel();     // Existing carousel
    initHeroSlider();       // New hero slider
    initAnimatedCounters(); // New animated counters
});

/**
 * Initializes mobile navigation: hamburger menu toggle and overlay behavior.
 */
function initMobileNavigation() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (hamburgerMenu && mobileNavOverlay) {
        // Toggle menu and prevent body scroll
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('open');
            mobileNavOverlay.classList.toggle('open');
            document.body.classList.toggle('overflow-hidden');
        });

        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('open');
                mobileNavOverlay.classList.remove('open');
                document.body.classList.remove('overflow-hidden');
            });
        });

        // Auto-close menu on desktop resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                hamburgerMenu.classList.remove('open');
                mobileNavOverlay.classList.remove('open');
                document.body.classList.remove('overflow-hidden');
            }
        });
    } else {
        console.warn("Mobile navigation elements not found.");
    }
}

/**
 * Manages back-to-top button visibility and smooth scroll.
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        // Scroll to top on click
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    } else {
        console.warn("Back to Top button not found.");
    }
}

/**
 * Initializes infinite horizontal scrolling for the Industry Focus carousel.
 */
function initIndustryCarousel() {
    const carousel = document.getElementById('industryCarousel');

    if (carousel) {
        let scrollSpeed = 0.2;
        let scrollInterval;

        // Clone items for seamless loop
        const originalCards = Array.from(carousel.children);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            carousel.appendChild(clone);
        });

        // Calculate total original width for looping
        const cardWidth = originalCards[0].offsetWidth + 24; // width + gap-6 (24px)
        const totalOriginalWidth = cardWidth * originalCards.length;

        /** Performs auto-scrolling and resets position for loop. */
        function autoScroll() {
            if (carousel.scrollLeft >= totalOriginalWidth) {
                carousel.scrollLeft = 0;
            } else {
                carousel.scrollBy({ left: scrollSpeed, behavior: 'smooth' });
            }
        }

        /** Starts the auto-scroll interval. */
        function startAutoScroll() {
            stopAutoScroll();
            // Using a higher interval for smoother visual perception, adjust 'scrollSpeed' in CSS for actual scroll amount
            scrollInterval = setInterval(autoScroll, 20); // More frequent updates for smoother visuals
        }

        /** Stops the auto-scroll interval. */
        function stopAutoScroll() {
            clearInterval(scrollInterval);
        }

        // Start autoplay and add hover controls
        startAutoScroll();
        carousel.addEventListener('mouseenter', stopAutoScroll);
        carousel.addEventListener('mouseleave', startAutoScroll);
    } else {
        console.warn("Industry carousel not found.");
    }
}

/**
 * Initializes infinite auto-scrolling for the membership logo carousel.
 */
function initLogoCarousel() {
    const logoCarouselTrack = document.querySelector('.logo-carousel-track');

    if (logoCarouselTrack) {
        // Clone logos for seamless loop (CSS handles animation)
        const logos = Array.from(logoCarouselTrack.children);
        logos.forEach(logo => {
            const clone = logo.cloneNode(true);
            logoCarouselTrack.appendChild(clone);
        });
        
    } else {
        console.warn("Logo carousel track not found.");
    }
}

/**
 * Initializes the full-width hero slider.
 */
function initHeroSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const paginationDots = document.querySelectorAll('.dot');

    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000; // 5 seconds for autoplay

    /** Shows a specific slide by index. */
    function showSlide(index) {
        // Ensure index wraps around
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Move the slider container
        sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update active pagination dot
        paginationDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    /** Moves to the next slide. */
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    /** Moves to the previous slide. */
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    /** Starts the autoplay interval. */
    function startAutoplay() {
        stopAutoplay(); // Clear any existing interval
        slideInterval = setInterval(nextSlide, slideDuration);
    }

    /** Stops the autoplay interval. */
    function stopAutoplay() {
        clearInterval(slideInterval);
    }

    // Event Listeners for navigation buttons
    nextButton.addEventListener('click', () => {
        nextSlide();
        startAutoplay(); // Reset autoplay on manual interaction
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        startAutoplay(); // Reset autoplay on manual interaction
    });

    // Event Listeners for pagination dots
    paginationDots.forEach(dot => {
        dot.addEventListener('click', (event) => {
            const slideIndex = parseInt(event.target.dataset.slide);
            showSlide(slideIndex);
            startAutoplay(); // Reset autoplay on manual interaction
        });
    });

    // Start the slider
    showSlide(currentSlide);
    startAutoplay();
}

/**
 * Initializes animated counters that animate when they come into view.
 */
function initAnimatedCounters() {
    const counterElements = document.querySelectorAll('.metric-number');

    const animateCount = (entry) => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.dataset.target);
            let current = 0;
            const duration = 2000; // 2 seconds animation
            const increment = target / (duration / 10); // Calculate increment per 10ms step

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current) + "+";
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + "+";
                }
            };
            requestAnimationFrame(updateCounter);
            observer.unobserve(counter); // Stop observing once animated
        }
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(animateCount);
    }, {
        threshold: 0.5 // Trigger when 50% of the element is visible
    });

    counterElements.forEach(counter => {
        observer.observe(counter);
    });
}
