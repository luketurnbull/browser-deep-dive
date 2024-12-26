// @ts-check

/**
 * Links a vertex and fragment shader together
 * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context
 * @param {WebGLShader} vertexShader - vertex shader
 * @param {WebGLShader} fragmentShader - fragment shader
 * @returns {WebGLProgram|null}
 */
export function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}
