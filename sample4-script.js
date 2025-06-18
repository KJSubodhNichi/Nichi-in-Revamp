// Ensure the DOM is fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle Functionality ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Load theme preference from localStorage or default to light
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
    } else {
        // Default to dark mode if user's system preference is dark
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-mode');
        } else {
            body.classList.add('light-mode'); // Explicitly add light-mode if default
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        }
    });

    // --- Mobile Navigation Toggle ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
        // Prevent body scrolling when mobile menu is open
        document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    });

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust scroll position to account for fixed header
                const headerOffset = document.querySelector('.main-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // Added 20px extra padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll-based Active Link Highlight ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav .nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px', // Adjust these values as needed
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.section === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Section Reveal Animations (IntersectionObserver) ---
    const contentRevealElements = document.querySelectorAll('.content-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        root: null,
        threshold: 0.1, // Element is 10% visible
        rootMargin: '0px 0px -10% 0px' // Slightly delay reveal until more visible
    });

    contentRevealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // --- Back-to-Top Button ---
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) { // Show button after scrolling 300px
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Animated Metrics Counter ---
    const metricNumbers = document.querySelectorAll('.metric-number');
    let metricsAnimated = false; // Flag to ensure animation runs only once

    const animateNumber = (element, target) => {
        const duration = 2000; // 2 seconds
        let start = 0;
        let increment;

        // Handle decimal numbers for SLA
        if (target.toString().includes('.')) {
            increment = target / (duration / 10); // Adjust increment for speed
            let currentValue = 0;
            const interval = setInterval(() => {
                currentValue += increment;
                if (currentValue >= target) {
                    element.textContent = target.toFixed(1); // Keep one decimal place
                    clearInterval(interval);
                } else {
                    element.textContent = currentValue.toFixed(1);
                }
            }, 10);
        } else {
            const range = target - start;
            let current = start;
            const stepTime = Math.abs(Math.floor(duration / range));

            const timer = setInterval(() => {
                current += 1;
                element.textContent = current;
                if (current === target) {
                    clearInterval(timer);
                }
            }, stepTime);
        }
    };

    const metricsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !metricsAnimated) {
                metricNumbers.forEach(number => {
                    const target = parseFloat(number.dataset.target);
                    animateNumber(number, target);
                });
                metricsAnimated = true; // Set flag to true after animation
                observer.unobserve(entry.target); // Stop observing
            }
        });
    }, {
        root: null,
        threshold: 0.5 // Trigger when 50% of the element is visible
    });

    const metricsSection = document.getElementById('metrics');
    if (metricsSection) {
        metricsObserver.observe(metricsSection);
    }


    // --- Testimonials Carousel ---
    const carouselInner = document.querySelector('.testimonial-carousel .carousel-inner');
    const testimonials = document.querySelectorAll('.testimonial-carousel .testimonial-item');
    const prevBtn = document.querySelector('.testimonial-carousel .prev-btn');
    const nextBtn = document.querySelector('.testimonial-carousel .next-btn');
    const carouselDotsContainer = document.querySelector('.testimonial-carousel .carousel-dots');
    let currentIndex = 0;
    let autoSlideInterval;
    const slideDuration = 5000; // 5 seconds for auto-slide

    // Create dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoSlide();
        });
        carouselDotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.testimonial-carousel .carousel-dots .dot');

    function goToSlide(index) {
        if (index < 0) {
            index = testimonials.length - 1;
        } else if (index >= testimonials.length) {
            index = 0;
        }
        carouselInner.style.transform = `translateX(-${index * 100}%)`;
        testimonials.forEach((item, i) => {
            item.classList.remove('active');
            dots[i].classList.remove('active');
        });
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, slideDuration);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide(); // Start auto-sliding on load

    // Swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carouselInner.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        clearInterval(autoSlideInterval); // Stop auto-slide on touch
    });

    carouselInner.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    });

    carouselInner.addEventListener('touchend', () => {
        if (touchEndX < touchStartX - 50) { // Swiped left
            nextSlide();
        }
        if (touchEndX > touchStartX + 50) { // Swiped right
            prevSlide();
        }
        startAutoSlide(); // Resume auto-slide after touch
    });


    // --- Case Study Modals ---
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    const modalOverlay = document.getElementById('case-study-modal-overlay');
    const closeModalBtn = modalOverlay.querySelector('.close-modal-btn');
    const modalBody = document.getElementById('case-study-modal-body');

    const caseStudyContent = {
        'case-study-1': {
            title: 'Revolutionizing Fintech with AI',
            image: 'https://placehold.co/800x450/37D5BB/FFFFFF?text=AI+Fintech+Solution',
            content: `
                <p><strong>Challenge:</strong> A leading fintech firm struggled with manual, time-consuming data processing and fraud detection, leading to high operational costs and delayed responses.</p>
                <p><strong>Solution:</strong> IT Solutions Inc. developed and implemented a sophisticated AI-powered platform leveraging machine learning algorithms for real-time transaction analysis and predictive fraud identification. This included integrating natural language processing (NLP) for automated customer support interactions.</p>
                <p><strong>Results:</strong> The new platform achieved a 40% increase in transaction processing efficiency, a 60% reduction in false-positive fraud alerts, and significantly improved customer satisfaction due to faster response times. The client reported a 20% decrease in operational expenses within the first six months.</p>
                <p><strong>Key Technologies:</strong> Python, TensorFlow, AWS SageMaker, Apache Kafka, PostgreSQL, RESTful APIs.</p>
            `
        },
        'case-study-2': {
            title: 'Seamless Cloud Migration for Enterprise',
            image: 'https://placehold.co/800x450/6F42C1/FFFFFF?text=Enterprise+Cloud+Migration',
            content: `
                <p><strong>Challenge:</strong> A large manufacturing enterprise relied on an aging on-premise infrastructure, hindering scalability, increasing maintenance burden, and posing security risks.</p>
                <p><strong>Solution:</strong> Our team executed a comprehensive lift-and-shift followed by a refactoring strategy to migrate the client's critical applications and data to a multi-cloud environment (AWS and Azure). We implemented robust security protocols, disaster recovery plans, and automated CI/CD pipelines.</p>
                <p><strong>Results:</strong> The migration led to a 25% reduction in IT operational costs, enhanced system reliability with 99.99% uptime, and improved agility for deploying new features. Data retrieval times were reduced by 35%, empowering faster decision-making across departments.</p>
                <p><strong>Key Technologies:</strong> AWS (EC2, S3, RDS, Lambda), Azure (VMs, Blob Storage, Azure Functions), Docker, Kubernetes, Terraform, Jenkins.</p>
            `
        },
        'case-study-3': {
            title: 'E-commerce Platform Redesign & Growth',
            image: 'https://placehold.co/800x450/00C2B8/FFFFFF?text=E-commerce+Platform+Success',
            content: `
                <p><strong>Challenge:</strong> An established e-commerce business faced declining user engagement and conversion rates due to an outdated website design and slow performance.</p>
                <p><strong>Solution:</strong> We undertook a complete redesign and re-platforming of their e-commerce site, focusing on intuitive UX/UI, mobile responsiveness, and performance optimization. We integrated advanced analytics, personalized recommendation engines, and streamlined the checkout process.</p>
                <p><strong>Results:</strong> The new platform led to a remarkable 30% increase in conversion rates, a 50% improvement in page load speeds, and a 20% rise in average order value. Customer feedback was overwhelmingly positive, noting the improved shopping experience.</p>
                <p><strong>Key Technologies:</strong> React.js, Node.js, MongoDB, Shopify API, Google Analytics, A/B Testing tools.</p>
            `
        }
    };

    caseStudyCards.forEach(card => {
        card.addEventListener('click', () => {
            const target = card.dataset.modalTarget;
            const data = caseStudyContent[target];
            if (data) {
                modalBody.innerHTML = `
                    <img src="${data.image}" alt="${data.title}">
                    <h3>${data.title}</h3>
                    ${data.content}
                `;
                modalOverlay.classList.add('active');
                body.style.overflow = 'hidden'; // Disable scrolling
            }
        });
    });

    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        body.style.overflow = ''; // Re-enable scrolling
    });

    // Close modal if clicked outside content
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            body.style.overflow = '';
        }
    });


    // --- Sticky Marketing CTA Bar ---
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    const heroSection = document.getElementById('hero');

    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                stickyCtaBar.classList.add('show'); // Show when hero is out of view
            } else {
                stickyCtaBar.classList.remove('show'); // Hide when hero is in view
            }
        });
    }, {
        root: null,
        threshold: 0.5 // When 50% of hero is no longer visible
    });

    if (heroSection) {
        ctaObserver.observe(heroSection);
    }


    // --- AI Chatbot Simulation ---
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbotBtn = document.querySelector('.close-chatbot-btn');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotBody = document.querySelector('.chatbot-body');
    const topicButtons = document.querySelectorAll('.topic-btn');

    const botResponses = {
        'services': "We offer a range of services including Software Development, Cloud Transformation, AI Solutions, and Digital Marketing Strategy. Which one are you interested in?",
        'contact': "You can reach us via email at info@itsolutions.com or call us at +1 (234) 567-890. Our office is at 123 Tech Avenue, Innovation City, CA.",
        'audit': "A Free Audit involves a comprehensive review of your current IT infrastructure and digital strategy to identify areas for improvement. Would you like to schedule one?",
        'default': "I'm sorry, I didn't quite understand that. Could you please rephrase or ask about one of our main topics (Services, Contact, Free Audit)?",
        'thank you': "You're welcome! Is there anything else I can assist you with?",
        'hi': "Hello! How can I help you today?",
        'hello': "Hello! How can I help you today?",
        'how are you': "I'm an AI, so I don't have feelings, but I'm ready to assist you! How can I help you today?",
        'bye': "Goodbye! Have a great day.",
        'what do you do': "I'm an AI assistant for IT Solutions Inc. I can provide information about our services, contact details, and more.",
        'schedule audit': "Great! To schedule a free audit, please visit our 'Contact' section and fill out the form, or provide your email here and we'll reach out."
    };

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatbotBody.appendChild(messageDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight; // Scroll to bottom
    }

    function handleUserInput(message) {
        addMessage(message, 'user');
        const lowerCaseMessage = message.toLowerCase();
        let botResponse = botResponses['default'];

        if (lowerCaseMessage.includes('services') || lowerCaseMessage.includes('solutions')) {
            botResponse = botResponses['services'];
        } else if (lowerCaseMessage.includes('contact') || lowerCaseMessage.includes('reach out')) {
            botResponse = botResponses['contact'];
        } else if (lowerCaseMessage.includes('audit') || lowerCaseMessage.includes('free audit') || lowerCaseMessage.includes('schedule audit')) {
            botResponse = botResponses['audit'];
            if (lowerCaseMessage.includes('schedule')) {
                 botResponse = botResponses['schedule audit'];
            }
        } else if (lowerCaseMessage.includes('thank you') || lowerCaseMessage.includes('thanks')) {
            botResponse = botResponses['thank you'];
        } else if (lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hello')) {
            botResponse = botResponses['hi'];
        } else if (lowerCaseMessage.includes('how are you')) {
            botResponse = botResponses['how are you'];
        } else if (lowerCaseMessage.includes('bye') || lowerCaseMessage.includes('goodbye')) {
            botResponse = botResponses['bye'];
        } else if (lowerCaseMessage.includes('what do you do') || lowerCaseMessage.includes('your purpose')) {
            botResponse = botResponses['what do you do'];
        }

        setTimeout(() => {
            addMessage(botResponse, 'bot');
        }, 500); // Simulate bot typing delay
    }

    chatbotToggleBtn.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        // Optional: Pre-fill first message if needed, or keep it static in HTML
    });

    closeChatbotBtn.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    chatbotSendBtn.addEventListener('click', () => {
        const message = chatbotInput.value.trim();
        if (message) {
            handleUserInput(message);
            chatbotInput.value = '';
        }
    });

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            chatbotSendBtn.click();
        }
    });

    topicButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.dataset.topic;
            handleUserInput(topic);
        });
    });


    // --- Three.js for Hero Background ---
    const heroCanvasContainer = document.getElementById('hero-canvas-container');

    if (heroCanvasContainer && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Alpha for transparent background
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        heroCanvasContainer.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Soft white light
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x6F42C1, 1); // Purple light
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x00C2B8, 1); // Cyan light
        pointLight2.position.set(-5, -5, -5);
        scene.add(pointLight2);

        // Geometry (Abstract shapes - particles and a rotating object)
        // Particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const color1 = new THREE.Color(0x6F42C1); // Purple
        const color2 = new THREE.Color(0x00C2B8); // Cyan

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 50; // x
            positions[i + 1] = (Math.random() - 0.5) * 50; // y
            positions[i + 2] = (Math.random() - 0.5) * 50; // z

            const color = Math.random() > 0.5 ? color1 : color2;
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Rotating Abstract Shape (e.g., a Dodecahedron)
        const geometry = new THREE.DodecahedronGeometry(3);
        const material = new THREE.MeshPhongMaterial({
            color: 0x37D5BB, // Green accent
            emissive: 0x111111,
            shininess: 100,
            transparent: true,
            opacity: 0.8,
            specular: 0xcccccc
        });
        const dodecahedron = new THREE.Mesh(geometry, material);
        scene.add(dodecahedron);

        camera.position.z = 10;

        // Mouse interaction for camera rotation
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            if (dodecahedron) {
                dodecahedron.rotation.y += 0.005;
                dodecahedron.rotation.x += 0.002;
            }
            if (particles) {
                particles.rotation.y += 0.001;
                particles.rotation.x += 0.0005;
            }

            camera.rotation.y += (targetX - camera.rotation.y) * 0.05;
            camera.rotation.x += (targetY - camera.rotation.x) * 0.05;

            renderer.render(scene, camera);
        };

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate(); // Start the animation
    } else {
        // Fallback for Three.js if not loaded or container missing
        if (heroCanvasContainer) {
            heroCanvasContainer.innerHTML = '<div style="background: linear-gradient(45deg, #6F42C1, #00C2B8); width: 100%; height: 100%;"></div>';
            heroCanvasContainer.style.position = 'absolute';
            heroCanvasContainer.style.top = '0';
            heroCanvasContainer.style.left = '0';
            heroCanvasContainer.style.zIndex = '1';
            heroCanvasContainer.style.opacity = '0.7';
        }
    }
});
