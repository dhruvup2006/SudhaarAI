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
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  MapPin, 
  TrendingUp,
  AlertCircle,
  FileText,
  PhoneCall,
  Droplet,
  Hammer,
  Trash2,
  Zap,
  Building,
  Sparkles,
  Cpu,
  BarChart3,
  CheckCircle,
  Radio,
  Share2
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
      location: '5th Avenue & Oak Street, Ward 12',
      status: 'In Progress',
      timeAgo: '2 hours ago'
    },
    {
      id: 'SUD-18402',
      title: 'Major Water Main Leak Flooding Street',
      category: 'Water',
      urgency: 'High',
      location: '742 Evergreen Terrace, Sector 4',
      status: 'Submitted',
      timeAgo: '4 hours ago'
    },
    {
      id: 'SUD-50291',
      title: 'Uncollected Waste & Overflowing Bins',
      category: 'Sanitation',
      urgency: 'Medium',
      location: 'Central Market Square, Block B',
      status: 'Classified',
      timeAgo: '6 hours ago'
    }
  ];

  const departmentServices = [
    {
      name: 'Public Works Dept (PWD)',
      desc: 'Road repairs, pothole filling, bridge maintenance & street paving.',
      icon: Hammer,
      code: 'PWD',
      sla: '24-48 Hrs SLA'
    },
    {
      name: 'Municipal Jal Board',
      desc: 'Water supply pipelines, sewer overflow clearance & drainage leaks.',
      icon: Droplet,
      code: 'JAL',
      sla: '12-24 Hrs SLA'
    },
    {
      name: 'Swachh Bharat & Sanitation',
      desc: 'Garbage dump clearance, door-to-door waste collection & public hygiene.',
      icon: Trash2,
      code: 'SWM',
      sla: '24 Hrs SLA'
    },
    {
      name: 'Electricity & Lighting',
      desc: 'Dark streetlights, transformer outages & hazardous loose electrical wires.',
      icon: Zap,
      code: 'PWR',
      sla: '6-12 Hrs SLA'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Public Notice Ticker Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-amber-500/10 border-b border-slate-800 py-2.5 px-4 text-xs font-medium text-slate-300 flex items-center justify-center gap-2 text-center">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span>
            <strong className="text-amber-400 font-extrabold uppercase tracking-wide">Official Public Announcement:</strong> Monsoon Civic Care Helpline is operational 24/7. Call Toll-Free <strong className="text-white">1800-11-7834</strong> for immediate emergency assistance.
          </span>
        </div>

        {/* Hero Section */}
        <section className="relative py-16 md:py-24 border-b border-slate-800 overflow-hidden">
          {/* Background Lighting Elements */}
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Portal Overview */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 p-1.5 border border-amber-500/40 shadow-xl flex items-center justify-center shrink-0">
                    <img src="/logo.png" alt="सुधार-AI Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
                    <Building className="w-3.5 h-3.5 text-amber-400" />
                    <span>State Municipal Administration • AI Platform</span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Transparent Municipal Grievance Redressal for Every Citizen
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Sudhaar AI empowers citizens to lodge municipal complaints regarding roads, water supply, sanitation, and electricity. Our automated NLP engine translates regional languages, classifies SLA urgency, and dispatches directly to departmental officers.
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <Link
                    href="/report"
                    className="px-7 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2.5 active:scale-95 cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5 text-slate-950" />
                    <span>Lodge a Grievance Now</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </Link>

                  <Link
                    href="/admin/login"
                    className="px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm transition-all border border-slate-700/80 flex items-center space-x-2.5 shadow-md"
                  >
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Department Officer Portal</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Track Grievance Card */}
              <div className="lg:col-span-5">
                <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-7 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2.5">
                      <Search className="w-5 h-5 text-amber-400" />
                      <h2 className="text-lg font-bold text-white">Track Grievance Status</h2>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/50 uppercase font-bold">
                      Live Verification
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                    Enter your Grievance Reference ID (e.g. <strong className="text-slate-200 font-mono">SUD-94821</strong>) to view real-time resolution status and assigned officer details.
                  </p>

                  <form onSubmit={handleTrackSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                        Grievance Reference Number <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={ticketIdInput}
                        onChange={(e) => setTicketIdInput(e.target.value)}
                        placeholder="e.g. SUD-94821"
                        className="w-full px-4 py-3.5 bg-slate-950 text-white border border-slate-700/80 rounded-xl font-mono text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 uppercase tracking-wider transition-all shadow-inner placeholder-slate-600"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                    >
                      <Search className="w-4 h-4 text-slate-950" />
                      <span>Search Grievance Record</span>
                    </button>
                  </form>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Sample Reference ID:</span>
                    <button
                      type="button"
                      onClick={() => setTicketIdInput('SUD-94821')}
                      className="font-mono text-amber-400 font-bold hover:underline"
                    >
                      SUD-94821
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* National Governance Statistics Bar */}
        <section className="bg-slate-900/60 border-b border-slate-800 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-800">
              <div className="px-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">1,420+</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Grievances Redressed</div>
              </div>
              <div className="px-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">98.4%</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">NLP Precision Score</div>
              </div>
              <div className="px-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight">&lt; 24 Hrs</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Avg SLA Resolution</div>
              </div>
              <div className="px-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">4 Core Bodies</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Integrated Authorities</div>
              </div>
            </div>
          </div>
        </section>

        {/* Municipal Departments & SLA Services */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-extrabold uppercase tracking-wider border border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Automated Municipal Routing</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Integrated Departments & Service SLAs
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every complaint is auto-categorized by AI and dispatched with predefined SLA turnarounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departmentServices.map((dept) => {
              const IconComp = dept.icon;
              return (
                <div key={dept.code} className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-lg group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center border border-slate-800 group-hover:border-amber-500/40 transition-colors">
                        <IconComp className="w-6 h-6 text-amber-400" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 bg-slate-950 text-amber-300 rounded-lg border border-slate-800 font-mono">
                        {dept.code}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base mb-2">{dept.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{dept.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {dept.sla}
                    </span>
                    <Link
                      href="/report"
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                    >
                      <span>Lodge</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Workflow Showcase */}
        <section className="py-16 bg-slate-900/40 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                How Sudhaar AI Resolves Civic Issues
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                End-to-end citizen reporting, automated translation, and field engineer tracking workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-sm flex items-center justify-center">
                  1
                </div>
                <h3 className="font-bold text-white text-base">Citizen Reports Issue</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Speak in Hindi, English, or regional languages using our voice recorder or type text with location.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-sm flex items-center justify-center">
                  2
                </div>
                <h3 className="font-bold text-white text-base">AI Classification & Translation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Google Translation API converts text to English, NLP engine calculates SLA priority and routes to department nodal officer.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-sm flex items-center justify-center">
                  3
                </div>
                <h3 className="font-bold text-white text-base">Field Repair & SLA Clearance</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Municipal engineers receive tickets on their officer dashboard and dispatch repairs with real-time status updates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Public Grievance Transparency Feed */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2.5">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <span>Public Grievance Transparency Feed</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Live public view of registered civic issues and assigned departmental actions
                </p>
              </div>

              <Link
                href="/admin/login"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <span>Officer Console Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleRecentTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/track/${ticket.id}`}
                  className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 block hover:border-amber-500/50 hover:bg-slate-950 transition-all shadow-md group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                      {ticket.id}
                    </span>
                    <UrgencyBadge urgency={ticket.urgency} size="sm" />
                  </div>

                  <h4 className="font-bold text-white text-sm line-clamp-1 mb-2 group-hover:text-amber-300 transition-colors">{ticket.title}</h4>

                  <div className="flex items-center text-xs text-slate-400 mb-3 space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{ticket.location}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <CategoryBadge category={ticket.category} size="sm" />
                    <span className="text-[11px] font-bold text-slate-500">{ticket.timeAgo}</span>
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
