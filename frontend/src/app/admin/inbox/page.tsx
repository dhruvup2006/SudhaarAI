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
  ChevronDown,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Building,
  Sparkles,
  ImageOff,
  Trash2,
  Inbox
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/core/dock';

interface Grievance {
  id: string;
  title: string;
  description: string;
  original_text?: string;
  detected_language?: string;
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

  // User session state
  const [userSession, setUserSession] = useState<{ role?: string; department?: string; category?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sudhaar_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserSession(parsed);
        if (parsed.role === 'officer' && parsed.category) {
          setSelectedCategory(parsed.category);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (selectedUrgency !== 'All') queryParams.append('urgency', selectedUrgency);
      if (selectedStatus !== 'All') queryParams.append('status', selectedStatus);

      const res = await apiFetch(`/api/grievances?${queryParams.toString()}`);
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

  // Strict Department Access Filter for Officer Role
  const displayedGrievances = grievances.filter((item) => {
    if (userSession?.role === 'officer' && userSession.category) {
      return item.category.toLowerCase() === userSession.category.toLowerCase();
    }
    return true;
  });

  const handleCloseGrievance = async (ticketId: string) => {
    if (!confirm(`Are you sure you want to CLOSE and remove grievance ${ticketId} from the portal?`)) {
      return;
    }
    setUpdatingStatus(true);
    try {
      const res = await apiFetch(`/api/grievances/${ticketId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setGrievances((prev) => prev.filter((g) => g.id !== ticketId));
        setSelectedTicket(null);
      }
    } catch (err) {
      console.error('Error closing grievance:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedTicket) return;
    if (newStatus === 'Closed') {
      await handleCloseGrievance(selectedTicket.id);
      return;
    }
    setUpdatingStatus(true);
    try {
      const res = await apiFetch(`/api/grievances/${selectedTicket.id}`, {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/85 backdrop-blur-2xl border border-zinc-800/90 p-6 sm:p-7 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-xs text-amber-400 font-bold mb-2">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>Nodal Officer Dispatch Desk</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Department grievance queue</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">Centralized incoming complaints prioritized by AI SLA rules and automated multi-lingual keyword analysis.</p>
        </div>

        <button
          onClick={fetchGrievances}
          className="px-6 py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-semibold tracking-tight flex items-center space-x-2 self-start sm:self-auto shadow-lg transition-all cursor-pointer active:scale-[0.98]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh database queue</span>
        </button>
      </div>


      {/* Apple-Style Dock Status Toolbar */}
      <div className="flex items-center justify-start py-4 overflow-visible relative z-20">
        <Dock className="h-16 bg-black/85 backdrop-blur-2xl border-zinc-800/90 shadow-xl px-4 py-2 gap-3 rounded-full border overflow-visible">
          {[
            { id: 'All', label: 'All Complaints', icon: Inbox, color: 'text-zinc-300' },
            { id: 'Submitted', label: 'Pending Review', icon: Clock, color: 'text-orange-400' },
            { id: 'In Progress', label: 'In Progress', icon: RefreshCw, color: 'text-sky-400' },
            { id: 'Resolved', label: 'Resolved', icon: CheckCircle2, color: 'text-emerald-400' }
          ].map((tab) => {
            const isSelected = selectedStatus === tab.id;
            const IconComponent = tab.icon;
            return (
              <DockItem
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={
                  isSelected
                    ? 'bg-white text-zinc-950 border-white shadow-lg'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }
              >
                <DockLabel position="top">{tab.label}</DockLabel>
                <DockIcon>
                  <IconComponent className={`w-5 h-5 ${isSelected ? 'text-zinc-950 font-bold' : tab.color}`} />
                </DockIcon>
              </DockItem>
            );
          })}
        </Dock>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 shadow-lg">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Reference ID or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-black text-white placeholder-slate-500 text-xs rounded-xl border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={userSession?.role === 'officer'}
            className={`w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none font-semibold transition-all ${
              userSession?.role === 'officer' 
                ? 'bg-black/90 text-amber-300 cursor-not-allowed opacity-90' 
                : 'bg-black text-white cursor-pointer'
            }`}
          >
            <option value="All" className="bg-zinc-900 text-slate-300">All Department Categories</option>
            <option value="Roads" className="bg-zinc-900 text-white">Public Works (Roads)</option>
            <option value="Water" className="bg-zinc-900 text-white">Jal Board (Water)</option>
            <option value="Sanitation" className="bg-zinc-900 text-white">Sanitation & Waste</option>
            <option value="Electricity" className="bg-zinc-900 text-white">Electricity & Power</option>
            <option value="Public Safety" className="bg-zinc-900 text-white">Public Safety</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Urgency Filter */}
        <div className="relative">
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-black text-white text-xs rounded-xl border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none font-medium transition-all cursor-pointer"
          >
            <option value="All" className="bg-zinc-900 text-slate-300">All Priority Levels</option>
            <option value="High" className="bg-zinc-900 text-white">High Priority SLA</option>
            <option value="Medium" className="bg-zinc-900 text-white">Medium Priority SLA</option>
            <option value="Low" className="bg-zinc-900 text-white">Low Priority SLA</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-black text-white text-xs rounded-xl border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none font-medium transition-all cursor-pointer"
          >
            <option value="All" className="bg-zinc-900 text-slate-300">All Status Flags</option>
            <option value="Submitted" className="bg-zinc-900 text-white">Submitted (Pending Review)</option>
            <option value="Classified" className="bg-zinc-900 text-white">AI Classified</option>
            <option value="In Progress" className="bg-zinc-900 text-white">Field Work In Progress</option>
            <option value="Resolved" className="bg-zinc-900 text-white">Resolved & Verified</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-[11px] font-extrabold text-amber-400 uppercase tracking-widest border-b border-zinc-800">
                <th className="py-4 px-5">Reference ID</th>
                <th className="py-4 px-5">Grievance Summary</th>
                <th className="py-4 px-5">Priority SLA</th>
                <th className="py-4 px-5">Dept Category</th>
                <th className="py-4 px-5">Assigned Nodal Body</th>
                <th className="py-4 px-5">Current Status</th>
                <th className="py-4 px-5 text-right">Officer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-xs">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-5"><div className="h-4 bg-zinc-800 rounded w-20" /></td>
                    <td className="py-4 px-5"><div className="h-4 bg-zinc-800 rounded w-48 mb-1.5" /><div className="h-3 bg-zinc-800/60 rounded w-32" /></td>
                    <td className="py-4 px-5"><div className="h-6 bg-zinc-800 rounded-md w-24" /></td>
                    <td className="py-4 px-5"><div className="h-6 bg-zinc-800 rounded-md w-24" /></td>
                    <td className="py-4 px-5"><div className="h-4 bg-zinc-800 rounded w-36" /></td>
                    <td className="py-4 px-5"><div className="h-6 bg-zinc-800 rounded-full w-24" /></td>
                    <td className="py-4 px-5"><div className="h-8 bg-zinc-800 rounded-lg w-28 ml-auto" /></td>
                  </tr>
                ))
              ) : displayedGrievances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center space-y-3">
                    <p className="text-sm font-semibold text-slate-200">No matching grievances found</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">No pending complaints match your active department, status, or search filters.</p>
                    <button
                      onClick={() => {
                        setSearch('');
                        setSelectedCategory('All');
                        setSelectedUrgency('All');
                        setSelectedStatus('All');
                      }}
                      className="mt-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700 text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <span>Clear all filters</span>
                    </button>
                  </td>
                </tr>
              ) : (
                displayedGrievances.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedTicket(item)}
                    className="hover:bg-zinc-800/60 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-5 font-mono font-semibold text-amber-400 whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-4 px-5 max-w-xs">
                      <p className="font-semibold text-white truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.location}</p>
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <UrgencyBadge urgency={item.urgency} size="sm" />
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <CategoryBadge category={item.category} size="sm" />
                    </td>
                    <td className="py-4 px-5 text-slate-300 font-medium truncate max-w-[200px]">
                      {item.department}
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className={`text-xs font-semibold ${
                        item.status === 'Resolved'
                          ? 'text-emerald-400'
                          : item.status === 'In Progress'
                          ? 'text-sky-400'
                          : 'text-amber-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs flex items-center space-x-1.5 ml-auto transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Inspect ticket</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination Bar */}
        <div className="p-4 bg-black border-t border-zinc-800 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>
            Showing <strong className="text-white">{displayedGrievances.length}</strong> grievance record{displayedGrievances.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-slate-300">
              Page 1 of 1
            </span>
          </div>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-white shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center space-x-3 mb-2.5">
                <span className="font-mono text-lg font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                  {selectedTicket.id}
                </span>
                <UrgencyBadge urgency={selectedTicket.urgency} size="sm" />
                <CategoryBadge category={selectedTicket.category} size="sm" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{selectedTicket.title}</h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{selectedTicket.location}</span>
              </p>
            </div>

            {/* Description & Photo */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Citizen Full Statement</h4>
              
              {selectedTicket.original_text && selectedTicket.original_text !== selectedTicket.description && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs">
                  <span className="font-bold text-amber-300 block mb-1">Original Text ({selectedTicket.detected_language || 'regional'}):</span>
                  <p className="text-amber-100">{selectedTicket.original_text}</p>
                </div>
              )}

              <p className="text-xs text-slate-200 bg-black p-4 rounded-2xl border border-zinc-800 leading-relaxed whitespace-pre-line">
                {selectedTicket.description}
              </p>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Attached Photo Evidence</h4>
                {selectedTicket.photo_url ? (
                  <img
                    src={selectedTicket.photo_url}
                    alt="Citizen evidence"
                    className="w-full max-h-56 object-cover rounded-2xl border border-zinc-800 shadow-md"
                  />
                ) : (
                  <div className="p-4 rounded-2xl bg-black/80 border border-zinc-800 text-slate-400 text-xs font-medium flex items-center space-x-2.5">
                    <ImageOff className="w-5 h-5 text-slate-500 shrink-0" />
                    <span>No photo evidence uploaded by citizen</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Update Control */}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Update Official Grievance Workflow Status
              </label>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  disabled={updatingStatus}
                  className="flex-1 px-4 py-3 bg-black text-white text-xs font-bold rounded-xl border border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="Submitted">Submitted (Pending Review)</option>
                  <option value="Classified">Classified (AI Assigned)</option>
                  <option value="In Progress">In Progress (Field Action Deployed)</option>
                  <option value="Resolved">Resolved (Work Complete & Verified)</option>
                  <option value="Closed">Close Grievance (Remove from Portal)</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleCloseGrievance(selectedTicket.id)}
                  disabled={updatingStatus}
                  className="px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Close & Remove</span>
                </button>

                <a
                  href={`/track/${selectedTicket.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center space-x-1.5 transition-colors shrink-0"
                >
                  <span>Public View</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
