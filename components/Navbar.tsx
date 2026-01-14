"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Mic, Home, Sparkles, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Check if we're on the dark-themed voice page
    const isDarkPage = pathname === "/sesli-egitim";

    const navItems = [
        { name: "Ana Sayfa", href: "/", icon: Home },
        { name: "Yazılı Eğitim", href: "/yazili-egitim", icon: BookOpen },
        { name: "Sesli Eğitim (Avatar)", href: "/sesli-egitim", icon: Mic },
    ];

    return (
        <nav className={`
            fixed top-0 left-0 right-0 z-50 transition-all duration-300
            ${isDarkPage
                ? "bg-white/5 backdrop-blur-xl border-b border-white/10"
                : "bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm"
            }
        `}>
            {/* Top Gradient Line - hide on dark page */}
            {!isDarkPage && (
                <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-cyan-400 to-violet-500" />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-12 h-12 group-hover:scale-110 transition-transform duration-300">
                            <Image
                                src={isDarkPage ? "/logo_white.png" : "/logo.png"}
                                alt="Türkçe Öğretim Platformu Logo"
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                            <div className={`absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity ${isDarkPage ? "text-cyan-300" : "text-amber-400"}`}>
                                <Sparkles size={14} />
                            </div>
                        </div>
                        <span className={`
                            text-lg font-bold tracking-tight transition-colors hidden sm:block
                            ${isDarkPage
                                ? "text-white/90 group-hover:text-cyan-300"
                                : "text-slate-800 group-hover:text-teal-700"
                            }
                        `}>
                            Türkçe Öğretim
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        relative px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 group overflow-hidden text-sm font-semibold
                                        ${isActive
                                            ? isDarkPage
                                                ? "bg-white/20 text-white border border-white/30 backdrop-blur-sm"
                                                : "bg-teal-600 text-white shadow-lg"
                                            : isDarkPage
                                                ? "text-white/80 hover:text-white hover:bg-white/10"
                                                : "text-slate-700 hover:bg-slate-100 hover:text-teal-700"
                                        }
                                    `}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? "text-current" : ""} transition-colors`} />
                                    <span className="relative z-10">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`
                                p-2 rounded-lg transition-colors
                                ${isDarkPage
                                    ? "text-white hover:bg-white/10"
                                    : "text-slate-600 hover:bg-slate-100"
                                }
                            `}
                        >
                            <span className="sr-only">Menüyü Aç</span>
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`
                            md:hidden overflow-hidden
                            ${isDarkPage
                                ? "bg-slate-900/95 backdrop-blur-xl border-t border-white/10"
                                : "bg-white border-t border-slate-100"
                            }
                        `}
                    >
                        <div className="px-4 py-4 space-y-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                                            ${isActive
                                                ? isDarkPage
                                                    ? "bg-white/10 text-white"
                                                    : "bg-teal-50 text-teal-800"
                                                : isDarkPage
                                                    ? "text-white/70 hover:bg-white/5 hover:text-white"
                                                    : "text-slate-600 hover:bg-slate-50"
                                            }
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? (isDarkPage ? "text-cyan-400" : "text-teal-600") : (isDarkPage ? "text-white/50" : "text-slate-400")}`} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
