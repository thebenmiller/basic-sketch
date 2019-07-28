import WebGLFilter from './WebGLFilter';
import createShader from 'gl-shader';

import vert from './shaders/vert';
import fragNoise from './shaders/frag-noise';

export default class NoiseFilter extends WebGLFilter {
  constructor(initialWidth, initialHeight) {
    super(initialWidth, initialHeight);
    this.shader = createShader(this.gl, vert, fragNoise);
    this.uniforms.in1 = 0.0005;
    this.uniforms.in2 = 0.0035;
    this.uniforms.im = 0.25;
  }
  updateNoiseValues(noise1, noise2, mix) {
    this.uniforms.in1 = noise1;
    this.uniforms.in2 = noise2;
    this.uniforms.im = mix;
  }
  incrementNoiseValues(mamt, namt) {
    const mix = (this.uniforms.im + mamt) % 1;
    this.updateNoiseValues(this.uniforms.in1 + namt, this.uniforms.in2 + namt, mix);
  }
}
