'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Building2, 
  RefreshCw,
  PieChart,
  ShieldCheck,
  Building,
  Sparkles,
  CheckCircle2
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>State Municipal Analytics Console</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Municipal Grievance Intelligence</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time performance metrics, category distribution, and SLA resolution turnaround rates.</p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold flex items-center space-x-2 self-start sm:self-auto shadow-md transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-extrabold uppercase tracking-wider">
            <span>Total Grievances</span>
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{data?.total_grievances || 6}</div>
          <p className="text-[11px] text-slate-400 font-semibold">Registered in Database</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-extrabold uppercase tracking-wider">
            <span>Resolution SLA Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">{data?.resolution_rate_percent || 33.3}%</div>
          <p className="text-[11px] text-emerald-300 font-bold">Standard Target &gt; 80%</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-extrabold uppercase tracking-wider">
            <span>Active Field Tasks</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-blue-400 tracking-tight">{data?.in_progress_count || 2}</div>
          <p className="text-[11px] text-slate-400 font-semibold">Work Orders Dispatched</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-extrabold uppercase tracking-wider">
            <span>Critical Priority</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-extrabold text-red-400 tracking-tight">{data?.by_urgency?.High || 2}</div>
          <p className="text-[11px] text-red-300 font-bold">Urgent Hazard Complaints</p>
        </div>
      </div>

      {/* Visual Progress Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-5 shadow-xl">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-4">
            <Building className="w-4 h-4 text-amber-400" />
            <span>Complaints by Department Category</span>
          </h3>

          <div className="space-y-4 pt-1">
            {['Roads', 'Water', 'Sanitation', 'Electricity', 'Public Safety'].map((cat) => {
              const count = data?.by_category?.[cat] || 0;
              const max = data?.total_grievances || 6;
              const percent = Math.round((count / max) * 100);

              let barColor = "bg-slate-700";
              if (cat === 'Water') barColor = "bg-blue-500";
              if (cat === 'Roads') barColor = "bg-amber-500";
              if (cat === 'Sanitation') barColor = "bg-emerald-500";
              if (cat === 'Electricity') barColor = "bg-yellow-500";
              if (cat === 'Public Safety') barColor = "bg-purple-500";

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-200">{cat} Department</span>
                    <span className="text-slate-400 font-mono">{count} tickets ({percent}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${barColor} transition-all duration-500 rounded-full`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgency & Status Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-5 shadow-xl">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-4">
            <PieChart className="w-4 h-4 text-amber-400" />
            <span>Priority & Workflow Breakdown</span>
          </h3>

          <div className="space-y-6 pt-1">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Urgency SLA Levels</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
                  <div className="text-2xl font-extrabold text-red-400">{data?.by_urgency?.High || 0}</div>
                  <div className="text-[10px] font-bold text-red-300">Critical Priority</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
                  <div className="text-2xl font-extrabold text-amber-400">{data?.by_urgency?.Medium || 0}</div>
                  <div className="text-[10px] font-bold text-amber-300">Medium Priority</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <div className="text-2xl font-extrabold text-emerald-400">{data?.by_urgency?.Low || 0}</div>
                  <div className="text-[10px] font-bold text-emerald-300">Standard Priority</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Workflow Resolution Progress</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-2xl font-extrabold text-white">{data?.by_status?.Classified || 0}</div>
                  <div className="text-[10px] font-bold text-slate-400">Classified</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center">
                  <div className="text-2xl font-extrabold text-blue-400">{data?.by_status?.['In Progress'] || 0}</div>
                  <div className="text-[10px] font-bold text-blue-300">In Progress</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <div className="text-2xl font-extrabold text-emerald-400">{data?.by_status?.Resolved || 0}</div>
                  <div className="text-[10px] font-bold text-emerald-300">Resolved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
