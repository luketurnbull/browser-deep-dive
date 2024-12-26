// @ts-check

import "./main-header.js";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
  <style>
    :host {
      display: block;
      width: 100%;
      contain: content;
    }

    .main-content {
      width: 100%;
      height: calc(100vh - var(--header-height, 60px));
      margin-top: var(--header-height, 60px);
    }
  </style>
  <main-header></main-header>
  <main class="main-content">
    <slot></slot>
  </main>
`;

export class BaseLayout extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["page-title"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "page-title") {
      const header = this.shadowRoot?.querySelector("main-header");
      if (header) {
        header.setAttribute("page-title", newValue);
      }
    }
  }
}

customElements.define("base-layout", BaseLayout);
