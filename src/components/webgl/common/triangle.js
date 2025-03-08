import { Vector2 } from "./vector-2.js";
import { Colour } from "./colour.js";

/**
 * Represents a Triangle
 */
export class Triangle {
  /**
   * Creates a triangle from 3 points and a colour.
   * @param {Vector2} a - First point.
   * @param {Vector2} b - Second point.
   * @param {Vector2} c - Third point.
   * @param {Colour} colour - Colour
   */
  constructor(a, b, c, colour) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.colour = colour;
  }

  /** renders the triangle in the webgl context
   * @param {WebGL2RenderingContext} gl
   * @param {WebGLProgram} program
   */
  render(gl, program) {
    const colourLocation = gl.getUniformLocation(program, "u_colour");

    gl.uniform4f(
      colourLocation,
      this.colour.r,
      this.colour.g,
      this.colour.b,
      this.colour.a
    );

    const coords = new Float32Array([
      this.a.x,
      this.a.y,
      this.b.x,
      this.b.y,
      this.c.x,
      this.c.y,
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, coords.length / 2);
  }
}
