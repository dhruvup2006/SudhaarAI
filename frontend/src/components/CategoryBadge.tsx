import React from 'react';
import { Droplet, Hammer, Trash2, Zap, ShieldAlert, FileText } from 'lucide-react';

interface CategoryBadgeProps {
  category: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, showIcon = true, size = 'md' }) => {
  const normalized = category.toLowerCase();
  
  let icon = <FileText className="w-3.5 h-3.5 mr-1.5 text-zinc-400 inline-block" />;

  if (normalized.includes("water")) {
    icon = <Droplet className="w-3.5 h-3.5 mr-1.5 text-blue-400 inline-block" />;
  } else if (normalized.includes("road")) {
    icon = <Hammer className="w-3.5 h-3.5 mr-1.5 text-amber-400 inline-block" />;
  } else if (normalized.includes("sanitation")) {
    icon = <Trash2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400 inline-block" />;
  } else if (normalized.includes("electric")) {
    icon = <Zap className="w-3.5 h-3.5 mr-1.5 text-yellow-400 inline-block" />;
  } else if (normalized.includes("safety") || normalized.includes("disaster")) {
    icon = <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-purple-400 inline-block" />;
  }

  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <span className={`inline-flex items-center text-slate-200 font-medium ${textSize}`}>
      {showIcon && icon}
      <span>{category}</span>
    </span>
  );
};
