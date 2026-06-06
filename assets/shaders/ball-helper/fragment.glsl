// Fragment Shader
varying vec2 vUv;

void main() {
    // Transform the UVs to be centered
    vec2 centeredUV = vUv * 2.0 - 1.0;
    float dist = length(centeredUV);
    float dotThickness = 0.2;
    float spaceBetweenDots = 0.33;

    // Determine the radius at which the dots will appear
    float radius = 0.4; // for a circle, radius is 1.0 in normalized UV coordinates

    // Calculate the pattern without if-statement
    float angle = atan(centeredUV.y, centeredUV.x);
    float pattern = mod(angle, dotThickness + spaceBetweenDots) < dotThickness ? 1.0 : 0.0;
    float inRadius = step(0.3, abs(dist - radius));
    float alpha = pattern * inRadius;

    alpha *= 0.5;

    // Set the fragment color
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha); // White dots with alpha for transparency
}
