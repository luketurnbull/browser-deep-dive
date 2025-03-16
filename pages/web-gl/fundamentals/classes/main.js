// @ts-check

import {
  WebGL,
  Program,
} from "../../../../src/components/webgl/common/webgl.js";

const vertexShaderSource = /* glsl */ `#version 300 es
  // an attribute is an input (in) to a vertex shader.
  // It will receive data from a buffer
  in vec4 a_position;

  // all shaders have a main function
  void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = /* glsl */ `#version 300 es
  // fragment shaders don't have a default precision so we need
  // to pick one. highp is a good default. It means "high precision"
  precision highp float;

  // we need to declare an output for the fragment shader
  out vec4 outColor;

  void main() {
    // Just set the output to a constant redish-purple
    outColor = vec4(1, 0, 0.5, 1);
  }
`;

class Canvas {
  constructor() {
    const canvas = /** @type {HTMLCanvasElement} */ (
      document.getElementById("canvas")
    );

    this.webGl = WebGL.instance;
    this.webGl.init(canvas);
    this.gl = this.webGl.getContext();
    this.render();

    document.addEventListener("resize", () => {
      this.render();
    });
  }

  render() {
    const program = new Program(
      vertexShaderSource,
      fragmentShaderSource,
      this.webGl
    );

    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    // three 2d points
    const positions = [0, 0, 0, 0.5, 0.7, 0];
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    );
    const vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(vao);

    // Create position attribute
    program.setAttribute("a_position");

    this.webGl.resize();
    this.webGl.clearCanvas();

    program.use();

    const primitiveType = this.gl.TRIANGLES;

    this.gl.drawArrays(primitiveType, 0, positions.length / 2);
  }
}

function main() {
  const canvas = new Canvas();
}

main();
