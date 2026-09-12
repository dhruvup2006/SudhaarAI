'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Search, Building } from 'lucide-react';

export default function TrackSearchPage() {
  const [ticketIdInput, setTicketIdInput] = useState('');
  const router = useRouter();

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketIdInput.trim()) return;
    const formattedId = ticketIdInput.trim().toUpperCase();
    router.push(`/track/${formattedId}`);
  };

  return (
    <div className="min-h-screen bg-[#0d1017] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white relative overflow-hidden font-sans">
      {/* Fixed Background Image - Indian Flag Artwork Preserved */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-75 pointer-events-none z-0"
        style={{ backgroundImage: `url('/login-bg.jpg')` }}
      />
      {/* Vignette & Contrast Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/90 via-[#0d1017]/85 to-black/95 pointer-events-none z-0" />

      {/* Tricolor Ambient Glow Spheres (CONSTANT TRICOLOR BG) */}
      <div className="fixed top-12 left-12 w-96 h-96 bg-rose-600/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-12 right-12 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full flex flex-col items-center justify-center relative z-10">
        
        {/* Header Badge */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-xl bg-[#0d1017]/95 border border-rose-500/30 backdrop-blur-xl shadow-lg">
            <span className="text-xs font-bold text-rose-400 font-mono">
              National Grievance Tracking Portal
            </span>
          </div>

          <h1 className="font-section-heading text-3xl sm:text-4xl text-white">
            Track complaint status
          </h1>
          <p className="font-body-base max-w-lg mx-auto text-slate-300">
            Enter your grievance reference ID provided during submission to view real-time resolution status and assigned nodal officer details.
          </p>
        </div>

        {/* Search Card */}
        <div className="w-full bg-[#0d1017]/95 backdrop-blur-2xl border border-rose-500/60 shadow-[0_0_30px_rgba(244,63,94,0.25)] rounded-3xl p-7 sm:p-9 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500" />

          <form onSubmit={handleTrackSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Grievance Reference Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-rose-400 absolute left-5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ticketIdInput}
                  onChange={(e) => setTicketIdInput(e.target.value)}
                  placeholder="e.g. SUD-19002 or SUD-92093"
                  className="w-full pl-14 pr-5 py-4 bg-black text-white border border-zinc-800 rounded-xl font-mono text-sm font-semibold focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 uppercase tracking-widest transition-all placeholder-slate-600 shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white w-full py-4 px-6 rounded-xl font-bold text-sm tracking-tight shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
            >
              <Search className="w-4 h-4 text-white" />
              <span>Track complaint status</span>
            </button>
          </form>

        </div>

      </main>

      <Footer />
    </div>
  );
}
