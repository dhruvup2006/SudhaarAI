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
    <div className="min-h-screen bg-black text-slate-100 flex flex-col sm:flex-row relative selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden">
      {/* Fixed Background Image - Indian Flag Artwork Preserved */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-75 pointer-events-none z-0"
        style={{ backgroundImage: `url('/login-bg.jpg')` }}
      />
      {/* Contrast Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95 pointer-events-none z-0" />

      {/* GDG VITC Ambient Glow Spheres */}
      <div className="fixed top-12 right-12 w-96 h-96 bg-[#4285F4]/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-12 left-12 w-96 h-96 bg-[#EA4335]/15 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* 1. DEPARTMENT OFFICER VIEW: Clean Full-Width Header */}
      {isOfficer ? (
        <div className="flex-1 flex flex-col min-h-screen relative z-10">
          {/* Executive Officer Header Bar */}
          <header className="bg-black/85 backdrop-blur-2xl border-b border-zinc-800/90 px-6 py-4 sticky top-0 z-40 shadow-xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              
              {/* Brand & Department Badge */}
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-3 group">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold tracking-tight text-white">सुधार <span className="text-amber-500">AI</span></span>
                    </div>
                    <span className="block text-xs text-slate-400 font-medium">
                      {userSession.category ? `${userSession.category} Department Portal` : 'Department Officer Desk'}
                    </span>
                  </div>
                </Link>

                <div className="hidden sm:block h-6 w-px bg-zinc-800" />

                <div className="hidden md:inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-slate-300 text-xs font-medium">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{userSession.department}</span>
                </div>
              </div>

              {/* Right User Actions */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex items-center space-x-3 bg-zinc-950 px-3.5 py-1.5 rounded-full border border-zinc-800">
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-slate-200 leading-none">Officer ({userSession.officerId})</p>
                    <p className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">{userSession.category} Dept</p>
                  </div>
                </div>

                <Link
                  href="/"
                  className="text-xs font-semibold px-3.5 py-2 rounded-full bg-zinc-950 hover:bg-zinc-900 text-slate-300 hover:text-white border border-zinc-800 transition-colors flex items-center space-x-1 hidden sm:flex"
                >
                  <span>Public Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
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
        <div className="flex-1 flex flex-col sm:flex-row min-h-screen relative z-10">
          {/* Mobile Top Navigation */}
          <div className="sm:hidden bg-black/90 border-b border-zinc-800 p-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-lg font-bold text-white">सुधार <span className="text-amber-500">AI</span></span>
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-300 hover:text-white bg-zinc-950 rounded-lg border border-zinc-800"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Sidebar Panel */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/95 border-r border-zinc-800/90 transform transition-transform duration-200 ease-in-out sm:translate-x-0 sm:static backdrop-blur-2xl flex flex-col ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-6 border-b border-zinc-800/90">
              <Link href="/" className="flex items-center space-x-3 group">
                <div>
                  <span className="text-lg font-bold tracking-tight text-white">सुधार <span className="text-amber-500">AI</span></span>
                  <span className="block text-[10px] text-amber-400 uppercase font-mono font-bold">Admin Console</span>
                </div>
              </Link>
            </div>

            {/* Nav Menu */}
            <nav className="flex-1 p-4 space-y-1.5">
              {navItems.map((item) => {
                const IconComp = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl font-semibold text-xs transition-all ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-zinc-950/60'
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-zinc-800/90">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      )}
    </div>
  );
}
