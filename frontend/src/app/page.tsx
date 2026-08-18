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
  Building
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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-amber-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Public Notice Ticker Banner */}
        <div className="gov-notice-banner py-2.5 px-4 text-xs font-medium border-b flex items-center justify-center gap-2 text-center">
          <AlertCircle className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>Official Public Notice:</strong> Monsoon Civic Emergency Helpline is operational 24/7 across all municipal wards. Call Toll-Free <strong>1800-11-7834</strong> for urgent waterlogging support.
          </span>
        </div>

        {/* Official Hero Banner */}
        <section className="bg-slate-900 text-white border-b border-slate-800 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Portal Overview */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>Centralized Grievance Redressal & Citizen Care</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Transparent Municipal Grievance Redressal for Every Citizen
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Sudhaar AI empowers citizens to lodge municipal complaints regarding roads, water supply, waste sanitation, and street lighting. Our automated NLP engine classifies, prioritizes, and routes complaints directly to field officer dashboards.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/report"
                    className="px-6 py-3.5 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2 border border-amber-400"
                  >
                    <PlusCircle className="w-5 h-5 text-white" />
                    <span>Lodge a Grievance Now</span>
                    <ArrowRight className="w-4 h-4 text-amber-100" />
                  </Link>

                  <Link
                    href="/admin/login"
                    className="px-5 py-3.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition-colors border border-slate-700 flex items-center space-x-2"
                  >
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Department Officer Portal</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Track Grievance Card */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-lg p-6 text-slate-900 shadow-xl border-t-4 border-amber-500">
                  <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-200">
                    <Search className="w-5 h-5 text-amber-600" />
                    <h2 className="text-lg font-bold text-slate-900">Track Grievance Status</h2>
                  </div>

                  <p className="text-xs text-slate-600 mb-4">
                    Enter your 10-digit Grievance Reference ID provided during submission to view real-time status and assigned nodal officer details.
                  </p>

                  <form onSubmit={handleTrackSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Grievance Reference Number *
                      </label>
                      <input
                        type="text"
                        value={ticketIdInput}
                        onChange={(e) => setTicketIdInput(e.target.value)}
                        placeholder="e.g. SUD-94821"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white uppercase tracking-wider"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center justify-center space-x-2"
                    >
                      <Search className="w-4 h-4 text-amber-400" />
                      <span>Track Grievance Record</span>
                    </button>
                  </form>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Sample Reference ID:</span>
                    <button
                      onClick={() => setTicketIdInput('SUD-94821')}
                      className="font-mono text-blue-700 font-bold hover:underline"
                    >
                      SUD-94821
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* National Governance Statistics */}
        <section className="bg-white border-b border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-200">
              <div className="px-4">
                <div className="text-3xl font-black text-slate-900">1,420+</div>
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mt-1">Grievances Redressed</div>
              </div>
              <div className="px-4">
                <div className="text-3xl font-black text-emerald-700">98.4%</div>
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mt-1">Routing Precision Score</div>
              </div>
              <div className="px-4">
                <div className="text-3xl font-black text-blue-700">&lt; 24 Hrs</div>
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mt-1">Avg Resolution Time</div>
              </div>
              <div className="px-4">
                <div className="text-3xl font-black text-amber-700">4 Core Bodies</div>
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mt-1">Integrated Authorities</div>
              </div>
            </div>
          </div>
        </section>

        {/* Citizen Quick Services & Department Directory */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Municipal Departments & Citizen Services
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Select your issue category to register a ticket with guaranteed departmental SLA turnarounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departmentServices.map((dept) => {
              const IconComp = dept.icon;
              return (
                <div key={dept.code} className="gov-card p-5 flex flex-col justify-between hover:border-amber-500">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded bg-slate-900 text-amber-400 flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300 font-mono">
                        {dept.code}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-1.5">{dept.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{dept.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {dept.sla}
                    </span>
                    <Link
                      href="/report"
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-0.5"
                    >
                      <span>Lodge</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Public Grievance Transparency Feed */}
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gov-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  <span>Public Grievance Transparency Feed</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Live public view of registered civic issues and assigned departmental actions
                </p>
              </div>

              <Link
                href="/admin/inbox"
                className="text-xs font-bold text-slate-900 hover:text-amber-700 bg-slate-100 px-3 py-2 rounded border border-slate-300 flex items-center gap-1 shrink-0"
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
                  className="bg-slate-50 border border-slate-200 rounded-md p-4 block hover:bg-white hover:border-amber-400 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {ticket.id}
                    </span>
                    <UrgencyBadge urgency={ticket.urgency} size="sm" />
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1 mb-2">{ticket.title}</h4>

                  <div className="flex items-center text-xs text-slate-600 mb-3 space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{ticket.location}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <CategoryBadge category={ticket.category} size="sm" />
                    <span className="text-[11px] font-semibold text-slate-500">{ticket.timeAgo}</span>
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

