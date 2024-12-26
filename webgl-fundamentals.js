// @ts-check

import { createShader } from "./src/utils/webgl/create-shader.js";
import { createProgram } from "./src/utils/webgl/create-program.js";
import { resizeCanvasToDisplaySize } from "./src/utils/canvas/resize-canvas.js";

const vertexShaderSource = /* glsl */ `#version 300 es
   in vec4 a_position;

   void main() {
      gl_Position = a_position;
   }
`;

const fragmentShaderSource = /* glsl */ `#version 300 es
   precision highp float;

   out vec4 outColor;

   void main() {
      outColor = vec4(1, 0, 0.0, 1);
   }
`;

function main() {
  const canvas = /** @type {HTMLCanvasElement|null} */ (
    document.getElementById("demo-canvas")
  );

  if (!canvas) {
    console.log(`The canvas element doesn't exist`);
    return;
  }

  const gl = canvas.getContext("webgl2");
  if (!gl) {
    console.error(`Your browser doesn't support WebGL2`);
    return;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  if (!vertexShader || !fragmentShader) {
    console.error(`Something went wrong creating the shaders`);
    return;
  }

  const program = createProgram(gl, vertexShader, fragmentShader);

  if (!program) {
    console.error(`Something went wrong creating the program`);
    return;
  }

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [-0.5, -0.5, 0, 0.5, 0.5, -0.5];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const vertexArrayObject = gl.createVertexArray();
  gl.bindVertexArray(vertexArrayObject);
  gl.enableVertexAttribArray(positionAttributeLocation);

  const size = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // @ts-ignore
  resizeCanvasToDisplaySize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.height, gl.canvas.width);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.bindVertexArray(vertexArrayObject);

  const primitiveType = gl.TRIANGLES;
  const count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

main();
