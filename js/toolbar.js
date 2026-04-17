class ToolbarComponent extends HTMLElement {

  connectedCallback() {
    this.innerHTML = `
      <div class="toolbar">
        <img src="/icons/menu/menu-white.png" class="menu-btn">
        <img src="/icons/logo/white-completo.png" class="logo-top">
      </div>

      <div class="overlay"></div>

      <div class="drawer">
        <div class="drawer-header">
          <img src="/icons/logo/white-completo.png" class="logo">
        </div>

        <nav class="menu">
          ${this.menuItem("Início", "/")}

          ${this.menuGroup("Orações", [
            ["Terços e Rosários", "/oracoes/terco"],
            ["Novenas", "/oracoes/novenas"],
            ["Outras orações", "/oracoes/outras"]
          ])}

          ${this.menuItem("Meditações", "/meditacoes")}

          ${this.menuGroup("Liturgia", [
            ["Liturgia Diária", "/liturgia"],
            ["Liturgia das Horas", "/liturgia/liturgia-das-horas"]
          ])}

          ${this.menuItem("Blog", "/blog")}
          ${this.menuItem("Pedidos de Oração", "/intencoes/")}
          ${this.menuItem("Wallpapers", "/wallpapers")}

          ${this.menuGroup("Biblioteca", [
            ["Bíblias", "/biblias"],
            ["Livros", "/livros"]
          ])}

          ${this.menuItem("Santos", "/santos")}
          ${this.menuItem("Ajude-nos", "/ajude")}
          ${this.menuItem("Contato", "/contato")}
          ${this.menuItem("Sobre", "/sobre")}
        </nav>

        <div class="drawer-footer">
          © Oratio - App Católico 2024-2026
        </div>
      </div>
    `;

    this.bindEvents();
    this.highlightActiveRoute();
  }

  menuItem(label, link) {
    return `<a href="${link}" class="menu-item">${label}</a>`;
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

  bindEvents() {
    const drawer = this.querySelector(".drawer");
    const overlay = this.querySelector(".overlay");
    const btn = this.querySelector(".menu-btn");

    const toggleMenu = () => {
      drawer.classList.toggle("open");
      overlay.classList.toggle("open");
    };

    btn.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", toggleMenu);

    // Submenus
    this.querySelectorAll(".menu-group-header").forEach(header => {
      header.addEventListener("click", () => {
        const target = this.querySelector("#" + header.dataset.target);
        const icon = header.querySelector(".toggle-icon");

        const isOpen = target.classList.toggle("open");

        icon.src = isOpen
          ? "/icons/menu/collapsing.png"
          : "/icons/menu/expand.png";
      });
    });
  }

  highlightActiveRoute() {
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

customElements.define("toolbar", ToolbarComponent);
