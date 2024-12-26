// @ts-check

/**
 * Creates a WebGL shader
 * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context
 * @param {GLenum} type - The type of shader, VERTEX_SHADER or FRAGMENT_SHADER
 * @param {string} source - The GLSL source code for the shader
 * @returns {WebGLShader|null} The created shader
 */
export function createShader(gl, type, source) {
  const shader = gl.createShader(type);

  if (!shader) {
    console.error("Error creating shader");
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.error(`Error creating shader:`, gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}
