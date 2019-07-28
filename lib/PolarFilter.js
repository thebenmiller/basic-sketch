import WebGLFilter from './WebGLFilter';
import createShader from 'gl-shader';

import vert from './shaders/vert';
import fragPolar from './shaders/frag-polar';

export default class PolarFilter extends WebGLFilter {
  constructor(initialWidth, initialHeight) {
    super(initialWidth, initialHeight);
    this.shader = createShader(this.gl, vert, fragPolar);
  }
}
