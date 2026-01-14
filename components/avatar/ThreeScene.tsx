"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stage } from "@react-three/drei";
import { Suspense } from "react";
import { AvatarModel } from "./AvatarModel";

interface ThreeSceneProps {
    isTalking: boolean;
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

export function ThreeScene({ isTalking, audioRef }: ThreeSceneProps) {
    return (
        <div className="w-full h-full flex items-center justify-center relative z-10">
            <Canvas
                camera={{ position: [0, 0, 4], fov: 50 }}
                shadows
                className="bg-transparent"
            >
                <Suspense fallback={null}>
                    {/* Stage automatically centers, scales, and lights the model */}
                    <Stage environment="city" intensity={0.5} adjustCamera={1.2}>
                        <AvatarModel isTalking={isTalking} audioRef={audioRef} />
                    </Stage>
                </Suspense>

                {/* Disable Zoom and Pan as requested */}
                <OrbitControls enableZoom={false} enablePan={false} makeDefault />
            </Canvas>
        </div>
    );
}
