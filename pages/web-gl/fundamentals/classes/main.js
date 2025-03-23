// @ts-check

import { WebGL } from "../../../../src/components/webgl/library/webgl.js";
import { Rectangle } from "../../../../src/components/webgl/library/rectangle.js";
import { Program } from "../../../../src/components/webgl/library/program.js";
import { Colour } from "../../../../src/components/webgl/library/colour.js";

const UNIFORMS = {
  resolution: "u_resolution",
  colour: "u_colour",
};

const ATTRIBUTES = {
  position: "a_position",
};

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
    this.program.setAttribute(ATTRIBUTES.position);
    this.program.use();

    // Pass in resolution uniform to transform clip space to pixels
    const resolutionUniform = this.program.getUniformLocation(
      UNIFORMS.resolution
    );
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

    const colourUniform = this.program.getUniformLocation(UNIFORMS.colour);

    this.gl.uniform4f(colourUniform, colour.r, colour.g, colour.b, colour.a);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, positions.length / 2);
  }
}

new Canvas();
