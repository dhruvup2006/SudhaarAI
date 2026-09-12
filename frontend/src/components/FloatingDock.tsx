'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  PlusCircle,
  Search,
  Inbox,
  BarChart3,
  LayoutDashboard,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/core/dock';

const dockItems = [
  {
    title: 'Home',
    icon: <Home className="h-full w-full text-amber-400" />,
    href: '/',
  },
  {
    title: 'Report Grievance',
    icon: <PlusCircle className="h-full w-full text-orange-400" />,
    href: '/report',
  },
  {
    title: 'Track Status',
    icon: <Search className="h-full w-full text-sky-400" />,
    href: '/track',
  },
  {
    title: 'Grievance Inbox',
    icon: <Inbox className="h-full w-full text-emerald-400" />,
    href: '/admin/inbox',
  },
  {
    title: 'Ward Analytics',
    icon: <BarChart3 className="h-full w-full text-indigo-400" />,
    href: '/admin/analytics',
  },
  {
    title: 'Officer Portal',
    icon: <LayoutDashboard className="h-full w-full text-purple-400" />,
    href: '/admin/login',
  },
  {
    title: 'Civic Hotline',
    icon: <PhoneCall className="h-full w-full text-rose-400" />,
    href: 'tel:1800117834',
  },
];

export function FloatingDock() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-full px-4 pointer-events-auto">
      <Dock className="items-end pb-3 bg-black/85 backdrop-blur-2xl border-zinc-800/90 shadow-2xl rounded-full border">
        {dockItems.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <DockItem className="aspect-square rounded-full bg-zinc-900/90 border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800/80 transition-all">
              <DockLabel position="top">{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          </Link>
        ))}
      </Dock>
    </div>
  );
}

export { FloatingDock as AppleStyleDock };
