'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Inbox, 
  BarChart3, 
  Settings, 
  ShieldAlert, 
  Bell, 
  LogOut,
  Menu,
  X,
  Building
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Grievance Inbox', href: '/admin/inbox', icon: Inbox, count: '6' },
    { label: 'Ward Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'AI Routing Rules', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col md:flex-row font-sans selection:bg-amber-500 selection:text-white">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-amber-600 flex items-center justify-center border border-amber-400">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-sm">SudhaarAI <span className="text-amber-400 text-xs">Officer Portal</span></span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded bg-slate-800"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col justify-between text-white`}>
        <div className="p-6 space-y-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-amber-600 flex items-center justify-center border border-amber-400 shadow-md">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-white tracking-tight">सुधार <span className="text-amber-400">AI</span></span>
              <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Department Officer Console</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Officer Control Room</div>
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-bold transition-all ${
                    active 
                      ? 'bg-amber-600 text-white shadow-sm border border-amber-500' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      active ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Official User Profile Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-amber-600 flex items-center justify-center font-extrabold text-white text-xs">
              OFF
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Nodal Officer Admin</p>
              <p className="text-[10px] text-amber-400 truncate">Central Municipal Command</p>
            </div>
            <Link href="/" title="Exit Officer Console" className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Admin Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <Building className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900 capitalize">
              {pathname.split('/').pop() || 'Dashboard'}
            </h2>
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">• Central Municipal Grievances Desk</span>
          </div>

          <div className="flex items-center space-x-3">
            <button className="relative p-2 rounded bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600" />
            </button>

            <Link
              href="/"
              className="text-xs font-bold px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            >
              Public Portal ↗
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

