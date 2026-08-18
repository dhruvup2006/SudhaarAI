'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  ShieldAlert, 
  Lock, 
  User, 
  Building2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Building,
  Sparkles,
  Cpu,
  BadgeCheck,
  Headphones,
  Globe,
  Activity
} from 'lucide-react';

export default function OfficerLoginPage() {
  const router = useRouter();
  
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const departmentsList = [
    { code: 'PWD', name: 'Public Works Department (PWD - Roads & Bridges)' },
    { code: 'JAL', name: 'Municipal Jal Board (Water Supply & Sewerage)' },
    { code: 'SWM', name: 'Swachh Bharat & Sanitation Board (Waste Collection)' },
    { code: 'PWR', name: 'State Electricity Distribution Corp (Power Board)' },
    { code: 'SAF', name: 'Public Safety & Emergency Management' },
  ];

  const handleQuickFill = () => {
    setOfficerId('OFF-8492');
    setPassword('GovtOfficer2026#');
    setDepartment('Public Works Department (PWD - Roads & Bridges)');
    setErrorMessage('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!officerId.trim()) {
      setErrorMessage('Please enter your Official Officer Login ID.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your account password.');
      return;
    }
    if (!department) {
      setErrorMessage('Please select your assigned municipal department.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        localStorage.setItem('sudhaar_officer_session', JSON.stringify({
          officerId: officerId.trim(),
          department: department,
          loggedInAt: new Date().toISOString()
        }));
      } catch (e) {
        console.error(e);
      }
      setIsSubmitting(false);
      router.push('/admin/inbox');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white relative overflow-hidden">
      <Navbar />

      {/* Ambient Radial Gradient Background Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex items-center justify-center relative z-10">
        
        {/* Split Screen Enterprise Card */}
        <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          
          {/* LEFT PANEL: Executive Portal Showcase */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative">
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Emblem / Portal Badge */}
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-950 p-1 border border-amber-500/40 shadow-lg flex items-center justify-center shrink-0">
                  <img src="/logo.png" alt="सुधार-AI Logo" className="w-full h-full object-contain" />
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>State Municipal Administration</span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Central Grievance Dispatch & SLA Resolution Engine
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
                  Authorized Municipal Nodal Officers portal for real-time grievance review, automated AI routing verification, field engineer assignment, and SLA tracking.
                </p>
              </div>

              {/* Portal Live Highlights List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <Cpu className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">AI NLP Auto-Classification</h4>
                    <p className="text-[11px] text-slate-400">Instant multi-language translation and department keyword matching.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Real-Time SLA Priority Tracking</h4>
                    <p className="text-[11px] text-slate-400">Urgency detection ensures high-risk civic hazards receive immediate priority.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <BadgeCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Official Audit Trail</h4>
                    <p className="text-[11px] text-slate-400">Complete historical logging for departmental accountability.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security Footer */}
            <div className="relative z-10 pt-6 border-t border-slate-800 flex items-center justify-between text-slate-400 text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px]">256-Bit SSL Encrypted Portal</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">v2.4 Government Build</span>
            </div>
          </div>

          {/* RIGHT PANEL: Officer Authentication Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-slate-900/60 relative">
            <div className="max-w-md mx-auto w-full space-y-6">
              
              {/* Login Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Nodal Officer Authentication</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleQuickFill}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Fill Demo Credentials</span>
                  </button>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Sign in to your Officer Account
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your credentials and select your municipal department to continue.
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center space-x-2.5 shadow-sm animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Officer ID Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                    Officer Login ID / Govt Email <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      placeholder="e.g. OFF-8492 or officer@pwd.gov.in"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/80 text-white text-xs rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono transition-all placeholder-slate-500 shadow-inner"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                    Account Password <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-slate-950/80 text-white text-xs rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono transition-all placeholder-slate-500 shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Department Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                    Assigned Municipal Department <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/80 text-white text-xs rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium transition-all cursor-pointer"
                    >
                      <option value="" className="bg-slate-900 text-slate-400">-- Select Assigned Department --</option>
                      {departmentsList.map((dept) => (
                        <option key={dept.code} value={dept.name} className="bg-slate-900 text-white">
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Checkbox & Helpdesk */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-950"
                    />
                    <span>Remember officer session</span>
                  </label>

                  <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                    <Headphones className="w-3.5 h-3.5 text-amber-400" />
                    <span>Helpline: <strong className="text-slate-200">1800-11-7834</strong></span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 mt-4 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Authenticating Officer Account...</span>
                  ) : (
                    <>
                      <span>Secure Login to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
