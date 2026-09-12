'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TextRoll } from '@/components/core/text-roll';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { 
  PlusCircle, 
  Search, 
  Clock, 
  ArrowRight, 
  Building2, 
  Droplet, 
  Hammer, 
  Trash2, 
  Zap, 
  Building, 
  Layers,
  Bot
} from 'lucide-react';

import { apiFetch } from '@/lib/api';

interface AnalyticsData {
  total_grievances: number;
  resolved_grievances: number;
  in_progress_grievances: number;
  pending_grievances: number;
  resolution_rate_percent: number;
  by_category: Record<string, number>;
  by_urgency: Record<string, number>;
  by_status: Record<string, number>;
}

export default function LandingPage() {
  const [ticketIdInput, setTicketIdInput] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    apiFetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch((err) => console.error('Failed to fetch analytics:', err));
  }, []);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketIdInput.trim()) return;
    const formattedId = ticketIdInput.trim().toUpperCase();
    router.push(`/track/${formattedId}`);
  };

  const departmentServices = [
    {
      name: 'Public Works Dept (PWD)',
      desc: 'Road repairs, pothole filling, bridge maintenance & street paving.',
      icon: Hammer,
      code: 'PWD',
      sla: '24-48 Hrs SLA',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400'
    },
    {
      name: 'Municipal Jal Board',
      desc: 'Water supply pipelines, sewer overflow clearance & drainage leaks.',
      icon: Droplet,
      code: 'JAL',
      sla: '12-24 Hrs SLA',
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400'
    },
    {
      name: 'Swachh Bharat & Sanitation',
      desc: 'Garbage dump clearance, door-to-door waste collection & public hygiene.',
      icon: Trash2,
      code: 'SWM',
      sla: '24 Hrs SLA',
      color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30 text-emerald-400'
    },
    {
      name: 'Electricity & Lighting',
      desc: 'Power outage triage, transformer repair & dangerous hanging wires.',
      icon: Zap,
      code: 'PWR',
      sla: '6-12 Hrs SLA',
      color: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30 text-yellow-400'
    }
  ];

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
      <div className="fixed top-1/2 left-1/3 w-96 h-96 bg-[#FBBC04]/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar />

      <main className="flex-1 relative z-10">

        {/* Hero Section */}
        <section className="relative py-16 md:py-28 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
            
            {/* Animated TextRoll Heading */}
            <h1 className="font-hero-heading flex flex-col items-center gap-1 mb-6 text-center">
              <TextRoll className="cursor-pointer text-white hover:text-rose-500 transition-colors">
                Report civic issues.
              </TextRoll>
              <TextRoll className="cursor-pointer text-zinc-300 hover:text-orange-500 transition-colors">
                Track real solutions.
              </TextRoll>
            </h1>

            <p className="font-body-lg max-w-2xl text-zinc-400 leading-relaxed mb-8 text-center">
              Submit complaints about roads, water supply, sanitation, and electricity. Our automated engine translates regional languages, classifies SLA urgency, and dispatches directly to departmental officers.
            </p>

            {/* Premium Rounded Action CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/report">
                <InteractiveHoverButton
                  text="Report a Grievance"
                  variant="primary"
                />
              </Link>

              <Link href="/admin/login">
                <InteractiveHoverButton
                  text="Department Officer Portal"
                  variant="secondary"
                />
              </Link>

              <Link href="/track">
                <InteractiveHoverButton
                  text="Track Live Status"
                  variant="outline"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* GDG VITC Live System Statistics Bar */}
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/85 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-zinc-800/80">
              <div className="px-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {analytics ? analytics.total_grievances : 18}
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Registered grievances</div>
              </div>
              <div className="px-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">
                  {analytics ? analytics.resolved_grievances : 3}
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Grievances solved</div>
              </div>
              <div className="px-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#4285F4] tracking-tight">
                  {analytics ? `${analytics.resolution_rate_percent}%` : '16.7%'}
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Resolution rate</div>
              </div>
              <div className="px-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">
                  {analytics ? Object.keys(analytics.by_category || {}).length : 5} Active
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Integrated authorities</div>
              </div>
            </div>
          </div>
        </section>

        {/* Municipal Departments & SLA Services */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-section-heading">
              Integrated departments & service SLAs
            </h2>
            <p className="font-body-base max-w-2xl mx-auto text-slate-300">
              Every complaint is auto-categorized by AI and dispatched with predefined SLA turnaround deadlines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departmentServices.map((dept) => {
              const IconComp = dept.icon;
              return (
                <div key={dept.code} className="bg-black/85 backdrop-blur-2xl border border-zinc-800/90 hover:border-amber-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xl group">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-amber-400 flex items-center justify-center border border-zinc-800 group-hover:border-amber-500/40 transition-colors">
                        <IconComp className="w-6 h-6 text-amber-400" />
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 bg-zinc-900 text-amber-300 rounded-full border border-zinc-800 font-mono">
                        {dept.code}
                      </span>
                    </div>

                    <h3 className="font-card-heading mb-2">{dept.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">{dept.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {dept.sla}
                    </span>
                    <Link
                      href="/report"
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                    >
                      <span>Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* GDG VITC Style Workflow Showcase */}
        <section className="py-16 bg-black/60 border-y border-zinc-800/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <h2 className="font-section-heading">
                How Sudhaar AI resolves civic issues
              </h2>
              <p className="font-body-base max-w-2xl mx-auto text-slate-300">
                End-to-end citizen reporting, automated translation, and field engineer tracking workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black/85 backdrop-blur-2xl border border-zinc-800/90 p-7 rounded-3xl space-y-4 hover:border-amber-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-lg flex items-center justify-center">
                  1
                </div>
                <h3 className="font-card-heading">Citizen reports issue</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Speak in Hindi, English, or regional languages using our voice recorder or type text with location.
                </p>
              </div>

              <div className="bg-black/85 backdrop-blur-2xl border border-zinc-800/90 p-7 rounded-3xl space-y-4 hover:border-blue-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#4285F4]/10 border border-[#4285F4]/30 text-[#4285F4] font-extrabold text-lg flex items-center justify-center">
                  2
                </div>
                <h3 className="font-card-heading">AI classification & translation</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Google Translation API converts text to English, NLP engine calculates SLA priority and routes to department nodal officer.
                </p>
              </div>

              <div className="bg-black/85 backdrop-blur-2xl border border-zinc-800/90 p-7 rounded-3xl space-y-4 hover:border-emerald-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#34A853]/10 border border-[#34A853]/30 text-[#34A853] font-extrabold text-lg flex items-center justify-center">
                  3
                </div>
                <h3 className="font-card-heading">Field repair & SLA clearance</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Municipal engineers receive tickets on their officer dashboard and dispatch repairs with real-time status updates.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
