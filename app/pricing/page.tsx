'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Sparkles, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Pricing() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setSession(data.user);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSession();
  }, []);

  const handleProClick = () => {
    if (!session) {
      router.push('/login');
      return;
    }

    const email = session.email;
    const phone = '905433947051';
    const message = `Merhaba, Türkçe Öğretim AI platformu için Pro üyelik almak istiyorum. Sisteme kayıtlı e-posta adresim: ${email}. IBAN bilgilerinizi iletebilir misiniz?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-gradient-to-b from-teal-500/20 to-transparent blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Sınırları Kaldırın. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Öğrenmeye Hız Katın.</span></h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Yapay zeka destekli Türkçe eğitim asistanını tüm kapasitesiyle kullanmak için hemen Pro'ya geçin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Free Plan */}
          <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
            <p className="text-slate-400 text-sm mb-6 h-10">Platformu denemek ve temel özelliklere göz atmak için idealdir.</p>
            
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">₺0</span>
              <span className="text-slate-500">/ömür boyu</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">Zemberek NLP Analizleri (Sınırsız)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">Yazılı ve Sesli Eğitim (Maks. 2 İşlem)</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <X className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">Sınırsız Yapay Zeka Desteği</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <X className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">Öncelikli Sunucu Erişimi</span>
              </li>
            </ul>

            <Link href={session ? "/profile" : "/register"} className="w-full py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors text-center">
              {session ? 'Mevcut Planınız' : 'Ücretsiz Başla'}
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-[#1e293b] to-[#0f172a] border border-teal-500/30 rounded-3xl p-8 relative shadow-2xl shadow-teal-500/10 flex flex-col transform md:-translate-y-4">
            <div className="absolute -top-4 inset-x-0 flex justify-center">
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-900 text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-full flex items-center gap-1 shadow-lg">
                <Sparkles className="w-3 h-3" /> En Çok Tercih Edilen
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <p className="text-slate-400 text-sm mb-6 h-10">Profesyonel eğitim almak ve tüm limitleri kaldırmak isteyenler için.</p>
            
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">₺100</span>
              <span className="text-slate-500">/3 aylık</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-white">Zemberek NLP Analizleri (Sınırsız)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-white font-medium">Yazılı ve Sesli Eğitim (Sınırsız İşlem)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-white font-medium">Kesintisiz Yapay Zeka Desteği</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-white">Gelecek Güncellemelere Ücretsiz Erişim</span>
              </li>
            </ul>

            <div className="space-y-3">
              <button 
                onClick={handleProClick}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp'tan Satın Al</span>
              </button>
              <p className="text-xs text-center text-slate-500">
                Ödemeniz sonrası hesabınız 1 iş günü içinde 3 aylık Pro olarak tanımlanacaktır.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
