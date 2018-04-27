import WebGLFilter from './WebGLFilter';
import createShader from 'gl-shader';

import vert from './shaders/vert';
import fragNoise from './shaders/frag-noise';

export default class NoiseFilter extends WebGLFilter {
  constructor(initialWidth, initialHeight) {
    super(initialWidth, initialHeight);
    this.shader = createShader(this.gl, vert, fragNoise);
  }
}
