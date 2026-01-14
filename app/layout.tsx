import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Outfit as a modern display font
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Yabancılara Türkçe Öğretimi",
  description: "Yapay Zeka Destekli Türkçe Öğrenme Platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning={true} className={`${inter.variable} ${outfit.variable} font-sans bg-gray-50 text-gray-900`}>
        <Navbar />
        <main className="min-h-screen flex flex-col">
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
