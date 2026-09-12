import React from 'react';
import Link from 'next/link';
import { PhoneCall, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800/90 bg-black/90 backdrop-blur-2xl text-slate-100 py-12 px-4 sm:px-6 lg:px-8 mt-20 relative z-10 shadow-2xl">
      {/* Google 4-Color Accent Line */}
      <div className="max-w-7xl mx-auto mb-8 h-1 w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853] rounded-full opacity-80" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About & Official Govt info */}
        <div className="space-y-4 md:col-span-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-white tracking-tight">सुधार-AI</span>
            </div>
            <span className="block text-xs text-slate-400 font-medium">Empowering Citizens Through AI & Tech • नवाचार द्वारा विकास</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed font-normal">
            Centralized Public Grievance Redressal and AI-powered Departmental Dispatch Engine. Built for municipal operations, PWD road maintenance, Jal Board water supply, Swachh Bharat sanitation, and electricity.
          </p>
          <div className="pt-2 text-xs space-y-1.5">
            <p className="flex items-center gap-1.5 text-slate-200 font-medium">
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>National Toll-Free Helpline: <strong className="text-white font-bold">1800-11-SUDHAAR (7834)</strong></span>
            </p>
          </div>
        </div>

        {/* Citizen Services */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2">
            <span>Citizen Portal</span>
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
            <li>
              <Link href="/report" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Register grievance</span>
              </Link>
            </li>
            <li>
              <Link href="/track" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Track complaint status</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Department Officers */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            <span>Officer Desk</span>
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
            <li>
              <Link href="/admin/login" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <span className="text-blue-400">•</span>
                <span>Department officer portal</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/analytics" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <span className="text-blue-400">•</span>
                <span>Analytics & SLA reports</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Strip */}
      <div className="max-w-7xl mx-auto pt-6 mt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">© 2026 Sudhaar AI Portal</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-400 font-medium">
          <span>Built for Public Welfare</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
        </div>
      </div>
    </footer>
  );
};
