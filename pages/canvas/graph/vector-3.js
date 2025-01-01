// @ts-check

/**
 * Represents a 3D vector
 */
export default class Vector3 {
  /**
   * Creates a 3D vector.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {number} z - The z-coordinate.
   */
  constructor(x, y, z) {
    /** @type {number} */
    this.x = x;

    /** @type {number} */
    this.y = y;

    /** @type {number} */
    this.z = z;
  }

  /**
   * Rotates the vector on the z axis
   * @param {number} angle
   */
  rotateZ(angle) {
    const originalX = this.x;
    this.x = originalX * Math.cos(angle) - this.y * Math.sin(angle);
    this.y = originalX * Math.sin(angle) + this.y * Math.cos(angle);
  }
}
