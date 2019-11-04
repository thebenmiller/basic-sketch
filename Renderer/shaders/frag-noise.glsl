precision mediump float;

#pragma glslify: noise = require(glsl-noise/simplex/2d)

uniform float in1;
uniform float in2;
uniform float im;

void main() {
  float n = noise(gl_FragCoord.xy * in1);
  float n2 = noise(gl_FragCoord.xy * in2);
  float m = mix(n, n2, im);
  gl_FragColor = vec4(vec3(m),1.0);
}
