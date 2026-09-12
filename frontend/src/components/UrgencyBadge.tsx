import React from 'react';

interface UrgencyBadgeProps {
  urgency: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency, size = 'md' }) => {
  const norm = urgency.toLowerCase();

  let dotColor = "bg-white";

  if (norm === 'high') {
    dotColor = "bg-red-500";
  } else if (norm === 'medium') {
    dotColor = "bg-yellow-400";
  } else {
    dotColor = "bg-white";
  }

  const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-2.5 h-2.5';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <span className={`inline-flex items-center space-x-2 font-medium text-slate-200 ${textSize}`}>
      <span className={`rounded-full ${dotColor} ${dotSize} shrink-0 inline-block`} />
      <span>{urgency} Priority</span>
    </span>
  );
};
