precision mediump float;

#define PI 3.1415926538

uniform sampler2D iChannel0;
uniform vec2 iResolution;
uniform vec2 direction;
uniform bool flip;

float smoother(float i, float bottom, float top, float power, float modifier){
  float n = smoothstep(bottom, top, i);
  float n2 = pow( abs(sin(PI*n)), power );
  return floor( n2 * top * modifier );
}

float map( float value, float inMin, float inMax, float outMin, float outMax ) {
  return ( (value - inMin) / ( inMax - inMin ) * ( outMax - outMin ) ) + outMin;
}

void main() {

  float dist = sqrt(pow(gl_FragCoord.x-iResolution.x/2.0,2.0)+pow(gl_FragCoord.y-iResolution.y/2.0,2.0));
  float r = (atan(gl_FragCoord.y-iResolution.y/2.0, gl_FragCoord.x-iResolution.x/2.0) - PI/2.0 ) / (PI*3.0);

  float x = mod(sin(r) * iResolution.x + iResolution.x/2.0, iResolution.x);
  float y = mod(iResolution.y - cos(r) * dist*1.5, iResolution.y);

  gl_FragColor = texture2D(iChannel0, vec2(x,y)/iResolution);
}
