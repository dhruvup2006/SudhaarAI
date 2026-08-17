'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CategoryBadge } from '@/components/CategoryBadge';
import { UrgencyBadge } from '@/components/UrgencyBadge';
import { 
  PlusCircle, 
  Search, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  MapPin, 
  TrendingUp 
} from 'lucide-react';

export default function LandingPage() {
  const [ticketIdInput, setTicketIdInput] = useState('');
  const router = useRouter();

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketIdInput.trim()) return;
    const formattedId = ticketIdInput.trim().toUpperCase();
    router.push(`/track/${formattedId}`);
  };

  const sampleRecentTickets = [
    {
      id: 'SUD-94821',
      title: 'Severe Pothole on Main Arterial Road',
      category: 'Roads',
      urgency: 'High',
      location: '5th Avenue & Oak Street',
      status: 'In Progress',
      timeAgo: '2 hours ago'
    },
    {
      id: 'SUD-18402',
      title: 'Major Water Main Leak Flooding Street',
      category: 'Water',
      urgency: 'High',
      location: '742 Evergreen Terrace',
      status: 'Submitted',
      timeAgo: '4 hours ago'
    },
    {
      id: 'SUD-50291',
      title: 'Uncollected Waste & Overflowing Bins',
      category: 'Sanitation',
      urgency: 'Medium',
      location: 'Central Market Square',
      status: 'Classified',
      timeAgo: '6 hours ago'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
          {/* Ambient Glow background */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide shadow-inner">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span>Next-Gen Civic Tech Platform</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                Civic Issues Solved at <span className="gradient-text">AI Velocity</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
                Report potholes, water bursts, garbage dumps, or dark streetlights in seconds.
                Our NLP engine automatically classifies, prioritizes urgency, and routes your grievance to the exact government department dashboard.
              </p>

              {/* Main Call to Actions */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/report"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 transition-all flex items-center justify-center space-x-2.5 group"
                >
                  <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Report an Issue Now</span>
                  <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/admin/inbox"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-medium text-base transition-colors flex items-center justify-center space-x-2"
                >
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  <span>Official Admin Login</span>
                </Link>
              </div>

              {/* Ticket Search Form */}
              <div className="pt-8 max-w-xl mx-auto">
                <div className="glass-panel p-2 rounded-2xl border border-slate-800 shadow-2xl">
                  <form onSubmit={handleTrackSubmit} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={ticketIdInput}
                        onChange={(e) => setTicketIdInput(e.target.value)}
                        placeholder="Enter Ticket ID (e.g. SUD-94821)..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-900/90 text-white placeholder-slate-500 text-sm rounded-xl border border-slate-700/60 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase tracking-wide"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors flex items-center space-x-1.5 shrink-0"
                    >
                      <span>Track Status</span>
                    </button>
                  </form>
                </div>
                <p className="text-xs text-slate-500 mt-2.5">
                  Try default ticket <button onClick={() => setTicketIdInput('SUD-94821')} className="text-indigo-400 underline font-mono">SUD-94821</button> or submit a new grievance
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Metrics Row */}
        <section className="py-10 border-y border-slate-800/80 bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">98.4%</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">AI Classification Accuracy</div>
              </div>
              <div className="p-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">&lt; 2s</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Automated Routing Speed</div>
              </div>
              <div className="p-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">1,420+</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Civic Issues Resolved</div>
              </div>
              <div className="p-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-purple-400">4 Depts</div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Integrated Governance</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Steps */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-white tracking-tight">How SudhaarAI Works</h2>
            <p className="text-slate-400 text-base">
              A transparent, end-to-end pipeline connecting citizens directly with action teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
                01
              </div>
              <h3 className="text-lg font-semibold text-white">1. Citizen Submission</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Describe the problem in plain text, attach a photo, and pin the location. No bureaucratic forms needed.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg">
                02
              </div>
              <h3 className="text-lg font-semibold text-white">2. AI Keyword & Urgency NLP</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our internal AI pipeline parses keywords, assigns high/medium priority, and routes to PWD, Water Board, or Sanitation.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                03
              </div>
              <h3 className="text-lg font-semibold text-white">3. Action & Live Tracking</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Officials update status from "To Do" to "In Progress" and "Resolved". Citizens view live timeline updates anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Live Community Feed Preview */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <span>Recent Public Grievance Feed</span>
                </h3>
                <p className="text-sm text-slate-400">Live ticket routing activity across wards</p>
              </div>
              <Link
                href="/admin/inbox"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
              >
                <span>View Full Official Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleRecentTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/track/${ticket.id}`}
                  className="glass-card p-5 rounded-2xl block hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-indigo-400 font-medium">{ticket.id}</span>
                    <UrgencyBadge urgency={ticket.urgency} size="sm" />
                  </div>
                  <h4 className="font-semibold text-white text-sm line-clamp-1 mb-2">{ticket.title}</h4>
                  <div className="flex items-center text-xs text-slate-400 mb-3 space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{ticket.location}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <CategoryBadge category={ticket.category} size="sm" />
                    <span className="text-[11px] text-slate-400">{ticket.timeAgo}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
