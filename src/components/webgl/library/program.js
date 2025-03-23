// @ts-check

import { WebGL } from "./webgl.js";

export class Program {
  program;

  /**
   * Creates a WebGL2 program using the provided vertex and fragment shaders.
   * @param {WebGLShader} vertexShader - The vertex shader.
   * @param {WebGLShader} fragmentShader - The fragment shader.
   * @param {WebGL} gl The created WebGL2 program.
   */
  constructor(vertexShader, fragmentShader, gl) {
    this.gl = gl.getContext();
    this.program = this.createProgram(vertexShader, fragmentShader);
  }

  /**
   * Creates a WebGL2 program using the provided vertex and fragment shaders.
   * @param {WebGLShader} vertexShader - The vertex shader.
   * @param {WebGLShader} fragmentShader - The fragment shader.
   */
  createProgram(vertexShader, fragmentShader) {
    const vShader = this.createShader(this.gl.VERTEX_SHADER, vertexShader);
    const fShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShader);
    const program = this.gl.createProgram();

    this.gl.attachShader(program, vShader);
    this.gl.attachShader(program, fShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const error = this.gl.getProgramInfoLog(program);
      this.gl.deleteProgram(program);
      throw new Error(`Error linking program: ${error}`);
    }

    return program;
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error("Failed to create shader.");
    }
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const error = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error(`Error compiling shader: ${error}`);
    }

    return shader;
  }

  use() {
    this.gl.useProgram(this.program);
  }

  /**
   * Creates an attribute
   * @param {string} name
   */
  setAttribute(name) {
    const location = this.gl.getAttribLocation(this.program, name);
    this.gl.vertexAttribPointer(location, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(location);
  }

  /**
   * Creates an uniform
   * @param {string} name
   * @returns {WebGLUniformLocation}
   */
  getUniformLocation(name) {
    const location = this.gl.getUniformLocation(this.program, name);

    if (!location) {
      throw new Error("Location not found");
    }

    return location;
  }
}
