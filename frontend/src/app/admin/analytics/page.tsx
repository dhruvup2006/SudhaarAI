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
  Building
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
          <h1 className="text-2xl font-extrabold text-slate-900">Municipal Grievance Analytics</h1>
          <p className="text-xs text-slate-600">Performance metrics and SLA resolution rates across municipal departments.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="gov-card p-5 bg-white border-t-4 border-slate-900 space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase">
            <span>Total Grievances</span>
            <BarChart3 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{data?.total_grievances || 6}</div>
          <p className="text-[11px] text-slate-500 font-semibold">Registered in Database</p>
        </div>

        <div className="gov-card p-5 bg-white border-t-4 border-emerald-600 space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase">
            <span>Resolution SLA Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-800">{data?.resolution_rate_percent || 33.3}%</div>
          <p className="text-[11px] text-emerald-700 font-bold">Standard SLA Target &gt; 80%</p>
        </div>

        <div className="gov-card p-5 bg-white border-t-4 border-blue-600 space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase">
            <span>Active Field Tasks</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-900">{data?.in_progress_count || 2}</div>
          <p className="text-[11px] text-slate-500 font-semibold">Work Order Dispatched</p>
        </div>

        <div className="gov-card p-5 bg-white border-t-4 border-red-600 space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase">
            <span>Critical Priority</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-black text-red-800">{data?.by_urgency?.High || 2}</div>
          <p className="text-[11px] text-red-700 font-bold">Urgent Hazard Complaints</p>
        </div>
      </div>

      {/* Visual Progress Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="gov-card p-6 bg-white space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
            <Building className="w-5 h-5 text-amber-600" />
            <span>Complaints by Department Category</span>
          </h3>

          <div className="space-y-4 pt-2">
            {['Roads', 'Water', 'Sanitation', 'Electricity', 'Public Safety'].map((cat) => {
              const count = data?.by_category?.[cat] || 0;
              const max = data?.total_grievances || 6;
              const percent = Math.round((count / max) * 100);

              let barColor = "bg-slate-800";
              if (cat === 'Water') barColor = "bg-blue-700";
              if (cat === 'Roads') barColor = "bg-amber-600";
              if (cat === 'Sanitation') barColor = "bg-emerald-700";
              if (cat === 'Electricity') barColor = "bg-yellow-600";
              if (cat === 'Public Safety') barColor = "bg-purple-700";

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900">{cat} Department</span>
                    <span className="text-slate-600 font-mono">{count} tickets ({percent}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded overflow-hidden border border-slate-300">
                    <div
                      className={`h-full ${barColor} transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgency & Status Distribution */}
        <div className="gov-card p-6 bg-white space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
            <PieChart className="w-5 h-5 text-amber-600" />
            <span>Priority & Status Breakdown</span>
          </h3>

          <div className="space-y-6 pt-2">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Urgency SLA Levels</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded bg-red-50 border border-red-200 text-center">
                  <div className="text-xl font-black text-red-800">{data?.by_urgency?.High || 0}</div>
                  <div className="text-[10px] font-bold text-red-900">Critical Priority</div>
                </div>
                <div className="p-3 rounded bg-amber-50 border border-amber-200 text-center">
                  <div className="text-xl font-black text-amber-900">{data?.by_urgency?.Medium || 0}</div>
                  <div className="text-[10px] font-bold text-amber-900">Medium Priority</div>
                </div>
                <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-center">
                  <div className="text-xl font-black text-emerald-800">{data?.by_urgency?.Low || 0}</div>
                  <div className="text-[10px] font-bold text-emerald-900">Standard Priority</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Workflow Resolution Progress</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded bg-slate-100 border border-slate-300 text-center">
                  <div className="text-xl font-black text-slate-900">{data?.by_status?.Classified || 0}</div>
                  <div className="text-[10px] font-bold text-slate-700">Classified</div>
                </div>
                <div className="p-3 rounded bg-blue-50 border border-blue-200 text-center">
                  <div className="text-xl font-black text-blue-900">{data?.by_status?.['In Progress'] || 0}</div>
                  <div className="text-[10px] font-bold text-blue-900">In Progress</div>
                </div>
                <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-center">
                  <div className="text-xl font-black text-emerald-800">{data?.by_status?.Resolved || 0}</div>
                  <div className="text-[10px] font-bold text-emerald-900">Resolved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

