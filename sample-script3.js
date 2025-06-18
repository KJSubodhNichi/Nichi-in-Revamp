// Theme toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", html.dataset.theme);
});

// Set initial theme from localStorage
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.dataset.theme = savedTheme;

// === Hero Slider Functionality ===
const heroSlides = document.querySelectorAll(".hero-slide");
const sliderNavPrevBtn = document.querySelector(".slider-nav-btn.prev");
const sliderNavNextBtn = document.querySelector(".slider-nav-btn.next");
const heroSliderDotsContainer = document.querySelector(".hero-slider .slider-dots"); // Specific selector for hero slider dots
let currentSlide = 0;
let slideInterval;

// Create dots for the hero slider dynamically
heroSlides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.dataset.slide = index; // Store slide index
    heroSliderDotsContainer.appendChild(dot);
});

const heroSliderDots = document.querySelectorAll(".hero-slider .slider-dots .dot"); // Specific selector for hero slider dots

function showSlide(index) {
    // Hide all slides and deactivate all dots
    heroSlides.forEach(slide => slide.classList.remove("active"));
    heroSliderDots.forEach(dot => dot.classList.remove("active"));
    
    // Show the selected slide and activate the corresponding dot
    if (heroSlides[index]) {
        heroSlides[index].classList.add("active");
    }
    if (heroSliderDots[index]) {
        heroSliderDots[index].classList.add("active");
    }
    currentSlide = index;
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % heroSlides.length;
    showSlide(nextIndex);
}

function prevSlide() {
    const prevIndex = (currentSlide - 1 + heroSlides.length) % heroSlides.length; // Ensure positive index
    showSlide(prevIndex);
}

// Auto-advance slides
function startSlideShow() {
    // Clear any existing interval to prevent multiple intervals running
    clearInterval(slideInterval); 
    slideInterval = setInterval(nextSlide, 6000); // Change slide every 6 seconds
}

// Initialize slider and start slideshow
showSlide(0);
startSlideShow();

// Navigation arrows event listeners
if (sliderNavNextBtn) {
    sliderNavNextBtn.addEventListener("click", () => {
        clearInterval(slideInterval); // Stop auto-advance when manually navigating
        nextSlide();
        startSlideShow(); // Restart auto-advance after manual navigation
    });
}

if (sliderNavPrevBtn) {
    sliderNavPrevBtn.addEventListener("click", () => {
        clearInterval(slideInterval); // Stop auto-advance when manually navigating
        prevSlide();
        startSlideShow(); // Restart auto-advance after manual navigation
    });
}

// Dot navigation event listeners for hero slider
heroSliderDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        clearInterval(slideInterval); // Stop auto-advance when manually navigating
        showSlide(index);
        startSlideShow(); // Restart auto-advance after manual navigation
    });
});


// === Chat Assistant ===
const chatToggle = document.querySelector(".chat-toggle");
const chatWindow = document.querySelector(".chat-window");
const closeChat = document.querySelector(".close-chat");
const sendButton = document.getElementById("sendChat");
const chatInput = document.getElementById("chatInput");
const chatBody = document.getElementById("chatBody");

// AI Chatbot predefined responses
const chatResponses = {
    "hi": "Hi there! How can I assist you with your IT or digital transformation needs today?",
    "hello": "Hello! What can NichiBot help you with?",
    "services": "We offer a wide range of services including AI & Machine Learning, Cloud Transformation, Cybersecurity, Digital Marketing, and Custom Software Development. Which one interests you most?",
    "ai": "Our AI solutions leverage cutting-edge machine learning for automation, predictive analytics, and enhanced decision-making. Would you like to know more about a specific AI application?",
    "cloud": "Our Cloud Transformation services ensure seamless migration and optimization to scalable cloud environments, boosting agility and cost-efficiency. Are you interested in AWS, Azure, or Google Cloud?",
    "cybersecurity": "We provide robust cybersecurity frameworks and proactive threat intelligence to protect your critical assets. Are you facing specific security challenges?",
    "digital marketing": "Our data-driven digital marketing strategies cover SEO, SEM, content marketing, and social media to maximize your online visibility. What are your marketing goals?",
    "erp": "We specialize in ERP solutions, particularly Odoo, to centralize your operations and improve efficiency. Are you looking to integrate legacy systems or optimize workflows?",
    "demo": "Great! You can schedule a demo directly from our website. Would you like me to open the 'Schedule a Demo' modal for you?",
    "case study": "We have several transformative case studies across various industries. Which industry or service area are you most interested in?",
    "careers": "Interested in joining our team? Visit our Careers page for current openings and learn about our culture. What kind of role are you looking for?",
    "contact": "You can reach us via our Contact Us form, email us at info@nichiin.com, or call us at +91 80 XXXXXXX. How would you prefer to get in touch?",
    "thank you": "You're welcome! Is there anything else I can assist you with?",
    "bye": "Goodbye! Have a great day.",
    "default": "I'm not sure I understood that. Can you rephrase or ask about topics like 'services', 'AI', 'cloud', 'cybersecurity', 'ERP', 'demo', or 'careers'?"
};

if (chatToggle) {
  chatToggle.addEventListener("click", () => {
    chatWindow.style.display = chatWindow.style.display === "flex" ? "none" : "flex";
    if (chatWindow.style.display === "flex") {
      chatInput.focus();
    }
  });
}

if (closeChat) {
  closeChat.addEventListener("click", () => {
    chatWindow.style.display = "none";
  });
}

if (sendButton) {
    sendButton.addEventListener("click", sendMessage);
}
if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
}

function displayBotMessage(text) {
    const botMessage = document.createElement("p");
    botMessage.classList.add("bot-message");
    
    // Simulate typing indicator
    const typingSpan = document.createElement("span");
    typingSpan.innerHTML = `<strong>NichiBot:</strong> <span class="typing-indicator"></span><span class="typing-indicator"></span><span class="typing-indicator"></span>`;
    chatBody.appendChild(typingSpan);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
        chatBody.removeChild(typingSpan); // Remove typing indicator
        botMessage.innerHTML = `<strong>NichiBot:</strong> ${text}`;
        chatBody.appendChild(botMessage);
        chatBody.scrollTop = chatBody.scrollHeight; // Scroll to bottom of chat
    }, 1500); // Simulate 1.5 seconds of typing
}

function sendMessage() {
  const message = chatInput.value.trim();
  if (message && chatBody) {
    // Add user message
    const userMessage = document.createElement("p");
    userMessage.classList.add("user-message"); // Add class for styling
    userMessage.innerHTML = `<strong>You:</strong> ${message}`;
    chatBody.appendChild(userMessage);
    
    // Clear input
    chatInput.value = "";
    
    // Determine bot response
    let botReply = chatResponses["default"];
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes("hi") || lowerCaseMessage.includes("hello")) {
        botReply = chatResponses["hi"];
    } else if (lowerCaseMessage.includes("services")) {
        botReply = chatResponses["services"];
    } else if (lowerCaseMessage.includes("ai") || lowerCaseMessage.includes("artificial intelligence")) {
        botReply = chatResponses["ai"];
    } else if (lowerCaseMessage.includes("cloud")) {
        botReply = chatResponses["cloud"];
    } else if (lowerCaseMessage.includes("cybersecurity") || lowerCaseMessage.includes("security")) {
        botReply = chatResponses["cybersecurity"];
    } else if (lowerCaseMessage.includes("marketing") || lowerCaseMessage.includes("digital marketing")) {
        botReply = chatResponses["digital marketing"];
    } else if (lowerCaseMessage.includes("erp") || lowerCaseMessage.includes("odoo")) {
        botReply = chatResponses["erp"];
    } else if (lowerCaseMessage.includes("demo") || lowerCaseMessage.includes("consultation") || lowerCaseMessage.includes("meeting")) {
        botReply = chatResponses["demo"];
        // Optionally, trigger the booking modal here
        setTimeout(() => openBookingModal(), 2000); 
    } else if (lowerCaseMessage.includes("case study") || lowerCaseMessage.includes("success stories")) {
        botReply = chatResponses["case study"];
    } else if (lowerCaseMessage.includes("careers") || lowerCaseMessage.includes("job")) {
        botReply = chatResponses["careers"];
    } else if (lowerCaseMessage.includes("contact")) {
        botReply = chatResponses["contact"];
    } else if (lowerCaseMessage.includes("thank you") || lowerCaseMessage.includes("thanks")) {
        botReply = chatResponses["thank you"];
    } else if (lowerCaseMessage.includes("bye") || lowerCaseMessage.includes("goodbye")) {
        botReply = chatResponses["bye"];
    }

    displayBotMessage(botReply);
    
    chatBody.scrollTop = chatBody.scrollHeight; // Scroll to bottom immediately after user sends message
  }
}

// === Testimonials Carousel ===
const testimonials = document.querySelectorAll(".testimonial");
const testimonialDotsContainer = document.querySelector(".testimonial-nav .slider-dots-container"); // Specific selector for testimonial dots container
let tIndex = 0;

// Create dots for testimonials dynamically
if (testimonialDotsContainer) {
    testimonials.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        dot.dataset.testimonial = index; // Store testimonial index
        dot.addEventListener("click", () => showTestimonial(index));
        testimonialDotsContainer.appendChild(dot);
    });
}

const testimonialDots = document.querySelectorAll(".testimonial-nav .slider-dots-container .dot"); // Specific selector for testimonial dots

function showTestimonial(index) {
    if (testimonials[tIndex]) {
        testimonials[tIndex].classList.remove("active");
    }
    if (testimonialDots[tIndex]) {
        testimonialDots[tIndex].classList.remove("active");
    }
    
    tIndex = index;
    if (testimonials[tIndex]) {
        testimonials[tIndex].classList.add("active");
    }
    if (testimonialDots[tIndex]) {
        testimonialDots[tIndex].classList.add("active");
    }
}

// Auto-cycling testimonials
setInterval(() => {
    if (testimonials[tIndex]) {
        testimonials[tIndex].classList.remove("active");
    }
    if (testimonialDots[tIndex]) {
        testimonialDots[tIndex].classList.remove("active");
    }
    tIndex = (tIndex + 1) % testimonials.length;
    if (testimonials[tIndex]) {
        testimonials[tIndex].classList.add("active");
    }
    if (testimonialDots[tIndex]) {
        testimonialDots[tIndex].classList.add("active");
    }
}, 5000);

// Navigation buttons for testimonials
const testimonialNavPrevBtn = document.querySelector(".testimonial-nav .prev");
const testimonialNavNextBtn = document.querySelector(".testimonial-nav .next");

if (testimonialNavPrevBtn) {
    testimonialNavPrevBtn.addEventListener("click", () => {
        showTestimonial((tIndex - 1 + testimonials.length) % testimonials.length);
    });
}

if (testimonialNavNextBtn) {
    testimonialNavNextBtn.addEventListener("click", () => {
        showTestimonial((tIndex + 1) % testimonials.length);
    });
}


// === Scroll Reveal Animation ===
const revealElements = document.querySelectorAll(".reveal-on-scroll");

function checkReveal() {
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    // If the element is in the viewport (or slightly above for pre-loading effect)
    if (elementTop < windowHeight - 100) {
      element.classList.add("visible");
    } else {
        // Optional: Remove 'visible' class if element scrolls out of view upwards
        // element.classList.remove("visible"); // Commented out to keep elements visible once revealed
    }
  });
}

// Initial check on page load
window.addEventListener("load", checkReveal);

// Check on scroll
window.addEventListener("scroll", checkReveal);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute("href");
    if (targetId === "#") return; // Avoid scrolling for empty href="#"
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // Offset for sticky header if needed
      const header = document.querySelector('.site-header');
      const headerHeight = header ? header.offsetHeight : 0; // Get header height, default to 0 if not found
      
      window.scrollTo({
        top: targetElement.offsetTop - headerHeight - 20, // Adjust 20px for extra padding
        behavior: "smooth"
      });
    }
  });
});

// Header scroll effect (add shadow and shrink when scrolled)
window.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  if (header) { // Ensure header exists
    if (window.scrollY > 50) { // Add shadow after scrolling 50px
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
});


// === Animated KPI Counters ===
const kpiCounters = document.querySelectorAll(".kpi-counter");

function animateCounter(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counterElement = entry.target;
            const target = parseFloat(counterElement.dataset.target);
            const duration = 2000; // 2 seconds
            let start = 0;
            let increment = target / (duration / 10); // Increment every 10ms

            const updateCounter = () => {
                start += increment;
                if (start < target) {
                    counterElement.textContent = Math.round(start);
                    requestAnimationFrame(updateCounter);
                } else {
                    counterElement.textContent = target % 1 === 0 ? target : target.toFixed(2); // Display integer or float
                }
            };
            updateCounter();
            observer.unobserve(counterElement); // Stop observing once animated
        }
    });
}

const counterObserver = new IntersectionObserver(animateCounter, {
    threshold: 0.7 // Trigger when 70% of the element is visible
});

kpiCounters.forEach(counter => {
    counterObserver.observe(counter);
});


// === Solution Configurator Logic ===
const industrySelect = document.getElementById("industrySelect");
const challengeSelect = document.getElementById("challengeSelect");
const configuratorOutput = document.getElementById("configuratorOutput");

const solutionData = {
    "healthcare": {
        "data-security": "<h3>Healthcare Data Security & Compliance Solution</h3><p>Implement a HIPAA-compliant cloud infrastructure with advanced encryption, access controls, and regular security audits to safeguard patient data. Includes training for staff on data privacy best practices.</p>",
        "operational-efficiency": "<h3>Healthcare Operational Efficiency Suite (AI-powered)</h3><p>Integrate AI-driven patient scheduling, automated billing, and smart resource allocation. This optimizes clinic workflows, reduces waiting times, and improves staff productivity.</p>",
        "customer-engagement": "<h3>Personalized Patient Engagement Platform</h3><p>Develop a secure mobile app for patients to access health records, book appointments, receive personalized health tips, and communicate with care providers, boosting satisfaction.</p>",
        "legacy-systems": "<h3>Healthcare Legacy System Modernization</h3><p>Migrate outdated on-premise EMR/EHR systems to a modern, scalable cloud-based platform. Ensures data integrity, interoperability, and real-time access for providers.</p>",
        "cost-reduction": "<h3>Healthcare IT Cost Optimization</h3><p>Conduct a comprehensive IT infrastructure audit to identify redundant systems and inefficient processes. Implement cloud cost management and leverage open-source solutions to reduce overhead by up to 20%.</p>"
    },
    "finance": {
        "data-security": "<h3>Financial Cybersecurity & Fraud Prevention</h3><p>Deploy advanced threat detection systems, multi-factor authentication, and blockchain-based security protocols to protect sensitive financial transactions and customer data from cyber threats.</p>",
        "operational-efficiency": "<h3>Automated Financial Workflow Solutions</h3><p>Implement RPA (Robotic Process Automation) for repetitive tasks like data entry, report generation, and transaction processing. Streamlines operations, reduces errors, and frees up human capital.</p>",
        "customer-engagement": "<h3>AI-Driven Personalized Banking Experience</h3><p>Develop an AI chatbot for instant customer support, personalized financial advice, and tailored product recommendations based on user behavior and financial goals.</p>",
        "legacy-systems": "<h3>Core Banking System Modernization</h3><p>Upgrade outdated core banking infrastructure to agile, cloud-native platforms. Enables faster product innovation, enhanced scalability, and seamless integration with fintech services.</p>",
        "cost-reduction": "<h3>Financial Infrastructure Cloud Migration & Optimization</h3><p>Migrate on-premise data centers to cost-effective cloud platforms (AWS, Azure, GCP). Optimize cloud resource usage, implement serverless architectures, and reduce hardware maintenance costs significantly.</p>"
    },
    "retail": {
        "data-security": "<h3>Retail Data Privacy & Transaction Security</h3><p>Implement PCI-DSS compliant payment gateways, robust data encryption for customer information, and regular vulnerability assessments to secure all retail transactions and customer data.</p>",
        "operational-efficiency": "<h3>Unified Retail ERP & Inventory Management</h3><p>Deploy a comprehensive ERP (e.g., Odoo) to centralize inventory, sales, CRM, and supply chain management. Automates stock replenishment, reduces manual errors, and provides real-time insights.</p>",
        "customer-engagement": "<h3>Omnichannel Customer Experience Platform</h3><p>Create a seamless shopping experience across online, mobile, and in-store channels. Includes personalized recommendations, loyalty programs, and integrated customer support via AI chat.</p>",
        "legacy-systems": "<h3>Retail POS & Backend System Upgrade</h3><p>Modernize disparate legacy POS systems and backend databases to a unified, scalable cloud-based solution. Improves data accuracy, speeds up checkout, and supports future integrations.</p>",
        "cost-reduction": "<h3>Retail Supply Chain Optimization with AI</h3><p>Utilize AI to predict demand, optimize logistics routes, and manage warehouse operations efficiently. Reduces holding costs, minimizes waste, and lowers shipping expenses.</p>"
    },
    "manufacturing": {
        "data-security": "<h3>Industrial IoT Cybersecurity for Smart Factories</h3><p>Secure OT/IT convergence with advanced network segmentation, anomaly detection for industrial control systems, and robust endpoint protection for IoT devices on the factory floor.</p>",
        "operational-efficiency": "<h3>Smart Factory Automation & Predictive Maintenance</h3><p>Integrate IoT sensors with AI analytics for real-time monitoring of machinery. Predict equipment failures, automate production lines, and optimize maintenance schedules to minimize downtime.</p>",
        "customer-engagement": "<h3>B2B Customer Portal & Self-Service Solution</h3><p>Develop a secure online portal for B2B clients to track orders, manage accounts, access product documentation, and submit support requests, enhancing client relationships.</p>",
        "legacy-systems": "<h3>Manufacturing Execution System (MES) Modernization</h3><p>Upgrade legacy MES and SCADA systems to modern, cloud-enabled platforms. Improves real-time visibility into production, enhances data collection, and facilitates integration with ERP.</p>",
        "cost-reduction": "<h3>Lean Manufacturing Digitization</h3><p>Implement digital twin technology and real-time data analytics to identify inefficiencies in production processes. Optimize resource allocation, reduce material waste, and lower energy consumption through smart automation.</p>"
    },
    "education": {
        "data-security": "<h3>Secure Student Information System (SIS)</h3><p>Implement robust data encryption, secure access protocols, and regular security audits for student records and academic data, ensuring compliance with privacy regulations.</p>",
        "operational-efficiency": "<h3>AI-Powered Academic Administration Suite</h3><p>Automate student enrollment, course scheduling, and grading processes using AI. Streamlines administrative tasks, reduces manual errors, and improves efficiency for educators and staff.</p>",
        "customer-engagement": "<h3>Personalized E-Learning & Student Engagement Platform</h3><p>Develop an interactive learning platform with AI-driven personalized content delivery, virtual tutors, and collaborative tools to enhance student engagement and academic outcomes.</p>",
        "legacy-systems": "<h3>Campus Management System Modernization</h3><p>Migrate outdated campus management software to a unified, cloud-based system. Integrates admissions, financial aid, student services, and alumni relations for a holistic view.</p>",
        "cost-reduction": "<h3>Education IT Infrastructure Optimization</h3><p>Consolidate on-premise servers to cloud infrastructure, optimize network performance, and implement energy-efficient IT solutions. Reduces operational costs and improves scalability for growing institutions.</p>"
    }
};

function updateConfiguratorOutput() {
    const industry = industrySelect.value;
    const challenge = challengeSelect.value;

    if (industry && challenge) {
        configuratorOutput.innerHTML = solutionData[industry][challenge] || "<p>No specific solution found for this combination. Please try another selection or contact us for a custom solution.</p>";
    } else {
        configuratorOutput.innerHTML = "Select an industry and a challenge to see a tailored solution.";
    }
}

if (industrySelect) {
    industrySelect.addEventListener("change", updateConfiguratorOutput);
}
if (challengeSelect) {
    challengeSelect.addEventListener("change", updateConfiguratorOutput);
}
updateConfiguratorOutput(); // Initial call to set default text


// === Booking Modal Logic ===
const bookingModal = document.getElementById("bookingModal");
const openBookingModalBtn = document.getElementById("openBookingModal");
const openBookingModalTwoBtn = document.getElementById("openBookingModalTwo");
const openBookingModalThreeBtn = document.getElementById("openBookingModalThree");
const closeBookingModalBtn = bookingModal ? bookingModal.querySelector(".close-modal") : null;

function openBookingModal() {
    if (bookingModal) {
        bookingModal.classList.add("visible");
        bookingModal.setAttribute("aria-hidden", "false");
    }
}

function closeBookingModal() {
    if (bookingModal) {
        bookingModal.classList.remove("visible");
        bookingModal.setAttribute("aria-hidden", "true");
    }
}

if (openBookingModalBtn) {
    openBookingModalBtn.addEventListener("click", openBookingModal);
}
if (openBookingModalTwoBtn) {
    openBookingModalTwoBtn.addEventListener("click", openBookingModal);
}
if (openBookingModalThreeBtn) {
    openBookingModalThreeBtn.addEventListener("click", openBookingModal);
}
if (closeBookingModalBtn) {
    closeBookingModalBtn.addEventListener("click", closeBookingModal);
}

// Close modal if clicking outside content
if (bookingModal) {
    bookingModal.addEventListener("click", (e) => {
        if (e.target === bookingModal) {
            closeBookingModal();
        }
    });
}


// === Exit-Intent Modal Logic ===
const exitIntentModal = document.getElementById("exitIntentModal");
const closeExitIntentModalBtn = exitIntentModal ? exitIntentModal.querySelector(".close-modal") : null;
const exitIntentDownloadBtn = exitIntentModal ? exitIntentModal.querySelector(".download-resource") : null;

let hasTriggeredExitIntent = false; // Flag to ensure it only triggers once

function showExitIntentModal() {
    if (!hasTriggeredExitIntent && window.innerWidth > 768) { // Only for desktop
        if (exitIntentModal) {
            exitIntentModal.classList.add("visible");
            exitIntentModal.setAttribute("aria-hidden", "false");
            hasTriggeredExitIntent = true;
        }
    }
}

function closeExitIntentModal() {
    if (exitIntentModal) {
        exitIntentModal.classList.remove("visible");
        exitIntentModal.setAttribute("aria-hidden", "true");
    }
}

if (closeExitIntentModalBtn) {
    closeExitIntentModalBtn.addEventListener("click", closeExitIntentModal);
}

// Close modal if clicking outside content or on the "No thanks" text
if (exitIntentModal) {
    exitIntentModal.addEventListener("click", (e) => {
        if (e.target === exitIntentModal || (e.target.tagName === 'P' && e.target.textContent.includes('No thanks'))) {
            closeExitIntentModal();
        }
    });
}

// Trigger exit intent on mouse leave (desktop only)
document.addEventListener("mouseleave", (e) => {
    if (e.clientY < 10 && window.innerWidth > 768) { // If mouse moves to top of viewport
        showExitIntentModal();
    }
});


// === Resource Download Logging (for demo purposes) ===
document.querySelectorAll(".download-resource").forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        const resourceName = e.target.dataset.resourceName || "Unknown Resource";
        console.log(`User initiated download for: "${resourceName}"`);
        // In a real application, you'd trigger the actual download
        // and potentially send an analytics event.
        // For now, we'll just close the exit intent modal if it was open
        closeExitIntentModal(); 
    });
});


// === Floating CTA visibility based on scroll ===
const floatingCta = document.getElementById("floatingCta");
if (floatingCta) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) { // Show after scrolling 300px
            floatingCta.style.opacity = '1';
            floatingCta.style.visibility = 'visible';
            floatingCta.style.transform = 'translateY(0)';
        } else {
            floatingCta.style.opacity = '0';
            floatingCta.style.visibility = 'hidden';
            floatingCta.style.transform = 'translateY(20px)'; // Hide by moving down
        }
    });
    // Initial state
    floatingCta.style.opacity = '0';
    floatingCta.style.visibility = 'hidden';
    floatingCta.style.transform = 'translateY(20px)';
    floatingCta.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out, visibility 0.3s ease-in-out';
}

