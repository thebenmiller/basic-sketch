import WebGLFilter from './WebGLFilter';
import createShader from 'gl-shader';

import vert from './shaders/vert';
import fragTreshold from './shaders/frag-avggrid';

export default class AvgGridFilter extends WebGLFilter {
  constructor(initialWidth, initialHeight) {
    super(initialWidth, initialHeight);

    this.shader = createShader(this.gl, vert, fragTreshold);
  }
}
