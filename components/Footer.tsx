"use client";

import React from 'react';
import { Code, Lightbulb } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const Footer = () => {
    const pathname = usePathname();
    const darkPages = new Set(["/sesli-egitim", "/pricing"]);
    const isDarkPage = darkPages.has(pathname);

    return (
        <footer className={`w-full py-6 mt-auto border-t backdrop-blur-sm transition-colors duration-300
            ${isDarkPage
                ? "bg-slate-950/35 border-white/10"
                : "bg-white/50 border-slate-100"
            }
        `}>
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-2 text-center">
                <div className={`flex items-center gap-2 text-sm font-light ${isDarkPage ? "text-slate-300" : "text-slate-500"}`}>
                    <Code size={16} className={isDarkPage ? "text-cyan-400" : "text-teal-500"} />
                    <span>Developed by</span>
                    <span className={`font-medium ${isDarkPage ? "text-slate-100" : "text-slate-700"}`}>Kadir GEDİK</span>
                    <span className="opacity-50">(Software Engineer)</span>
                </div>

                <span className={`hidden md:inline-block mx-2 ${isDarkPage ? "text-slate-500" : "text-slate-300"}`}>•</span>

                <div className={`flex items-center gap-2 text-sm font-light ${isDarkPage ? "text-slate-300" : "text-slate-500"}`}>
                    <Lightbulb size={16} className={isDarkPage ? "text-amber-400" : "text-amber-500"} />
                    <span>Project Idea by</span>
                    <span className={`font-medium ${isDarkPage ? "text-slate-100" : "text-slate-700"}`}>Arş. Gör. Kerim GEDİK</span>
                </div>
            </div>
        </footer>
    );
};
