// @ts-check

import { WebGLCanvas } from "./src/components/webgl/webgl-canvas.js";

/**
 * @extends {WebGLCanvas}
 */
export class TriangleCanvas extends WebGLCanvas {
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
   in vec4 a_position;

   void main() {
      gl_Position = a_position;
   }
`;

    const fragmentShaderSource = /* glsl */ `#version 300 es
   precision highp float;

   out vec4 outColor;

   void main() {
      outColor = vec4(1, 0, 0.0, 1);
   }
`;

    const vertexShader = this.createShader(
      gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this.createShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) return;

    const program = this.createProgram(vertexShader, fragmentShader);

    if (!program) return;

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
      -0.5,
      -0.5, // bottom left
      0.5,
      -0.5, // bottom right
      0,
      0.5, // top
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

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
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

customElements.define("triangle-canvas", TriangleCanvas);
