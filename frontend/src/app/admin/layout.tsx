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
  Search, 
  User, 
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Inbox', href: '/admin/inbox', icon: Inbox, count: '6' },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'AI Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden glass-panel px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white">SudhaarAI <span className="text-indigo-400 text-xs">Admin</span></span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-slate-800 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col justify-between bg-slate-950/95 md:bg-slate-950/70`}>
        <div className="p-6 space-y-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Sudhaar<span className="text-indigo-400">AI</span></span>
              <p className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">Official Dashboard</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Main Console</div>
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      active ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
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
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
              OFF
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Municipal Officer</p>
              <p className="text-[11px] text-slate-400 truncate">Dept. Control Room</p>
            </div>
            <Link href="/" title="Exit Admin Console" className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Admin Header */}
        <header className="sticky top-0 z-30 glass-panel border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-bold text-white capitalize">
              {pathname.split('/').pop() || 'Dashboard'}
            </h2>
            <span className="text-xs text-slate-500 hidden sm:inline">• Central Command Portal</span>
          </div>

          <div className="flex items-center space-x-3">
            <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            <Link
              href="/"
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
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
