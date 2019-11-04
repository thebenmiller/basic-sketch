import WebGLFilter from './WebGLFilter';
import createShader from 'gl-shader';

import vert from './shaders/vert';
import fragTreshold from './shaders/frag-threshold';

export default class ThresholdFilter extends WebGLFilter {
  constructor(initialWidth, initialHeight, thresholdValue) {
    super(initialWidth, initialHeight);

    this.shader = createShader(this.gl, vert, fragTreshold);
    this.uniforms.threshold = thresholdValue;
  }
  set threshold(thresholdValue) {
    this.uniforms.threshold = thresholdValue;
  }
}
