precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uSeed;
uniform float uParticles;
uniform float uOpacity;

float res = 300.0;
float gravity = -0.4;

void main() {
  vec2 uv = vUv - 0.5;
  uv.y += 0.25;

  float clr = 0.0;
  float timecycle = uTime;
  float seed = (uSeed + floor(uTime));

  float invres = 2.0 / res;
  float invparticles = 0.5 / uParticles;

  for (float i = 0.0; i < uParticles; i += 1.0) {
    seed += i + tan(seed);
    vec2 tPos = (vec2(cos(seed), sin(seed))) * i * invparticles;

    vec2 pPos = vec2(0.0, 0.0);
    pPos.x = ((tPos.x) * timecycle);
    pPos.y = -gravity * (timecycle * timecycle) + tPos.y * timecycle + pPos.y;

    pPos = floor(pPos * res) * invres;

    vec2 p1 = pPos;
    vec4 r1 = vec4(vec2(step(p1, uv)), 1.0 - vec2(step(p1 + invres, uv)));
    float px1 = r1.x * r1.y * r1.z * r1.w;
    float px2 = smoothstep(0.0, 200.0, (1.0 / distance(uv, pPos + 0.015)));
    px1 = max(px1, px2);

    clr += px1 * (sin(uTime * 20.0 + i) + 1.0);
  }

  vec4 particleColor = vec4(3.0, 1.5, 3.1, uOpacity);
  vec4 finalColor = vec4(clr * (1.0 - timecycle)) * particleColor;

  // Check if the pixel color is white and make it transparent
  if (finalColor.rgb == vec3(1.0, 1.0, 1.0)) {
    discard;
  } else {
    gl_FragColor = finalColor;
  }
}