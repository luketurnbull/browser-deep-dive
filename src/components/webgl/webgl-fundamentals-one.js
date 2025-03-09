// @ts-check

import { WebGLCanvas } from "./common/webgl-canvas.js";
import { Colour } from "./common/colour.js";
import { Rectangle } from "./common/rectangle.js";

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
    this.render();
  }

  /**
   * Renders the WebGL scene.
   */
  render() {
    super.handleResize();
    this.create2DProgram();

    const gl = this.gl;
    const program = this.program;

    if (!gl || !program) return;

    console.log("hit");

    // Attribute locations
    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );

    // Uniform locations
    const resolutionUniformLocation = gl.getUniformLocation(
      program,
      "u_resolution"
    );

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

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

    gl.useProgram(program);
    gl.uniform2f(
      resolutionUniformLocation,
      this.canvas.width,
      this.canvas.height
    );

    const colour = new Colour(Math.random(), Math.random(), Math.random(), 1);
    const rectangle = new Rectangle(
      Math.random() * 200,
      Math.random() * 200,
      Math.random() * 500,
      Math.random() * 500,
      colour
    );
    let count = rectangle.render(gl, program);
    gl.drawArrays(gl.TRIANGLES, 0, count / 2);
  }

  create2DProgram() {
    const gl = this.gl;

    if (!gl) return;

    const vertexShaderSource = /* glsl */ `#version 300 es
      in vec2 a_position;

      uniform vec2 u_resolution;

      void main() {
        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      }
    `;

    const fragmentShaderSource = /* glsl */ `#version 300 es
      precision highp float;

      uniform vec4 u_colour;

      out vec4 outColor;

      void main() {
        outColor = u_colour;
      }
    `;

    const program = this.createShaderProgram(
      vertexShaderSource,
      fragmentShaderSource
    );

    this.program = program;
  }
}

customElements.define("webgl-fundamentals-one", WebGlFundamentalsOne);
