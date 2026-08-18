'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { 
  Lock, 
  User, 
  Building2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Building, 
  Sparkles, 
  KeyRound, 
  ShieldAlert,
  AlertCircle,
  Shield,
  UserCheck
} from 'lucide-react';

export default function OfficerLoginPage() {
  const router = useRouter();
  
  // Tab state: 'officer' | 'admin'
  const [activeTab, setActiveTab] = useState<'officer' | 'admin'>('officer');

  // Officer Form Fields
  const [officerId, setOfficerId] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  
  // Admin Form Fields
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const departmentOptions = [
    { name: 'Public Works Department (PWD)', category: 'Roads', code: 'PWD' },
    { name: 'Municipal Jal Board', category: 'Water', code: 'JAL' },
    { name: 'Swachh Bharat & Sanitation Board', category: 'Sanitation', code: 'SWM' },
    { name: 'State Electricity Board', category: 'Electricity', code: 'PWR' },
  ];

  const handleOfficerQuickFill = () => {
    setOfficerId('OFF-8492');
    setOfficerPassword('Officer2026#');
    setSelectedDept('Roads');
    setErrorMessage('');
  };

  const handleAdminQuickFill = () => {
    setAdminId('ADMIN-001');
    setAdminPassword('AdminMaster2026#');
    setErrorMessage('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (activeTab === 'officer') {
      if (!officerId.trim()) {
        setErrorMessage('Please enter your Officer Login ID.');
        return;
      }
      if (!officerPassword.trim()) {
        setErrorMessage('Please enter your account password.');
        return;
      }
      if (!selectedDept) {
        setErrorMessage('Please select your assigned department.');
        return;
      }

      setIsSubmitting(true);

      const deptObj = departmentOptions.find(d => d.category === selectedDept) || departmentOptions[0];

      setTimeout(() => {
        try {
          localStorage.setItem('sudhaar_user', JSON.stringify({
            role: 'officer',
            officerId: officerId.trim(),
            department: deptObj.name,
            category: deptObj.category,
            loggedInAt: new Date().toISOString()
          }));
        } catch (e) {
          console.error(e);
        }
        setIsSubmitting(false);
        router.push('/admin/inbox');
      }, 700);

    } else {
      // Admin Tab Login
      if (!adminId.trim()) {
        setErrorMessage('Please enter your System Admin ID.');
        return;
      }
      if (!adminPassword.trim()) {
        setErrorMessage('Please enter the Admin Master Security Key.');
        return;
      }

      setIsSubmitting(true);

      setTimeout(() => {
        try {
          localStorage.setItem('sudhaar_user', JSON.stringify({
            role: 'admin',
            officerId: adminId.trim(),
            department: 'All Departments (System Admin)',
            category: 'All',
            loggedInAt: new Date().toISOString()
          }));
        } catch (e) {
          console.error(e);
        }
        setIsSubmitting(false);
        router.push('/admin/inbox');
      }, 700);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white relative overflow-hidden">
      <Navbar />

      {/* Ambient Lighting Elements */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto w-full flex flex-col items-center justify-center relative z-10">
        
        {/* Top Portal Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center space-x-3 bg-slate-900 border border-slate-800 p-2.5 px-4 rounded-2xl shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-slate-950 p-1 border border-amber-500/40 shrink-0">
              <img src="/logo.png" alt="SudhaarAI Logo" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <span className="text-sm font-extrabold text-white tracking-tight">सुधार-AI Portal Authentication</span>
              <span className="block text-[10px] text-amber-400 font-bold uppercase tracking-wider">Official Officer & Admin Access</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign In to Control Center
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Select your portal authorization type below to manage grievance queues.
          </p>
        </div>

        {/* Auth Container Card */}
        <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

          {/* 2-Tab Navigation Bar */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('officer');
                setErrorMessage('');
              }}
              className={`py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'officer'
                  ? 'bg-amber-500 text-slate-950 shadow-lg font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Department Officer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMessage('');
              }}
              className={`py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-lg font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>System Administrator</span>
            </button>
          </div>

          {/* Quick-Fill Demo Button */}
          <div className="flex items-center justify-between text-xs pt-1 border-b border-slate-800 pb-4">
            <span className="text-slate-400 font-medium">
              {activeTab === 'officer' ? 'Department Nodal Officer Portal' : 'Full Command System Admin Portal'}
            </span>
            <button
              type="button"
              onClick={activeTab === 'officer' ? handleOfficerQuickFill : handleAdminQuickFill}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Auto-Fill Demo Credentials</span>
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center space-x-2.5 shadow-sm animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {activeTab === 'officer' ? (
              /* DEPARTMENT OFFICER TAB FORM */
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                    Assigned Municipal Department <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold transition-all cursor-pointer"
                    >
                      <option value="" className="bg-slate-900 text-slate-400">-- Select Your Assigned Department --</option>
                      {departmentOptions.map((dept) => (
                        <option key={dept.category} value={dept.category} className="bg-slate-900 text-white">
                          {dept.name} ({dept.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                    Officer Login ID / Email <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      placeholder="e.g. OFF-8492"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono transition-all placeholder-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                    Officer Password <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={officerPassword}
                      onChange={(e) => setOfficerPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono transition-all placeholder-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* SYSTEM ADMIN TAB FORM */
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                    System Administrator ID <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      placeholder="e.g. ADMIN-001"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono transition-all placeholder-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                    Master Admin Security Key <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono transition-all placeholder-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 mt-4 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Login to {activeTab === 'officer' ? 'Officer Dashboard' : 'System Admin Console'}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </form>

          {/* Security Badge */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-slate-500 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              256-Bit Encrypted Session
            </span>
            <span>Government Portal v2.4</span>
          </div>

        </div>

      </main>
    </div>
  );
}
