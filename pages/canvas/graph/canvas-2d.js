// @ts-check

import Vector2 from "./vector-2.js";

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

  /**
   * Draws a line on the canvas, from one point to another
   * @public
   * @param {Vector2} start
   * @param {Vector2} end
   * @param {string} colour
   */
  drawLine(start, end, colour) {
    this.context.fillStyle = colour;
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.stroke();
  }

  /**
   * Draws a line on the canvas, from one point to another
   * @public
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} colour
   */
  drawRectangle(x, y, width, height, colour) {
    console.log(`
            Draw rectangle:
            x: ${x}
            y: ${y}
         `);
    this.context.fillStyle = colour;
    this.context.rect(x, y, width, height);
    this.context.fill();
  }

  destroy() {
    window.removeEventListener("resize", this.boundResize);
  }
}
