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
  Activity
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
    <div className="h-screen max-h-screen bg-black text-slate-100 flex flex-col selection:bg-rose-500 selection:text-slate-950 relative overflow-hidden font-sans">
      {/* Fixed Background Image - Indian Flag Artwork Preserved CONSTANT */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-75 pointer-events-none z-0"
        style={{ backgroundImage: `url('/login-bg.jpg')` }}
      />
      {/* Contrast Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95 pointer-events-none z-0" />

      {/* GDG VITC Ambient Glow Spheres */}
      <div className="fixed top-12 right-12 w-96 h-96 bg-[#4285F4]/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-12 left-12 w-96 h-96 bg-[#EA4335]/15 rounded-full blur-[120px] pointer-events-none z-0" />

      <Navbar />

      <main className="flex-1 flex items-center justify-center py-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">

          {/* LEFT SIDE: Clean Branding & Feature Showcase */}
          <div className="lg:col-span-6 space-y-5 text-left -mt-4 lg:-mt-6">
            <div className="mb-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md pb-1">
                सुधार <span className="text-rose-500">AI</span>
              </h1>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-slate-200 tracking-tight leading-tight">
                National Civic <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400">
                  Officer Desk
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed pt-1">
                Direct municipal resolution engine. Access department complaint queues, update real-time field resolution status, and manage ward analytics.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3 h-3 text-rose-400" />
                </div>
                <span>Government Authorized Department Portal Access</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <span>AI Automated Language Translation & Urgency Triage</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Activity className="w-3 h-3 text-blue-400" />
                </div>
                <span>Real-time SLA Timeline Tracking & Officer Analytics</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Translucent Glassmorphism Form Card (Matching Design Reference) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-black/85 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              
              {/* Card Header & Title */}
              <div className="text-center space-y-1.5 mb-4">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {authMode === 'login' ? 'Welcome' : 'Register'}
                </h2>
                
                {/* Elegant Underline Divider with Glowing Central Dot (Reference Design) */}
                <div className="w-28 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto relative my-2">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
                </div>

                <p className="text-[11px] text-slate-400 font-medium">
                  {authMode === 'login' ? 'Sign in to your officer account' : 'Register as a municipal department officer'}
                </p>
              </div>

              {/* Success Banner */}
              {successMessage && (
                <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-2 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2 shadow-md">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {authMode === 'login' ? (
                /* ================= LOGIN FORM ================= */
                <div className="space-y-4">

                  {/* Role Switcher Pills */}
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-950/70 p-1 rounded-full border border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('officer');
                        setErrorMessage('');
                      }}
                      className={`py-1.5 px-3 text-xs font-bold rounded-full flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
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
                      className={`py-1.5 px-3 text-xs font-bold rounded-full flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                        activeTab === 'admin'
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>System Admin</span>
                    </button>
                  </div>

                  {/* Demo Quick Fill Link */}
                  <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400 font-medium text-[11px]">Quick Access</span>
                    <button
                      type="button"
                      onClick={activeTab === 'officer' ? handleOfficerQuickFill : handleAdminQuickFill}
                      className="text-[11px] font-bold text-rose-400 hover:underline transition-colors cursor-pointer"
                    >
                      Fill Demo Credentials
                    </button>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-3.5">
                    {activeTab === 'officer' ? (
                      <>
                        {/* Department Field */}
                        <div className="space-y-0.5">
                          <label className="block text-[11px] font-semibold text-slate-300">
                            Assigned Department
                          </label>
                          <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="w-full bg-transparent border-b border-slate-700 focus:border-rose-500 py-1.5 text-xs text-white focus:outline-none transition-colors cursor-pointer font-medium"
                          >
                            <option value="" className="bg-slate-900 text-slate-400">Select department...</option>
                            {departmentOptions.map((dept) => (
                              <option key={dept.category} value={dept.category} className="bg-slate-900 text-white">
                                {dept.name} ({dept.category})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Officer ID Field (Sleek Underline Input Style) */}
                        <div className="space-y-0.5">
                          <label className="block text-[11px] font-semibold text-slate-300">
                            Your Officer ID
                          </label>
                          <input
                            type="text"
                            value={officerId}
                            onChange={(e) => setOfficerId(e.target.value)}
                            placeholder="e.g. OFF-8492"
                            className="w-full bg-transparent border-b border-slate-700 focus:border-rose-500 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                          />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-0.5 relative">
                          <label className="block text-[11px] font-semibold text-slate-300">
                            Your Password
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={officerPassword}
                            onChange={(e) => setOfficerPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full bg-transparent border-b border-slate-700 focus:border-rose-500 py-1.5 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 bottom-1.5 text-slate-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Admin ID Field */}
                        <div className="space-y-0.5">
                          <label className="block text-[11px] font-semibold text-slate-300">
                            Administrator ID
                          </label>
                          <input
                            type="text"
                            value={adminId}
                            onChange={(e) => setAdminId(e.target.value)}
                            placeholder="ADMIN-001"
                            className="w-full bg-transparent border-b border-slate-700 focus:border-rose-500 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                          />
                        </div>

                        {/* Admin Password Field */}
                        <div className="space-y-0.5 relative">
                          <label className="block text-[11px] font-semibold text-slate-300">
                            Admin Master Key
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full bg-transparent border-b border-slate-700 focus:border-rose-500 py-1.5 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 bottom-1.5 text-slate-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </>
                    )}

                    {/* Terms Notice Text (Matching Reference Image) */}
                    <p className="text-[10px] text-slate-400 text-center leading-tight pt-1">
                      By signing in you agree to Government Municipal <br />
                      <span className="text-slate-300 underline cursor-pointer">Terms of Use</span> and <span className="text-slate-300 underline cursor-pointer">Privacy Policy</span>
                    </p>

                    {/* Vibrant Accent Action Button (Matching Reference Image) */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white hover:bg-zinc-100 text-zinc-950 font-semibold py-3 rounded-full shadow-xl transition-all tracking-tight text-xs cursor-pointer active:scale-[0.98] disabled:opacity-50"
                      >
                        {isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}
                      </button>
                    </div>
                  </form>

                  {/* Bottom Switch Link (Matching Reference Image) */}
                  <div className="text-center text-xs text-slate-300 pt-1.5 border-t border-slate-800/80">
                    <span>Do you need an account? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setErrorMessage('');
                      }}
                      className="text-rose-400 font-bold hover:underline cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              ) : (
                /* ================= REGISTER FORM ================= */
                <div className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        Officer Full Name
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Officer Rajesh Kumar"
                        className="w-full bg-transparent border-b border-slate-700 focus:border-rose-500 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        Official Email
                      </label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="rajesh.kumar@pwd.gov.in"
                        className="w-full bg-transparent border-b border-slate-700 focus:border-rose-500 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        Assigned Department
                      </label>
                      <select
                        value={regDeptCategory}
                        onChange={(e) => setRegDeptCategory(e.target.value)}
                        className="w-full bg-transparent border-b border-slate-700 focus:border-rose-500 py-1.5 text-xs text-white focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="" className="bg-slate-900 text-slate-400">Select department...</option>
                        {departmentOptions.map((dept) => (
                          <option key={dept.category} value={dept.category} className="bg-slate-900 text-white">
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
                          className="w-full bg-transparent border-b border-slate-700 focus:border-rose-500 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
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
                          className="w-full bg-transparent border-b border-slate-700 focus:border-rose-500 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white hover:bg-zinc-100 text-zinc-950 font-semibold py-3.5 rounded-full shadow-xl transition-all tracking-tight text-sm cursor-pointer active:scale-[0.98] disabled:opacity-50"
                      >
                        {isSubmitting ? 'Creating Account...' : 'Create Official Account'}
                      </button>
                    </div>
                  </form>

                  {/* Bottom Switch Link */}
                  <div className="text-center text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                    <span>Do you have an account? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setErrorMessage('');
                      }}
                      className="text-rose-400 font-bold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
