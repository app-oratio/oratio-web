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
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

/* =========================
   NAVEGAÇÃO
   ========================= */

function nextSlide() {
  if (currentIndex < slides.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0; // volta ao início
  }
  updateCarousel();
}

function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = slides.length - 1; // vai para o último
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
  }, 10000);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
}

/* =========================
   EVENTOS
   ========================= */

// Botões
nextBtn.onclick = () => {
  stopAutoplay();
  nextSlide();
};

prevBtn.onclick = () => {
  stopAutoplay();
  prevSlide();
};

// Hover (desktop)
track.addEventListener("mouseenter", stopAutoplay);
track.addEventListener("mouseleave", startAutoplay);

// Touch (mobile)
track.addEventListener("touchstart", stopAutoplay);
track.addEventListener("touchend", startAutoplay);
