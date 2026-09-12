'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface NeoTabsProps {
  tabs?: TabItem[];
  defaultTabId?: string;
  className?: string;
  activeTab?: string;
  onTabChange?: (id: string) => void;
}

export function NeoTabs({
  tabs = [
    {
      id: 'profile',
      label: 'Profile',
      content: (
        <p className="text-black dark:text-white">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt similique, quae hic dicta
          quo facere facilis praesentium a sunt, est quia pariatur nam, modi aut minus iste odio
          consectetur molestias iusto cupiditate ullam laborum veniam quos officia. Quos, temporibus
          perspiciatis!
        </p>
      ),
    },
    {
      id: 'account',
      label: 'Account',
      content: (
        <p className="text-black dark:text-white">
          Manage your account settings, credentials, security options, and regional preferences.
        </p>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: (
        <p className="text-black dark:text-white">
          Configure notification preferences for instant SLA alerts, updates, and grievance dispatches.
        </p>
      ),
    },
  ],
  defaultTabId = 'profile',
  className,
  activeTab: controlledActiveTab,
  onTabChange,
}: NeoTabsProps) {
  const [localActiveTab, setLocalActiveTab] = useState(defaultTabId);

  const activeTabId = controlledActiveTab !== undefined ? controlledActiveTab : localActiveTab;

  const handleSelect = (id: string) => {
    if (onTabChange) {
      onTabChange(id);
    }
    setLocalActiveTab(id);
  };

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div className={cn('w-full', className)}>
      <div>
        <div role="tablist" className="-mb-0.5 flex gap-3 flex-wrap">
          {tabs.map((tab) => {
            const isSelected = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelect(tab.id)}
                className={cn(
                  'border-2 border-black px-6 py-2 font-semibold text-black shadow-[4px_4px_0_0] shadow-black focus:ring-2 focus:ring-yellow-300 focus:outline-0 dark:border-white dark:text-white dark:shadow-white dark:focus:ring-yellow-600 transition-all cursor-pointer',
                  isSelected
                    ? 'bg-yellow-200 dark:bg-yellow-700 dark:text-white'
                    : 'bg-white dark:bg-slate-900 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {currentTab && (
        <div role="tabpanel" className="mt-4">
          {typeof currentTab.content === 'string' ? (
            <p className="text-black dark:text-white">{currentTab.content}</p>
          ) : (
            currentTab.content
          )}
        </div>
      )}
    </div>
  );
}
