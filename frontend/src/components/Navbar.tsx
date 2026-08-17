'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, PlusCircle, Search, LayoutDashboard, Menu, X, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-white">Sudhaar<span className="text-indigo-400">AI</span></span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md uppercase tracking-wider">v1.0</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Civic Grievance AI Router</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/report"
              className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Report Issue</span>
            </Link>
            <Link
              href="/track/SUD-94821"
              className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Track Ticket</span>
            </Link>
            <div className="h-4 w-px bg-slate-800 mx-2" />
            <Link
              href="/admin/inbox"
              className="px-4 py-2 text-sm font-medium text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 rounded-xl transition-all flex items-center space-x-2 shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>Official Portal</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 rounded-lg"
            >
              Overview
            </Link>
            <Link
              href="/report"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-base font-medium text-emerald-400 hover:bg-slate-800 rounded-lg"
            >
              Report Issue
            </Link>
            <Link
              href="/track/SUD-94821"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-base font-medium text-blue-400 hover:bg-slate-800 rounded-lg"
            >
              Track Complaint
            </Link>
            <Link
              href="/admin/inbox"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-base font-medium text-indigo-300 bg-indigo-950/50 border border-indigo-800/40 rounded-lg mt-2"
            >
              Official Dashboard
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
