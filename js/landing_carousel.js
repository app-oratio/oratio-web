const track = document.getElementById("carouselTrack");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let currentIndex = 0;
let slides = [];
let autoplayInterval = null;

/* =========================
   CARREGAR JSON
   ========================= */

fetch("/json/landing_page.json")
  .then(res => res.json())
  .then(data => {
    slides = data;

    data.forEach(item => {
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

    updateCarousel();
    startAutoplay();
  });

/* =========================
   ATUALIZAR POSIÇÃO
   ========================= */

function updateCarousel() {
  track.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

/* =========================
   NAVEGAÇÃO
   ========================= */

function nextSlide() {
  if (currentIndex < slides.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateCarousel();
}

function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = slides.length - 1;
  }
  updateCarousel();
}

/* =========================
   AUTOPLAY (10s)
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
   PAUSA POR INTERAÇÃO
   ========================= */

// Desktop (hover)
track.addEventListener("mouseenter", stopAutoplay);
track.addEventListener("mouseleave", startAutoplay);

// Mobile (toque)
track.addEventListener("touchstart", stopAutoplay);
track.addEventListener("touchend", startAutoplay);

/* =========================
   SWIPE (MOBILE)
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

  // remove transição durante drag
  track.style.transition = "none";
  track.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff}px))`;
});

track.addEventListener("touchend", (e) => {
  if (!isDragging) return;

  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  isDragging = false;

  // threshold
  if (diff > 50) {
    nextSlide();
  } else if (diff < -50) {
    prevSlide();
  } else {
    updateCarousel();
  }

  startAutoplay();
});
