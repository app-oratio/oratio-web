const track = document.getElementById("carouselTrack");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let currentIndex = 1;
let slides = [];
let autoplayInterval = null;

/* =========================
   CARREGAR JSON
   ========================= */

fetch("/json/landing_page.json")
  .then(res => res.json())
  .then(data => {
    slides = data;

    const items = [];

    // clone do último (vai no começo)
    items.push(slides[slides.length - 1]);

    // slides reais
    slides.forEach(item => items.push(item));

    // clone do primeiro (vai no final)
    items.push(slides[0]);

    items.forEach(item => {
      const slide = document.createElement("div");
      slide.className = "carousel-slide";

      slide.innerHTML = `
        <div class="carousel-card">
          <img src="${item.imagem}" alt="${item.titulo}">
          <div class="carousel-content">
            <h2>${item.titulo}</h2>
            <p>${item.texto}</p>
          </div>
        </div>
      `;

      track.appendChild(slide);
    });

    updateCarousel(false);
    startAutoplay();
  });

/* =========================
   ATUALIZAR POSIÇÃO
   ========================= */

function updateCarousel(animate = true) {
  track.style.transition = animate
    ? "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
    : "none";

  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

/* =========================
   TRANSIÇÃO INFINITA
   ========================= */

track.addEventListener("transitionend", () => {
  // chegou no clone do último
  if (currentIndex === 0) {
    currentIndex = slides.length;
    updateCarousel(false);
  }

  // chegou no clone do primeiro
  if (currentIndex === slides.length + 1) {
    currentIndex = 1;
    updateCarousel(false);
  }
});

/* =========================
   NAVEGAÇÃO
   ========================= */

function nextSlide() {
  currentIndex++;
  updateCarousel();
}

function prevSlide() {
  currentIndex--;
  updateCarousel();
}

/* =========================
   AUTOPLAY
   ========================= */

function startAutoplay() {
  stopAutoplay();

  autoplayInterval = setInterval(() => {
    nextSlide();
  }, 7000);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
}

/* =========================
   BOTÕES
   ========================= */

if (nextBtn && prevBtn) {
  nextBtn.onclick = () => {
    stopAutoplay();
    nextSlide();
  };

  prevBtn.onclick = () => {
    stopAutoplay();
    prevSlide();
  };
}

/* =========================
   INTERAÇÃO
   ========================= */

track.addEventListener("mouseenter", stopAutoplay);
track.addEventListener("mouseleave", startAutoplay);

track.addEventListener("touchstart", stopAutoplay);
track.addEventListener("touchend", startAutoplay);

/* =========================
   SWIPE
   ========================= */

let startX = 0;
let isDragging = false;

track.addEventListener("touchstart", (e) => {
  stopAutoplay();
  startX = e.touches[0].clientX;
  isDragging = true;
});

track.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const currentX = e.touches[0].clientX;
  const diff = currentX - startX;

  track.style.transition = "none";
  track.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff}px))`;
});

track.addEventListener("touchend", (e) => {
  if (!isDragging) return;

  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  isDragging = false;

  if (diff > 50) {
    nextSlide();
  } else if (diff < -50) {
    prevSlide();
  } else {
    updateCarousel();
  }

  startAutoplay();
});
