import { Colour } from "./colour.js";
import { Vector2 } from "./vector-2.js";

/**
 * Represents a Rectangle
 */
export class Rectangle {
  /**
   * Creates a Rectangle.
   * @param {number} x - Starting x (top left).
   * @param {number} y - Starting y (top right).
   * @param {number} width - Width.
   * @param {number} height - Height.
   * @param {Colour} colour - Colour
   */
  constructor(x, y, height, width, colour) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.colour = colour;
  }

  /** renders the rectangle in the webgl context
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

    const topLeft = new Vector2(this.x, this.y);
    const topRight = new Vector2(this.x + this.width, this.y);
    const bottomLeft = new Vector2(this.x, this.y + this.height);
    const bottomRight = new Vector2(this.x + this.width, this.y + this.height);

    const coords = new Float32Array([
      // Triangle one
      topLeft.x,
      topLeft.y,
      topRight.x,
      topRight.y,
      bottomLeft.x,
      bottomLeft.y,
      // Triangle two
      topRight.x,
      topRight.y,
      bottomLeft.x,
      bottomLeft.y,
      bottomRight.x,
      bottomRight.y,
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STATIC_DRAW);
    return coords.length;
  }
}
