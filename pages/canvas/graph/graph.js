// @ts-check

import Canvas2D from "./canvas-2d.js";
import Vector2 from "./vector-2.js";
import Vector3 from "./vector-3.js";

const FILL_STYLE = "#FF0000";
const SPACING = 40;

export default class Graph extends Canvas2D {
  /** @type {number|null} */
  animationFrameId = null;
  /** @type {number} */
  fovFactor = 200;
  /** @type {Vector3[]} */
  cubePoints = [];
  /** @type {Vector3} */
  camera = new Vector3(0, 2, 3);

  /**
   * @param {string} canvasElementId - The ID of the canvas element
   */
  constructor(canvasElementId) {
    super(canvasElementId);
    this.fovFactor = 400;
    this.camera = new Vector3(0, 0, 5);
    this.init();
  }

  /**
   * Initialise everything, start animation loop
   */
  init() {
    // Create a proper cube with 8 vertices
    const size = 1;
    this.cubePoints = [
      new Vector3(-size, -size, -size),
      new Vector3(size, -size, -size),
      new Vector3(-size, size, -size),
      new Vector3(size, size, -size),
      new Vector3(-size, -size, size),
      new Vector3(size, -size, size),
      new Vector3(-size, size, size),
      new Vector3(size, size, size),
    ];

    this.startLoop();
  }

  /**
   * Starts the animation loop
   */
  startLoop() {
    let lastTimestamp = performance.now(); // Use performance.now for high precision
    const loop = (currentTimestamp) => {
      const deltaTime = (currentTimestamp - lastTimestamp) / 1000; // Convert ms to seconds
      lastTimestamp = currentTimestamp;
      this.update(deltaTime); // Update with delta time
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop); // Start the loop
  }

  /**
   * Stops the animation loop
   */
  stopLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Renders the content
   */
  render() {
    // Clear canvas
    this.context.clearRect(0, 0, this.width, this.height);

    // Draw graph lines
    // this.drawGraph();

    this.cubePoints.forEach((point) => {
      const projectedPoint = this.project(point);

      this.drawRectangle(
        projectedPoint.x + this.width / 2,
        projectedPoint.y + this.height / 2,
        4,
        4,
        "#FF0000"
      );
    });
  }

  /**
   * Updates the state of the application
   * @param {number} deltaTime - Time elapsed since the last frame in seconds
   */
  update(deltaTime) {
    // Example: Rotate the cube points
    const rotationSpeed = Math.PI / 2; // Radians per second
    const angle = rotationSpeed * deltaTime;

    this.cubePoints.forEach((point) => {
      // point.rotateZ(angle);
      // point.rotateX(angle);
      point.rotateY(angle);
    });
  }

  /**
   * Retrieves a 3D vector and returns a projected 2D point
   * @param {Vector3} point - A point in 3D space
   * @returns {Vector2}
   */
  project(point) {
    const effectiveZ = point.z + this.camera.z;

    const projectedX = Math.round((point.x * this.fovFactor) / effectiveZ);
    const projectedY = Math.round((point.y * this.fovFactor) / effectiveZ);

    return new Vector2(projectedX, projectedY);
  }

  /**
   * Draws a grid of rounded rectangles on the canvas
   * @private
   */
  drawGraph() {
    for (let x = 0; x < this.width; x += SPACING) {
      const start = new Vector2(x, 0);
      const end = new Vector2(x, this.height);
      this.drawLine(start, end, FILL_STYLE);
    }

    for (let y = 0; y < this.height; y += SPACING) {
      const start = new Vector2(0, y);
      const end = new Vector2(this.width, y);
      this.drawLine(start, end, FILL_STYLE);
    }
  }

  /**
   * Clean up function
   */
  destroy() {
    this.stopLoop();
    super.destroy();
  }
}
