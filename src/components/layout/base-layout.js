// @ts-check

import "./main-header.js";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
  <style>
    :host {
      display: block;
      width: 100%;
    }

    .main-content {
      width: 100%;
      height: calc(100vh - var(--header-height, 60px));
      margin-top: var(--header-height, 60px);
    }
  </style>
  <main-header>
    <slot name="title"></slot>
  </main-header>
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
}

customElements.define("base-layout", BaseLayout);
