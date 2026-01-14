"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceInterfaceProps {
    onStateChange: (state: "idle" | "listening" | "processing" | "speaking" | "waitingForPlay") => void;
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

export function VoiceInterface({ onStateChange, audioRef }: VoiceInterfaceProps) {
    const [status, setStatus] = useState<"idle" | "listening" | "processing" | "speaking" | "waitingForPlay">("idle");
    const [transcript, setTranscript] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        onStateChange(status);
    }, [status, onStateChange]);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioUnlockedRef = useRef(false);

    const unlockAudio = async () => {
        if (audioUnlockedRef.current) return;
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            }
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }
            if (audioRef.current) {
                audioRef.current.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
                await audioRef.current.play();
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            audioUnlockedRef.current = true;
        } catch (e) {
            console.log("Audio unlock attempt:", e);
        }
    };

    const toggleRecording = async () => {
        await unlockAudio();
        if (status === "idle") {
            await startRecording();
        } else if (status === "listening") {
            stopRecording();
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                stream.getTracks().forEach(track => track.stop());
                const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
                await processAudio(audioBlob);
            };

            mediaRecorder.start();
            setStatus("listening");
            setTranscript("");
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Mikrofona erişilemedi! Lütfen izin verin.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && status === "listening") {
            mediaRecorderRef.current.stop();
            setStatus("processing");
        }
    };

    const playAudio = () => {
        if (audioRef.current && status === "waitingForPlay") {
            audioRef.current.play()
                .then(() => {
                    setStatus("speaking");
                })
                .catch((error) => {
                    console.error("Audio play failed:", error);
                    setStatus("idle");
                });
        }
    };

    const processAudio = async (audioBlob: Blob) => {
        try {
            const formData = new FormData();
            formData.append("file", audioBlob, "audio.webm");

            const sttRes = await fetch("/api/speech-to-text", {
                method: "POST",
                body: formData,
            });
            const sttData = await sttRes.json();

            if (!sttData.text) throw new Error("Transcription failed");
            setTranscript(sttData.text);

            const newMessage = { role: "user", content: sttData.text };
            const updatedHistory = [...conversationHistory, newMessage];
            setConversationHistory(updatedHistory);

            const chatRes = await fetch("/api/voice-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: updatedHistory }),
            });
            const chatData = await chatRes.json();
            const aiResponseText = chatData.message.content;
            setResponse(aiResponseText);

            setConversationHistory([...updatedHistory, { role: "assistant", content: aiResponseText }]);

            const ttsRes = await fetch("/api/text-to-speech", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: aiResponseText })
            });

            if (!ttsRes.ok) {
                throw new Error(`TTS failed: ${ttsRes.status}`);
            }

            const audioBlobRes = await ttsRes.blob();
            const audioUrl = URL.createObjectURL(audioBlobRes);

            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.volume = 1.0;
                audioRef.current.muted = false;
                audioRef.current.load();

                audioRef.current.oncanplaythrough = () => {
                    if (audioRef.current) {
                        audioRef.current.play()
                            .then(() => {
                                setStatus("speaking");
                            })
                            .catch(() => {
                                setStatus("waitingForPlay");
                            });
                    }
                };

                audioRef.current.onended = () => {
                    setStatus("idle");
                };
            }
        } catch (error) {
            console.error("Processing error:", error);
            setStatus("idle");
            setResponse("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    const getStatusConfig = () => {
        switch (status) {
            case "idle":
                return {
                    text: "Konuşmaya Başla",
                    subtext: "Mikrofona tıklayın",
                    bgClass: "bg-gradient-to-br from-cyan-500 to-teal-600",
                    ringClass: "ring-cyan-400/50",
                    icon: <Mic size={32} />
                };
            case "listening":
                return {
                    text: "Dinliyorum...",
                    subtext: "Durdurmak için tıklayın",
                    bgClass: "bg-gradient-to-br from-red-500 to-rose-600",
                    ringClass: "ring-red-400/50",
                    icon: <MicOff size={32} />
                };
            case "processing":
                return {
                    text: "Düşünüyorum...",
                    subtext: "Lütfen bekleyin",
                    bgClass: "bg-gradient-to-br from-amber-500 to-orange-600",
                    ringClass: "ring-amber-400/50",
                    icon: <Loader2 size={32} className="animate-spin" />
                };
            case "speaking":
                return {
                    text: "Konuşuyorum",
                    subtext: "Bitince sıra sizde",
                    bgClass: "bg-gradient-to-br from-emerald-500 to-green-600",
                    ringClass: "ring-emerald-400/50",
                    icon: <Volume2 size={32} />
                };
            case "waitingForPlay":
                return {
                    text: "Yanıtı Dinle",
                    subtext: "Sesi duymak için tıklayın",
                    bgClass: "bg-gradient-to-br from-violet-500 to-purple-600",
                    ringClass: "ring-violet-400/50",
                    icon: <Volume2 size={32} />
                };
            default:
                return {
                    text: "Konuşmaya Başla",
                    subtext: "Mikrofona tıklayın",
                    bgClass: "bg-gradient-to-br from-cyan-500 to-teal-600",
                    ringClass: "ring-cyan-400/50",
                    icon: <Mic size={32} />
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Status Card - Glassmorphism */}
            <motion.div
                key={status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 text-center shadow-xl"
            >
                <motion.p
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: status === "listening" || status === "processing" ? Infinity : 0 }}
                    className="text-white font-semibold text-base tracking-wide"
                >
                    {config.text}
                </motion.p>
                <p className="text-white/60 text-sm">{config.subtext}</p>
            </motion.div>

            {/* Main Button - Glassmorphism with Ripple */}
            <div className="relative">
                {/* Ripple Effect on Click */}
                <AnimatePresence>
                    {status === "listening" && (
                        <>
                            <motion.div
                                initial={{ scale: 1, opacity: 0.5 }}
                                animate={{ scale: 2.5, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute inset-0 rounded-full bg-red-500/30"
                            />
                            <motion.div
                                initial={{ scale: 1, opacity: 0.3 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                                className="absolute inset-0 rounded-full bg-red-500/20"
                            />
                        </>
                    )}
                </AnimatePresence>

                <motion.button
                    onClick={status === "waitingForPlay" ? playAudio : toggleRecording}
                    disabled={status === "processing" || status === "speaking"}
                    whileHover={{ scale: (status === "idle" || status === "waitingForPlay") ? 1.08 : 1 }}
                    whileTap={{ scale: 0.92 }}
                    className={`
                        relative w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl 
                        transition-all duration-300 ${config.bgClass}
                        ring-4 ${config.ringClass}
                        backdrop-blur-sm
                        ${(status === "processing" || status === "speaking") ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
                    `}
                >
                    {/* Inner Glow */}
                    <div className="absolute inset-2 rounded-full bg-white/10" />
                    <span className="relative z-10">{config.icon}</span>
                </motion.button>
            </div>

            {/* Audio Visualizer when listening */}
            <AnimatePresence>
                {status === "listening" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-end gap-1.5 mt-6 h-8"
                    >
                        {[...Array(7)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1 bg-gradient-to-t from-cyan-500 to-violet-500 rounded-full"
                                animate={{
                                    height: ["8px", `${16 + Math.random() * 16}px`, "8px"],
                                }}
                                transition={{
                                    duration: 0.4 + Math.random() * 0.3,
                                    repeat: Infinity,
                                    delay: i * 0.08,
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Speaking Visualizer */}
            <AnimatePresence>
                {status === "speaking" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 mt-6 h-8"
                    >
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 bg-gradient-to-t from-emerald-400 to-green-300 rounded-full"
                                animate={{
                                    height: ["12px", "28px", "12px"],
                                    opacity: [0.7, 1, 0.7]
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.12,
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Conversation counter */}
            {conversationHistory.length > 0 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/40 text-xs mt-5 tracking-wide"
                >
                    💬 {Math.floor(conversationHistory.length / 2)} mesaj alışverişi
                </motion.p>
            )}
        </div>
    );
}
