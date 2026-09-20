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
  AlertCircle,
  Shield,
  UserCheck,
  Mail,
  CheckCircle2,
  Sparkles,
  Search,
  LayoutDashboard,
  Inbox,
  BarChart3,
  Clock
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function OfficerLoginPage() {
  const router = useRouter();

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Tab state for login: 'officer' | 'admin'
  const [activeTab, setActiveTab] = useState<'officer' | 'admin'>('officer');

  // Officer Login Fields
  const [officerId, setOfficerId] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  // Officer Registration Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDeptCategory, setRegDeptCategory] = useState('');
  const [regWardZone, setRegWardZone] = useState('');
  const [regOfficerId, setRegOfficerId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Admin Form Fields
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  // Handle Login Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

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

      try {
        // Try backend login
        const res = await apiFetch('/api/officers/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            officer_id: officerId.trim(),
            password: officerPassword.trim()
          })
        });

        if (res.ok) {
          const officerData = await res.json();
          localStorage.setItem('sudhaar_user', JSON.stringify({
            role: 'officer',
            officerId: officerData.id,
            name: officerData.name,
            email: officerData.email,
            department: officerData.department,
            category: officerData.category,
            wardZone: officerData.ward_zone,
            token: officerData.access_token,
            loggedInAt: new Date().toISOString()
          }));
          setIsSubmitting(false);
          router.push('/admin/inbox');
          return;
        }
      } catch (err) {
        console.log('Backend login error, falling back to local auth:', err);
      }

      // Offline / Fallback Auth
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

  // Handle Registration Submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Please enter a valid Government Email address.');
      return;
    }
    if (!regDeptCategory) {
      setErrorMessage('Please select your Assigned Department.');
      return;
    }
    if (!regPassword.trim() || regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    const deptObj = departmentOptions.find(d => d.category === regDeptCategory) || departmentOptions[0];
    const assignedId = regOfficerId.trim().toUpperCase() || `OFF-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      const res = await apiFetch('/api/officers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim(),
          department: deptObj.name,
          category: deptObj.category,
          ward_zone: regWardZone.trim() || 'Central Zone',
          password: regPassword.trim(),
          officer_id: assignedId
        })
      });

      if (res.ok) {
        const newOfficer = await res.json();
        setSuccessMessage(`Account created successfully! Your Officer ID is ${newOfficer.id}`);
        
        // Auto-login registered officer
        localStorage.setItem('sudhaar_user', JSON.stringify({
          role: 'officer',
          officerId: newOfficer.id,
          name: newOfficer.name,
          email: newOfficer.email,
          department: newOfficer.department,
          category: newOfficer.category,
          wardZone: newOfficer.ward_zone,
          token: newOfficer.access_token,
          loggedInAt: new Date().toISOString()
        }));

        setTimeout(() => {
          setIsSubmitting(false);
          router.push('/admin/inbox');
        }, 1200);
        return;
      } else {
        const errorData = await res.json();
        if (errorData.detail) {
          setErrorMessage(errorData.detail);
          setIsSubmitting(false);
          return;
        }
      }
    } catch (err) {
      console.log('Backend endpoint unavailable, saving account locally:', err);
    }

    // Local Storage Fallback Registration
    setTimeout(() => {
      setSuccessMessage(`Account created! Assigned Officer ID: ${assignedId}`);
      localStorage.setItem('sudhaar_user', JSON.stringify({
        role: 'officer',
        officerId: assignedId,
        name: regName.trim(),
        email: regEmail.trim(),
        department: deptObj.name,
        category: deptObj.category,
        wardZone: regWardZone.trim() || 'Central Zone',
        loggedInAt: new Date().toISOString()
      }));

      setTimeout(() => {
        setIsSubmitting(false);
        router.push('/admin/inbox');
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-[#0e1117] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-slate-950 relative overflow-hidden font-sans">
      {/* Fixed Background Image - Indian Flag Artwork Preserved CONSTANT */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-60 pointer-events-none z-0"
        style={{ backgroundImage: `url('/login-bg.jpg')` }}
      />
      {/* Contrast Overlay */}
      <div className="fixed inset-0 bg-gradient-to-r from-[#0d1017] via-[#0d1017]/95 to-black/80 pointer-events-none z-0" />

      {/* GDG VITC Ambient Glow Spheres */}
      <div className="fixed top-12 left-12 w-96 h-96 bg-[#EA4335]/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-12 right-12 w-96 h-96 bg-[#FBBC04]/15 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar />

      <main className="flex-1 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">

          {/* LEFT SIDE: Form Block (Matching Reference Anywhere App Design with Red-Orange Gradient) */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-6 text-left max-w-xl mx-auto lg:mx-0 w-full">
            
            {/* Header Title & Subtitle Section */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
                {authMode === 'login' ? 'Officer Portal login' : 'Create new account'}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500 inline-block ml-1">.</span>
              </h1>

              <div className="pt-1 text-sm font-medium text-slate-300">
                {authMode === 'login' ? (
                  <span>Need an official account?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 font-bold hover:underline cursor-pointer"
                    >
                      Register Now
                    </button>
                  </span>
                ) : (
                  <span>Already A Member?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 font-bold hover:underline cursor-pointer"
                    >
                      Log In
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2 shadow-md">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Banner */}
            {successMessage && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-2 shadow-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form Section */}
            {authMode === 'login' ? (
              /* ================= LOGIN FORM ================= */
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Role Switcher Pills */}
                <div className="grid grid-cols-2 gap-2 bg-[#171a24] p-1.5 rounded-2xl border border-zinc-800/90 max-w-md">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('officer'); setErrorMessage(''); }}
                    className={`py-2 px-4 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      activeTab === 'officer'
                        ? 'bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white shadow-lg shadow-rose-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Officer Desk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('admin'); setErrorMessage(''); }}
                    className={`py-2 px-4 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      activeTab === 'admin'
                        ? 'bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white shadow-lg shadow-rose-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>System Admin</span>
                  </button>
                </div>

                {activeTab === 'officer' ? (
                  <>
                    {/* Department Select Field Box (Distinct Rounded Dark Input Style) */}
                    <div className={`bg-[#181b24] border rounded-2xl p-3 px-4 transition-all ${
                      focusedField === 'dept' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-zinc-800'
                    }`}>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Assigned Department
                      </label>
                      <div className="flex items-center justify-between">
                        <select
                          value={selectedDept}
                          onFocus={() => setFocusedField('dept')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setSelectedDept(e.target.value)}
                          className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer py-0.5"
                        >
                          <option value="" className="bg-[#181b24] text-slate-400">Select department...</option>
                          {departmentOptions.map((dept) => (
                            <option key={dept.category} value={dept.category} className="bg-[#181b24] text-white">
                              {dept.name} ({dept.category})
                            </option>
                          ))}
                        </select>
                        <Building2 className="w-4 h-4 text-slate-400 shrink-0 ml-2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Officer ID Input Box */}
                    <div className={`bg-[#181b24] border rounded-2xl p-3 px-4 transition-all ${
                      focusedField === 'officerId' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-zinc-800'
                    }`}>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Officer ID / E-mail
                      </label>
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={officerId}
                          onFocus={() => setFocusedField('officerId')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setOfficerId(e.target.value)}
                          placeholder="e.g. OFF-8492"
                          className="w-full bg-transparent text-white font-mono text-sm font-semibold focus:outline-none placeholder-slate-600 py-0.5"
                        />
                        <User className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                      </div>
                    </div>

                    {/* Password Input Box */}
                    <div className={`bg-[#181b24] border rounded-2xl p-3 px-4 transition-all ${
                      focusedField === 'password' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-zinc-800'
                    }`}>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Password
                      </label>
                      <div className="flex items-center justify-between">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={officerPassword}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setOfficerPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-transparent text-white font-mono text-sm font-semibold focus:outline-none placeholder-slate-600 py-0.5"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-white shrink-0 ml-2"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Admin ID Field Box */}
                    <div className={`bg-[#181b24] border rounded-2xl p-3 px-4 transition-all ${
                      focusedField === 'adminId' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-zinc-800'
                    }`}>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Administrator ID
                      </label>
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={adminId}
                          onFocus={() => setFocusedField('adminId')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setAdminId(e.target.value)}
                          placeholder="ADMIN-001"
                          className="w-full bg-transparent text-white font-mono text-sm font-semibold focus:outline-none placeholder-slate-600 py-0.5"
                        />
                        <Shield className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                      </div>
                    </div>

                    {/* Admin Password Field Box */}
                    <div className={`bg-[#181b24] border rounded-2xl p-3 px-4 transition-all ${
                      focusedField === 'adminPassword' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-zinc-800'
                    }`}>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Admin Master Key
                      </label>
                      <div className="flex items-center justify-between">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={adminPassword}
                          onFocus={() => setFocusedField('adminPassword')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-transparent text-white font-mono text-sm font-semibold focus:outline-none placeholder-slate-600 py-0.5"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-white shrink-0 ml-2"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Bottom Action Button Pair (Matching Reference Anywhere App Buttons with Red-Orange Gradient Accent) */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={activeTab === 'officer' ? handleOfficerQuickFill : handleAdminQuickFill}
                    className="w-full sm:w-auto flex-1 bg-[#2f3545] hover:bg-[#3b4357] text-white rounded-full py-3.5 px-6 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    Fill Demo Credentials
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex-1 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white rounded-full py-3.5 px-8 font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/25 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            ) : (
              /* ================= REGISTER FORM ================= */
              <form onSubmit={handleRegister} className="space-y-3.5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className={`bg-[#181b24] border rounded-2xl p-3 px-4 transition-all ${
                    focusedField === 'regName' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-zinc-800'
                  }`}>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Officer Full Name
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onFocus={() => setFocusedField('regName')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Officer Rajesh Kumar"
                      className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none placeholder-slate-600 py-0.5"
                    />
                  </div>

                  <div className={`bg-[#181b24] border rounded-2xl p-3 px-4 transition-all ${
                    focusedField === 'regEmail' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-zinc-800'
                  }`}>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Official E-mail
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onFocus={() => setFocusedField('regEmail')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="rajesh@pwd.gov.in"
                      className="w-full bg-transparent text-white font-mono text-sm font-semibold focus:outline-none placeholder-slate-600 py-0.5"
                    />
                  </div>
                </div>

                <div className={`bg-[#181b24] border rounded-2xl p-3 px-4 transition-all ${
                  focusedField === 'regDept' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-zinc-800'
                }`}>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Assigned Department
                  </label>
                  <select
                    value={regDeptCategory}
                    onFocus={() => setFocusedField('regDept')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setRegDeptCategory(e.target.value)}
                    className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer py-0.5"
                  >
                    <option value="" className="bg-[#181b24] text-slate-400">Select department...</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept.category} value={dept.category} className="bg-[#181b24] text-white">
                        {dept.name} ({dept.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className={`bg-[#181b24] border rounded-2xl p-3 px-4 transition-all ${
                    focusedField === 'regPassword' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-zinc-800'
                  }`}>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Password
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onFocus={() => setFocusedField('regPassword')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-white font-mono text-sm font-semibold focus:outline-none placeholder-slate-600 py-0.5"
                    />
                  </div>

                  <div className={`bg-[#181b24] border rounded-2xl p-3 px-4 transition-all ${
                    focusedField === 'regConfirm' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-zinc-800'
                  }`}>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onFocus={() => setFocusedField('regConfirm')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-white font-mono text-sm font-semibold focus:outline-none placeholder-slate-600 py-0.5"
                    />
                  </div>
                </div>

                {/* Bottom Action Button Pair */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                    className="w-full sm:w-auto flex-1 bg-[#2f3545] hover:bg-[#3b4357] text-white rounded-full py-3.5 px-6 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                  >
                    Back to Login
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex-1 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white rounded-full py-3.5 px-8 font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* RIGHT SIDE: Bold Hindi Brand Title & Gradient Bullet Points Showcase */}
          <div className="lg:col-span-5 xl:col-span-6 relative hidden lg:flex flex-col justify-center items-start h-full min-h-[440px] pl-16 lg:pl-24 space-y-6 text-left max-w-xl ml-auto">
            
            {/* Organic Curved Line Overlay */}
            <svg
              className="absolute -left-12 top-0 bottom-0 h-full w-48 text-[#181b24]/40 pointer-events-none opacity-50"
              viewBox="0 0 200 800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 6"
            >
              <path d="M 100 0 C 180 200, 20 400, 100 600 C 150 700, 80 800, 100 800" />
            </svg>

            {/* Large Bold Hindi Title in Orange-Red Gradient */}
            <div>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none drop-shadow-xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400">
                  सुधार AI
                </span>
              </h1>
            </div>

            {/* Gradient Bullet Points for Officer Benefits */}
            <ul className="space-y-4 pt-1 text-sm sm:text-base text-slate-200 font-medium max-w-md">
              <li className="flex items-start space-x-3.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 shrink-0 mt-1.5 shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
                <span>Automated AI translation for regional citizen complaints into official department records.</span>
              </li>
              <li className="flex items-start space-x-3.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 shrink-0 mt-1.5 shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
                <span>Smart category dispatch & automated priority SLA turnaround deadline tracking.</span>
              </li>
              <li className="flex items-start space-x-3.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 shrink-0 mt-1.5 shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
                <span>Real-time field resolution status updates and comprehensive ward-level analytics.</span>
              </li>
            </ul>

          </div>

        </div>
      </main>
    </div>
  );
}
