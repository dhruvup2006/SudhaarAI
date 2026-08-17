import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Heart, ExternalLink, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">SudhaarAI</span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            AI-driven civic grievance classification and intelligent department routing platform. Empowering citizens and speeding up municipal response times.
          </p>
          <div className="flex items-center space-x-4 text-xs text-slate-500 pt-2">
            <span>© 2026 SudhaarAI Civic Tech.</span>
            <span>•</span>
            <span className="flex items-center">Built with Next.js & FastAPI</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Citizen Services</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/report" className="text-slate-400 hover:text-indigo-400 transition-colors">
                Report a Pothole / Leak
              </Link>
            </li>
            <li>
              <Link href="/track/SUD-94821" className="text-slate-400 hover:text-indigo-400 transition-colors">
                Track Complaint Status
              </Link>
            </li>
            <li>
              <Link href="/" className="text-slate-400 hover:text-indigo-400 transition-colors">
                Supported Departments
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Official Portal</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/admin/inbox" className="text-slate-400 hover:text-indigo-400 transition-colors">
                Department Inbox
              </Link>
            </li>
            <li>
              <Link href="/admin/analytics" className="text-slate-400 hover:text-indigo-400 transition-colors">
                Resolution Analytics
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" className="text-slate-400 hover:text-indigo-400 transition-colors">
                AI Routing Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
