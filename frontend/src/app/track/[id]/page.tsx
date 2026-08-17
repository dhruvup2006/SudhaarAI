'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CategoryBadge } from '@/components/CategoryBadge';
import { UrgencyBadge } from '@/components/UrgencyBadge';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Building2, 
  MapPin, 
  Copy, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle,
  RefreshCw,
  Share2
} from 'lucide-react';

interface GrievanceData {
  id: string;
  title: string;
  description: string;
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

  const [ticket, setTicket] = useState<GrievanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchTicket = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/grievances/${ticketId}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`Ticket ID "${ticketId}" was not found in the database.`);
        }
        throw new Error('Failed to load ticket details.');
      }
      const data = await res.json();
      setTicket(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Timeline step helper
  const steps = [
    { title: 'Submitted', key: 'Submitted', desc: 'Grievance received from citizen portal' },
    { title: 'Classified', key: 'Classified', desc: 'AI engine auto-assigned category & department' },
    { title: 'In Progress', key: 'In Progress', desc: 'Assigned to field engineers for repair' },
    { title: 'Resolved', key: 'Resolved', desc: 'Issue repaired & verified by supervisor' }
  ];

  const getStepStatus = (stepKey: string) => {
    if (!ticket) return 'upcoming';
    const statusOrder: Record<string, number> = {
      'Submitted': 1,
      'Classified': 2,
      'In Progress': 3,
      'Resolved': 4
    };
    const currentLevel = statusOrder[ticket.status] || 2;
    const stepLevel = statusOrder[stepKey] || 1;

    if (currentLevel > stepLevel) return 'completed';
    if (currentLevel === stepLevel) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Navigation back link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview</span>
          </Link>

          <button
            onClick={fetchTicket}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-800/40"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Status</span>
          </button>
        </div>

        {loading ? (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-300">Fetching live ticket timeline from FastAPI server...</p>
          </div>
        ) : error ? (
          <div className="glass-panel p-8 rounded-3xl border border-rose-500/30 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Ticket Not Found</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">{error}</p>
            <div className="pt-2">
              <Link
                href="/report"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm inline-block"
              >
                Submit a New Grievance
              </Link>
            </div>
          </div>
        ) : ticket && (
          <div className="space-y-8">
            {/* Header Ticket Banner */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-mono text-xl font-bold text-indigo-400">{ticket.id}</span>
                    <button
                      onClick={handleCopyId}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-700"
                      title="Copy Ticket ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h1 className="text-2xl font-bold text-white">{ticket.title}</h1>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={ticket.category} size="lg" />
                  <UrgencyBadge urgency={ticket.urgency} size="lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-slate-200 font-medium">{ticket.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-indigo-300 font-medium">{ticket.department}</span>
                </div>
              </div>
            </div>

            {/* Status Timeline UI */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <span>Grievance Resolution Progress</span>
              </h3>

              <div className="relative pt-2 pb-4">
                <div className="space-y-8 relative">
                  {steps.map((st, idx) => {
                    const statusState = getStepStatus(st.key);
                    return (
                      <div key={st.key} className="flex items-start space-x-4 relative">
                        {/* Connecting Vertical Line */}
                        {idx < steps.length - 1 && (
                          <div className={`absolute left-5 top-10 bottom-0 w-0.5 ${
                            statusState === 'completed' ? 'bg-emerald-500' : 'bg-slate-800'
                          }`} />
                        )}

                        {/* Step Icon Indicator */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 z-10 transition-all ${
                          statusState === 'completed' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                            : statusState === 'current'
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-600/40'
                            : 'bg-slate-900 text-slate-600 border border-slate-800'
                        }`}>
                          {statusState === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : statusState === 'current' ? (
                            <Sparkles className="w-4 h-4 animate-pulse" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="pt-1">
                          <div className="flex items-center space-x-2">
                            <h4 className={`text-base font-semibold ${
                              statusState === 'current' ? 'text-indigo-400' : statusState === 'completed' ? 'text-white' : 'text-slate-500'
                            }`}>
                              {st.title}
                            </h4>
                            {statusState === 'current' && (
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30 uppercase tracking-wider">
                                Current State
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

            {/* AI Classification Metadata Box */}
            <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-indigo-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">SudhaarAI Pipeline Diagnostics</h3>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  {(ticket.ai_confidence * 100).toFixed(0)}% AI Confidence
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                {ticket.ai_reasoning || "Matched keywords indicating routing to relevant municipal engineering team."}
              </p>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
                <span>Routed to: <strong className="text-white">{ticket.department}</strong></span>
                <span>Logged: {new Date(ticket.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Issue Description & Photo Details */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-semibold text-white">Citizen Report Details</h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                {ticket.description}
              </p>

              {ticket.photo_url && (
                <div className="pt-2">
                  <span className="text-xs text-slate-400 block mb-2 font-medium">Attached Visual Evidence:</span>
                  <img
                    src={ticket.photo_url}
                    alt="Ticket Evidence"
                    className="w-full max-h-80 object-cover rounded-2xl border border-slate-800 shadow-xl"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
