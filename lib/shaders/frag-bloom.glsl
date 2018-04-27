precision mediump float;

uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform float threshold;


void main() {
  vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
  uv.y = 1.0 - uv.y;
  vec4 fragColor = texture2D(iChannel0, uv);
  vec3 luminanceVector = vec3(.0722, .7152, .2126);
  float luminance = dot(luminanceVector, fragColor.rgb);
  luminance = max(0.0, luminance - threshold);
  fragColor.rgb *= sign(luminance);

  gl_FragColor = vec4(fragColor.rgb, 1.0);
}
