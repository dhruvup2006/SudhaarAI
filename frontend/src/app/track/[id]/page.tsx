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
  Building2, 
  MapPin, 
  Copy, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle,
  RefreshCw,
  Printer,
  Building,
  Sparkles,
  Search,
  FileText
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
          throw new Error(`Grievance record "${ticketId}" was not found in the database.`);
        }
        throw new Error('Failed to load ticket details from server.');
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

  const handlePrint = () => {
    window.print();
  };

  // Timeline step helper
  const steps = [
    { title: 'Grievance Registered', key: 'Submitted', desc: 'Recorded in national portal database' },
    { title: 'AI Classified & Auto-Routed', key: 'Classified', desc: 'Dispatched to departmental officer desk' },
    { title: 'Field Action In Progress', key: 'In Progress', desc: 'On-site inspection & repair team deployed' },
    { title: 'Resolution Verified & Closed', key: 'Resolved', desc: 'Repair completed & SLA closed' }
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Navigation & Action Bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home Portal</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="text-xs font-bold text-slate-200 hover:text-white flex items-center space-x-1.5 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Record</span>
            </button>
            <button
              onClick={fetchTicket}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1.5 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/30 shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-300">Connecting to Municipal Grievance Server...</p>
          </div>
        ) : error ? (
          <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-10 text-center space-y-4 shadow-xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Grievance Record Not Found</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
            <div className="pt-2">
              <Link
                href="/report"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs inline-block transition-colors shadow-md"
              >
                Lodge a New Grievance
              </Link>
            </div>
          </div>
        ) : ticket && (
          <div className="space-y-6">
            {/* Header Ticket Card */}
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-mono text-xl font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                      {ticket.id}
                    </span>
                    <button
                      onClick={handleCopyId}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 border border-slate-700 transition-colors"
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
                <div className="flex items-center space-x-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-medium truncate">Location: {ticket.location}</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-medium truncate">Nodal Authority: {ticket.department}</span>
                </div>
              </div>
            </div>

            {/* Timeline UI */}
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Clock className="w-4 h-4 text-amber-400" />
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
                            statusState === 'completed' ? 'bg-emerald-500' : 'bg-slate-800'
                          }`} />
                        )}

                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-all ${
                          statusState === 'completed' 
                            ? 'bg-emerald-500 text-slate-950 shadow-md' 
                            : statusState === 'current'
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-lg'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {statusState === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-slate-950" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        <div className="pt-0.5">
                          <div className="flex items-center space-x-2.5">
                            <h4 className={`text-sm font-bold ${
                              statusState === 'current' ? 'text-amber-400' : statusState === 'completed' ? 'text-white' : 'text-slate-400'
                            }`}>
                              {st.title}
                            </h4>
                            {statusState === 'current' && (
                              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full uppercase tracking-wider">
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

            {/* AI Diagnostics Audit Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Automated AI Routing Diagnostics
                  </h3>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full uppercase tracking-wider">
                  {(ticket.ai_confidence * 100).toFixed(0)}% Match Precision
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono">
                {ticket.ai_reasoning || "Matched key signals indicating routing to relevant municipal engineering team."}
              </p>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1 gap-2">
                <span>Assigned Dept: <strong className="text-white">{ticket.department}</strong></span>
                {ticket.detected_language && (
                  <span>Language Detected: <strong className="text-amber-400 uppercase">{ticket.detected_language}</strong></span>
                )}
                <span>Created: {new Date(ticket.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Citizen Statement & Visual Evidence */}
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Citizen Statement & Photo Evidence</span>
              </h3>

              {/* Show Original Regional Text if translated */}
              {ticket.original_text && ticket.original_text !== ticket.description && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-amber-300 block">Original Spoken / Typed Text ({ticket.detected_language || 'regional'}):</span>
                  <p className="text-amber-100 font-medium">{ticket.original_text}</p>
                </div>
              )}

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-1">Translated Description (English):</span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950 p-4 rounded-xl border border-slate-800 font-medium">
                  {ticket.description}
                </p>
              </div>

              {ticket.photo_url && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-300 block mb-2">Submitted Photo Evidence:</span>
                  <img
                    src={ticket.photo_url}
                    alt="Ticket Evidence"
                    className="w-full max-h-80 object-cover rounded-xl border border-slate-800 shadow-md"
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
