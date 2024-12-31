// @ts-check

import Canvas2D from "./canvas-2d.js";
import Vector2 from "./vector-2.js";

const FILL_STYLE = "#FF0000";
const SPACING = 40;

export default class Graph extends Canvas2D {
  /**
   * @param {string} canvasElementId - The ID of the canvas element
   */
  constructor(canvasElementId) {
    super(canvasElementId);
    this.drawGraph();
  }

  resize() {
    super.resize();
    this.drawGraph();
  }

  /**
   * Draws a grid of rounded rectangles on the canvas
   * @private
   */
  drawGraph() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillStyle = FILL_STYLE;

    for (let x = 0; x < this.width; x += SPACING) {
      const start = new Vector2(x, 0);
      const end = new Vector2(x, this.height);
      this.drawLine(start, end);
    }

    console.log(this.height);

    for (let y = 0; y < this.height; y += SPACING) {
      const start = new Vector2(0, y);
      const end = new Vector2(this.width, y);
      this.drawLine(start, end);
    }
  }

  /**
   * Draws a line on the canvas, from one point to another
   * @private
   * @param {Vector2} start
   * @param {Vector2} end
   */
  drawLine(start, end) {
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.stroke();
  }
}
