// @ts-check

import { Vector2 } from "./vector-2.js";
import { Triangle } from "./triangle.js";
import { WebGL } from "./webgl.js";

export class Rectangle {
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
