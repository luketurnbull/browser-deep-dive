// @ts-check

const template = document.createElement("template");
template.innerHTML = /*html*/ `
  <style>
    :host {
      display: block;
      width: 100%;
    }

    header {
      padding: 1rem;
      background: #f5f5f5;
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
  </style>

  <header>
    <slot name="title"></slot>
    <p><slot></slot></p>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/pages/webgl">WebGL 2</a></li>
      </ul>
    </nav>
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
  }
}

customElements.define("main-header", Header);
