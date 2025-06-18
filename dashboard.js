const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

let currentIndex = 0;
let autoSlide = true;
let slideInterval;

// Generate dots
slides.forEach((_, i) => {
  const dot = document.createElement('span');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('span');

// Go to specific slide
function goToSlide(index) {
  currentIndex = index;
  updateSlides();
  resetTimer();
}

// Update slide visibility
function updateSlides() {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentIndex);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });

  const offset = -currentIndex * 100;
  document.querySelector('.slides').style.transform = `translateX(${offset}%)`;
}

// Navigation
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlides();
  resetTimer();
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlides();
  resetTimer();
});

// Auto slide
function startAutoSlide() {
  slideInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlides();
  }, 5000);
}

function resetTimer() {
  if (autoSlide) {
    clearInterval(slideInterval);
    startAutoSlide();
  }
}

// Init
updateSlides();
if (autoSlide) startAutoSlide();
