import React from 'react';
import { AlertTriangle, Clock, Info } from 'lucide-react';

interface UrgencyBadgeProps {
  urgency: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency, size = 'md' }) => {
  const norm = urgency.toLowerCase();

  let styleClass = "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold";
  let Icon = Info;

  if (norm === 'high') {
    styleClass = "bg-red-50 text-red-800 border-red-300 font-bold";
    Icon = AlertTriangle;
  } else if (norm === 'medium') {
    styleClass = "bg-amber-50 text-amber-800 border-amber-300 font-semibold";
    Icon = Clock;
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-md border ${styleClass} ${sizeClass}`}>
      <Icon className="w-3.5 h-3.5 mr-1 shrink-0" />
      {urgency} Priority
    </span>
  );
};

