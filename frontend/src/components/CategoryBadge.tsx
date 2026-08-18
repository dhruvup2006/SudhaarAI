import React from 'react';
import { Droplet, Hammer, Trash2, Zap, ShieldAlert, FileText } from 'lucide-react';

interface CategoryBadgeProps {
  category: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, showIcon = true, size = 'md' }) => {
  const normalized = category.toLowerCase();
  
  let bgClass = "bg-slate-100 text-slate-700 border-slate-300 font-medium";
  let icon = <FileText className="w-3.5 h-3.5 mr-1 text-slate-600" />;

  if (normalized.includes("water")) {
    bgClass = "bg-blue-50 text-blue-800 border-blue-200 font-semibold";
    icon = <Droplet className="w-3.5 h-3.5 mr-1 text-blue-600" />;
  } else if (normalized.includes("road")) {
    bgClass = "bg-amber-50 text-amber-900 border-amber-300 font-semibold";
    icon = <Hammer className="w-3.5 h-3.5 mr-1 text-amber-700" />;
  } else if (normalized.includes("sanitation")) {
    bgClass = "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold";
    icon = <Trash2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />;
  } else if (normalized.includes("electric")) {
    bgClass = "bg-yellow-50 text-yellow-900 border-yellow-300 font-semibold";
    icon = <Zap className="w-3.5 h-3.5 mr-1 text-yellow-600" />;
  } else if (normalized.includes("safety") || normalized.includes("disaster")) {
    bgClass = "bg-purple-50 text-purple-800 border-purple-200 font-semibold";
    icon = <ShieldAlert className="w-3.5 h-3.5 mr-1 text-purple-600" />;
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-md border ${bgClass} ${sizeClass}`}>
      {showIcon && icon}
      {category}
    </span>
  );
};

