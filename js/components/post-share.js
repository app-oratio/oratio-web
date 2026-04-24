class PostShare extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const title = this.getTitle();
    const url = this.getUrl();
    const description = this.getDescription();

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/css/post-shared.css">

      <div class="post-share">

        <button class="share-btn facebook" data-url="${url}">
          <img src="/icons/shared/facebook.svg" alt="Facebook">
        </button>

        <button class="share-btn twitter" data-title="${title}" data-url="${url}">
          <img src="/icons/shared/x.svg" alt="X">
        </button>

        <button class="share-btn whatsapp" data-title="${title}" data-url="${url}">
          <img src="/icons/shared/whatsapp.svg" alt="WhatsApp">
        </button>

        <button class="share-btn telegram" data-title="${title}" data-url="${url}">
          <img src="/icons/shared/telegram.svg" alt="Telegram">
        </button>

        <button class="share-btn copy" data-url="${url}">
          <img src="/icons/shared/copiar.svg" alt="Copiar link">
        </button>

        <button class="share-btn native" data-title="${title}" data-url="${url}" data-description="${description}">
          <img src="/icons/shared/compartilhar.svg" alt="Compartilhar">
        </button>

      </div>
    `;

    this.initEvents();
  }

  getTitle() {
    return (
      this.getAttribute("title") ||
      document.querySelector("meta[property='og:title']")?.content ||
      document.title ||
      ""
    );
  }

  getUrl() {
    return (
      this.getAttribute("url") ||
      document.querySelector("link[rel='canonical']")?.href ||
      window.location.href
    );
  }

  getDescription() {
    return (
      this.getAttribute("description") ||
      document.querySelector("meta[property='og:description']")?.content ||
      document.querySelector("meta[name='description']")?.content ||
      ""
    );
  }

  initEvents() {
    const root = this.shadowRoot;

    root.querySelector(".facebook")?.addEventListener("click", (e) => {
      const url = e.currentTarget.dataset.url;
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    });

    root.querySelector(".twitter")?.addEventListener("click", (e) => {
      const title = e.currentTarget.dataset.title;
      const url = e.currentTarget.dataset.url;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
    });

    root.querySelector(".whatsapp")?.addEventListener("click", (e) => {
      const title = e.currentTarget.dataset.title;
      const url = e.currentTarget.dataset.url;
      window.open(`https://wa.me/?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`, "_blank");
    });

    root.querySelector(".telegram")?.addEventListener("click", (e) => {
      const title = e.currentTarget.dataset.title;
      const url = e.currentTarget.dataset.url;
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank");
    });

    root.querySelector(".copy")?.addEventListener("click", (e) => {
      const url = e.currentTarget.dataset.url;
      navigator.clipboard.writeText(url).then(() => {
        this.showFeedback("Link copiado!");
      });
    });

    root.querySelector(".native")?.addEventListener("click", (e) => {
      const title = e.currentTarget.dataset.title;
      const url = e.currentTarget.dataset.url;
      const description = e.currentTarget.dataset.description;

      if (navigator.share) {
        navigator.share({
          title: title,
          text: description,
          url: url
        });
      } else {
        this.showFeedback("Compartilhamento não suportado.");
      }
    });
  }

  showFeedback(message) {
    const toast = document.createElement("div");

    toast.textContent = message;

    Object.assign(toast.style, {
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#000",
      color: "#fff",
      padding: "8px 16px",
      borderRadius: "999px",
      fontSize: "0.85rem",
      zIndex: "9999",
      opacity: "0",
      transition: "opacity 0.3s"
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
}

customElements.define("post-share", PostShare);
