'use client';

import React, { useEffect, useState } from 'react';
import { CategoryBadge } from '@/components/CategoryBadge';
import { UrgencyBadge } from '@/components/UrgencyBadge';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Building2, 
  MapPin, 
  X, 
  Sparkles, 
  ChevronDown,
  AlertTriangle,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

interface Grievance {
  id: string;
  title: string;
  description: string;
  location: string;
  photo_url?: string;
  category: string;
  urgency: string;
  status: string;
  department: string;
  ai_confidence: number;
  ai_reasoning?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminInboxPage() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Modal State
  const [selectedTicket, setSelectedTicket] = useState<Grievance | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (selectedUrgency !== 'All') queryParams.append('urgency', selectedUrgency);
      if (selectedStatus !== 'All') queryParams.append('status', selectedStatus);

      const res = await fetch(`http://127.0.0.1:8000/api/grievances?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setGrievances(data);
      }
    } catch (err) {
      console.error('Failed to fetch grievances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, [search, selectedCategory, selectedUrgency, selectedStatus]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedTicket) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/grievances/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedTicket(updated);
        // Refresh table list
        fetchGrievances();
      }
    } catch (err) {
      console.error('Error updating ticket status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Grievance Inbox</h1>
          <p className="text-xs text-slate-400">All incoming citizen reports auto-prioritized by AI urgency scoring.</p>
        </div>

        <button
          onClick={fetchGrievances}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-indigo-400 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filter Control Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticket ID or keyword..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-700/70 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 text-white text-xs rounded-xl border border-slate-700/70 focus:outline-none focus:border-indigo-500 appearance-none"
          >
            <option value="All">All Categories</option>
            <option value="Roads">Roads</option>
            <option value="Water">Water</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Electricity">Electricity</option>
            <option value="Public Safety">Public Safety</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Urgency Filter */}
        <div className="relative">
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 text-white text-xs rounded-xl border border-slate-700/70 focus:outline-none focus:border-indigo-500 appearance-none"
          >
            <option value="All">All Urgency Levels</option>
            <option value="High">High Priority First</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 text-white text-xs rounded-xl border border-slate-700/70 focus:outline-none focus:border-indigo-500 appearance-none"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Classified">Classified</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Grievance Summary</th>
                <th className="py-3.5 px-4">Urgency</th>
                <th className="py-3.5 px-4">AI Category</th>
                <th className="py-3.5 px-4">Assigned Department</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
                    Loading grievances database...
                  </td>
                </tr>
              ) : grievances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No grievances matching current filter parameters.
                  </td>
                </tr>
              ) : (
                grievances.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedTicket(item)}
                    className="hover:bg-slate-900/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400 whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-white truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.location}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <UrgencyBadge urgency={item.urgency} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <CategoryBadge category={item.category} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium truncate max-w-[180px]">
                      {item.department}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : item.status === 'In Progress'
                          ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 font-medium text-xs flex items-center space-x-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detail Modal / Slide-Over */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel max-w-2xl w-full rounded-3xl border border-slate-700 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title Header */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-mono text-lg font-bold text-indigo-400">{selectedTicket.id}</span>
                <UrgencyBadge urgency={selectedTicket.urgency} size="sm" />
                <CategoryBadge category={selectedTicket.category} size="sm" />
              </div>
              <h2 className="text-xl font-bold text-white">{selectedTicket.title}</h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedTicket.location}</span>
              </p>
            </div>

            {/* AI Diagnostics Banner */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>AI Classification & Department Routing</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400">
                  {(selectedTicket.ai_confidence * 100).toFixed(0)}% Confidence
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {selectedTicket.ai_reasoning || "Automatic classification algorithm evaluated issue parameters."}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Target Dept: <span className="text-white">{selectedTicket.department}</span>
              </p>
            </div>

            {/* Description & Photo */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Citizen Full Description</h4>
              <p className="text-xs text-slate-200 bg-slate-900 p-4 rounded-xl border border-slate-800 leading-relaxed whitespace-pre-line">
                {selectedTicket.description}
              </p>

              {selectedTicket.photo_url && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Submitted Photo</h4>
                  <img
                    src={selectedTicket.photo_url}
                    alt="Citizen evidence"
                    className="w-full max-h-56 object-cover rounded-xl border border-slate-800 shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Interactive Status Dropdown Control */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Update Official Ticket Status
              </label>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  disabled={updatingStatus}
                  className="flex-1 px-4 py-2.5 bg-slate-900 text-white text-xs font-medium rounded-xl border border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Submitted">Submitted (Pending Review)</option>
                  <option value="Classified">Classified (AI Routed)</option>
                  <option value="In Progress">In Progress (Field Work Assigned)</option>
                  <option value="Resolved">Resolved (Work Complete)</option>
                  <option value="Rejected">Rejected (Invalid/Duplicate)</option>
                </select>

                <a
                  href={`/track/${selectedTicket.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs border border-slate-700 flex items-center space-x-1"
                >
                  <span>Public View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
