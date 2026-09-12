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
    <div className="min-h-screen bg-black text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
      {/* Fixed Background Image - Indian Flag Artwork Preserved */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-75 pointer-events-none z-0"
        style={{ backgroundImage: `url('/login-bg.jpg')` }}
      />
      {/* Vignette & Contrast Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95 pointer-events-none z-0" />

      {/* GDG VITC Ambient Glow Spheres */}
      <div className="fixed top-12 right-12 w-96 h-96 bg-[#4285F4]/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-12 left-12 w-96 h-96 bg-[#EA4335]/15 rounded-full blur-[120px] pointer-events-none z-0" />

      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full flex flex-col items-center justify-center relative z-10">
        
        {/* Header Badge */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-black/80 border border-zinc-800 backdrop-blur-xl shadow-lg">
            <span className="text-xs font-bold text-slate-300 font-mono">
              National Grievance Tracking Portal
            </span>
          </div>

          <h1 className="font-section-heading text-3xl sm:text-4xl">
            Track complaint status
          </h1>
          <p className="font-body-base max-w-lg mx-auto text-slate-300">
            Enter your grievance reference ID provided during submission to view real-time resolution status and assigned nodal officer details.
          </p>
        </div>

        {/* Search Card */}
        <div className="w-full bg-black/85 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]" />

          <form onSubmit={handleTrackSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Grievance Reference Number <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-sky-400 absolute left-5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ticketIdInput}
                  onChange={(e) => setTicketIdInput(e.target.value)}
                  placeholder="e.g. SUD-19002 or SUD-92093"
                  className="w-full pl-14 pr-5 py-4 bg-zinc-950 text-white border border-zinc-800 rounded-2xl font-mono text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase tracking-widest transition-all placeholder-slate-600 shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-white hover:bg-zinc-100 text-zinc-950 w-full py-4 px-6 rounded-full font-semibold text-sm tracking-tight shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
            >
              <Search className="w-4 h-4 text-zinc-950" />
              <span>Track complaint status</span>
            </button>
          </form>

        </div>

      </main>

      <Footer />
    </div>
  );
}
