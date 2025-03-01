varying vec3 vNormal;
varying vec3 vViewPosition;
uniform float transparency;  // Transparency control for objects
uniform bool isHovered;      // Controls hover effect

void main() {
    // **Subtle Eerie Ash Base**
    float intensity = pow(0.5 - dot(vNormal, normalize(vViewPosition)), 2.0);
    vec3 ashColor = vec3(0.2, 0.2, 0.2);  // **Even darker base for a horror vibe**
    vec3 glowColor = mix(ashColor, vec3(1, 1, 1), intensity * 0.3); // **Less overpowering**

    // **Strong Glowing Outline Effect**
    float edgeFactor = 1.0 - abs(dot(vNormal, normalize(vViewPosition))); // Detect edges
    float outlineStrength = isHovered ? smoothstep(0.2, 0.5, edgeFactor) * 2.5 : 0.0; // **Boosted outline glow**

    // **Final Alpha & Glow Effect**
    float alpha = transparency;
    if (isHovered) {
        alpha = max(alpha, intensity * 0.6);  // **Stronger hover brightness**
    }

    // **Final Horror Glow**
    gl_FragColor = vec4(glowColor + outlineStrength * vec3(1.0, 0.4, 0.1), alpha); 
}
