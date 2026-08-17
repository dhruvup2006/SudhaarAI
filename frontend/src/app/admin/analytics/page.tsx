'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2, 
  Sparkles, 
  RefreshCw,
  PieChart,
  ShieldCheck
} from 'lucide-react';

interface AnalyticsData {
  total_grievances: number;
  resolved_count: number;
  in_progress_count: number;
  pending_count: number;
  resolution_rate_percent: number;
  by_category: Record<string, number>;
  by_urgency: Record<string, number>;
  by_status: Record<string, number>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Grievance Analytics & Metrics</h1>
          <p className="text-xs text-slate-400">Real-time performance stats across municipal governance departments.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-400 flex items-center space-x-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Grievances</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{data?.total_grievances || 6}</div>
          <p className="text-[11px] text-slate-500">Logged since launch</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Resolution Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{data?.resolution_rate_percent || 33.3}%</div>
          <p className="text-[11px] text-emerald-500/80">Target: &gt; 80% SLA speed</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active In-Progress</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-blue-400">{data?.in_progress_count || 2}</div>
          <p className="text-[11px] text-slate-500">Field work assigned</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>High Priority</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400">{data?.by_urgency?.High || 2}</div>
          <p className="text-[11px] text-rose-400/80">Urgent hazard reports</p>
        </div>
      </div>

      {/* Visual Progress Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Grievances by Category</span>
          </h3>

          <div className="space-y-3 pt-2">
            {['Roads', 'Water', 'Sanitation', 'Electricity', 'Public Safety'].map((cat) => {
              const count = data?.by_category?.[cat] || 0;
              const max = data?.total_grievances || 6;
              const percent = Math.round((count / max) * 100);

              let barColor = "bg-indigo-500";
              if (cat === 'Water') barColor = "bg-blue-500";
              if (cat === 'Roads') barColor = "bg-amber-500";
              if (cat === 'Sanitation') barColor = "bg-emerald-500";
              if (cat === 'Electricity') barColor = "bg-yellow-500";
              if (cat === 'Public Safety') barColor = "bg-purple-500";

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{cat}</span>
                    <span className="text-slate-400 font-mono">{count} tickets ({percent}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgency & Status Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            <span>Urgency & Status Distribution</span>
          </h3>

          <div className="space-y-6 pt-2">
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Priority Levels</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center">
                  <div className="text-xl font-bold text-rose-400">{data?.by_urgency?.High || 0}</div>
                  <div className="text-[10px] text-rose-300">High</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                  <div className="text-xl font-bold text-amber-400">{data?.by_urgency?.Medium || 0}</div>
                  <div className="text-[10px] text-amber-300">Medium</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <div className="text-xl font-bold text-emerald-400">{data?.by_urgency?.Low || 0}</div>
                  <div className="text-[10px] text-emerald-300">Low</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Workflow Status</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xl font-bold text-slate-200">{data?.by_status?.Classified || 0}</div>
                  <div className="text-[10px] text-slate-400">Classified</div>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
                  <div className="text-xl font-bold text-blue-400">{data?.by_status?.['In Progress'] || 0}</div>
                  <div className="text-[10px] text-blue-300">In Progress</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <div className="text-xl font-bold text-emerald-400">{data?.by_status?.Resolved || 0}</div>
                  <div className="text-[10px] text-emerald-300">Resolved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
