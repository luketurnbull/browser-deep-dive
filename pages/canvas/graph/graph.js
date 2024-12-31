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
  camera = new Vector3(0, 0, 3);

  /**
   * @param {string} canvasElementId - The ID of the canvas element
   */
  constructor(canvasElementId) {
    super(canvasElementId);
    this.init();
  }

  /**
   * Initialise everything, start animation loop
   */
  init() {
    // Load points
    for (let x = -1; x <= 1; x += 0.25) {
      for (let y = -1; y <= 1; y += 0.25) {
        for (let z = -1; z <= 1; z += 0.25) {
          const vec3 = new Vector3(x, y, z);
          this.cubePoints.push(vec3);
        }
      }
    }

    this.startLoop();
  }

  /**
   * Starts the animation loop
   */
  startLoop() {
    //  const loop = () => {
    //    this.render();
    //    console.log("Test");
    //    this.animationFrameId = requestAnimationFrame(loop);
    //  };
    //  loop();

    this.render();
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
    this.drawGraph();

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

    // Draw rectangle
    //  this.drawRectangle(10, 10, 300, 200, "#00FF00");
  }

  /**
   * Retrieves a 3D vector and returns a projected 2D point
   * @param {Vector3} point - A point in 3D space
   * @returns {Vector2}
   */
  project(point) {
    const effectiveZ = point.z + this.camera.z;

    // Check for invalid z values
    if (effectiveZ <= 0) {
      return new Vector2(0, 0); // Or handle invalid points appropriately
    }

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
   * Draws a line on the canvas, from one point to another
   * @private
   * @param {Vector2} start
   * @param {Vector2} end
   * @param {string} colour
   */
  drawLine(start, end, colour) {
    this.context.fillStyle = colour;
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.stroke();
  }

  /**
   * Draws a line on the canvas, from one point to another
   * @private
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} colour
   */
  drawRectangle(x, y, width, height, colour) {
    console.log(`
            Draw rectangle:
            x: ${x}
            y: ${y}
         `);
    this.context.fillStyle = colour;
    this.context.rect(x, y, width, height);
    this.context.fill();
  }

  /**
   * Clean up function
   */
  destroy() {
    this.stopLoop();
    super.destroy();
  }
}
