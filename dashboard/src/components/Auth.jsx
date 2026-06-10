import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Registrasi berhasil! Cek email kamu untuk konfirmasi.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-ground px-4">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl" />
      </div>

      <div className="card p-8 sm:p-10 w-full max-w-[420px] relative animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg mb-4">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
          <h1 className="text-2xl font-extrabold text-surface-800 tracking-tight">RemotePower</h1>
          <p className="text-surface-400 text-sm mt-1">
            {isRegister ? 'Buat akun untuk memulai' : 'Masuk ke kontrol panel'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}
          {message && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-600 rounded-xl text-sm border border-green-100">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              {message}
            </div>
          )}

          <div>
            <label className="section-label mb-1.5 block">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="section-label mb-1.5 block">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            ) : isRegister ? 'Buat Akun' : 'Masuk'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-surface-200 text-center">
          <button onClick={() => setIsRegister(!isRegister)} className="text-primary-500 text-sm font-semibold hover:text-primary-700 transition-colors">
            {isRegister ? '← Sudah punya akun? Login' : 'Belum punya akun? Daftar →'}
          </button>
        </div>
      </div>
    </div>
  );
}
