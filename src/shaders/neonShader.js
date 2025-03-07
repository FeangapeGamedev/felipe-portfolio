import * as THREE from "three";

export const NeonShader = {
  uniforms: {
    color: { value: new THREE.Color(0x00ffff) }, // Default Cyan
    intensity: { value: 2.5 }, // Glow intensity
    time: { value: 0.0 }, // Animated flicker
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normal;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color; // 🔥 Pass the color
    uniform float intensity;
    uniform float time;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      float glow = sin(time * 3.0) * 0.25 + 0.75; // Flickering effect
      float edgeGlow = pow(abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0); // Outer glow effect

      vec3 neonColor = color * glow * intensity * edgeGlow; // 🔥 Apply the uniform color

      gl_FragColor = vec4(neonColor, 1.0); // Set the final color
    }
  `,
};
