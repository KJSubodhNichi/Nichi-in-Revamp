/* script.js */

// Ensure the DOM is fully loaded before running any scripts
document.addEventListener('DOMContentLoaded', () => {

    /*
    -----------------------------------------------------------------------------
    GLOBAL SELECTORS
    -----------------------------------------------------------------------------
    */
    const body = document.body;
    const mainHeader = document.getElementById('main-header');
    const heroSection = document.getElementById('hero');
    const heroHeadline = document.querySelector('.hero-headline');
    const heroWords = heroHeadline ? Array.from(heroHeadline.querySelectorAll('.word')) : [];
    const navLinks = document.querySelectorAll('.main-nav .nav-links a');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const contentRevealElements = document.querySelectorAll('.content-reveal');
    const metricNumbers = document.querySelectorAll('.metric-number');
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    const caseStudyModalOverlay = document.getElementById('case-study-modal-overlay');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const caseStudyModalBody = document.getElementById('case-study-modal-body');
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    const carouselInner = document.querySelector('.carousel-inner');
    const prevBtn = document.querySelector('.carousel-btn.prev-btn');
    const nextBtn = document.querySelector('.carousel-btn.next-btn');
    const carouselDotsContainer = document.querySelector('.carousel-dots');
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    const backToTopBtn = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbotBtn = document.querySelector('.close-chatbot-btn');
    const chatbotBody = document.querySelector('.chatbot-body');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const prefilledTopicBtns = document.querySelectorAll('.topic-btn');
    // New selector for the close button on the sticky CTA bar
    const closeStickyCtaBtn = document.getElementById('close-sticky-cta-btn');

    // Select all service cards and the services section itself
    const servicesSection = document.getElementById('services');
    const serviceCards = document.querySelectorAll("#services .service-card");
    const nextSection = servicesSection ? servicesSection.nextElementSibling : null; // Assuming there's a next section

    let currentTestimonialIndex = 0;
    let testimonialInterval; // To control auto-slide

    /*
    -----------------------------------------------------------------------------
    THEME TOGGLE LOGIC
    -----------------------------------------------------------------------------
    */

    /**
     * Sets the theme (light or dark) on the body and persists it in localStorage.
     * @param {string} theme - 'light' or 'dark'
     */
    const setTheme = (theme) => {
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(`${theme}-mode`);
        localStorage.setItem('theme', theme);
    };

    // Check for saved theme preference or system preference on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark'); // Default to dark if system preference is dark
    } else {
        setTheme('light'); // Default to light
    }

    // Toggle theme on button click
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
            setTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }

    /*
    -----------------------------------------------------------------------------
    SMOOTH SCROLLING WITH HEADER OFFSET
    -----------------------------------------------------------------------------
    */

    /**
     * Handles smooth scrolling to a target element with an offset for the fixed header.
     * @param {Event} e - The click event.
     */
    const handleSmoothScroll = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Close mobile nav if open
            if (mobileNavOverlay.classList.contains('open')) {
                hamburgerMenu.classList.remove('is-active');
                mobileNavOverlay.classList.remove('open');
            }

            const headerHeight = mainHeader.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = targetPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Attach smooth scroll listener to all internal navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Exclude the CTA button in the header if it's already handled, or just include it if it links to a section.
        // Assuming primary-cta on header is for demo booking, not section navigation.
        if (!anchor.classList.contains('primary-cta')) {
            anchor.addEventListener('click', handleSmoothScroll);
        }
    });


    /*
    -----------------------------------------------------------------------------
    HEADER SCROLL EFFECTS (SHRINK, BLUR, HIDE/REVEAL)
    -----------------------------------------------------------------------------
    */
    let lastScrollY = window.scrollY;

    /**
     * Applies header transformations based on scroll position.
     */
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) { // If scrolled more than 50px
            mainHeader.classList.add('header-scrolled');
        } else {
            mainHeader.classList.remove('header-scrolled');
        }

        // Hide/reveal header on scroll down/up
        if (window.scrollY > lastScrollY && window.scrollY > 200) { // Scrolling down and past hero
            mainHeader.classList.add('header-hidden');
        } else { // Scrolling up
            mainHeader.classList.remove('header-hidden');
        }
        lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Call once on load to set initial state


    /*
    -----------------------------------------------------------------------------
    HAMBURGER MENU & MOBILE NAV OVERLAY
    -----------------------------------------------------------------------------
    */

    if (hamburgerMenu && mobileNavOverlay) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('is-active');
            mobileNavOverlay.classList.toggle('open');
            body.classList.toggle('no-scroll'); // Optional: prevent scrolling background
        });

        // Close mobile nav when a link inside it is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('is-active');
                mobileNavOverlay.classList.remove('open');
                body.classList.remove('no-scroll');
            });
        });
    }


    /*
    -----------------------------------------------------------------------------
    HERO HEADLINE WORD ANIMATION (IntersectionObserver)
    -----------------------------------------------------------------------------
    */

    /**
     * Animates hero headline words on intersection.
     */
    if (heroHeadline && heroWords.length > 0) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroHeadline.classList.add('revealed');
                    heroObserver.unobserve(entry.target); // Unobserve once animated
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of element is visible

        heroObserver.observe(heroHeadline);
    }


    /*
    -----------------------------------------------------------------------------
    THREE.JS HERO BACKGROUND ANIMATION
    -----------------------------------------------------------------------------
    */
    const heroCanvasContainer = document.getElementById('hero-canvas-container');

    if (heroCanvasContainer && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Alpha true for transparent background

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        heroCanvasContainer.appendChild(renderer.domElement);

        // Particle System (simple example)
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 5000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10; // x, y, z from -5 to 5
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.01,
            color: 0x6F42C1, // Purple accent
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false // Avoid particles obscuring each other incorrectly
        });

        const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleMesh);

        // Add some subtle moving shapes
        const geometry = new THREE.DodecahedronGeometry(0.5); // A 12-sided polygon
        const material = new THREE.MeshStandardMaterial({
            color: 0x00C2B8, // Cyan accent
            metalness: 0.7,
            roughness: 0.2,
            transparent: true,
            opacity: 0.5
        });
        const shapeCount = 10;
        const shapes = [];

        for (let i = 0; i < shapeCount; i++) {
            const shape = new THREE.Mesh(geometry, material);
            shape.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10 - 5 // Push some shapes back
            );
            shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            scene.add(shape);
            shapes.push(shape);
        }

        // Add subtle ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Add directional light for highlights
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);


        camera.position.z = 3;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Animate particles
            particleMesh.rotation.y += 0.0005;
            particleMesh.rotation.x += 0.0002;

            // Animate shapes
            shapes.forEach(shape => {
                shape.rotation.x += 0.001;
                shape.rotation.y += 0.0008;
                shape.position.y += 0.001; // Move shapes subtly
                if (shape.position.y > 5) shape.position.y = -5; // Reset if they go too high
            });


            renderer.render(scene, camera);
        };

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate(); // Start the animation loop
    }


    /*
    -----------------------------------------------------------------------------
    SCROLL-TRIGGERED CONTENT REVEAL (IntersectionObserver)
    -----------------------------------------------------------------------------
    */
    if (contentRevealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of element is visible
        });

        contentRevealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    /*
    -----------------------------------------------------------------------------
    SERVICE CARDS ANIMATION (GSAP & Custom Scroll Handling)
    -----------------------------------------------------------------------------
    */
    let currentCardIndex = 0;
    let isCardAnimating = false;
    let isServicesSectionActive = false;

    if (serviceCards.length > 0 && servicesSection) {
        // Hide all cards except the first one initially using GSAP for proper styling
        gsap.set(serviceCards, { opacity: 0, y: 50, zIndex: 1 });
        gsap.set(serviceCards[0], { opacity: 1, y: 0, zIndex: 2 }); // First card is active

        const servicesSectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isServicesSectionActive = entry.isIntersecting;
                if (isServicesSectionActive) {
                    // When the section becomes active, ensure the first card is visible
                    // and handle potential re-entry into the section
                    gsap.to(serviceCards[currentCardIndex], { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
                }
            });
        }, {
            rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of the viewport
            threshold: 0 // Observe as soon as it enters/leaves the rootMargin
        });

        servicesSectionObserver.observe(servicesSection);


        /**
         * Animates the transition between service cards.
         * @param {number} newIndex - The index of the card to show.
         * @param {string} direction - 'up' or 'down' for animation direction.
         */
        const animateCardTransition = (newIndex, direction) => {
            if (isCardAnimating || newIndex === currentCardIndex) return;

            isCardAnimating = true;
            const oldCard = serviceCards[currentCardIndex];
            const newCard = serviceCards[newIndex];

            const fromY = direction === 'down' ? 50 : -50;
            const toY = direction === 'down' ? -50 : 50;

            const tl = gsap.timeline({
                onComplete: () => {
                    isCardAnimating = false;
                    currentCardIndex = newIndex;
                    // Ensure the new card is fully visible and old card is hidden
                    gsap.set(oldCard, { opacity: 0, y: toY, zIndex: 1 });
                    gsap.set(newCard, { opacity: 1, y: 0, zIndex: 2 });
                }
            });

            // Animate old card out
            tl.to(oldCard, { opacity: 0, y: toY, duration: 0.5, ease: "power2.in" }, 0);

            // Animate new card in
            tl.fromTo(newCard,
                { opacity: 0, y: fromY, zIndex: 2 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.1 } // Small delay for stagger effect
            );
        };

        /**
         * Handles wheel scroll events for the service cards.
         * Prevents default scroll if within card range, otherwise allows natural scroll.
         * @param {WheelEvent} e - The wheel event.
         */
        const handleServiceCardScroll = (e) => {
            if (!isServicesSectionActive) return; // Only process if the service section is primarily in view

            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;

            // Check if user is at the first or last card boundary
            const atFirstCard = currentCardIndex === 0;
            const atLastCard = currentCardIndex === serviceCards.length - 1;

            let shouldPreventDefault = false; // Flag to control default scroll

            if (isScrollingDown) {
                if (atLastCard) {
                    // Allow natural scroll to the next section
                    shouldPreventDefault = false;
                } else {
                    // Scroll to the next card
                    e.preventDefault(); // Prevent page scroll
                    shouldPreventDefault = true;
                    if (!isCardAnimating) {
                        animateCardTransition(currentCardIndex + 1, 'down');
                    }
                }
            } else if (isScrollingUp) {
                if (atFirstCard) {
                    // Allow natural scroll to the previous section
                    shouldPreventDefault = false;
                } else {
                    // Scroll to the previous card
                    e.preventDefault(); // Prevent page scroll
                    shouldPreventDefault = true;
                    if (!isCardAnimating) {
                        animateCardTransition(currentCardIndex - 1, 'up');
                    }
                }
            }

            // Only prevent default if we're actively transitioning cards
            if (shouldPreventDefault && !isCardAnimating) {
                // If a transition is supposed to happen but isn't due to rapid scrolling,
                // still prevent default to avoid jitter until the animation starts
                e.preventDefault();
            }
        };

        // Attach the wheel event listener to the window
        // Use passive: false to allow e.preventDefault()
        window.addEventListener('wheel', handleServiceCardScroll, { passive: false });
    }


    /*
    -----------------------------------------------------------------------------
    ANIMATED COUNTERS (IntersectionObserver)
    -----------------------------------------------------------------------------
    */

    /**
     * Animates a number from 0 to a target value.
     * @param {HTMLElement} element - The DOM element to animate.
     * @param {number} target - The final number.
     * @param {number} duration - Animation duration in milliseconds.
     * @param {number} decimals - Number of decimal places for float targets.
     */
    const animateNumber = (element, target, duration, decimals = 0) => {
        let start = 0;
        const increment = target / (duration / 16); // ~60fps
        let current = 0;

        const step = () => {
            current += increment;
            if (current < target) {
                element.textContent = current.toFixed(decimals);
                requestAnimationFrame(step);
            } else {
                element.textContent = target.toFixed(decimals);
            }
        };
        requestAnimationFrame(step);
    };

    if (metricNumbers.length > 0) {
        const metricsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.metric-number').forEach(numElement => {
                        const target = parseFloat(numElement.dataset.target);
                        const isFloat = target % 1 !== 0; // Check if it's a float
                        animateNumber(numElement, target, 2000, isFloat ? 1 : 0); // 2 seconds duration
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

        const metricsSection = document.getElementById('metrics');
        if (metricsSection) {
            metricsObserver.observe(metricsSection);
        }
    }


    /*
    -----------------------------------------------------------------------------
    NAV LINK ACTIVATION ON SCROLL (IntersectionObserver)
    -----------------------------------------------------------------------------
    */

    /**
     * Activates the corresponding navigation link when a section enters the viewport.
     */
    const sections = document.querySelectorAll('main section[id]');
    const navActiveObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`.main-nav .nav-links a[data-section="${id}"]`);
            const mobileNavLink = document.querySelector(`.mobile-nav-links a[href="#${id}"]`);

            if (navLink) {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.3) { // When section is substantially in view
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                } else if (!entry.isIntersecting && window.scrollY < 100) { // If at top and no section intersecting
                    // Handle specific case for hero section being active at top
                    if (id === 'hero' && navLink.dataset.section === 'hero') {
                        navLinks.forEach(link => link.classList.remove('active'));
                        document.querySelector('.main-nav .nav-links a[data-section="hero"]').classList.add('active');
                    }
                }
            }
            if (mobileNavLink) {
                 if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                    mobileNavLinks.forEach(link => link.classList.remove('active'));
                    mobileNavLink.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: '-50% 0px -50% 0px', // When the section center crosses the viewport center
        threshold: 0
    });

    sections.forEach(section => {
        navActiveObserver.observe(section);
    });

    // Special handling for initial load or refreshing at top
    window.addEventListener('load', () => {
        if (window.scrollY < 100) { // If near the top on load
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector('.main-nav .nav-links a[data-section="hero"]').classList.add('active');
        }
    });


    /*
    -----------------------------------------------------------------------------
    CASE STUDY MODAL LOGIC
    -----------------------------------------------------------------------------
    */

    /**
     * Dynamically loads content into the modal based on case study ID.
     * In a real app, this would fetch content from an API or pre-defined object.
     * @param {string} caseStudyId - The ID of the case study.
     */
    const loadCaseStudyContent = (caseStudyId) => {
        let content = '';
        switch (caseStudyId) {
            case 'case-study-1':
                content = `
                    <h3>Revolutionizing Fintech with AI</h3>
                    <img src="https://placehold.co/800x450/37D5BB/FFFFFF?text=AI+Fintech+Solution" alt="AI Fintech Solution">
                    <p><strong>Challenge:</strong> Our client, a rapidly growing fintech startup, struggled with manual, time-consuming fraud detection and customer support processes, leading to high operational costs and slower response times.</p>
                    <p><strong>Solution:</strong> We developed a custom AI-powered platform integrating machine learning models for real-time fraud detection and a natural language processing (NLP) chatbot for automated customer inquiries.</p>
                    <p><strong>Results:</strong> The new system reduced manual fraud review time by 60% and improved response time for customer queries by 75%. This led to a 40% increase in overall transaction efficiency and significantly enhanced customer satisfaction.</p>
                    <p><strong>Technologies Used:</strong> Python, TensorFlow, scikit-learn, AWS SageMaker, Node.js, React.</p>
                `;
                break;
            case 'case-study-2':
                content = `
                    <h3>Seamless Cloud Migration for Enterprise</h3>
                    <img src="https://placehold.co/800x450/6F42C1/FFFFFF?text=Enterprise+Cloud+Migration" alt="Enterprise Cloud Migration">
                    <p><strong>Challenge:</strong> A large manufacturing enterprise with outdated on-premise infrastructure faced scalability issues, high maintenance costs, and limited data analytics capabilities.</p>
                    <p><strong>Solution:</strong> We designed and executed a phased cloud migration strategy to AWS, re-architecting their legacy applications for cloud-native performance. This involved migrating databases, modernizing APIs, and implementing robust security protocols.</p>
                    <p><strong>Results:</strong> The migration led to a 25% reduction in operational costs, improved system uptime to 99.99%, and provided the flexibility to scale resources on demand. Data processing capabilities were enhanced, enabling faster insights.</p>
                    <p><strong>Technologies Used:</strong> AWS (EC2, S3, RDS, Lambda, VPC), Docker, Kubernetes, Terraform.</p>
                `;
                break;
            case 'case-study-3':
                content = `
                    <h3>E-commerce Platform Redesign & Growth</h3>
                    <img src="https://placehold.co/800x450/00C2B8/FFFFFF?text=E-commerce+Redesign" alt="E-commerce Redesign">
                    <p><strong>Challenge:</strong> An established e-commerce business had an outdated platform with poor UX, slow loading times, and limited mobile responsiveness, leading to high bounce rates and low conversion.</p>
                    <p><strong>Solution:</strong> We completely redesigned their e-commerce platform with a focus on modern UI/UX principles, mobile-first responsiveness, and optimized performance. Integrated advanced product search, personalized recommendations, and streamlined checkout flows.</p>
                    <p><strong>Results:</strong> The new platform resulted in a 30% increase in conversion rates, 50% faster page load times, and a significant improvement in customer engagement and retention, boosting overall sales by 20% in the first quarter.</p>
                    <p><strong>Technologies Used:</strong> HTML5, CSS3, JavaScript (Vanilla), Shopify Plus API integration, SEO best practices.</p>
                `;
                break;
            default:
                content = '<h3>Case Study Not Found</h3><p>Apologies, the requested case study content is not available.</p>';
        }
        if (caseStudyModalBody) {
            caseStudyModalBody.innerHTML = content;
        }
    };

    if (caseStudyCards.length > 0 && caseStudyModalOverlay && closeModalBtn) {
        caseStudyCards.forEach(card => {
            card.addEventListener('click', () => {
                const modalTargetId = card.dataset.modalTarget;
                if (modalTargetId) {
                    loadCaseStudyContent(modalTargetId);
                    caseStudyModalOverlay.classList.add('open');
                    body.classList.add('no-scroll');
                }
            });
        });

        closeModalBtn.addEventListener('click', () => {
            caseStudyModalOverlay.classList.remove('open');
            body.classList.remove('no-scroll');
            // Clear content after closing
            if (caseStudyModalBody) {
                caseStudyModalBody.innerHTML = '';
            }
        });

        // Close modal if clicking outside the content
        caseStudyModalOverlay.addEventListener('click', (e) => {
            if (e.target === caseStudyModalOverlay) {
                caseStudyModalOverlay.classList.remove('open');
                body.classList.remove('no-scroll');
                if (caseStudyModalBody) {
                    caseStudyModalBody.innerHTML = '';
                }
            }
        });
    }

    /*
    -----------------------------------------------------------------------------
    TESTIMONIALS CAROUSEL
    -----------------------------------------------------------------------------
    */

    /**
     * Creates pagination dots for the carousel.
     */
    const createDots = () => {
        if (!carouselDotsContainer || !carouselInner) return;
        carouselDotsContainer.innerHTML = ''; // Clear existing dots
        const totalItems = carouselInner.children.length;
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            if (i === currentTestimonialIndex) {
                dot.classList.add('active');
            }
            dot.dataset.index = i;
            dot.addEventListener('click', () => showTestimonial(i));
            carouselDotsContainer.appendChild(dot);
        }
    };

    /**
     * Displays a specific testimonial slide and updates dots.
     * @param {number} index - The index of the testimonial to show.
     */
    const showTestimonial = (index) => {
        if (!carouselInner || !testimonialCarousel) return;

        const totalItems = carouselInner.children.length;
        if (index >= totalItems) {
            currentTestimonialIndex = 0;
        } else if (index < 0) {
            currentTestimonialIndex = totalItems - 1;
        } else {
            currentTestimonialIndex = index;
        }

        const offset = -currentTestimonialIndex * 100;
        carouselInner.style.transform = `translateX(${offset}%)`;

        // Update active class on items
        Array.from(carouselInner.children).forEach((item, idx) => {
            if (idx === currentTestimonialIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update active dot
        createDots(); // Recreate dots to ensure consistency
    };

    /**
     * Moves to the next testimonial.
     */
    const nextTestimonial = () => {
        showTestimonial(currentTestimonialIndex + 1);
    };

    /**
     * Moves to the previous testimonial.
     */
    const prevTestimonial = () => {
        showTestimonial(currentTestimonialIndex - 1);
    };

    /**
     * Starts the auto-slide for testimonials.
     */
    const startTestimonialAutoSlide = () => {
        testimonialInterval = setInterval(nextTestimonial, 7000); // Change slide every 7 seconds
    };

    /**
     * Stops the auto-slide for testimonials.
     */
    const stopTestimonialAutoSlide = () => {
        clearInterval(testimonialInterval);
    };

    if (testimonialCarousel && carouselInner) {
        // Initial setup
        showTestimonial(0);
        startTestimonialAutoSlide();

        // Event listeners for manual navigation
        if (prevBtn) prevBtn.addEventListener('click', () => {
            stopTestimonialAutoSlide();
            prevTestimonial();
            startTestimonialAutoSlide(); // Restart after manual interaction
        });
        if (nextBtn) nextBtn.addEventListener('click', () => {
            stopTestimonialAutoSlide();
            nextTestimonial();
            startTestimonialAutoSlide(); // Restart after manual interaction
        });

        // Swipe functionality for testimonials
        let startX;
        let isDragging = false;

        carouselInner.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            stopTestimonialAutoSlide();
        });

        carouselInner.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            // Prevent default to avoid scrolling the page while swiping carousel
            e.preventDefault();
            // Optional: Visually drag the carousel (can be complex with CSS transitions)
            // For now, just handle the end of the drag
        });

        carouselInner.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            const endX = e.changedTouches[0].clientX;
            const diffX = endX - startX;
            if (diffX > 50) { // Swiped right
                prevTestimonial();
            } else if (diffX < -50) { // Swiped left
                nextTestimonial();
            }
            isDragging = false;
            startTestimonialAutoSlide();
        });
    }


    /*
    -----------------------------------------------------------------------------
    INDUSTRIES HORIZONTAL SCROLL (SCROLL-JACKING EFFECT)
    -----------------------------------------------------------------------------
    */

    const industriesSection = document.getElementById('industries');
    const industriesPinnedContainer = document.querySelector('.industries-pinned-container');
    const industriesWrapper = document.querySelector('.industries-wrapper');

    if (industriesSection && industriesPinnedContainer && industriesWrapper) {
        let scrollTween; // To store the GSAP (or similar, if used) tween, or a custom scroll variable

        // Calculate the total scrollable width of the industries wrapper
        const getScrollWidth = () => {
            return industriesWrapper.scrollWidth - industriesPinnedContainer.offsetWidth;
        };

        const setupIndustriesScroll = () => {
            // Set the section height dynamically to allow for the horizontal scroll
            // This is crucial: the section needs to be tall enough to allow the user to scroll
            // enough for the horizontal content to fully reveal.
            const totalScrollableWidth = getScrollWidth();
            industriesSection.style.height = `${industriesPinnedContainer.offsetHeight + totalScrollableWidth}px`;
            // The height is the pinned container's height + the horizontal scrollable width.
            // This creates a "fake" vertical scroll that translates to horizontal movement.
        };

        // Initial setup and on resize
        setupIndustriesScroll();
        window.addEventListener('resize', setupIndustriesScroll);

        // Scroll logic (Vanilla JS approximation of scroll-jacking)
        window.addEventListener('scroll', () => {
            const sectionRect = industriesSection.getBoundingClientRect();
            const startScrollPoint = sectionRect.top + window.scrollY;
            const endScrollPoint = startScrollPoint + industriesSection.offsetHeight - window.innerHeight;

            if (window.scrollY >= startScrollPoint && window.scrollY <= endScrollPoint) {
                // User is scrolling within the "active" zone for horizontal scroll
                const scrollProgress = (window.scrollY - startScrollPoint) / (industriesSection.offsetHeight - window.innerHeight);
                const maxTranslate = getScrollWidth();
                const translateX = -scrollProgress * maxTranslate;
                industriesWrapper.style.transform = `translateX(${translateX}px)`;
            } else if (window.scrollY < startScrollPoint) {
                // Before the section, reset to 0
                industriesWrapper.style.transform = `translateX(0px)`;
            } else if (window.scrollY > endScrollPoint) {
                // After the section, snap to the end
                industriesWrapper.style.transform = `translateX(${-getScrollWidth()}px)`;
            }
        });
    }


    /*
    -----------------------------------------------------------------------------
    FLOATING STICKY CTA BAR & BACK-TO-TOP BUTTON
    -----------------------------------------------------------------------------
    */

    // Check localStorage for sticky CTA bar preference on page load
    const isStickyCtaHidden = localStorage.getItem('hideStickyCtaBar');
    if (stickyCtaBar && isStickyCtaHidden === 'true') {
        stickyCtaBar.style.display = 'none'; // Keep it hidden if user previously closed it
    }

    /**
     * Toggles visibility of sticky CTA bar and back-to-top button based on scroll.
     */
    const toggleFloatingElements = () => {
        // Only show if it hasn't been explicitly hidden by the user
        if (stickyCtaBar && localStorage.getItem('hideStickyCtaBar') !== 'true') {
            if (window.scrollY > window.innerHeight * 0.5) { // Show after scrolling past half of hero
                stickyCtaBar.classList.add('show');
            } else {
                stickyCtaBar.classList.remove('show');
            }
        }

        if (backToTopBtn) {
            if (window.scrollY > window.innerHeight * 0.5) { // Show after scrolling past half of hero
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    };

    window.addEventListener('scroll', toggleFloatingElements);
    toggleFloatingElements(); // Initial call

    // Back to Top button functionality
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // New: Sticky CTA Bar Close Button Logic
    if (closeStickyCtaBtn && stickyCtaBar) {
        closeStickyCtaBtn.addEventListener('click', () => {
            stickyCtaBar.classList.remove('show'); // Trigger the slide-out/fade-out transition
            // After the transition, hide the element completely and save preference
            stickyCtaBar.addEventListener('transitionend', () => {
                stickyCtaBar.style.display = 'none';
                localStorage.setItem('hideStickyCtaBar', 'true');
            }, { once: true }); // Ensure this listener runs only once
        });
    }


    /*
    -----------------------------------------------------------------------------
    CONTACT FORM SUBMISSION (MOCK)
    -----------------------------------------------------------------------------
    */

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Simulate form submission
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Clear previous message
            formMessage.style.display = 'none';
            formMessage.classList.remove('success', 'error');

            // Simple validation
            if (!name || !email || !subject || !message) {
                formMessage.textContent = 'Please fill in all fields.';
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
                return;
            }

            // Simulate API call delay
            // In a real scenario, you would send this data to a backend server.
            // Example: fetch('/api/contact', { method: 'POST', body: formData })
            try {
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

                // Simulate success
                formMessage.textContent = 'Thank you for your message! We will get back to you shortly.';
                formMessage.classList.add('success');
                contactForm.reset(); // Clear form fields on success

            } catch (error) {
                console.error('Contact form submission error:', error);
                formMessage.textContent = 'Oops! Something went wrong. Please try again later.';
                formMessage.classList.add('error');
            } finally {
                formMessage.style.display = 'block';
            }
        });
    }

    /*
    -----------------------------------------------------------------------------
    AI CHATBOT LOGIC
    -----------------------------------------------------------------------------
    */

    if (chatbotToggleBtn && chatbotWindow && closeChatbotBtn && chatbotInput && chatbotSendBtn && chatbotBody) {
        // Toggle chatbot window
        chatbotToggleBtn.addEventListener('click', () => {
            chatbotWindow.classList.toggle('open');
        });

        closeChatbotBtn.addEventListener('click', () => {
            chatbotWindow.classList.remove('open');
        });

        /**
         * Adds a message to the chatbot body.
         * @param {string} text - The message text.
         * @param {string} sender - 'user' or 'bot'.
         */
        const addMessage = (text, sender) => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', sender);

            const avatarDiv = document.createElement('div');
            avatarDiv.classList.add('avatar');
            avatarDiv.textContent = sender === 'bot' ? '🤖' : '👤'; // Bot or user avatar

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('message-content');
            contentDiv.textContent = text;

            const timestampDiv = document.createElement('span');
            timestampDiv.classList.add('timestamp');
            timestampDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(timestampDiv); // Add timestamp

            chatbotBody.appendChild(messageDiv);
            chatbotBody.scrollTop = chatbotBody.scrollHeight; // Scroll to bottom
        };

        /**
         * Simulates bot typing indicator.
         * @returns {HTMLElement} The typing indicator element.
         */
        const showTypingIndicator = () => {
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('message', 'bot', 'typing-indicator');

            const avatarDiv = document.createElement('div');
            avatarDiv.classList.add('avatar');
            avatarDiv.textContent = '🤖';

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('message-content');
            contentDiv.textContent = 'Bot is typing...';

            typingDiv.appendChild(avatarDiv);
            typingDiv.appendChild(contentDiv);

            chatbotBody.appendChild(typingDiv);
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
            return typingDiv;
        };

        /**
         * Removes the typing indicator.
         * @param {HTMLElement} indicator - The typing indicator element to remove.
         */
        const removeTypingIndicator = (indicator) => {
            if (indicator && chatbotBody.contains(indicator)) {
                chatbotBody.removeChild(indicator);
            }
        };

        /**
         * Simulates a bot response or calls an LLM.
         * @param {string} userMessage - The user's message.
         */
        const getBotResponse = async (userMessage) => {
            const typingIndicator = showTypingIndicator();
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500)); // Simulate typing delay

            let botResponse = "I'm sorry, I couldn't understand that. Please try rephrasing or choose from the pre-filled topics.";

            // Basic keyword-based responses
            if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
                botResponse = "Hello! How can I assist you today?";
            } else if (userMessage.toLowerCase().includes('services')) {
                botResponse = "We offer a range of services including Software Development, Cloud Transformation, AI & ML Solutions, and Digital Marketing Strategy. Which one are you interested in?";
            } else if (userMessage.toLowerCase().includes('contact')) {
                botResponse = "You can reach us via email at info@itsolutions.com or call us at +1 (234) 567-890. You can also fill out the contact form on our website.";
            } else if (userMessage.toLowerCase().includes('audit') || userMessage.toLowerCase().includes('free consultation')) {
                botResponse = "Yes, we offer a free audit to assess your current technology landscape and identify areas for improvement. Would you like to book one?";
            } else if (userMessage.toLowerCase().includes('thank you')) {
                botResponse = "You're welcome! Is there anything else I can help you with?";
            }

            // Simulate LLM API call for more advanced responses (this part is mock)
            // In a real application, you would make a fetch call to a backend that then calls the Gemini API.
            /*
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // Canvas will provide this in runtime
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    botResponse = result.candidates[0].content.parts[0].text;
                }
            } catch (error) {
                console.error("Error calling Gemini API:", error);
                botResponse = "I'm having trouble connecting to my knowledge base right now. Please try again later.";
            }
            */

            removeTypingIndicator(typingIndicator);
            addMessage(botResponse, 'bot');
        };

        // Handle sending messages
        const sendMessage = () => {
            const message = chatbotInput.value.trim();
            if (message) {
                addMessage(message, 'user');
                chatbotInput.value = '';
                getBotResponse(message);
            }
        };

        chatbotSendBtn.addEventListener('click', sendMessage);

        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Handle pre-filled topic buttons
        prefilledTopicBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const topic = btn.dataset.topic;
                let predefinedMessage = '';
                switch (topic) {
                    case 'services':
                        predefinedMessage = "Tell me about your services.";
                        break;
                    case 'contact':
                        predefinedMessage = "How can I contact you?";
                        break;
                    case 'audit':
                        predefinedMessage = "I'm interested in a free audit.";
                        break;
                    default:
                        predefinedMessage = "Hello!"; // Fallback
                }
                addMessage(predefinedMessage, 'user');
                getBotResponse(predefinedMessage);
            });
        });
    }


}); // End DOMContentLoaded

