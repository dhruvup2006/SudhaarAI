'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Search, LayoutDashboard, Menu, X, Home, Inbox, BarChart3 } from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/core/dock';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 py-3 px-4 sm:px-6 lg:px-8">
      {/* GDG VITC Floating Pill Container */}
      <div className="max-w-7xl mx-auto bg-black/85 backdrop-blur-xl border border-zinc-800/90 rounded-full px-4 sm:px-6 py-2 shadow-2xl transition-all flex items-center justify-between">
        
        {/* Logo & Brand Name */}
        <Link href="/" className="flex items-center space-x-2.5 group cursor-pointer shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                सुधार <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wide hidden sm:block">
              Govt Civic Resolution Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation ToolBar with Apple-Style Dock Animation */}
        <div className="hidden md:flex items-center justify-center">
          <Dock className="h-14 py-1.5 px-3 bg-zinc-950/90 border-zinc-800/90 shadow-inner gap-2">
            <Link href="/">
              <DockItem className="bg-zinc-950 border-zinc-800 hover:border-emerald-500/60 hover:bg-zinc-900">
                <DockLabel position="bottom">Overview</DockLabel>
                <DockIcon>
                  <Home className="w-5 h-5 text-emerald-400" />
                </DockIcon>
              </DockItem>
            </Link>

            <Link href="/track">
              <DockItem className="bg-zinc-950 border-zinc-800 hover:border-sky-500/60 hover:bg-zinc-900">
                <DockLabel position="bottom">Track Status</DockLabel>
                <DockIcon>
                  <Search className="w-5 h-5 text-sky-400" />
                </DockIcon>
              </DockItem>
            </Link>

            <Link href="/admin/login">
              <DockItem className="bg-zinc-950 border-zinc-800 hover:border-blue-500/60 hover:bg-zinc-900">
                <DockLabel position="bottom">Officer Portal</DockLabel>
                <DockIcon>
                  <LayoutDashboard className="w-5 h-5 text-blue-400" />
                </DockIcon>
              </DockItem>
            </Link>

            <Link href="/report">
              <DockItem className="bg-white border-white hover:bg-zinc-100 text-zinc-950">
                <DockLabel position="bottom">Report Grievance</DockLabel>
                <DockIcon>
                  <PlusCircle className="w-5 h-5 text-zinc-950" />
                </DockIcon>
              </DockItem>
            </Link>
          </Dock>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <Link
            href="/report"
            className="bg-white text-zinc-950 p-2 rounded-full font-bold text-xs shadow-md hover:bg-zinc-100 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-full bg-zinc-950 border border-zinc-800"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-3 py-3 border border-zinc-800/80 space-y-2 bg-black/95 rounded-2xl px-3 text-sm font-medium shadow-2xl backdrop-blur-xl">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-zinc-900 rounded-xl"
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span>Overview</span>
          </Link>

          <Link
            href="/track"
            onClick={() => setMobileOpen(false)}
            className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-zinc-900 rounded-xl"
          >
            <Search className="w-4 h-4 text-sky-400" />
            <span>Track status</span>
          </Link>

          <Link
            href="/admin/login"
            onClick={() => setMobileOpen(false)}
            className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-zinc-900 rounded-xl"
          >
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            <span>Officer portal</span>
          </Link>

          <div className="pt-2">
            <Link
              href="/report"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white text-zinc-950 font-bold rounded-full shadow-md hover:bg-zinc-100 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report grievance</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
