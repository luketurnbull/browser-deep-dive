// @ts-check

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

  constructor() {}

  /**
   * Init
   * @param {HTMLCanvasElement} canvas - The canvas element to initialize WebGL2.
   */
  init(canvas) {
    this.#canvas = canvas;
    // @ts-ignore - presume it's never null as we throw an error message after
    this.#gl = canvas.getContext("webgl2");
    if (!this.#gl) {
      throw new Error(
        "Unable to initialize WebGL2. Your browser may not support it."
      );
    }
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
    this.#gl.clearColor(0, 1, 0, 1);
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

export class Program {
  program;

  /**
   * Creates a WebGL2 program using the provided vertex and fragment shaders.
   * @param {WebGLShader} vertexShader - The vertex shader.
   * @param {WebGLShader} fragmentShader - The fragment shader.
   * @param {WebGL} gl The created WebGL2 program.
   */
  constructor(vertexShader, fragmentShader, gl) {
    this.gl = gl.getContext();
    this.program = this.createProgram(vertexShader, fragmentShader);
  }

  /**
   * Creates a WebGL2 program using the provided vertex and fragment shaders.
   * @param {WebGLShader} vertexShader - The vertex shader.
   * @param {WebGLShader} fragmentShader - The fragment shader.
   */
  createProgram(vertexShader, fragmentShader) {
    const vShader = this.createShader(this.gl.VERTEX_SHADER, vertexShader);
    const fShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShader);
    const program = this.gl.createProgram();

    this.gl.attachShader(program, vShader);
    this.gl.attachShader(program, fShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const error = this.gl.getProgramInfoLog(program);
      this.gl.deleteProgram(program);
      throw new Error(`Error linking program: ${error}`);
    }

    return program;
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error("Failed to create shader.");
    }
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const error = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error(`Error compiling shader: ${error}`);
    }

    return shader;
  }

  use() {
    this.gl.useProgram(this.program);
  }

  /**
   * Get location of attribute in current program
   * @param {string} name
   * @returns
   */
  getAttributeLocation(name) {
    return this.gl.getAttribLocation(this.program, name);
  }

  // Method to set attributes, uniforms, etc.
  setAttribute(name) {
    const location = this.getAttributeLocation(name);
    this.gl.vertexAttribPointer(location, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(location);
  }

  // Additional methods for setting uniforms can be added here
}
