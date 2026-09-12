'use client';

import React, { useEffect, useState, use, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CategoryBadge } from '@/components/CategoryBadge';
import { UrgencyBadge } from '@/components/UrgencyBadge';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { 
  CheckCircle2, 
  Clock, 
  Building2, 
  MapPin, 
  Copy, 
  Check, 
  ArrowLeft, 
  AlertCircle,
  RefreshCw,
  Printer,
  Search,
  FileText,
  ImageOff
} from 'lucide-react';

interface GrievanceData {
  id: string;
  title: string;
  description: string;
  original_text?: string;
  detected_language?: string;
  location: string;
  photo_url?: string;
  category: string;
  urgency: string;
  status: string;
  department: string;
  ai_confidence: number;
  ai_reasoning?: string;
  created_at: string;
  updated_at: string;
}

export default function TicketTrackPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;
  const router = useRouter();

  const [ticket, setTicket] = useState<GrievanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [searchIdInput, setSearchIdInput] = useState('');

  useEffect(() => {
    let isMounted = true;
    fetch(`http://127.0.0.1:8000/api/grievances/${ticketId}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`Grievance record "${ticketId}" was not found in the database.`);
          }
          throw new Error('Failed to load ticket details from server.');
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setTicket(data);
          setError('');
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error(err);
          const msg = err instanceof Error ? err.message : 'Unable to connect to backend.';
          setError(msg);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [ticketId]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchIdInput.trim()) return;
    const formatted = searchIdInput.trim().toUpperCase();
    router.push(`/track/${formatted}`);
  };

  // 3-Step Department Timeline (REMOVED AI Classified Step 2 as requested)
  const steps = [
    { title: 'Grievance Registered', key: 'Submitted', desc: 'Recorded in national portal database' },
    { title: 'Field Action In Progress', key: 'In Progress', desc: 'On-site inspection & repair team deployed' },
    { title: 'Resolution Verified & Closed', key: 'Resolved', desc: 'Repair completed & SLA closed' }
  ];

  const getStepStatus = (stepKey: string) => {
    if (!ticket) return 'upcoming';
    const statusOrder: Record<string, number> = {
      'Submitted': 1,
      'Classified': 1,
      'In Progress': 2,
      'Resolved': 3
    };
    const currentLevel = statusOrder[ticket.status] || 1;
    const stepLevel = statusOrder[stepKey] || 1;

    if (currentLevel > stepLevel) return 'completed';
    if (currentLevel === stepLevel) return 'current';
    return 'upcoming';
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

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6 relative z-10">
        
        {/* Search Bar Top Strip */}
        <div className="w-full bg-black/85 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-3 shadow-xl no-print">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchIdInput}
                onChange={(e) => setSearchIdInput(e.target.value)}
                placeholder="Enter reference number (e.g. SUD-19002)..."
                className="w-full pl-11 pr-4 py-3 bg-zinc-950 text-white border border-zinc-800 rounded-2xl font-mono text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase tracking-wider transition-all placeholder-slate-500"
              />
            </div>
            <InteractiveHoverButton
              type="submit"
              text="Track grievance"
              variant="primary"
              className="shrink-0"
            />
          </form>
        </div>

        {/* Navigation & Action Controls Bar */}
        <div className="flex items-center justify-between no-print">
          <Link
            href="/"
            className="px-4 py-2 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-semibold flex items-center space-x-2 transition-all shadow-md active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to home portal</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print receipt</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh status</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
            <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-300">Connecting to Municipal Database Server...</p>
          </div>
        ) : error ? (
          <div className="bg-zinc-900 border border-red-500/30 rounded-3xl p-10 text-center space-y-4 shadow-xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Grievance Record Not Found</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/report"
                className="px-6 py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs inline-block transition-all shadow-md active:scale-[0.98]"
              >
                Lodge a New Grievance
              </Link>
            </div>
          </div>
        ) : ticket && (
          <div className="space-y-6">
            {/* Header Ticket Card */}
            <div className="bg-black/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-mono text-xl font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                      {ticket.id}
                    </span>
                    <button
                      onClick={handleCopyId}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-zinc-800 border border-zinc-700 transition-colors"
                      title="Copy Reference ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">{ticket.title}</h1>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={ticket.category} size="lg" />
                  <UrgencyBadge urgency={ticket.urgency} size="lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 pt-5">
                <div className="flex items-center space-x-2.5 bg-black/60 p-3 rounded-xl border border-zinc-800">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium truncate">Location: {ticket.location}</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-black/60 p-3 rounded-xl border border-zinc-800">
                  <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="font-medium truncate">Nodal Authority: {ticket.department}</span>
                </div>
              </div>
            </div>

            {/* Timeline UI (3 Steps) */}
            <div className="bg-black/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-xl space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-zinc-800 pb-3">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Department Action Timeline</span>
              </h3>

              <div className="relative pt-2 pb-2">
                <div className="space-y-8 relative">
                  {steps.map((st, idx) => {
                    const statusState = getStepStatus(st.key);
                    return (
                      <div key={st.key} className="flex items-start space-x-4 relative">
                        {idx < steps.length - 1 && (
                          <div className={`absolute left-4 top-8 bottom-0 w-0.5 ${
                            statusState === 'completed' ? 'bg-emerald-500' : 'bg-zinc-800'
                          }`} />
                        )}

                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-all ${
                          statusState === 'completed' 
                            ? 'bg-emerald-500 text-zinc-950 shadow-md' 
                            : statusState === 'current'
                            ? 'bg-sky-500 text-zinc-950 ring-4 ring-sky-500/20 shadow-lg'
                            : 'bg-zinc-800 text-slate-400 border border-zinc-700'
                        }`}>
                          {statusState === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-zinc-950" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        <div className="pt-0.5">
                          <div className="flex items-center space-x-2.5">
                            <h4 className={`text-sm font-bold ${
                              statusState === 'current' ? 'text-sky-400' : statusState === 'completed' ? 'text-white' : 'text-slate-400'
                            }`}>
                              {st.title}
                            </h4>
                            {statusState === 'current' && (
                              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-full uppercase tracking-wider">
                                Current Status
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{st.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Citizen Statement & Visual Evidence */}
            <div className="bg-black/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2.5 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Citizen Statement & Photo Evidence</span>
              </h3>

              {/* Show Original Regional Text if translated */}
              {ticket.original_text && ticket.original_text !== ticket.description && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-emerald-300 block">Original Spoken / Typed Text ({ticket.detected_language || 'regional'}):</span>
                  <p className="text-emerald-100 font-medium">{ticket.original_text}</p>
                </div>
              )}

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-1">Translated Description (English):</span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-black p-4 rounded-xl border border-zinc-800 font-medium">
                  {ticket.description}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-xs font-bold text-slate-300 block mb-2">Submitted Photo Evidence:</span>
                {ticket.photo_url ? (
                  <img
                    src={ticket.photo_url}
                    alt="Ticket Evidence"
                    className="w-full max-h-80 object-cover rounded-xl border border-zinc-800 shadow-md"
                  />
                ) : (
                  <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 text-slate-400 text-xs font-medium flex items-center space-x-2.5">
                    <ImageOff className="w-5 h-5 text-slate-500 shrink-0" />
                    <span>No photo evidence was attached by citizen.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
