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

    addEventListener("resize", () => {
      this.resize();
    });
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
   * Creates a shader of the given type.
   * @param {number} type - The type of shader (e.g., gl.VERTEX_SHADER or gl.FRAGMENT_SHADER).
   * @param {string} source - The GLSL source code for the shader.
   * @returns {WebGLShader} The compiled shader.
   */
  createShader(type, source) {
    const shader = this.#gl.createShader(type);
    if (!shader) {
      throw new Error("Failed to create shader.");
    }

    this.#gl.shaderSource(shader, source);
    this.#gl.compileShader(shader);

    // Check for compilation errors
    if (this.#gl.getShaderParameter(shader, this.#gl.COMPILE_STATUS)) {
      return shader; // shader is guaranteed to be non-null here
    } else {
      const error = this.#gl.getShaderInfoLog(shader);
      this.#gl.deleteShader(shader);
      throw new Error(`Error compiling shader: ${error}`);
    }
  }

  /**
   * Creates a WebGL2 program using the provided vertex and fragment shaders.
   * @param {WebGLShader} vertexShader - The vertex shader.
   * @param {WebGLShader} fragmentShader - The fragment shader.
   * @returns {WebGLProgram} The created WebGL2 program.
   */
  createProgram(vertexShader, fragmentShader) {
    const program = this.#gl.createProgram();
    if (!program) {
      throw new Error("Failed to create program.");
    }

    this.#gl.attachShader(program, vertexShader);
    this.#gl.attachShader(program, fragmentShader);
    this.#gl.linkProgram(program);

    // Check for linking errors
    if (!this.#gl.getProgramParameter(program, this.#gl.LINK_STATUS)) {
      const error = this.#gl.getProgramInfoLog(program);
      this.#gl.deleteProgram(program);
      throw new Error(`Error linking program: ${error}`);
    }

    return program; // program is guaranteed to be non-null here
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

  /**
   * Gets the WebGL2 rendering context.
   * @returns {WebGL2RenderingContext} The WebGL2 context.
   */
  getContext() {
    return this.#gl;
  }
}
