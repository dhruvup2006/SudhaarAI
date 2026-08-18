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
  Building
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
      setErrorMessage('Please select your municipal department from the dropdown.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    // Store login session info in localStorage for admin layout usage
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
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-amber-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full flex flex-col justify-center">
        {/* Official Department Login Card */}
        <div className="gov-card p-6 sm:p-8 bg-white border-t-4 border-amber-600 shadow-lg">
          {/* Card Header */}
          <div className="text-center mb-6 space-y-2 border-b border-slate-200 pb-5">
            <div className="w-12 h-12 rounded bg-slate-900 text-amber-400 flex items-center justify-center mx-auto border border-amber-500 shadow-md">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold uppercase">
              <Building className="w-3.5 h-3.5 text-amber-600" />
              <span>Municipal Officer Portal</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Department Officer Authentication
            </h1>
            <p className="text-xs text-slate-600">
              Access the central grievance dispatch & SLA resolution dashboard.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded bg-red-50 border border-red-300 text-red-800 text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Field 1: Officer ID */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Officer Login ID / Email *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="e.g. OFF-8492 or officer@pwd.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 text-slate-900 text-xs rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-semibold"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Account Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-9 py-2.5 bg-slate-50 text-slate-900 text-xs rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Field 3: Department Selection Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Select Department *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 text-slate-900 text-xs rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                >
                  <option value="">-- Select Assigned Municipal Dept --</option>
                  {departmentsList.map((dept) => (
                    <option key={dept.code} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Remember me & Options */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Remember Session</span>
              </label>

              <span className="text-slate-500 text-[11px]">Help Desk: <strong>1800-11-7834</strong></span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center justify-center space-x-2 border border-slate-700 disabled:opacity-50 mt-2 shadow-sm"
            >
              {isSubmitting ? (
                <span>Authenticating Officer...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Secure Login to Officer Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>

          {/* Sample Quick Fill Credentials Box */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <button
              onClick={handleQuickFill}
              className="text-xs font-bold text-blue-800 hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded border border-blue-200 inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Fill Sample Officer Credentials</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
