uniform float time;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  uv.x += sin(time + uv.y * 10.0) * 0.1;
  uv.y += cos(time + uv.x * 10.0) * 0.1;
  vec3 color = vec3(0.5 + 0.5 * sin(time + uv.x * 10.0), 0.5 + 0.5 * cos(time + uv.y * 10.0), 0.5 + 0.5 * sin(time));
  gl_FragColor = vec4(color, 1.0);
}