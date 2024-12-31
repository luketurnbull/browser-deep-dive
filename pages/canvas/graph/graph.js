// @ts-check

import Canvas2D from "./canvas-2d.js";

const FILL_STYLE = "#333333";
const SPACING = 20;
const RECT_SIZE = 3;
const BORDER_RADIUS = 1;

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
    if (!this.context) return;

    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillStyle = FILL_STYLE;

    for (let x = 0; x < this.width; x += SPACING) {
      for (let y = 0; y < this.height; y += SPACING) {
        this.context.beginPath();
        this.context.roundRect(x, y, RECT_SIZE, RECT_SIZE, BORDER_RADIUS);
        this.context.fill();
      }
    }
  }
}
