import { Triangle } from "./triangle.js";
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
    const topLeft = new Vector2(this.x, this.y);
    const topRight = new Vector2(this.x + this.width, this.y);
    const bottomLeft = new Vector2(this.x, this.y + this.height);
    const bottomRight = new Vector2(this.x + this.width, this.y + this.height);

    const triangleOne = new Triangle(
      topLeft,
      topRight,
      bottomLeft,
      this.colour
    );
    const triangleTwo = new Triangle(
      topRight,
      bottomRight,
      bottomLeft,
      this.colour
    );

    triangleOne.render(gl, program);
    triangleTwo.render(gl, program);
  }
}
