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
      contain: layout size;
      background: #f5f5f5;
    }

    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: var(--container-padding, 2rem);
      max-width: var(--container-max-width, 1200px);
      margin: 0 auto;
    }

    header {
      height: var(--header-height, 60px);
      box-sizing: border-box;
    }

    nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      gap: 1rem;
      height: 100%;
      align-items: center;
    }

    nav li {
      position: relative;
    }

    nav .dropdown {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      background: #f5f5f5;
      padding: 0.5rem;
      min-width: 200px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      border-radius: 4px;
      z-index: 101;
    }

    nav .dropdown ul {
      flex-direction: column;
      gap: 0.5rem;
    }

    nav li:hover .dropdown {
      display: block;
    }

    a {
      text-decoration: none;
      color: #333;
      padding: 0.5rem;
      display: block;
      text-wrap: nowrap;
    }

    a.active {
      color: #0066cc;
      font-weight: bold;
    }

    .dropdown a.active {
      background: #e6f0ff;
      border-radius: 4px;
    }

    h1 {
      margin: 0;
      min-width: 0;
      line-height: 1.2;
      text-wrap: balance;
      font-size: 1.25rem;
    }

    nav {
      height: 100%;
      display: flex;
      align-items: center;
    }
  </style>

  <header>
    <div class="container">
        <h1></h1>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/pages/web-gl/">Web GL</a>
              <div class="dropdown">
                <ul>
                  <li>
                    <a href="/pages/web-gl/fundamentals/">WebGL Fundamentals</a>
                  </li>
                </ul>
              </div>
          </li>
          </ul>
        </nav>
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
    const pathWithTrailingSlash = currentPath + "/";

    // Find and update the active link
    const links = this.shadowRoot?.querySelectorAll("a");
    links?.forEach((link) => {
      const href = link?.getAttribute("href")?.replace(/\/$/, "");

      // Special case for home page
      if (href === "/" || href === "") {
        const isHome = currentPath === "" || currentPath === "/";

        link.classList.toggle("active", isHome);
        return;
      }

      const isActive =
        href === currentPath ||
        href === pathWithIndex ||
        href === pathWithoutIndex ||
        href === pathWithTrailingSlash ||
        (currentPath.startsWith(href + "/") && href !== "/");

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
