import React from 'react';
import { AlertTriangle, Clock, Info } from 'lucide-react';

interface UrgencyBadgeProps {
  urgency: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency, size = 'md' }) => {
  const norm = urgency.toLowerCase();

  let styleClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  let Icon = Info;
  let pulseEffect = "";

  if (norm === 'high') {
    styleClass = "bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-sm shadow-rose-900/30";
    Icon = AlertTriangle;
    pulseEffect = "animate-pulse";
  } else if (norm === 'medium') {
    styleClass = "bg-amber-500/15 text-amber-300 border-amber-500/30";
    Icon = Clock;
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-sm font-semibold' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border ${styleClass} ${sizeClass}`}>
      <Icon className={`w-3.5 h-3.5 mr-1 ${pulseEffect}`} />
      {urgency} Priority
    </span>
  );
};
