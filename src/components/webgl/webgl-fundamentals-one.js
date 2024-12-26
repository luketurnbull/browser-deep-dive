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
  }

  handleResize() {
    super.handleResize();
    this.drawTriangle();
  }

  drawTriangle() {
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

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([100, 100, 400, 400, 800, 100]),
      gl.STATIC_DRAW
    );

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

    const noOfTriangles = 1;

    gl.useProgram(program);
    gl.uniform2f(
      resolutionUniformLocation,
      this.canvas.width,
      this.canvas.height
    );
    gl.drawArrays(gl.TRIANGLES, 0, noOfTriangles * 3);
  }
}

customElements.define("webgl-fundamentals-one", WebGlFundamentalsOne);
