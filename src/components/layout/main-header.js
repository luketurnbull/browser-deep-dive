// @ts-check

const template = document.createElement("template");
template.innerHTML = /*html*/ `
  <style>
    :host {
      display: block;
      width: 100%;
      position: fixed;
      top: 0;
      z-index: 100;
      height: var(--header-height, 60px);
      contain: content;
    }

    header {
      padding: 1rem;
      background: #f5f5f5;
      view-transition-name: none;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    nav ul {
      list-style: none;
      padding: 0;
      display: flex;
      gap: 1rem;
    }

    a {
      text-decoration: none;
      color: #333;
    }

    a.active {
      color: #0066cc;
      font-weight: bold;
      border-bottom: 2px solid #0066cc;
    }

    h1 {
      margin: 0;
    }

    nav {
      view-transition-name: none;
    }
  </style>

  <header>
    <div class="container">
      <div class="header-content">
        <h1></h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/pages/web-gl/">Web GL</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
`;

/**
 * @class
 * @extends {HTMLElement}
 */
class Header extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));

    // Add navigation event listener
    window.addEventListener("popstate", () => this.updateActiveLink());
  }

  connectedCallback() {
    this.updateActiveLink();
  }

  updateActiveLink() {
    // Get current path, removing any trailing slash
    const currentPath = window.location.pathname.replace(/\/$/, "");

    // Create alternate path versions to check against
    const pathWithIndex = currentPath + "/index.html";
    const pathWithoutIndex = currentPath.replace("/index.html", "");

    // Find and update the active link
    const links = this.shadowRoot?.querySelectorAll("a");
    links?.forEach((link) => {
      const href = link.getAttribute("href");

      // Special case for home page
      if (href === "/" && (currentPath === "" || currentPath === "/")) {
        link.classList.add("active");
        return;
      }

      const isActive =
        href === currentPath ||
        href === pathWithIndex ||
        href === pathWithoutIndex;

      link.classList.toggle("active", isActive);
    });
  }

  static get observedAttributes() {
    return ["page-title"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "page-title") {
      const titleElement = this.shadowRoot?.querySelector("h1");
      if (titleElement) {
        titleElement.textContent = newValue;
      }
    }
  }
}

customElements.define("main-header", Header);
