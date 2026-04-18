if (!document.getElementById("toolbar-css")) {
  const link = document.createElement("link");
  link.id = "toolbar-css";
  link.rel = "stylesheet";
  link.href = "/css/toolbar.css";
  document.head.appendChild(link);
}

class ToolbarComponent extends HTMLElement {

  connectedCallback() {

    const year = new Date().getFullYear();

    this.innerHTML = `
      <div class="toolbar">

        <div class="toolbar-left">
          <img src="/icons/menu/menu-white.png" class="toolbar-menu" id="menuButton">
          
          <div class="brand">
            <img src="/icons/logo/logo-white.png" class="brand-logo">
            <span class="brand-text">Oratio | App Católico</span>
          </div>
        </div>

      </div>

      <div class="drawer-overlay" id="drawerOverlay"></div>

      <div class="drawer" id="drawer">

        <div class="drawer-header">
          <div class="brand">
            <img src="/icons/logo/logo-white.png" class="brand-logo">
            <span class="brand-text">Oratio | App Católico</span>
          </div>
        </div>

        <div class="drawer-items">

          <a href="/">Início</a>

          ${this.menuGroup("Orações", [
            ["Terços e Rosários", "/oracoes/terco"],
            ["Novenas", "/oracoes/novenas"],
            ["Outras orações", "/oracoes/outras"]
          ])}

          <a href="/meditacoes">Meditações</a>

          ${this.menuGroup("Liturgia", [
            ["Liturgia Diária", "/liturgia"],
            ["Liturgia das Horas", "/liturgia/liturgia-das-horas"]
          ])}

          <a href="/blog">Blog</a>
          <a href="/intencoes/">Pedidos de Oração</a>
          <a href="/wallpapers">Wallpapers</a>

          ${this.menuGroup("Biblioteca", [
            ["Bíblias", "/biblias"],
            ["Livros", "/livros"]
          ])}

          <a href="/santos">Santos</a>
          <a href="/ajude">Ajude-nos</a>
          <a href="/contato">Contato</a>
          <a href="/sobre">Sobre</a>

        </div>

        <div class="drawer-footer">
          © Oratio - App Católico 2024-2026
        </div>

      </div>
    `;

    this.setupEvents();
    this.setupSubmenus();
    this.highlightActive();
  }

  menuGroup(title, items) {
    const id = "group-" + Math.random().toString(36).substring(2, 9);

    return `
      <div class="menu-group">

        <div class="menu-group-header" data-target="${id}">
          <span>${title}</span>
          <img src="/icons/menu/expand.png" class="toggle-icon">
        </div>

        <div class="submenu" id="${id}">
          ${items.map(i => `<a href="${i[1]}">${i[0]}</a>`).join("")}
        </div>

      </div>
    `;
  }

  setupEvents() {
    const menu = this.querySelector("#menuButton");
    const drawer = this.querySelector("#drawer");
    const overlay = this.querySelector("#drawerOverlay");

    menu.onclick = () => {
      drawer.classList.add("open");
      overlay.classList.add("show");
    };

    overlay.onclick = () => {
      drawer.classList.remove("open");
      overlay.classList.remove("show");
    };
  }

  setupSubmenus() {
    this.querySelectorAll(".menu-group-header").forEach(header => {
      header.onclick = () => {
        const target = this.querySelector("#" + header.dataset.target);
        const icon = header.querySelector(".toggle-icon");

        const isOpen = target.classList.toggle("open");

        icon.src = isOpen
          ? "/icons/menu/collapsing.png"
          : "/icons/menu/expand.png";
      };
    });
  }

  highlightActive() {
    let currentPath = window.location.pathname;

    if (currentPath.length > 1 && currentPath.endsWith("/")) {
      currentPath = currentPath.slice(0, -1);
    }

    this.querySelectorAll("a").forEach(link => {
      let href = link.getAttribute("href");
      if (!href) return;

      if (href.length > 1 && href.endsWith("/")) {
        href = href.slice(0, -1);
      }

      let isActive = false;

      if (href === "/") {
        isActive = currentPath === "/";
      } else {
        isActive =
          currentPath === href ||
          currentPath.startsWith(href + "/");
      }

      if (isActive) {
        link.classList.add("active");

        const submenu = link.closest(".submenu");
        if (submenu) {
          submenu.classList.add("open");

          const header = submenu.previousElementSibling;
          const icon = header.querySelector(".toggle-icon");

          if (icon) {
            icon.src = "/icons/menu/collapsing.png";
          }
        }
      }
    });
  }

}

customElements.define("site-toolbar", SiteToolbar);
