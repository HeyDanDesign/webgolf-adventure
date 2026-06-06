varying vec2 vUv;
uniform sampler2D map1;
uniform sampler2D map2;
uniform float time;

// Function to convert sRGB to linear
vec3 sRGBToLinear(vec3 srgb) {
  return pow(srgb, vec3(2.2));
}

void main() { 
  // Sample both textures in sRGB
  vec2 anim = vec2(time, time * 0.5);
  vec3 color1 = texture2D(map1, vUv + anim).rgb;
  vec3 color2 = texture2D(map2, vUv * 2.0 + anim).rgb;
  
  // Convert sRGB colors to linear space before blending
  vec3 color1Linear = sRGBToLinear(color1);
  vec3 color2Linear = sRGBToLinear(color2);
  
  // Blend the two textures. Adjust the blending factor as needed.
  vec3 blendedColorLinear = mix(color1Linear, color2Linear, 0.5);
  
  // Calculate the luminance of the blended color in linear space
  float luminance = dot(blendedColorLinear, vec3(0.299, 0.587, 0.114));
  
  // Convert blended color back to sRGB for display
  vec3 blendedColor = pow(blendedColorLinear, vec3(1.0 / 2.2));
  
  // Set alpha based on luminance: fully opaque for white, fully transparent for black.
  gl_FragColor = vec4(blendedColor, luminance); // Use luminance as the alpha channel.
}
