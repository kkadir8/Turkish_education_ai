"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, PenTool, Mic, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Typing Effect Words
const typingWords = ["Hızlı", "Kolay", "Etkili"];

// Chat Messages for Mockup Animation
const chatMessages = [
  { type: "user", text: "Ben gitmek okul.", hasError: true },
  { type: "ai", text: "Doğrusu: **Okula gidiyorum.** Harikasın! ✨", isCorrection: true },
  { type: "user", text: "Dün ben çok güzel yemek yedim.", hasError: false },
  { type: "ai", text: "Mükemmel cümle! 🎉 Hangi yemeği yedin?", isCorrection: false },
];

// Audio Visualizer Component
function AudioVisualizer() {
  return (
    <div className="flex items-end gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-violet-500 to-cyan-400 rounded-full"
          animate={{
            height: ["8px", "24px", "12px", "32px", "16px"],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Typing Effect Component
function TypingEffect() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % typingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={wordIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="inline-block bg-gradient-to-r from-cyan-500 to-violet-600 bg-clip-text text-transparent font-black"
      >
        {typingWords[wordIndex]}
      </motion.span>
    </AnimatePresence>
  );
}

// Phone Mockup with Chat Animation
function PhoneMockup() {
  const [visibleMessages, setVisibleMessages] = useState<{ index: number; key: string }[]>([]);
  const cycleRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    let currentIndex = 0;

    const showMessage = () => {
      if (!isMountedRef.current) return;

      if (currentIndex < chatMessages.length) {
        const uniqueKey = `msg-${Date.now()}-${cycleRef.current}-${currentIndex}`;
        setVisibleMessages((prev) => [...prev, { index: currentIndex, key: uniqueKey }]);
        currentIndex++;
        timeoutRef.current = setTimeout(showMessage, 1500);
      } else {
        // Reset after all messages shown
        timeoutRef.current = setTimeout(() => {
          if (!isMountedRef.current) return;
          cycleRef.current++;
          setVisibleMessages([]);
          currentIndex = 0;
          timeoutRef.current = setTimeout(showMessage, 1000);
        }, 3000);
      }
    };

    showMessage();

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className="relative w-[280px] h-[560px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-700">
        {/* Screen */}
        <div className="w-full h-full bg-slate-50 rounded-[2.2rem] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Turkish Teacher AI</p>
              <p className="text-white/70 text-xs">Çevrimiçi</p>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-3 space-y-3 overflow-hidden">
            <AnimatePresence>
              {visibleMessages.map((item) => {
                const msg = chatMessages[item.index];
                if (!msg) return null;
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.type === "user"
                        ? "bg-teal-600 text-white rounded-br-sm"
                        : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"
                        }`}
                    >
                      {msg.type === "user" && msg.hasError && (
                        <div className="flex items-center gap-1 mb-1">
                          <AlertCircle className="w-3 h-3 text-red-300" />
                          <span className="text-xs text-red-200">Hata tespit edildi</span>
                        </div>
                      )}
                      <p className={msg.hasError ? "underline decoration-red-400 decoration-wavy" : ""}>
                        {msg.text.split("**").map((part, partIndex) =>
                          partIndex % 2 === 1 ? (
                            <strong key={`${item.key}-part-${partIndex}`} className="text-teal-600">
                              {part}
                            </strong>
                          ) : (
                            <span key={`${item.key}-text-${partIndex}`}>{part}</span>
                          )
                        )}
                      </p>
                      {msg.type === "ai" && msg.isCorrection && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600">Düzeltildi</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Mesajınızı yazın..."
                className="flex-1 bg-transparent text-sm text-slate-600 outline-none"
                disabled
              />
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Glow Effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-[4rem] blur-3xl -z-10" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-br from-cyan-100/50 via-violet-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-teal-100/40 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-50 to-violet-50 border border-cyan-200/50 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-semibold text-slate-700">Yapay Zeka Destekli Dil Öğrenme</span>
            </motion.div>

            {/* Main Title with Gradient */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Turkish Teacher{" "}
              <span className="bg-gradient-to-r from-cyan-500 via-teal-500 to-violet-600 bg-clip-text text-transparent">
                AI
              </span>
            </h1>

            {/* Subtitle with Typing Effect */}
            <p className="text-xl md:text-2xl text-slate-600 mb-4 leading-relaxed">
              Yapay zeka ile Türkçe öğrenmenin en{" "}
              <TypingEffect /> yolu.
            </p>
            <p className="text-lg text-slate-500 mb-10">
              Anında düzeltme, sınırsız pratik, kişiselleştirilmiş öğrenme.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/yazili-egitim">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
                >
                  Hemen Başla <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/sesli-egitim">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 hover:border-violet-300 text-slate-700 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Mic className="w-5 h-5 text-violet-600" /> Sesli Dene
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <PhoneMockup />
          </motion.div>
        </div>

        {/* FEATURES SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              İki Güçlü Öğrenme Modu
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Yazarak veya konuşarak pratik yapın. Yapay zeka anında geri bildirim verir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1: Yazma Asistanı */}
            <Link href="/yazili-egitim" className="group">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:border-teal-300 transition-all duration-300 h-full"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <PenTool className="w-8 h-8 text-teal-600" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">
                  Akıllı Yazma Asistanı
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Metinlerinizi saniyeler içinde analiz eder. Gramer hatalarını düzeltir, kelime önerileri sunar.
                </p>

                <div className="flex items-center text-teal-600 font-semibold group-hover:translate-x-2 transition-transform">
                  Yazmaya Başla <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </motion.div>
            </Link>

            {/* Card 2: Sesli Pratik */}
            <Link href="/sesli-egitim" className="group">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700 hover:border-violet-500 transition-all duration-300 h-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform backdrop-blur-sm">
                    <Mic className="w-8 h-8 text-violet-400" />
                  </div>
                  <AudioVisualizer />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">
                  Sesli Konuşma Pratiği
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Çekinmeden konuşun, telaffuzunuzu geliştirin. AI size anında geri bildirim verir.
                </p>

                <div className="flex items-center text-violet-400 font-semibold group-hover:translate-x-2 transition-transform">
                  Konuşmaya Başla <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-slate-400 mb-4">Güvenilir Teknolojiler</p>
          <div className="flex items-center justify-center gap-8 opacity-50">
            <span className="text-slate-600 font-semibold">OpenAI GPT-4</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-semibold">Whisper API</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-semibold">Next.js</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
