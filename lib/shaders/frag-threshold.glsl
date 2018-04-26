precision mediump float;

uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform float threshold;

void main() {
  vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
  vec4 fragColor = texture2D(iChannel0, uv);
  float intensity = fragColor.r * .0722 + fragColor.g * .7152 + fragColor.b * .2126;

  if(intensity < threshold){
    gl_FragColor = vec4(0.0,0.0,0.0,1.0);
  }else{
    gl_FragColor = vec4(1.0,1.0,1.0,1.0);
  }
}
