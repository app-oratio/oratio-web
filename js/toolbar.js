if(!document.getElementById("toolbar-css")){
  const link = document.createElement("link");
  link.id = "toolbar-css";
  link.rel = "stylesheet";
  link.href = "/css/toolbar.css";
  document.head.appendChild(link);
}

class SiteToolbar extends HTMLElement {

  connectedCallback(){

    const year = new Date().getFullYear();

    this.innerHTML = `

<!-- TOOLBAR -->
<div class="toolbar">

  <div class="toolbar-left">
    <img src="/icons/menu/menu-white.png" class="toolbar-menu" id="menuButton">

    <a href="/" class="toolbar-brand">
      <img src="/icons/logo/logo-white.png" class="toolbar-logo">
      <span class="toolbar-title">Oratio | App Católico</span>
    </a>
  </div>

</div>

<!-- OVERLAY -->
<div class="drawer-overlay" id="drawerOverlay"></div>

<!-- MENU LATERAL -->
<div class="drawer" id="drawer">

  <div class="drawer-header">
    <img src="/icons/logo/logo-white.png" class="drawer-logo">
    <span class="drawer-title">Oratio | App Católico</span>
  </div>

  <div class="drawer-items">

    <a href="/">Início</a>

    <!-- ORAÇÕES -->
    <div class="menu-group">
      <div class="menu-item has-sub" data-target="oracoes">
        Orações
        <img src="/icons/menu/expand.png" class="menu-arrow">
      </div>

      <div class="submenu" id="oracoes">
        <a href="/oracoes">Todas</a>
        <a href="/oracoes/terco">Terços e Rosários</a>
        <a href="/oracoes/novenas">Novenas</a>
        <a href="/oracoes/outras">Outras</a>
      </div>
    </div>

    <a href="/meditacoes">Meditações</a>

    <!-- LITURGIA -->
    <div class="menu-group">
      <div class="menu-item has-sub" data-target="liturgia">
        Liturgia
        <img src="/icons/menu/expand.png" class="menu-arrow">
      </div>

      <div class="submenu" id="liturgia">
        <a href="/liturgia">Liturgia Diária</a>
        <a href="/liturgia/liturgia-das-horas">Liturgia das Horas</a>
      </div>
    </div>

    <a href="/blog">Blog</a>
    <a href="/intencoes/">Pedidos de Oração</a>
    <a href="/wallpapers">Wallpapers</a>

    <!-- BIBLIOTECA -->
    <div class="menu-group">
      <div class="menu-item has-sub" data-target="biblioteca">
        Biblioteca
        <img src="/icons/menu/expand.png" class="menu-arrow">
      </div>

      <div class="submenu" id="biblioteca">
        <a href="/biblioteca">Geral</a>
        <a href="/biblias">Bíblias</a>
        <a href="/livros">Livros</a>
      </div>
    </div>

    <a href="/santos">Santos</a>
    <a href="/ajude">Ajude-nos</a>
    <a href="/contato">Contato</a>
    <a href="/sobre">Sobre</a>

  </div>

  <div class="drawer-footer">
    © Oratio - App Católico 2024-${year}
  </div>

</div>

`;

    this.setupEvents();
  }

  setupEvents(){

    const menu = this.querySelector("#menuButton");
    const drawer = this.querySelector("#drawer");
    const overlay = this.querySelector("#drawerOverlay");

    menu.onclick = function(){
      drawer.classList.add("open");
      overlay.classList.add("show");
    };

    overlay.onclick = function(){
      drawer.classList.remove("open");
      overlay.classList.remove("show");
    };

    // SUBMENUS
    const items = this.querySelectorAll(".has-sub");

    items.forEach(item => {
      item.onclick = function(){

        const targetId = this.getAttribute("data-target");
        const submenu = document.getElementById(targetId);
        const icon = this.querySelector(".menu-arrow");

        const isOpen = submenu.classList.contains("open");

        submenu.classList.toggle("open");

        icon.src = isOpen 
          ? "/icons/menu/expand.png" 
          : "/icons/menu/collapsing.png";
      };
    });

  }

}

customElements.define("site-toolbar", SiteToolbar);
