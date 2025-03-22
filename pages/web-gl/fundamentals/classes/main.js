// @ts-check

import { Colour } from "../../../../src/components/webgl/common/colour.js";
import { Vector2 } from "../../../../src/components/webgl/common/vector-2.js";
import {
  WebGL,
  Program,
} from "../../../../src/components/webgl/common/webgl.js";

const vertexShaderSource = /* glsl */ `#version 300 es
  in vec2 a_position;
  
  uniform vec2 u_resolution;

  void main() {
    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clip space)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
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
    this.webGl.init(canvas, new Colour(0, 0, 0, 0));
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

    const a = new Vector2(10, 20);
    const b = new Vector2(80, 20);
    const c = new Vector2(10, 30);

    // three 2d points
    const positions = [a.x, a.y, b.x, b.y, c.x, c.y];
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    );

    const vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(vao);

    this.webGl.resize();
    this.webGl.clearCanvas();

    program.use();

    // Create position attribute
    program.setAttribute("a_position");
    const resolutionUniform = program.getUniformLocation("u_resolution");

    // Pass in the canvas resolution so we can convert from
    // pixels to clipspace in the shader
    this.gl.uniform2f(
      resolutionUniform,
      this.gl.canvas.width,
      this.gl.canvas.height
    );

    this.gl.drawArrays(this.gl.TRIANGLES, 0, positions.length / 2);
  }
}

function main() {
  new Canvas();
}

main();
