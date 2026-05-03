"use client";

import { useState, useRef } from "react";
import { ThreeScene } from "@/components/avatar/ThreeScene";
import { VoiceInterface } from "@/components/avatar/VoiceInterface";
import { Bot, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function SesliEgitimClient() {
    const [isTalking, setIsTalking] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleStateChange = (state: string) => {
        setIsTalking(state === "speaking");
    };

    return (
        <div className="min-h-screen h-screen overflow-hidden flex flex-col">
            <div
                className="fixed inset-0 -z-10"
                style={{
                    background: "radial-gradient(ellipse at center 40%, #134e4a 0%, #0f172a 50%, #020617 100%)"
                }}
            />

            <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-cyan-500/10"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.05, 0.1, 0.05]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-violet-500/10"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.08, 0.12, 0.08]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-teal-400/15"
                />
            </div>

            <div
                className="fixed inset-0 -z-5 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
                    backgroundSize: "30px 30px"
                }}
            />

            <div className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-2 relative z-10"
                >
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/30 px-4 py-2 rounded-full mb-3 backdrop-blur-sm">
                        <Bot className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-300 text-sm font-medium">AI Destekli Konusma Pratigi</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">
                        Sesli{" "}
                        <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-violet-500 bg-clip-text text-transparent">
                            Turkce
                        </span>{" "}
                        Atolyesi
                    </h1>
                </motion.div>

                <audio
                    ref={audioRef}
                    playsInline
                    className="hidden"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full max-w-xl ml-4"
                >
                    <motion.div
                        animate={isTalking ? {
                            opacity: [0.4, 0.8, 0.4],
                            scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-28 bg-gradient-to-t from-cyan-500/40 to-transparent blur-3xl rounded-full pointer-events-none"
                    />

                    <motion.div
                        animate={isTalking ? {
                            y: [0, -8, 0, -4, 0],
                            scale: [1, 1.02, 1, 1.01, 1]
                        } : {}}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        className="h-[340px] md:h-[400px] relative"
                    >
                        <ThreeScene isTalking={isTalking} audioRef={audioRef} />
                    </motion.div>
                </motion.div>

                <div className="mt-2 relative z-20">
                    <VoiceInterface onStateChange={handleStateChange} audioRef={audioRef} />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-3 flex flex-wrap justify-center gap-2 relative z-10"
                >
                    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span className="text-slate-300 text-xs">B1-B2 seviyesinde pratik</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <span className="text-slate-300 text-xs">Mikrofon gerekli</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
