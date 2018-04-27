precision mediump float;

#pragma glslify: noise = require(glsl-noise/simplex/2d)

void main() {
  float n = cnoise2(gl_FragCoord.xy);
  gl_FragColor = vec4(vec3(n),1.0);
}
