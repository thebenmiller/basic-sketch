precision mediump float;

uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform float size;

void main() {
  vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
  uv.y = 1.0 - uv.y;

  vec2 pixelSize = vec2(size / iResolution.x, size / iResolution.y);
  vec2 gridIndex = floor(gl_FragCoord.xy  / size);
  vec2 position = floor(uv/pixelSize)*pixelSize;

  gl_FragColor = vec4(texture2D(iChannel0, position));

  float color = 0.0;
}
