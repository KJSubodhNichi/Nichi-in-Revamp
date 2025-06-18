document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const progressBar = document.querySelector('.progress-bar');
    const currentSlideNum = document.getElementById('current-slide-num');
    const totalSlidesNum = document.getElementById('total-slides-num');
    const totalSlides = slides.length;

    // State variables
    let currentSlideIndex = 0;
    let isAnimating = false;
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // Minimum pixels for a recognized swipe

    // Update total slides number on indicator
    totalSlidesNum.textContent = String(totalSlides).padStart(2, '0');

    /**
     * Updates the progress bar and numeric indicator based on the current slide.
     */
    function updateNavigationUI() {
        const progress = ((currentSlideIndex + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;
        currentSlideNum.textContent = String(currentSlideIndex + 1).padStart(2, '0');
    }

    /**
     * Animates the words in a headline with a staggered effect.
     * @param {HTMLElement} headlineElement - The H1 element containing the words.
     */
    function animateHeadlineWords(headlineElement) {
        const words = headlineElement.querySelectorAll('span');
        words.forEach((word, index) => {
            // Apply a delay to each word for the staggered effect
            word.style.transitionDelay = `${index * 0.1}s`;
            // Trigger the CSS animation
            word.style.transform = 'translateY(0)';
            word.style.opacity = '1';
        });
    }

    /**
     * Resets the headline word animation state.
     * @param {HTMLElement} headlineElement - The H1 element.
     */
    function resetHeadlineWords(headlineElement) {
        const words = headlineElement.querySelectorAll('span');
        words.forEach((word) => {
            word.style.transitionDelay = '0s'; // Reset delay
            word.style.transform = 'translateY(100%)';
            word.style.opacity = '0';
        });
    }

    /**
     * Transitions to a new slide.
     * @param {number} newIndex - The index of the slide to transition to.
     */
    function goToSlide(newIndex) {
        if (isAnimating) {
            return; // Prevent multiple transitions at once
        }

        isAnimating = true;

        // Ensure newIndex wraps around for circular navigation
        const nextSlideIndex = (newIndex + totalSlides) % totalSlides;

        const currentSlide = slides[currentSlideIndex];
        const nextSlide = slides[nextSlideIndex];

        // If trying to go to the same slide, do nothing
        if (currentSlide === nextSlide) {
            isAnimating = false;
            return;
        }

        // Apply exit animation classes to the current slide
        currentSlide.classList.remove('active');
        currentSlide.classList.add('transition-exit');
        // Add a temporary class to correctly stack slides during transition
        currentSlide.classList.add('previous');

        // Reset content animations for the exiting slide
        const currentContent = currentSlide.querySelector('.slide-content');
        currentContent.style.transform = 'translateY(20px) scale(0.95)';
        currentContent.style.opacity = '0';
        currentContent.style.transitionDelay = '0s'; // Reset delay
        resetHeadlineWords(currentSlide.querySelector('.slide-headline'));
        currentSlide.querySelector('.slide-subheadline').style.transitionDelay = '0s';
        currentSlide.querySelector('.cta-button').style.transitionDelay = '0s';

        // Set the next slide to transition-enter state
        nextSlide.classList.add('transition-enter');

        // After a short delay, apply the active and transition-enter-active classes
        // This delay allows CSS to register the initial state before animating
        requestAnimationFrame(() => {
            currentSlide.classList.add('transition-exit-active');
            nextSlide.classList.add('active', 'transition-enter-active');

            // Apply content animations for the entering slide
            const nextContent = nextSlide.querySelector('.slide-content');
            nextContent.style.transitionDelay = '0.2s';
            nextContent.style.transform = 'translateY(0) scale(1)';
            nextContent.style.opacity = '1';

            const nextHeadline = nextSlide.querySelector('.slide-headline');
            animateHeadlineWords(nextHeadline); // Trigger staggered headline animation

            const nextSubheadline = nextSlide.querySelector('.slide-subheadline');
            nextSubheadline.style.transitionDelay = '0.4s';
            nextSubheadline.style.transform = 'translateY(0)';
            nextSubheadline.style.opacity = '1';

            const nextCtaButton = nextSlide.querySelector('.cta-button');
            nextCtaButton.style.transitionDelay = '0.6s';
            nextCtaButton.style.transform = 'translateY(0)';
            nextCtaButton.style.opacity = '1';
        });

        // Listen for the end of the transition on the *exiting* slide
        // This ensures the `isAnimating` flag is reset only after the transition completes
        const onExitTransitionEnd = () => {
            currentSlide.classList.remove('transition-exit', 'transition-exit-active', 'previous');
            // Remove the listener to prevent it from firing again
            currentSlide.removeEventListener('transitionend', onExitTransitionEnd);
            // After the exit transition, reset content of old slide for next time it becomes active
            const oldContent = currentSlide.querySelector('.slide-content');
            oldContent.style.transform = 'translateY(20px) scale(0.95)';
            oldContent.style.opacity = '0';
            resetHeadlineWords(currentSlide.querySelector('.slide-headline'));
            currentSlide.querySelector('.slide-subheadline').style.transform = 'translateY(15px)';
            currentSlide.querySelector('.slide-subheadline').style.opacity = '0';
            currentSlide.querySelector('.cta-button').style.transform = 'translateY(10px)';
            currentSlide.querySelector('.cta-button').style.opacity = '0';
        };

        // Listen for the end of the transition on the *entering* slide
        const onEnterTransitionEnd = () => {
            nextSlide.classList.remove('transition-enter', 'transition-enter-active');
            nextSlide.removeEventListener('transitionend', onEnterTransitionEnd);
            isAnimating = false; // Reset animation flag
        };

        // We need to listen to one of the properties that has the longest transition
        // For clip-path, it's 1.2s. For opacity it's 0.8s.
        // It's safer to listen for the longest transition to ensure all animations are done.
        currentSlide.addEventListener('transitionend', onExitTransitionEnd, { once: true });
        nextSlide.addEventListener('transitionend', onEnterTransitionEnd, { once: true });

        // Update current slide index after setting up transitions
        currentSlideIndex = nextSlideIndex;
        updateNavigationUI();
    }

    /**
     * Navigates to the next slide.
     */
    function nextSlide() {
        goToSlide(currentSlideIndex + 1);
    }

    /**
     * Navigates to the previous slide.
     */
    function prevSlide() {
        goToSlide(currentSlideIndex - 1);
    }

    // Event Listeners for Navigation Buttons
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    // Keyboard Navigation
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            prevSlide();
        } else if (event.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Touch/Swipe Navigation
    const sliderContainer = document.querySelector('.slider-container');

    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true }); // Use passive to improve scrolling performance

    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });

    /**
     * Determines if a swipe gesture occurred and triggers slide navigation.
     */
    function handleSwipeGesture() {
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swiped left (next slide)
            nextSlide();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swiped right (previous slide)
            prevSlide();
        }
    }

    // Initial setup: activate the first slide and update UI
    // Ensure the initial active slide's content also animates in
    slides[currentSlideIndex].classList.add('active');
    // Trigger initial content animation for the first slide after a slight delay
    // This uses a timeout to ensure CSS properties are applied before the animation
    setTimeout(() => {
        const initialContent = slides[currentSlideIndex].querySelector('.slide-content');
        initialContent.style.transitionDelay = '0.2s';
        initialContent.style.transform = 'translateY(0) scale(1)';
        initialContent.style.opacity = '1';

        const initialHeadline = slides[currentSlideIndex].querySelector('.slide-headline');
        animateHeadlineWords(initialHeadline);

        const initialSubheadline = slides[currentSlideIndex].querySelector('.slide-subheadline');
        initialSubheadline.style.transitionDelay = '0.4s';
        initialSubheadline.style.transform = 'translateY(0)';
        initialSubheadline.style.opacity = '1';

        const initialCtaButton = slides[currentSlideIndex].querySelector('.cta-button');
        initialCtaButton.style.transitionDelay = '0.6s';
        initialCtaButton.style.transform = 'translateY(0)';
        initialCtaButton.style.opacity = '1';
    }, 50); // Small delay to allow CSS to render initial state

    updateNavigationUI();
});
