import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ExternalLink, PhoneCall, Building, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/90 bg-slate-900/95 backdrop-blur-2xl text-slate-100 py-12 px-4 sm:px-6 lg:px-8 mt-20 relative z-10 shadow-2xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About & Official Govt info */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-950 p-1 border border-amber-500/40 shadow-md flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="सुधार-AI Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-white tracking-wide drop-shadow-sm">सुधार-AI (SudhaarAI)</span>
              <span className="block text-[11px] text-amber-400 font-bold uppercase tracking-wider">Empowering Growth Through Innovation • नवाचार द्वारा विकास को सशक्त बनाना</span>
            </div>
          </div>
          <p className="text-xs text-slate-200 max-w-md leading-relaxed font-normal">
            Centralized Citizen Grievance Redressal and AI-powered Departmental Routing Platform. Designed for municipal authorities, Public Works Department (PWD), Jal Board, Sanitation Board, and Electricity Departments.
          </p>
          <div className="pt-2 text-xs space-y-1.5">
            <p className="flex items-center gap-1.5 text-slate-100 font-medium">
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>National Toll-Free Grievance Helpline: <strong className="text-white font-bold">1800-11-SUDHAAR (1800-11-7834)</strong></span>
            </p>
            <p className="text-slate-400">© 2026 Government Grievance Redressal Portal. All rights reserved.</p>
          </div>
        </div>

        {/* Citizen Services */}
        <div>
          <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-4 border-b border-slate-700/80 pb-2">
            Citizen Services
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li>
              <Link href="/report" className="text-slate-200 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-400">•</span>
                <span>File a Public Grievance</span>
              </Link>
            </li>
            <li>
              <Link href="/track/SUD-94821" className="text-slate-200 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Track Complaint Status</span>
              </Link>
            </li>
            <li>
              <Link href="/" className="text-slate-200 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Citizen Charter & Resolution Timeframes</span>
              </Link>
            </li>
            <li>
              <Link href="/" className="text-slate-200 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Nodal Officers & Ward Directory</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Department Portal & Compliance */}
        <div>
          <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-4 border-b border-slate-700/80 pb-2">
            Department Officers & Compliance
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li>
              <Link href="/admin/inbox" className="text-slate-200 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Department Officer Inbox</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/analytics" className="text-slate-200 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Ward Resolution Analytics</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" className="text-slate-200 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-400">•</span>
                <span>AI Routing & SLA Rules</span>
              </Link>
            </li>
            <li>
              <span className="text-slate-300">• Terms of Use & Accessibility Policy</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Strip */}
      <div className="max-w-7xl mx-auto pt-6 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-4">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 bg-slate-950 text-amber-400 rounded border border-slate-700 font-mono font-semibold">
            NIC & GIGW Compliant
          </span>
          <span className="text-slate-200">Designed & Maintained for Municipal Public Welfare</span>
        </div>
        <div className="flex items-center space-x-4 text-slate-300 font-medium">
          <span className="hover:text-white cursor-pointer">Website Policy</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">Help</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">Feedback</span>
        </div>
      </div>
    </footer>
  );
};

