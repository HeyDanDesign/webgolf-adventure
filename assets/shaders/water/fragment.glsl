varying vec2 vUv;
uniform sampler2D map;
uniform vec3 basecolor;
uniform vec3 foamcolor;
uniform float time;

void main() { 
  vec3 color1 = texture2D(map, vUv * 8.0 + vec2(time * 0.01, time / 0.01)).rgb;
  vec3 color2 = texture2D(map, vUv * 10.0 + vec2(time * 0.005, time / 0.01)).rgb;

  // Blend between the base color and the foam color based on the red channel of `color`.
  // The `clamp` function adjusts the contrast of `color2` before it's used for mixing.
  gl_FragColor.rgb = mix(basecolor * clamp(1.0 - color2, 0.93, 1.0), foamcolor, color1);
  gl_FragColor.a = 0.4;
  
}
