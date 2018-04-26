import triangle from 'gl-big-triangle';
import createShader from 'gl-shader';
import createTexture from 'gl-texture2d';
import createWebglContext from 'webgl-context';

import vert from './shaders/vert';
import frag from './shaders/frag';

export default class WebGLFilter {
  constructor(initialWidth, initialHeight) {
    this.canvasWidth = initialWidth;
    this.canvasHeight = initialHeight;
    this.gl = createWebglContext({
      width: initialWidth,
      height: initialHeight,
    });
    this.canvas = this.gl.canvas;
    this.shader = createShader(this.gl, vert, frag);
    this.triangle = triangle(this.gl);
    this.texture = null;
    this.uniforms = {
      iResolution: [initialWidth, initialHeight],
      iChannel0: 0,
    };
  }
  set w(width) {
    this.canvas.width = this.canvasWidth = width;
  }
  get w() {
    return this.gl.drawingBufferWidth;
  }
  set h(height) {
    this.canvasHeight = this.canvasHeight = height;
  }
  get h() {
    return this.gl.drawingBufferHeight;
  }
  set textureData(textureData) {
    // This might need to be a little more understanding of texture changes.
    // Like screen resizing
    if (this.texture && this.texture.width && this.texture.height) {
      this.texture.setPixels(textureData);
    } else {
      this.texture = createTexture(this.gl, textureData);
      this.texture.wrapS = this.texture.wrapT = this.gl.CLAMP_TO_EDGE;
      this.texture.minFilter = this.gl.LINEAR;
      this.texture.magFilter = this.gl.LINEAR;
      // this.uniforms.texture = this.texture;
    }
  }
  set test(text) {
    console.log('test', text);
  }
  get imageData() {
    const pixels = new Uint8Array(this.w * this.h * 4);
    this.gl.readPixels(0, 0, this.w, this.h, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
    return pixels;
  }
  render() {
    this.gl.viewport(0, 0, this.w, this.h);
    this.shader.bind();
    this.triangle.bind();
    this.texture.bind();
    Object.keys(this.uniforms).forEach(key => (this.shader.uniforms[key] = this.uniforms[key]));
    this.triangle.draw();
  }
}
