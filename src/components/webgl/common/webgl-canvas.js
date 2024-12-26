// @ts-check

/**
 * Custom WebGL element that manages a canvas with WebGL context
 * @extends {HTMLElement}
 */
export class WebGLCanvas extends HTMLElement {
  /**
   * @typedef {Object} ResizeEventDetail
   * @property {number} width - The new width in pixels
   * @property {number} height - The new height in pixels
   * @property {number} pixelRatio - The current device pixel ratio
   */

  constructor() {
    super();

    // Create shadow DOM
    this.attachShadow({ mode: "open" });

    /** @type {HTMLCanvasElement} */
    this._canvas = document.createElement("canvas");

    /** @type {WebGL2RenderingContext|null} */
    this.gl = null;

    /** @type {number} */
    this.pixelRatio = window.devicePixelRatio || 1;

    // Bind methods
    this.handleResize = this.handleResize.bind(this);

    // Setup resize observer
    this.resizeObserver = new ResizeObserver(this.handleResize);

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      canvas {
        width: 100%;
        height: 100%;
        display: block;
      }
    `;

    this.shadowRoot?.append(style, this._canvas);
  }

  /**
   * Lifecycle callback when element is added to DOM
   */
  connectedCallback() {
    this.initWebGL();
    this.resizeObserver.observe(this);
    this.handleResize();

    // Dispatch event when initialization is complete
    this.dispatchEvent(new CustomEvent("connected"));
  }

  /**
   * Lifecycle callback when element is removed from DOM
   */
  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  /**
   * Initialize WebGL context and set initial state
   * @throws {Error} If WebGL is not supported
   */
  initWebGL() {
    this.gl = this._canvas.getContext("webgl2");

    if (!this.gl) {
      throw new Error("WebGL not supported");
    }

    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  /**
   * Handle canvas resize events, updating size and dispatching custom event
   */
  handleResize() {
    if (!this.gl) return;

    // Get the computed size of the element
    const rect = this.getBoundingClientRect();
    const displayWidth = Math.floor(rect.width * this.pixelRatio);
    const displayHeight = Math.floor(rect.height * this.pixelRatio);

    if (
      this._canvas.width !== displayWidth ||
      this._canvas.height !== displayHeight
    ) {
      this._canvas.width = displayWidth;
      this._canvas.height = displayHeight;

      this.gl.viewport(0, 0, displayWidth, displayHeight);

      /** @type {CustomEvent<ResizeEventDetail>} */
      const resizeEvent = new CustomEvent("glresize", {
        detail: {
          width: displayWidth,
          height: displayHeight,
          pixelRatio: this.pixelRatio,
        },
      });

      this.dispatchEvent(resizeEvent);
    }
  }

  /**
   * Get the WebGL rendering context
   * @returns {WebGL2RenderingContext|WebGLRenderingContext|null}
   */
  getGL() {
    return this.gl;
  }

  /**
   * Creates a WebGL shader
   * @param {GLenum} type - The type of shader (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
   * @param {string} source - The GLSL source code for the shader
   * @returns {WebGLShader|null} The created shader or null if creation failed
   */
  createShader(type, source) {
    const gl = this.gl;
    if (!gl) return null;

    const shader = gl.createShader(type);
    if (!shader) {
      console.error("Error creating shader");
      return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.error(`Error creating shader:`, gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  /**
   * Creates a shader program from vertex and fragment shaders
   * @param {WebGLShader} vertexShader - The compiled vertex shader
   * @param {WebGLShader} fragmentShader - The compiled fragment shader
   * @returns {WebGLProgram|null} The created program or null if creation failed
   */
  createProgram(vertexShader, fragmentShader) {
    const gl = this.gl;
    if (!gl) return null;

    const program = gl.createProgram();
    if (!program) {
      console.error("Error creating program");
      return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.error(`Error creating program:`, gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  /**
   * Creates a shader program from vertex and fragment shaders
   * @param {string} vertexShaderSource - The GLSL source code for the vertex shader
   * @param {string} fragmentShaderSource - The GLSL source code for the fragment shader
   * @returns {WebGLProgram|null} The created program or null if creation failed
   */
  createShaderProgram(vertexShaderSource, fragmentShaderSource) {
    const gl = this.gl;
    if (!gl) return null;

    const vertexShader = this.createShader(
      gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this.createShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) {
      console.error(`Something went wrong creating the shaders`);
      return null;
    }

    return this.createProgram(vertexShader, fragmentShader);
  }

  /**
   * Get the canvas element
   * @returns {HTMLCanvasElement}
   */
  get canvas() {
    return this._canvas;
  }
}

// Register the custom element
customElements.define("webgl-canvas", WebGLCanvas);
