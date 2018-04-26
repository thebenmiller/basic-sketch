import WebGLFilter from './WebGLFilter';
import createShader from 'gl-shader';
import createFBO from 'gl-fbo';
import triangle from 'gl-big-triangle';

import vert from './shaders/vert';
import frag from './shaders/frag';
import fragBlur from './shaders/frag-blur';

export default class BlurFilter extends WebGLFilter {
  constructor(initialWidth, initialHeight, blurAmount) {
    super(initialWidth, initialHeight);

    this.fboA = createFBO(this.gl, initialWidth, initialHeight);
    this.fboB = createFBO(this.gl, initialWidth, initialHeight);
    [this.fboA.color[0], this.fboB.color[0]].forEach((texture) => {
      texture.wrapS = texture.wrapT = this.gl.CLAMP_TO_EDGE;
      texture.minFilter = this.gl.LINEAR;
      texture.magFilter = this.gl.LINEAR;
    });
    this.shader = createShader(this.gl, vert, fragBlur);
    this.iterations = blurAmount || 4;
  }
  set blurAmount(blurValue) {
    this.iterations = blurValue;
  }
  render() {
    let writeBuffer = this.fboA;
    let readBuffer = this.fboB;

    this.gl.viewport(0, 0, this.w, this.h);

    for (let i = 0; i < this.iterations * 2; i++) {
      const radius = this.iterations - Math.floor(i / 2);

      // render to buffer
      writeBuffer.bind();

      if (i === 0) {
        this.texture.bind();
      } else {
        readBuffer.color[0].bind();
      }

      this.shader.bind();

      Object.keys(this.uniforms).forEach(key => (this.shader.uniforms[key] = this.uniforms[key]));

      this.shader.uniforms.flip = true;

      if (i % 2) {
        this.shader.uniforms.direction = [radius, 0];
      } else {
        this.shader.uniforms.direction = [0, radius];
      }

      this.triangle.bind();
      this.triangle.draw();

      // swap buffers
      const t = writeBuffer;
      writeBuffer = readBuffer;
      readBuffer = t;
    }

    // render to screen
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    writeBuffer.color[0].bind();
    this.shader.uniforms.direction = [0, 0];
    this.shader.uniforms.flip = this.iterations % 2 !== 0;
    this.triangle.bind();
    this.triangle.draw();
  }
}
