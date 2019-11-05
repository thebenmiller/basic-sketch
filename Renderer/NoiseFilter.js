import WebGLFilter from "./WebGLFilter";
import createShader from "gl-shader";

import vert from "./shaders/vert";
import fragNoise from "./shaders/frag-noise";

export default class NoiseFilter extends WebGLFilter {
  constructor(initialWidth, initialHeight) {
    super(initialWidth, initialHeight);
    this.shader = createShader(this.gl, vert, fragNoise);
    this.uniforms.in1 = 0.0015;
    this.uniforms.in2 = 0.03;
  }
  updateNoiseValues(noise1, noise2) {
    this.uniforms.in1 = noise1;
    this.uniforms.in2 = noise2;
  }
  incrementNoiseValues(amt = 0.001) {
    this.updateNoiseValues(this.uniforms.in1, this.uniforms.in2 + amt);
  }
}
