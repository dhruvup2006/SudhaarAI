'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Inbox, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Building,
  Shield,
  UserCheck,
  Building2,
  ExternalLink
} from 'lucide-react';

interface UserSession {
  role: 'admin' | 'officer';
  officerId: string;
  department: string;
  category: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userSession, setUserSession] = useState<UserSession>({
    role: 'officer',
    officerId: 'OFF-8492',
    department: 'Public Works Department (PWD)',
    category: 'Roads'
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sudhaar_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserSession(parsed);

        // Protection: Officers cannot access Analytics or AI Settings
        if (parsed.role === 'officer' && (pathname === '/admin/analytics' || pathname === '/admin/settings')) {
          router.replace('/admin/inbox');
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('sudhaar_user');
    } catch (e) {
      console.error(e);
    }
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Grievance Inbox', href: '/admin/inbox', icon: Inbox },
    { label: 'Ward Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'AI Routing Rules', href: '/admin/settings', icon: Settings },
  ];

  const isOfficer = userSession.role === 'officer';

  // Bypass layout header/sidebar on /admin/login to prevent double headers
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      
      {/* 1. DEPARTMENT OFFICER VIEW: Clean Full-Width Header (NO Left Sidepanel Sidebar) */}
      {isOfficer ? (
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Executive Officer Header Bar */}
          <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-40 shadow-xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              
              {/* Brand & Department Badge */}
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="w-11 h-11 rounded-xl bg-slate-950 p-1 border border-slate-700/80 shadow-md flex items-center justify-center shrink-0 group-hover:border-amber-500/50 transition-all">
                    <img src="/logo.png" alt="सुधार-AI Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-xl font-extrabold tracking-tight text-white">सुधार <span className="text-amber-400">AI</span></span>
                    <span className="block text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">
                      {userSession.category ? `${userSession.category} Department Portal` : 'Department Officer Desk'}
                    </span>
                  </div>
                </Link>

                <div className="hidden sm:block h-6 w-px bg-slate-800" />

                <div className="hidden md:inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>{userSession.department}</span>
                </div>
              </div>

              {/* Right User Actions */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex items-center space-x-3 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-extrabold text-[11px]">
                    {userSession.category ? userSession.category.substring(0, 3).toUpperCase() : 'OFF'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-white leading-none">Officer ({userSession.officerId})</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{userSession.category} Department</p>
                  </div>
                </div>

                <Link
                  href="/"
                  className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center space-x-1 hidden sm:flex"
                >
                  <span>Public Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>

            </div>
          </header>

          {/* Full Width Body */}
          <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      ) : (
        /* 2. SYSTEM ADMIN VIEW: Full Sidebar Layout ONLY for Admin */
        <div className="flex-1 flex flex-col md:flex-row min-h-screen">
          {/* Mobile Top Bar */}
          <div className="md:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-950 p-1 border border-slate-700 shrink-0">
                <img src="/logo.png" alt="SudhaarAI Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-white text-sm">SudhaarAI <span className="text-amber-400 text-xs">Admin</span></span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Admin Sidepanel Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col justify-between text-white shadow-2xl`}>
            <div className="p-6 space-y-6">
              {/* Logo Brand Header */}
              <Link href="/" className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-slate-950 p-1 border border-slate-700 shadow-md flex items-center justify-center shrink-0">
                  <img src="/logo.png" alt="सुधार-AI Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-lg font-extrabold text-white tracking-tight">सुधार <span className="text-amber-400">AI</span></span>
                  <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    Central Admin Console
                  </p>
                </div>
              </Link>

              {/* Navigation Links */}
              <nav className="space-y-1 pt-4">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3.5 mb-2">
                  System Admin Control
                </div>
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                        active 
                          ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Admin Profile Card */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-extrabold text-xs shrink-0">
                  ADM
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">System Administrator</p>
                  <p className="text-[10px] text-amber-400 truncate">Central Municipal Command</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  title="Sign Out" 
                  className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Container for System Admin */}
          <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
            <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-extrabold text-white capitalize tracking-tight">
                  {pathname.split('/').pop() || 'Dashboard'}
                </h2>
                <span className="text-xs font-medium text-slate-400 hidden sm:inline">• Central Municipal Command</span>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  href="/"
                  className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <span>Public Portal</span>
                  <span>↗</span>
                </Link>
              </div>
            </header>

            <main className="flex-1 p-6 sm:p-8">
              {children}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
