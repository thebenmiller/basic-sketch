precision mediump float;

uniform sampler2D iChannel0;
uniform vec2 iResolution;


void main() {
  vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
  gl_FragColor = texture2D(iChannel0, uv);
}
