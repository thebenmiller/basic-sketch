import WebGLFilter from './WebGLFilter';
import createShader from 'gl-shader';

import vert from './shaders/vert';
import fragGreyscale from './shaders/frag-greyscale';

export default class GreyscaleFilter extends WebGLFilter {
  constructor(initialWidth, initialHeight) {
    super(initialWidth, initialHeight);

    this.shader = createShader(this.gl, vert, fragGreyscale);
  }
}
