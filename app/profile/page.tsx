'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Star, LogOut, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default function Profile() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setSession(data.user);
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0f172a]"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!session) return null;

  const usageLimit = session.plan === 'pro' ? 'Sınırsız' : '2';

  return (
    <div className="min-h-screen bg-[#0f172a] pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-2xl mx-auto">
        <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-white/10 pb-8 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-teal-500/30">
              {session.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">{session.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-400">
                <Mail size={16} />
                <span>{session.email}</span>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="mt-4 sm:mt-0 sm:ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors border border-red-500/20"
            >
              <LogOut size={18} />
              <span>Çıkış Yap</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Mevcut Plan Kartı */}
            <div className="bg-[#0f172a]/80 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${session.plan === 'pro' ? 'bg-amber-400' : 'bg-slate-400'}`}></div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${session.plan === 'pro' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>
                  <Star size={24} />
                </div>
                <h2 className="text-lg font-semibold text-white">Mevcut Plan</h2>
              </div>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-white uppercase">{session.plan}</span>
                {session.plan === 'free' && <span className="text-sm text-slate-400">/ Ücretsiz</span>}
              </div>

              {session.plan === 'free' && (
                <Link href="/pricing" className="mt-4 inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 font-medium">
                  Pro'ya Yükselt <ArrowRight size={16} />
                </Link>
              )}
            </div>

            {/* Kullanım İstatistikleri */}
            <div className="bg-[#0f172a]/80 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400 blur-3xl opacity-10 group-hover:opacity-30 transition-opacity"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Activity size={24} />
                </div>
                <h2 className="text-lg font-semibold text-white">Kullanım İstatistikleri</h2>
              </div>
              
              <div className="mb-2">
                <span className="text-3xl font-bold text-white">{session.usageCount}</span>
                <span className="text-slate-400 ml-2">/ {usageLimit} İşlem</span>
              </div>
              
              <p className="text-sm text-slate-500 mt-2">
                Sesli ve Yazılı Eğitim modüllerindeki toplam kullanım sayınız.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
