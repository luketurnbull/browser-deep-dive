// @ts-check

import { WebGLCanvas } from "./common/webgl-canvas.js";

// Learnings from https://webgl2fundamentals.org/webgl/lessons/webgl-how-it-works.html

/**
 * @extends {WebGLCanvas}
 */
export class WebGlFundamentalsOne extends WebGLCanvas {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.drawTriangle();
    this.render();
  }

  handleResize() {
    super.handleResize();
    this.drawTriangle();
  }

  /**
   * Renders the WebGL scene.
   */
  render() {
    console.log(this.children);
    // Render each child component
    Array.from(this.children).forEach((child) => {
      if (child instanceof Triangle) {
        const vertices = child.getVertices();
        this.drawTriangle(vertices);
      }
    });
  }

  drawTriangle(vertices = []) {
    const gl = this.gl;

    if (!gl) return;

    const vertexShaderSource = /* glsl */ `#version 300 es
      in vec2 a_position;

      uniform vec2 u_resolution;

      out vec4 v_color;

      void main() {
        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace, 0, 1);
        v_color = gl_Position * 0.5 + 0.5;
      }
    `;

    const fragmentShaderSource = /* glsl */ `#version 300 es
      precision highp float;

      in vec4 v_color;

      out vec4 outColor;

      void main() {
          outColor = v_color;
      }
    `;

    const program = this.createShaderProgram(
      vertexShaderSource,
      fragmentShaderSource
    );

    if (!program) return;

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );

    const resolutionUniformLocation = gl.getUniformLocation(
      program,
      "u_resolution"
    );

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const coords = new Float32Array([
      // First triangle
      ...vertices,
      // Second triangle
      700,
      200,
      800,
      600,
      1200,
      50,
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STATIC_DRAW);

    const vertexArrayObject = gl.createVertexArray();

    gl.bindVertexArray(vertexArrayObject);
    gl.enableVertexAttribArray(positionAttributeLocation);

    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    const noOfTriangles = coords.length / 6;

    gl.useProgram(program);
    gl.uniform2f(
      resolutionUniformLocation,
      this.canvas.width,
      this.canvas.height
    );
    gl.drawArrays(gl.TRIANGLES, 0, noOfTriangles * 3);
  }
}

/**
 * @class Triangle
 * @extends HTMLElement
 * @classdesc A Web Component that represents a triangle shape.
 */
class Triangle extends HTMLElement {
  constructor() {
    super();
    this._vertices = [20, 20, 200, 500, 500, 20]; // Example vertices for a triangle
  }

  static get observedAttributes() {
    return ["vertices"];
  }

  /**
   * Called when an attribute is changed.
   * @param {string} name - The name of the attribute that changed.
   * @param {string} oldValue - The old value of the attribute.
   * @param {string} newValue - The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "vertices") {
      this.vertices = newValue.split(",").map(Number); // Convert to an array of numbers
    }
  }

  /**
   * Gets the vertices of the triangle.
   * @returns {number[]} The vertices of the triangle.
   */
  getVertices() {
    return this._vertices;
  }

  /**
   * Sets the vertices of the triangle.
   * @param {number[]} value - The new vertices for the triangle.
   */
  set vertices(value) {
    this._vertices = value;
  }
}

customElements.define("webgl-triangle", Triangle);
customElements.define("webgl-fundamentals-one", WebGlFundamentalsOne);
