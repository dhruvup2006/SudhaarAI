import React from 'react';
import { Droplet, Hammer, Trash2, Zap, ShieldAlert, FileText } from 'lucide-react';

interface CategoryBadgeProps {
  category: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, showIcon = true, size = 'md' }) => {
  const normalized = category.toLowerCase();
  
  let bgClass = "bg-slate-800/80 text-slate-300 border-slate-700";
  let icon = <FileText className="w-3.5 h-3.5 mr-1" />;

  if (normalized.includes("water")) {
    bgClass = "bg-blue-500/15 text-blue-400 border-blue-500/30";
    icon = <Droplet className="w-3.5 h-3.5 mr-1 text-blue-400" />;
  } else if (normalized.includes("road")) {
    bgClass = "bg-amber-500/15 text-amber-400 border-amber-500/30";
    icon = <Hammer className="w-3.5 h-3.5 mr-1 text-amber-400" />;
  } else if (normalized.includes("sanitation")) {
    bgClass = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    icon = <Trash2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />;
  } else if (normalized.includes("electric")) {
    bgClass = "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
    icon = <Zap className="w-3.5 h-3.5 mr-1 text-yellow-400" />;
  } else if (normalized.includes("safety") || normalized.includes("disaster")) {
    bgClass = "bg-purple-500/15 text-purple-400 border-purple-500/30";
    icon = <ShieldAlert className="w-3.5 h-3.5 mr-1 text-purple-400" />;
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3.5 py-1.5 text-sm font-semibold' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border ${bgClass} ${sizeClass}`}>
      {showIcon && icon}
      {category}
    </span>
  );
};
