// @ts-check

import { Vector2 } from "./vector-2.js";

export class Triangle {
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
