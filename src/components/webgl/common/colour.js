/**
 * Represents a RGBA colour
 */
export class Colour {
  /**
    * Creates a Rectangle.
    * @param {number} r - Red between 0 and 1.
    * @param {number} g - Green between 0 and 1.
    * @param {number} b - Blue between 0 and 1.
    * @param {number} a - Alpha between 0 and 1.
    
    */
  constructor(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}
