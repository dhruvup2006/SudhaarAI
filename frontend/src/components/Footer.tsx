import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ExternalLink, PhoneCall, Building, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-300 bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About & Official Govt info */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-amber-600 flex items-center justify-center border border-amber-400">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-wide">सुधार AI (SudhaarAI)</span>
              <span className="block text-[11px] text-amber-400 font-semibold uppercase">National Public Grievance Portal</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            Centralized Citizen Grievance Redressal and AI-powered Departmental Routing Platform. Designed for municipal authorities, Public Works Department (PWD), Jal Board, Sanitation Board, and Electricity Departments.
          </p>
          <div className="pt-2 text-xs text-slate-400 space-y-1">
            <p className="flex items-center gap-1 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>National Toll-Free Grievance Helpline: <strong>1800-11-SUDHAAR (1800-11-7834)</strong></span>
            </p>
            <p>© 2026 Government Grievance Redressal Portal. All rights reserved.</p>
          </div>
        </div>

        {/* Citizen Services */}
        <div>
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
            Citizen Services
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/report" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                <span>• File a Public Grievance</span>
              </Link>
            </li>
            <li>
              <Link href="/track/SUD-94821" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                <span>• Track Complaint Status</span>
              </Link>
            </li>
            <li>
              <Link href="/" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                <span>• Citizen Charter & Resolution Timeframes</span>
              </Link>
            </li>
            <li>
              <Link href="/" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                <span>• Nodal Officers & Ward Directory</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Department Portal & Compliance */}
        <div>
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
            Department Officers & Compliance
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/admin/inbox" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                <span>• Department Officer Inbox</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/analytics" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                <span>• Ward Resolution Analytics</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                <span>• AI Routing & SLA Rules</span>
              </Link>
            </li>
            <li>
              <span className="text-slate-400">Terms of Use & Accessibility Policy</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Strip */}
      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono">
            NIC & GIGW Compliant
          </span>
          <span>Designed & Maintained for Municipal Public Welfare</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Website Policy</span>
          <span>•</span>
          <span>Help</span>
          <span>•</span>
          <span>Feedback</span>
        </div>
      </div>
    </footer>
  );
};

