varying vec2 vUv;
uniform float time;

void main() {
  vUv = uv;
  vec3 newPos = position;
  // newPos.z += 0.05 * (cos(0.5 * time + 100.0 * vUv.x) + sin(0.5 * time + 100.0 * vUv.y));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}