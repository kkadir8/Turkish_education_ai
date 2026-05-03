"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, ImageIcon, X, PenLine, Mail, BookOpen, Sparkles, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRandomScenarioImage } from "@/constants/scenarioImages";

type Message = {
    role: "user" | "assistant" | "system";
    content: string;
};

type ScenarioImage = {
    id: number;
    url: string;
    description: string;
};

// Quick Start Chips Data
const quickStartChips = [
    { id: "image", label: "🖼️ Resim Anlat", icon: ImageIcon },
    { id: "diary", label: "📝 Günlük Yaz", icon: PenLine },
    { id: "letter", label: "✉️ Mektup Yaz", icon: Mail },
    { id: "story", label: "📖 Hikaye Anlat", icon: BookOpen },
];

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<"normal" | "image-description">("normal");
    const [selectedImage, setSelectedImage] = useState<ScenarioImage | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const checkUsage = async () => {
        try {
            const res = await fetch("/api/user/usage", { method: "POST" });
            if (res.status === 401) {
                window.location.href = '/login';
                return false;
            }
            if (res.status === 403) {
                alert("Ücretsiz kullanım hakkınız bitti. Devamı için Pro üyelik gerekmektedir.");
                window.location.href = '/pricing';
                return false;
            }
            return true;
        } catch (error) {
            console.error("Usage check failed", error);
            return false;
        }
    };

    // Start Image Description Mode
    const startImageDescriptionMode = async () => {
        if (!(await checkUsage())) return;

        const image = getRandomScenarioImage();
        setSelectedImage(image);
        setMode("image-description");
        setIsLoading(true);

        const systemMessage: Message = {
            role: "system",
            content: `[RESİM ANLATMA GÖREVİ BAŞLADI] Kullanıcı ekranda bir resim görüyor. Resmin içeriğini SEN BİLMİYORSUN. Kullanıcıya resmi anlatmasını iste. "Merhaba! Ekranda bir resim görüyorsun. Bu resimde ne var? Bana anlat!" gibi bir cümleyle başla.`
        };

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [systemMessage] }),
            });

            const data = await response.json();
            if (data.message) {
                setMessages([data.message]);
            }
        } catch (error) {
            console.error("Failed to start image mode", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Start a quick task
    const startQuickTask = async (taskType: string) => {
        if (taskType === "image") {
            startImageDescriptionMode();
            return;
        }

        if (!(await checkUsage())) return;

        setIsLoading(true);
        const prompts: Record<string, string> = {
            diary: "Kullanıcı günlük yazmak istiyor. 'Bugün neler yaptın? Bana kısaca anlat.' diye sor.",
            letter: "Kullanıcı mektup yazmak istiyor. 'Kime mektup yazmak istersin? Bir arkadaşına mı, ailene mi?' diye sor.",
            story: "Kullanıcı hikaye anlatmak istiyor. 'Harika! Bana kısa bir hikaye anlat. Konu serbest!' diye başla."
        };

        const systemMessage: Message = {
            role: "system",
            content: `[GÖREV BAŞLADI] ${prompts[taskType]}`
        };

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [systemMessage] }),
            });

            const data = await response.json();
            if (data.message) {
                setMessages([data.message]);
            }
        } catch (error) {
            console.error("Failed to start task", error);
        } finally {
            setIsLoading(false);
        }
    };

    const closeImageMode = () => {
        setMode("normal");
        setSelectedImage(null);
        setMessages([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        if (!(await checkUsage())) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            const data = await response.json();
            if (data.message) {
                setMessages((prev) => [...prev, data.message]);
            }
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetChat = () => {
        setMessages([]);
        setMode("normal");
        setSelectedImage(null);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] min-h-[600px] w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            {/* Modern Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        {/* Online Indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    </div>
                    <div>
                        <h2
                            onClick={resetChat}
                            className="text-white font-bold text-lg cursor-pointer hover:text-cyan-300 transition-colors"
                        >
                            Kâtip Çelebi
                        </h2>
                        <p className="text-slate-400 text-sm flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                            Yazma Asistanı • Çevrimiçi
                        </p>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-cyan-500/20 to-violet-500/20 px-4 py-1.5 rounded-full border border-cyan-500/30">
                    <span className="text-cyan-300 text-xs font-semibold">B1 Seviyesi</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                {/* Subtle Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M0 0h1v1H0zM39 0h1v1h-1zM0 39h1v1H0zM39 39h1v1h-1z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                <AnimatePresence>
                    {/* Image Display for Image Mode */}
                    {mode === "image-description" && selectedImage && (
                        <motion.div
                            key="image-display"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-4"
                        >
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5 text-teal-600" />
                                        <span className="text-sm font-semibold text-slate-700">Resim Anlatma Görevi</span>
                                    </div>
                                    <button
                                        onClick={closeImageMode}
                                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <img
                                    src={selectedImage.url}
                                    alt="Betimleme görseli"
                                    className="w-full h-56 object-cover"
                                />
                                <p className="text-center text-sm text-slate-500 py-3 bg-slate-50">
                                    Bu görseli detaylı şekilde anlat ✍️
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Empty State with Quick Start Chips */}
                    {messages.length === 0 && mode === "normal" && (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="h-full flex flex-col items-center justify-center text-center py-12"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mb-6">
                                <Sparkles className="w-10 h-10 text-teal-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Merhaba! 👋</h3>
                            <p className="text-slate-500 max-w-md mb-8">
                                Türkçe yazma pratiği yapmak için aşağıdaki görevlerden birini seç veya direkt yazmaya başla.
                            </p>

                            {/* Quick Start Chips - Horizontal Scroll */}
                            <div className="flex flex-wrap justify-center gap-3 max-w-lg">
                                {quickStartChips.map((chip) => (
                                    <motion.button
                                        key={chip.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => startQuickTask(chip.id)}
                                        className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-teal-300 transition-all text-slate-700 font-medium"
                                    >
                                        {chip.label}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Messages */}
                    {messages.map((message, index) => (
                        <motion.div
                            key={`message-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className="flex items-end gap-2 max-w-[80%]">
                                {/* AI Avatar */}
                                {message.role === "assistant" && (
                                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                <div
                                    className={`rounded-2xl px-5 py-3 shadow-sm ${message.role === "user"
                                        ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-br-md"
                                        : "bg-white border border-slate-100 text-slate-800 rounded-bl-md"
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                </div>

                                {/* User Avatar */}
                                {message.role === "user" && (
                                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="flex items-end gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white border border-slate-100 px-5 py-3 rounded-2xl rounded-bl-md shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                                        <span className="text-slate-500 text-sm">Yazıyor...</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Sticky Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100">
                {/* Suggestion Chips when chatting */}
                {messages.length > 0 && mode === "normal" && (
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                        {quickStartChips.slice(0, 3).map((chip) => (
                            <button
                                key={chip.id}
                                type="button"
                                onClick={() => startQuickTask(chip.id)}
                                className="flex-shrink-0 text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-3 items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                        className="flex-1 px-5 py-3.5 bg-slate-100 rounded-full text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                    />
                    <motion.button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                    >
                        <Send className="w-5 h-5" />
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
