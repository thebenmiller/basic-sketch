precision mediump float;

uniform vec2 iResolution;
uniform sampler2D iChannel0;

void main() {
  vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
  uv.y = 1.0 - uv.y;
  vec4 fragColor = texture2D(iChannel0, uv);
  vec3 luminanceVector = vec3(.0722, .7152, .2126);
  float luminance = dot(luminanceVector, fragColor.rgb);
  gl_FragColor = vec4(vec3(luminance),1.0);
}
