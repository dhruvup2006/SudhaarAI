'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Search, Building, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full flex flex-col items-center justify-center">
        
        {/* Header Badge */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>National Grievance Tracking Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Track Complaint Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Enter your 10-digit Grievance Reference ID provided during submission to view real-time resolution status and assigned nodal officer details.
          </p>
        </div>

        {/* Search Card */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500" />

          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2 tracking-wider">
                Enter Grievance Reference ID <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ticketIdInput}
                  onChange={(e) => setTicketIdInput(e.target.value)}
                  placeholder="e.g. SUD-19002 or SUD-92093"
                  className="w-full pl-12 pr-4 py-4 bg-slate-950 text-white border border-slate-700/80 rounded-2xl font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 uppercase tracking-wider transition-all placeholder-slate-600 shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-950" />
              <span>Track Grievance Status</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </form>

          {/* Sample Chips */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <span>Sample Reference IDs to test:</span>
            <div className="flex items-center space-x-2 font-mono font-bold">
              {['SUD-19002', 'SUD-92093', 'SUD-31458'].map((sampleId) => (
                <button
                  key={sampleId}
                  type="button"
                  onClick={() => router.push(`/track/${sampleId}`)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  {sampleId}
                </button>
              ))}
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
