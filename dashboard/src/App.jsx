import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Admin } from './components/Admin';

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-ground gap-3">
        <span className="material-symbols-outlined text-primary-500 text-5xl animate-spin">progress_activity</span>
        <p className="text-surface-400 font-semibold tracking-wide text-sm">Memuat sistem...</p>
      </div>
    );
  }

  if (!session) return <Auth />;

  return (
    <div className="min-h-screen bg-surface-ground">
      {/* ──── Top App Bar ──── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-200">
        <div className="max-w-container mx-auto flex items-center justify-between h-16 px-5">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <span className="font-extrabold text-lg text-surface-800 tracking-tight">RemotePower</span>
          </button>

          <div className="flex items-center gap-2">
            {profile?.role === 'admin' && (
              <nav className="hidden sm:flex bg-surface-100 rounded-xl p-1 mr-2">
                <button onClick={() => setView('dashboard')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'dashboard' ? 'bg-white text-primary-600 shadow-card' : 'text-surface-500 hover:text-surface-700'}`}>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">dashboard</span> Dashboard</span>
                </button>
                <button onClick={() => setView('admin')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'admin' ? 'bg-white text-primary-600 shadow-card' : 'text-surface-500 hover:text-surface-700'}`}>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">admin_panel_settings</span> Admin</span>
                </button>
              </nav>
            )}
            <div className="hidden sm:flex items-center gap-2 text-xs text-surface-400 mr-3 border-r border-surface-200 pr-4">
              <span className="material-symbols-outlined text-base">person</span>
              {session.user.email}
            </div>
            <button onClick={() => supabase.auth.signOut()} className="btn-ghost p-2 rounded-xl text-surface-400 hover:text-red-500" title="Sign Out">
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ──── Content ──── */}
      <main className="animate-fade-in">
        {view === 'admin' && profile?.role === 'admin' ? <Admin /> : <Dashboard profile={profile} />}
      </main>

      {/* ──── Mobile Bottom Nav ──── */}
      {profile?.role === 'admin' && (
        <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-t border-surface-200 flex justify-around h-16 items-center">
          <button onClick={() => setView('dashboard')} className={`flex flex-col items-center gap-0.5 ${view === 'dashboard' ? 'text-primary-600' : 'text-surface-400'}`}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={() => setView('admin')} className={`flex flex-col items-center gap-0.5 ${view === 'admin' ? 'text-primary-600' : 'text-surface-400'}`}>
            <span className="material-symbols-outlined">shield</span>
            <span className="text-[10px] font-bold">Admin</span>
          </button>
        </nav>
      )}
    </div>
  );
}

export default App;
