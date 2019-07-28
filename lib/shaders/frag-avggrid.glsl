precision mediump float;

uniform vec2 iResolution;
uniform sampler2D iChannel0;
const float size = 1.0;

void main() {
  vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
  uv.y = 1.0 - uv.y;

  vec2 gridIndex = floor(gl_FragCoord.xy  / size);

  float color = 0.0;

  for(int i=0; i<int(size*size); i++){
    vec2 p = vec2(gridIndex.x * size + mod(float(i), size), gridIndex.y * size + floor(float(i) / size)) / iResolution.xy;
    p.y = 1.0 - p.y;
    color += texture2D(iChannel0, p).r;
  }

  color /= (size*size);

  gl_FragColor = vec4(vec3(color),1.0);
}
