import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

extend({ TextGeometry });

const ThreeDText = ({ text, position, rotation, color, size, height, isNeon = false }) => {
    const [font, setFont] = useState(null);
    const [textMesh, setTextMesh] = useState(null);

    useEffect(() => {
        const loader = new FontLoader();
        loader.load("/Kind Regards_Regular.json", (loadedFont) => {  
            setFont(loadedFont);
        });
    }, []);

    useEffect(() => {
        if (font) {
            const textGeometry = new TextGeometry(text, {
                font: font,
                size: size || 2,  
                height: height || 0.1,  
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.05,  
                bevelSize: 0.03,
            });

            textGeometry.center();

            // ✅ NEON GLOW MATERIAL (Only applied when `isNeon` is true)
            const textMaterial = new THREE.MeshStandardMaterial({ 
                color,
                emissive: isNeon ? color : "#000000", // Only neon text glows
                emissiveIntensity: isNeon ? 30 : 1,  // High intensity for neon text
                roughness: 0.2,
                metalness: 0.8
            });

            const mesh = new THREE.Mesh(textGeometry, textMaterial);
            mesh.position.set(...position);
            mesh.rotation.set(...rotation);
            setTextMesh(mesh);
        }
    }, [font, text, position, rotation, color, size, height, isNeon]);

    // ✅ Flickering Animation (Only for Neon)
    useFrame(({ clock }) => {
        if (isNeon && textMesh) {
            textMesh.material.emissiveIntensity = 15 + Math.sin(clock.elapsedTime * 3) * 1.5; // Flicker
        }
    });

    return textMesh ? (
        <group scale={[0.5, 0.2, 0.001]}>
            <primitive object={textMesh} />
        </group>
    ) : null;
};

export default ThreeDText;
