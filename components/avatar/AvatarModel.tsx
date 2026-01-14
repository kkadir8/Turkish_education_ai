"use client";

import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface AvatarProps {
    isTalking: boolean;
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

export function AvatarModel({ isTalking }: AvatarProps) {
    const group = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF("/robot.glb");
    const { actions } = useAnimations(animations, group);

    // Play idle animation if available
    useEffect(() => {
        if (actions && Object.keys(actions).length > 0) {
            const firstAnim = Object.keys(actions)[0];
            actions[firstAnim]?.play();
        }
    }, [actions]);

    useFrame((state) => {
        if (!group.current) return;

        const time = state.clock.getElapsedTime();

        // Default Floating Animation
        group.current.position.y = -1 + Math.sin(time) * 0.1;

        // Talking Animation - Simple pulse when speaking
        if (isTalking) {
            // Pulse scale when talking
            const pulseScale = 2.5 + Math.sin(time * 6) * 0.1;
            group.current.scale.setScalar(pulseScale);

            // Subtle rotation wiggle
            group.current.rotation.y = Math.sin(time * 4) * 0.05;
        } else {
            // Return to normal when not talking
            group.current.scale.setScalar(2.5);
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0, 0.1);
        }

        // Head bob when talking
        scene.traverse((child) => {
            if ((child as THREE.Bone).isBone && child.name.toLowerCase().includes("head")) {
                if (isTalking) {
                    child.rotation.x = Math.sin(time * 8) * 0.1;
                } else {
                    child.rotation.x = THREE.MathUtils.lerp(child.rotation.x, 0, 0.1);
                }
            }
        });
    });

    return (
        <group ref={group} position={[0, -1, 0]} scale={[2.5, 2.5, 2.5]}>
            <primitive object={scene} />
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 10, 5]} intensity={2} />
            <pointLight position={[-5, 5, 5]} intensity={1} color="#33ccff" />
        </group>
    );
}
