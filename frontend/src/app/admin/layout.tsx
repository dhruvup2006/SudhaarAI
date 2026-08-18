'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Inbox, 
  BarChart3, 
  Settings, 
  ShieldAlert, 
  Bell, 
  LogOut,
  Menu,
  X,
  Building,
  Shield,
  UserCheck
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

        // Access Control Protection: Officer cannot open Ward Analytics or AI Routing Rules
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

  // Role-Based Navigation Items
  const allNavItems = [
    { label: 'Grievance Inbox', href: '/admin/inbox', icon: Inbox, adminOnly: false },
    { label: 'Ward Analytics', href: '/admin/analytics', icon: BarChart3, adminOnly: true },
    { label: 'AI Routing Rules', href: '/admin/settings', icon: Settings, adminOnly: true },
  ];

  const visibleNavItems = allNavItems.filter(item => {
    if (userSession.role === 'officer') {
      return !item.adminOnly;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-amber-500 selection:text-white">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-950 p-1 border border-slate-700 shrink-0">
            <img src="/logo.png" alt="SudhaarAI Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-white text-sm">SudhaarAI <span className="text-amber-400 text-xs">Console</span></span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
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
                {userSession.role === 'admin' ? 'Central Admin Console' : `${userSession.category || 'Dept'} Officer Console`}
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3.5 mb-2">
              {userSession.role === 'admin' ? 'Central System Control' : 'Officer Control Room'}
            </div>
            {visibleNavItems.map((item) => {
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

        {/* User Session Profile Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
              userSession.role === 'admin' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {userSession.role === 'admin' ? 'ADM' : (userSession.category ? userSession.category.substring(0, 3).toUpperCase() : 'OFF')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {userSession.role === 'admin' ? 'System Administrator' : `Officer (${userSession.officerId})`}
              </p>
              <p className="text-[10px] text-amber-400 truncate">
                {userSession.department}
              </p>
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

      {/* Main Content Container */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <Building className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-extrabold text-white capitalize tracking-tight">
              {pathname.split('/').pop() || 'Dashboard'}
            </h2>
            <span className="text-xs font-medium text-slate-400 hidden sm:inline">• {userSession.department}</span>
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

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
