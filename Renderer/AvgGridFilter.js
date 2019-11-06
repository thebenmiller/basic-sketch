import WebGLFilter from './WebGLFilter';
import createShader from 'gl-shader';

import vert from './shaders/vert';
import fragTreshold from './shaders/frag-avggrid';

export default class AvgGridFilter extends WebGLFilter {
  constructor(initialWidth, initialHeight) {
    super(initialWidth, initialHeight);

    this.uniforms.size = 1.0;

    this.shader = createShader(this.gl, vert, fragTreshold);
  }

  setGridSize(size){
    this.uniforms.size = size;
  }
}
