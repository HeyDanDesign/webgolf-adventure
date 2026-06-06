uniform sampler2D alphaMap;
uniform float influence;
uniform float brightness;
varying vec2 vUv;

void main() {
    vec4 texel = texture2D(alphaMap, vUv * 2.0);
    float alpha = mix(1.0, texel.r, influence); // Interpolate between full alpha and texture's alpha
    alpha *= brightness;

    // Define start and end colors for the gradient
    vec3 startColor = vec3(0.302, 0.659, 0.894);
    vec3 endColor = vec3(0.302, 0.659, 0.894); // Bottom color

    // Interpolate between startColor and endColor based on the vertical position
    vec3 gradientColor = mix(endColor, startColor, vUv.y);

    // Use the interpolated gradientColor and the dynamic alpha value
    gl_FragColor = vec4(gradientColor, alpha);
}
