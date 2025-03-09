// @ts-check

import { WebGL } from "../../../../src/components/webgl/common/webgl.js";

const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("myCanvas")
);

const utils = WebGL.instance;
utils.init(canvas);
const gl = utils.getContext();

const vertexShaderSource = /* glsl */ `#version 300 es
  in vec4 a_position;
  uniform mat4 u_matrix;
  
  void main() {
    gl_Position = u_matrix * a_position;
  }
`;

const fragmentShaderSource = /* glsl */ `#version 300 es
  precision highp float;
  
  out vec4 outColor;

  void main() {
    outColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

try {
  const vertexShader = utils.createShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = utils.createShader(
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  const program = utils.createProgram(vertexShader, fragmentShader);
  console.log("WebGL program created successfully:", program);
} catch (error) {
  console.error(error);
}
