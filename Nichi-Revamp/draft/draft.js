/**
 * @fileoverview Contains essential JavaScript functionalities for website interactivity.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize all core functionalities on DOM load.
    initMobileNavigation();
    initBackToTop();
    initIndustryCarousel();
    initLogoCarousel();
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
            scrollInterval = setInterval(autoScroll, 2000); // Changed to 2000ms as per user request (from 20ms)
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
