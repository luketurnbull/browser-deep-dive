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
    const originalY = this.y;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    this.x = originalX * cos - originalY * sin;
    this.y = originalX * sin + originalY * cos;
  }

  /**
   * Rotates the vector on the x axis
   * @param {number} angle
   */
  rotateX(angle) {
    const originalZ = this.z;
    const originalY = this.y;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    this.z = originalZ * cos - originalY * sin;
    this.y = originalZ * sin + originalY * cos;
  }

  /**
   * Rotates the vector on the x axis
   * @param {number} angle
   */
  rotateY(angle) {
    const originalZ = this.z;
    const originalX = this.x;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    this.x = originalX * cos - originalZ * sin;
    this.z = originalX * sin + originalZ * cos;
  }
}
