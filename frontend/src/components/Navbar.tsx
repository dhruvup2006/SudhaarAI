'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, PlusCircle, Search, LayoutDashboard, Menu, X, PhoneCall, Globe, Building } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Tricolor Top Stripe */}
      <div className="tricolor-stripe w-full" />

      {/* Top Utility Bar (Govt Portal Banner & Helpline) */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-amber-400 flex items-center gap-1">
              <Building className="w-3.5 h-3.5" />
              Government of India / Municipal Grievances Portal
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">Public Redressal & Civic Care System</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-emerald-400 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
              <PhoneCall className="w-3 h-3" />
              <span>Toll Free Helpline: <strong>1800-11-SUDHAAR (7834)</strong></span>
            </div>
            
            <div className="hidden sm:flex items-center space-x-2 text-slate-400 border-l border-slate-700 pl-3">
              <button 
                onClick={() => setFontSize('normal')} 
                className={`hover:text-white ${fontSize === 'normal' ? 'font-bold text-white' : ''}`}
                title="Normal Font Size"
              >
                A
              </button>
              <button 
                onClick={() => setFontSize('large')} 
                className={`hover:text-white ${fontSize === 'large' ? 'font-bold text-white' : ''}`}
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            <div className="flex items-center space-x-1 text-slate-300 border-l border-slate-700 pl-3 cursor-pointer hover:text-white">
              <Globe className="w-3 h-3" />
              <span className="font-medium">English | हिन्दी</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & National Emblem Box */}
            <Link href="/" className="flex items-center space-x-3.5 group">
              <div className="w-11 h-11 rounded-xl bg-slate-950 p-1 border border-slate-700/80 shadow-md flex items-center justify-center overflow-hidden shrink-0 group-hover:border-amber-500/50 transition-all">
                <img src="/logo.png" alt="सुधार-AI Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-extrabold tracking-tight text-white">सुधार <span className="text-amber-400">AI</span></span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full uppercase tracking-wider">
                    Official Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block font-medium">Empowering Growth Through Innovation</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              >
                Home Overview
              </Link>
              <Link
                href="/report"
                className="px-3.5 py-2 text-sm font-medium text-emerald-300 hover:text-emerald-200 hover:bg-slate-800 rounded-md transition-colors flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>File Grievance</span>
              </Link>
              <Link
                href="/track/SUD-94821"
                className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 rounded-md transition-colors flex items-center space-x-1.5"
              >
                <Search className="w-4 h-4 text-blue-400" />
                <span>Track Complaint</span>
              </Link>
              <div className="h-5 w-px bg-slate-700 mx-2" />
              <Link
                href="/admin/login"
                className="px-4 py-2 text-sm font-semibold text-amber-200 bg-amber-950/70 hover:bg-amber-900/80 border border-amber-600/50 rounded-md transition-all flex items-center space-x-2 shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Department Officer Login</span>
              </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-slate-300 hover:text-white rounded-md bg-slate-800"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {mobileOpen && (
            <div className="md:hidden py-3 border-t border-slate-800 space-y-1 bg-slate-900 px-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
              >
                Home Overview
              </Link>
              <Link
                href="/report"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-medium text-emerald-400 hover:bg-slate-800 rounded-md"
              >
                File Grievance
              </Link>
              <Link
                href="/track/SUD-94821"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-medium text-blue-400 hover:bg-slate-800 rounded-md"
              >
                Track Complaint
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-semibold text-amber-300 bg-amber-950/80 border border-amber-700/60 rounded-md mt-2"
              >
                Department Officer Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

