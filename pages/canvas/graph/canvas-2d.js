// @ts-check

export default class Canvas2D {
  width = 0;
  height = 0;

  /**
   * @param {string} canvasElementId - The ID of the canvas element
   */
  constructor(canvasElementId) {
    /** @type {HTMLElement|null} */
    const element = document.getElementById(canvasElementId);

    if (!element) {
      const message = `Error initialising canvas: ${canvasElementId} does not exist.`;
      console.error(message);
      throw new Error(message);
    }

    if (!(element instanceof HTMLCanvasElement)) {
      const message = `Error initialising canvas: ${canvasElementId} is not a canvas element.`;
      console.error(message);
      throw new Error(message);
    }

    /** @type {HTMLCanvasElement} */
    this.canvas = element;

    const context = this.canvas.getContext("2d");

    if (!context) {
      const message = `Error initialising context`;
      console.error(message);
      throw new Error(message);
    }

    /** @type {CanvasRenderingContext2D} */
    this.context = context;

    // Bind the resize method to maintain correct 'this' context
    this.boundResize = this.resize.bind(this);

    this.resize();
    window.addEventListener("resize", this.boundResize);
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;

    // Update canvas pixel dimensions
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;

    // Scale the drawing context
    if (this.context) {
      this.context.scale(dpr, dpr);
    }
  }

  destroy() {
    window.removeEventListener("resize", this.boundResize);
  }
}
