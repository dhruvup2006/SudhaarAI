'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import {
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  Shield,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  UserPlus,
  Sparkles,
  Layers,
  Activity,
  Search,
  LayoutDashboard,
  Inbox,
  BarChart3,
  Clock
} from 'lucide-react';

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
  const [rememberMe, setRememberMe] = useState(true);
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
        const res = await fetch('http://127.0.0.1:8000/api/officers/login', {
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
      const res = await fetch('http://127.0.0.1:8000/api/officers/register', {
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
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-black text-slate-100 flex flex-col selection:bg-rose-500 selection:text-slate-950 relative overflow-hidden font-sans">
      {/* Fixed Background Image - Indian Flag Artwork Preserved CONSTANT */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-75 pointer-events-none z-0"
        style={{ backgroundImage: `url('/login-bg.jpg')` }}
      />
      {/* Contrast Vignette Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95 pointer-events-none z-0" />

      {/* GDG VITC Ambient Glow Spheres */}
      <div className="fixed top-12 right-12 w-96 h-96 bg-[#4285F4]/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-12 left-12 w-96 h-96 bg-[#EA4335]/15 rounded-full blur-[120px] pointer-events-none z-0" />

      <Navbar />

      <main className="flex-1 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full">

          {/* LEFT SIDE PANEL: Deep Dark Form Card (Matching Reference Design) */}
          <div className="lg:col-span-5 xl:col-span-4 w-full">
            <div className="w-full bg-[#08080a]/90 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
              
              {/* Header Title & Subtitle */}
              <div className="space-y-1 mb-5">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {authMode === 'login' ? 'Welcome To Sudhaar AI' : 'Create Officer Account'}
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  {authMode === 'login' ? 'Sign in to your officer account' : 'Register for municipal department access'}
                </p>
              </div>

              {/* Success Banner */}
              {successMessage && (
                <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-2 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2 shadow-md">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {authMode === 'login' ? (
                /* ================= LOGIN FORM ================= */
                <div className="space-y-4">

                  {/* Role Switcher Pills */}
                  <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('officer');
                        setErrorMessage('');
                      }}
                      className={`py-1.5 px-3 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                        activeTab === 'officer'
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Officer Desk</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('admin');
                        setErrorMessage('');
                      }}
                      className={`py-1.5 px-3 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                        activeTab === 'admin'
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>System Admin</span>
                    </button>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {activeTab === 'officer' ? (
                      <>
                        {/* Department Field */}
                        <div className="space-y-1">
                          <label className="block text-xs font-semibold text-slate-300">
                            Assigned Department
                          </label>
                          <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors cursor-pointer font-medium"
                          >
                            <option value="" className="bg-zinc-900 text-slate-400">Select department...</option>
                            {departmentOptions.map((dept) => (
                              <option key={dept.category} value={dept.category} className="bg-zinc-900 text-white">
                                {dept.name} ({dept.category})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Officer ID Field */}
                        <div className="space-y-1">
                          <label className="block text-xs font-semibold text-slate-300">
                            Officer ID / E-mail
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={officerId}
                              onChange={(e) => setOfficerId(e.target.value)}
                              placeholder="OFF-8492"
                              className="w-full bg-transparent border-b border-zinc-700 focus:border-rose-500 py-2 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                            />
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">@</span>
                          </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1 relative">
                          <label className="block text-xs font-semibold text-slate-300">
                            Password
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={officerPassword}
                            onChange={(e) => setOfficerPassword(e.target.value)}
                            placeholder="6+ strong characters"
                            className="w-full bg-transparent border-b border-zinc-700 focus:border-rose-500 py-2 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 bottom-2 text-slate-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Admin ID Field */}
                        <div className="space-y-1">
                          <label className="block text-xs font-semibold text-slate-300">
                            Administrator ID / E-mail
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={adminId}
                              onChange={(e) => setAdminId(e.target.value)}
                              placeholder="ADMIN-001"
                              className="w-full bg-transparent border-b border-zinc-700 focus:border-rose-500 py-2 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                            />
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">@</span>
                          </div>
                        </div>

                        {/* Admin Password Field */}
                        <div className="space-y-1 relative">
                          <label className="block text-xs font-semibold text-slate-300">
                            Admin Master Key
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="6+ strong characters"
                            className="w-full bg-transparent border-b border-zinc-700 focus:border-rose-500 py-2 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 bottom-2 text-slate-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </>
                    )}

                    {/* Remember me & Quick Fill Row (Matching Reference) */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded bg-zinc-950 border-zinc-700 text-rose-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                        />
                        <span className="text-[11px]">Remember for 30 days</span>
                      </label>
                      <button
                        type="button"
                        onClick={activeTab === 'officer' ? handleOfficerQuickFill : handleAdminQuickFill}
                        className="text-[11px] font-semibold text-amber-400 hover:underline transition-colors cursor-pointer"
                      >
                        Fill Demo Credentials
                      </button>
                    </div>

                    {/* Main Action Button (Matching Reference Dark Button Style) */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 rounded-2xl border border-zinc-700/80 shadow-xl transition-all tracking-tight text-xs cursor-pointer active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
                        <ArrowRight className="w-4 h-4 text-rose-500" />
                      </button>
                    </div>
                  </form>

                  {/* Bottom Switch Link (Matching Reference Image) */}
                  <div className="text-center text-xs text-slate-400 pt-3 border-t border-zinc-800/80">
                    <span>Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setErrorMessage('');
                      }}
                      className="text-amber-400 font-bold hover:underline cursor-pointer ml-1"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              ) : (
                /* ================= REGISTER FORM ================= */
                <div className="space-y-3.5">
                  <form onSubmit={handleRegister} className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        Officer Full Name
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Officer Rajesh Kumar"
                        className="w-full bg-transparent border-b border-zinc-700 focus:border-rose-500 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        Official E-mail
                      </label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="rajesh.kumar@pwd.gov.in"
                        className="w-full bg-transparent border-b border-zinc-700 focus:border-rose-500 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        Assigned Department
                      </label>
                      <select
                        value={regDeptCategory}
                        onChange={(e) => setRegDeptCategory(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
                      >
                        <option value="" className="bg-zinc-900 text-slate-400">Select department...</option>
                        {departmentOptions.map((dept) => (
                          <option key={dept.category} value={dept.category} className="bg-zinc-900 text-white">
                            {dept.name} ({dept.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-300">
                          Password
                        </label>
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-transparent border-b border-zinc-700 focus:border-rose-500 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-300">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-transparent border-b border-zinc-700 focus:border-rose-500 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 rounded-2xl border border-zinc-700/80 shadow-xl transition-all tracking-tight text-xs cursor-pointer active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <span>{isSubmitting ? 'Creating Account...' : 'Create Official Account'}</span>
                        <ArrowRight className="w-4 h-4 text-rose-500" />
                      </button>
                    </div>
                  </form>

                  {/* Bottom Switch Link */}
                  <div className="text-center text-xs text-slate-400 pt-2 border-t border-zinc-800/80">
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setErrorMessage('');
                      }}
                      className="text-amber-400 font-bold hover:underline cursor-pointer ml-1"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT SIDE: Interactive Product & Dashboard Showcase (Matching Reference Image Right Panel) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5 hidden sm:block">
            
            {/* Header Text (Matching Reference "Designed for individuals") */}
            <div className="space-y-2 text-left pl-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Designed for Civic Operations
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                See real-time grievance analytics, AI dispatch routing, and field officer SLAs remotely, from anywhere!
              </p>
            </div>

            {/* Floating Perspective Dashboard Mockup (Matching Reference UI Design Card) */}
            <div className="relative group perspective-1000">
              <div className="w-full bg-black/85 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-5 shadow-2xl space-y-4 transition-all duration-500 transform lg:rotate-[-1.5deg] lg:group-hover:rotate-0 lg:group-hover:scale-[1.01] overflow-hidden">
                
                {/* Dashboard Header Bar */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-extrabold text-amber-400 tracking-wider text-sm font-mono">TK.VP / SUDHAAR.AI</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                      LIVE NODAL DESK
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-zinc-950 px-3 py-1 rounded-xl border border-zinc-800 text-xs text-slate-400">
                    <Search className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-[11px] font-mono">Search grievances...</span>
                  </div>
                </div>

                {/* Dashboard Layout Content */}
                <div className="grid grid-cols-12 gap-4 pt-1">
                  
                  {/* Left Mini Sidebar */}
                  <div className="col-span-3 space-y-2 border-r border-zinc-800/80 pr-3 hidden md:block">
                    <div className="px-2 py-1.5 rounded-xl bg-zinc-900 text-amber-400 text-xs font-bold flex items-center space-x-2 border border-zinc-800">
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Dashboard</span>
                    </div>
                    <div className="px-2 py-1.5 text-slate-400 hover:text-white text-xs font-medium flex items-center space-x-2 transition-colors">
                      <Inbox className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Grievances</span>
                    </div>
                    <div className="px-2 py-1.5 text-slate-400 hover:text-white text-xs font-medium flex items-center space-x-2 transition-colors">
                      <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Analytics</span>
                    </div>
                    <div className="px-2 py-1.5 text-slate-400 hover:text-white text-xs font-medium flex items-center space-x-2 transition-colors">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      <span>SLA Timelines</span>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/80 space-y-2">
                      <div className="flex items-center justify-between px-2 py-1 bg-zinc-950 rounded-lg text-[10px] text-slate-400">
                        <span>Night Mode</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                  </div>

                  {/* Main Preview Grid Cards */}
                  <div className="col-span-12 md:col-span-9 space-y-3">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* Ticket Card 1 */}
                      <div className="bg-zinc-950/90 border border-zinc-800 p-3.5 rounded-2xl space-y-2 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">Road Repair Dispatch</span>
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                            High SLA
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          Updating active field inspection for pothole repairs in Central Ward Zone 4.
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                          <span className="font-mono text-emerald-400">SUD-19002</span>
                          <span className="text-slate-400">PWD Department</span>
                        </div>
                      </div>

                      {/* Ticket Card 2 */}
                      <div className="bg-zinc-950/90 border border-zinc-800 p-3.5 rounded-2xl space-y-2 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">Jal Board Supply</span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            Medium SLA
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          Pipeline pressure restoration and municipal water pipeline maintenance.
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                          <span className="font-mono text-sky-400">SUD-92093</span>
                          <span className="text-slate-400">Water Supply</span>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Summary Bar */}
                    <div className="bg-zinc-950/90 border border-zinc-800 p-3 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="font-bold text-white block text-xs">SLA Resolution Rate: 94.2%</span>
                          <span className="text-[10px] text-slate-400">Auto-dispatched via Sudhaar AI Engine</span>
                        </div>
                      </div>
                      <div className="hidden sm:block text-right">
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                          18 Active Dispatch Cases
                        </span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
