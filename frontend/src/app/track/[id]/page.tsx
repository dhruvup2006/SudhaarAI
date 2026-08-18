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
  Building
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

  const handlePrint = () => {
    window.print();
  };

  // Timeline step helper
  const steps = [
    { title: 'Grievance Lodged', key: 'Submitted', desc: 'Complaint registered in central database' },
    { title: 'AI Classified & Assigned', key: 'Classified', desc: 'Auto-routed to nodal department engineer' },
    { title: 'Field Action In Progress', key: 'In Progress', desc: 'Inspection & physical repair initiated' },
    { title: 'Resolved & Closed', key: 'Resolved', desc: 'Work verified & grievance resolved' }
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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-amber-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Navigation back link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home Portal</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center space-x-1 bg-white px-3 py-1.5 rounded border border-slate-300 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Record</span>
            </button>
            <button
              onClick={fetchTicket}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center space-x-1 bg-amber-50 px-3 py-1.5 rounded border border-amber-300 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="gov-card p-12 text-center space-y-4">
            <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Connecting to Municipal Grievance Server...</p>
          </div>
        ) : error ? (
          <div className="gov-card p-8 text-center space-y-4 border-t-4 border-red-600">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Grievance Record Not Found</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">{error}</p>
            <div className="pt-2">
              <Link
                href="/report"
                className="px-5 py-2.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm inline-block border border-amber-500"
              >
                Lodge a New Grievance
              </Link>
            </div>
          </div>
        ) : ticket && (
          <div className="space-y-6">
            {/* Header Ticket Banner */}
            <div className="gov-card p-6 sm:p-8 border-t-4 border-amber-600 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-mono text-xl font-extrabold text-blue-900 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                      {ticket.id}
                    </span>
                    <button
                      onClick={handleCopyId}
                      className="p-1.5 text-slate-600 hover:text-slate-900 rounded bg-slate-100 border border-slate-300"
                      title="Copy Reference ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={ticket.category} size="lg" />
                  <UrgencyBadge urgency={ticket.urgency} size="lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 pt-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-slate-900 font-medium">Location: {ticket.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-slate-900 font-medium">Nodal Dept: {ticket.department}</span>
                </div>
              </div>
            </div>

            {/* Status Timeline UI */}
            <div className="gov-card p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Department Action Timeline</span>
              </h3>

              <div className="relative pt-2 pb-4">
                <div className="space-y-8 relative">
                  {steps.map((st, idx) => {
                    const statusState = getStepStatus(st.key);
                    return (
                      <div key={st.key} className="flex items-start space-x-4 relative">
                        {/* Connecting Vertical Line */}
                        {idx < steps.length - 1 && (
                          <div className={`absolute left-4 top-8 bottom-0 w-0.5 ${
                            statusState === 'completed' ? 'bg-emerald-600' : 'bg-slate-200'
                          }`} />
                        )}

                        {/* Step Icon Indicator */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-all ${
                          statusState === 'completed' 
                            ? 'bg-emerald-600 text-white' 
                            : statusState === 'current'
                            ? 'bg-amber-600 text-white ring-4 ring-amber-100 shadow'
                            : 'bg-slate-200 text-slate-600 border border-slate-300'
                        }`}>
                          {statusState === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="pt-0.5">
                          <div className="flex items-center space-x-2">
                            <h4 className={`text-sm font-bold ${
                              statusState === 'current' ? 'text-amber-800' : statusState === 'completed' ? 'text-slate-900' : 'text-slate-500'
                            }`}>
                              {st.title}
                            </h4>
                            {statusState === 'current' && (
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 rounded uppercase">
                                Current Status
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{st.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI Diagnostics Audit Card */}
            <div className="gov-card p-6 bg-slate-50 border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Automated AI Department Diagnostics
                  </h3>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded">
                  {(ticket.ai_confidence * 100).toFixed(0)}% Match Precision
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-200 font-mono">
                {ticket.ai_reasoning || "Matched keywords indicating routing to relevant municipal engineering team."}
              </p>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1">
                <span>Assigned Authority: <strong>{ticket.department}</strong></span>
                <span>Lodged Timestamp: {new Date(ticket.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Issue Description & Visual Evidence */}
            <div className="gov-card p-6 sm:p-8 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                Citizen Statement & Evidence
              </h3>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded border border-slate-200">
                {ticket.description}
              </p>

              {ticket.photo_url && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-700 block mb-2">Submitted Photo Evidence:</span>
                  <img
                    src={ticket.photo_url}
                    alt="Ticket Evidence"
                    className="w-full max-h-80 object-cover rounded border border-slate-300 shadow-sm"
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

