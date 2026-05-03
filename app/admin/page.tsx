'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, RefreshCw, Check, Star } from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSessionAndUsers = async () => {
      try {
        const sessionRes = await fetch('/api/auth/me');
        if (!sessionRes.ok) {
          router.push('/login');
          return;
        }
        
        const sessionData = await sessionRes.json();
        
        if (sessionData.user.role !== 'admin') {
          router.push('/');
          return;
        }
        
        setSession(sessionData.user);

        const usersRes = await fetch('/api/admin/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessionAndUsers();
  }, [router]);

  const togglePlan = async (userId: string, currentPlan: string) => {
    const newPlan = currentPlan === 'free' ? 'pro' : 'free';
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: newPlan }),
      });

      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, plan: newPlan } : u));
      }
    } catch (err) {
      console.error(err);
      alert('Plan güncellenirken bir hata oluştu.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0f172a]"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="text-red-400" /> Admin Paneli
            </h1>
            <p className="text-slate-400 mt-2">Kullanıcıları ve abonelikleri yönetin.</p>
          </div>
          
          <div className="bg-[#1e293b] px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
            <Users className="text-slate-400" size={20} />
            <span className="text-white font-semibold">{users.length} Kullanıcı</span>
          </div>
        </div>

        <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0f172a]/80 border-b border-white/10 text-slate-400 text-sm font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Kullanıcı</th>
                  <th className="px-6 py-4">Kayıt Tarihi</th>
                  <th className="px-6 py-4">Kullanım</th>
                  <th className="px-6 py-4">Mevcut Plan</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-sm text-slate-400">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-sm font-medium">
                        {user.usageCount} {user.plan === 'free' ? '/ 2' : '/ ∞'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.plan === 'pro' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                          <Star size={12} /> PRO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 text-xs font-bold uppercase tracking-wider">
                          FREE
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => togglePlan(user._id, user.plan)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg ${
                            user.plan === 'free' 
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-amber-500/20' 
                              : 'bg-slate-700 hover:bg-slate-600 text-white shadow-slate-900/50'
                          }`}
                        >
                          {user.plan === 'free' ? (
                            <>PRO Yap <Check size={16} /></>
                          ) : (
                            <>FREE Yap <RefreshCw size={16} /></>
                          )}
                        </button>
                      )}
                      {user.role === 'admin' && (
                        <span className="text-red-400 text-xs font-bold uppercase px-3">Yönetici</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
