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

  uniform vec4 u_colour;

  // we need to declare an output for the fragment shader
  out vec4 outColour;

  void main() {
    // Just set the output to a constant redish-purple
    outColour = u_colour;
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
    this.program = new Program(
      vertexShaderSource,
      fragmentShaderSource,
      this.webGl
    );

    this.setupAttributesAndUniforms();
    this.render();

    document.addEventListener("resize", () => {
      this.render();
    });
  }

  setupAttributesAndUniforms() {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    // Create position attribute
    this.program.setAttribute("a_position");
    this.program.use();

    // Pass in resolution uniform to transform clip space to pixels
    const resolutionUniform = this.program.getUniformLocation("u_resolution");
    // Pass in the canvas resolution so we can convert from
    // pixels to clipspace in the shader
    this.gl.uniform2f(
      resolutionUniform,
      this.gl.canvas.width,
      this.gl.canvas.height
    );
  }

  render() {
    this.webGl.resize();
    this.webGl.clearCanvas();

    for (let i = 0; i < 10; i++) {
      this.drawRectangle(
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        new Colour(Math.random(), Math.random(), Math.random(), 1)
      );
    }
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {Colour} colour
   */
  drawRectangle(x, y, width, height, colour) {
    const rectangle = new Rectangle(x, y, width, height);

    // three 2d points
    const positions = rectangle.toArray();
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    );

    const colourUniform = this.program.getUniformLocation("u_colour");

    this.gl.uniform4f(colourUniform, colour.r, colour.g, colour.b, colour.a);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, positions.length / 2);
  }
}

class Triangle {
  /**
   *
   * @param {Vector2} a - Point A
   * @param {Vector2} b - Point B
   * @param {Vector2} c - Point C
   */
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  /**
   *
   * @returns {number[]} numbered array of coordinates
   */
  toArray() {
    return [this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y];
  }
}

class Rectangle {
  /**
   *
   * @param {number} x - Starting x (left)
   * @param {number} y - Starting y (top)
   * @param {number} width - Width of Rectangle
   * @param {number} height - Height of Rectangle
   */
  constructor(x, y, width, height) {
    this.gl = WebGL.instance.getContext();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Rectangle is formed from two triangles and four points
    const topLeft = new Vector2(this.x, this.y);
    const topRight = new Vector2(this.x + this.width, this.y);
    const bottomLeft = new Vector2(this.x, this.y + this.height);
    const bottomRight = new Vector2(this.x + this.width, this.y + this.height);

    this.a = new Triangle(topLeft, topRight, bottomLeft);
    this.b = new Triangle(topRight, bottomLeft, bottomRight);
  }

  /**
   *
   * @returns {number[]} numbered array of coordinates
   */
  toArray() {
    return [...this.a.toArray(), ...this.b.toArray()];
  }
}

function main() {
  new Canvas();
}

main();
