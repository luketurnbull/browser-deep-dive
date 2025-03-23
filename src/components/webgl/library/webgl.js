// @ts-check

import { Colour } from "./colour.js";

export class WebGL {
  /**
   * The private instance of the WebGL class.
   * @type {WebGL}
   */
  static #instance;

  /**
   * The canvas
   * @type {HTMLCanvasElement}
   */
  #canvas;

  /**
   * The WebGL2 rendering context.
   * @type {WebGL2RenderingContext}
   */
  #gl;

  /**
   * The Vertex Object Array.
   * @type {WebGLVertexArrayObject}
   */
  #vao;

  /**
   * Background colour of the canvas
   * @type {Colour}
   */
  #backgroundColour;

  constructor() {}

  /**
   * Init
   * @param {HTMLCanvasElement} canvas - The canvas element to initialize WebGL2.
   * @param {Colour} backgroundColour - The background colour of the canvas
   */
  init(canvas, backgroundColour) {
    this.#canvas = canvas;
    // @ts-ignore - presume it's never null as we throw an error message after
    this.#gl = canvas.getContext("webgl2");
    if (!this.#gl) {
      throw new Error(
        "Unable to initialize WebGL2. Your browser may not support it."
      );
    }

    this.#backgroundColour = backgroundColour;

    this.#vao = this.#gl.createVertexArray();
    this.#gl.bindVertexArray(this.#vao);
  }

  /**
   * Gets the single instance of the WebGL class.
   * @returns {WebGL} The instance of the WebGL class.
   */
  static get instance() {
    if (!WebGL.#instance) {
      WebGL.#instance = new WebGL();
    }

    return WebGL.#instance;
  }

  /**
   * Resize the canvas to match the size it's displayed.
   * @param {number} [multiplier] - Amount to multiply by.
   *    Pass in window.devicePixelRatio for native pixels.
   * @return {boolean} true if the canvas was resized.
   */
  resize(multiplier = 1) {
    const width = Math.floor(this.#canvas.clientWidth * multiplier);
    const height = Math.floor(this.#canvas.clientHeight * multiplier);
    if (this.#canvas.width !== width || this.#canvas.height !== height) {
      this.#canvas.width = width;
      this.#canvas.height = height;
      return true;
    }
    return false;
  }

  clearCanvas() {
    this.#gl.viewport(0, 0, this.#gl.canvas.width, this.#gl.canvas.height);
    // Clear the canvas
    this.#gl.clearColor(
      this.#backgroundColour.r,
      this.#backgroundColour.g,
      this.#backgroundColour.b,
      this.#backgroundColour.a
    );
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
  }

  /**
   * Gets the WebGL2 rendering context.
   * @returns {WebGL2RenderingContext} The WebGL2 context.
   */
  getContext() {
    return this.#gl;
  }
}
