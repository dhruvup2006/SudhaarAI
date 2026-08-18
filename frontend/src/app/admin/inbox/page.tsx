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
  ImageOff
} from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>Nodal Officer Dispatch Desk</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Department Grievance Queue</h1>
          <p className="text-xs text-slate-400 mt-1">Centralized incoming complaints prioritized by AI SLA rules and automated multi-lingual keyword analysis.</p>
        </div>

        <button
          onClick={fetchGrievances}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold flex items-center space-x-2 self-start sm:self-auto shadow-md transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Database Queue</span>
        </button>
      </div>

      {/* Officer Department Lock Notice Banner */}
      {userSession?.role === 'officer' && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-300 font-bold shadow-md">
          <div className="flex items-center space-x-2.5">
            <Building className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Assigned Department Filter: Displaying grievances routed to <strong>{userSession.category}</strong> ({userSession.department}) only.</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] uppercase font-extrabold border border-amber-500/40">
            Officer Department View
          </span>
        </div>
      )}

      {/* Filter Control Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 shadow-lg">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Reference ID or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none font-medium transition-all cursor-pointer"
          >
            <option value="All" className="bg-slate-900 text-slate-300">All Department Categories</option>
            <option value="Roads" className="bg-slate-900 text-white">Public Works (Roads)</option>
            <option value="Water" className="bg-slate-900 text-white">Jal Board (Water)</option>
            <option value="Sanitation" className="bg-slate-900 text-white">Sanitation & Waste</option>
            <option value="Electricity" className="bg-slate-900 text-white">Electricity & Power</option>
            <option value="Public Safety" className="bg-slate-900 text-white">Public Safety</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Urgency Filter */}
        <div className="relative">
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none font-medium transition-all cursor-pointer"
          >
            <option value="All" className="bg-slate-900 text-slate-300">All Priority Levels</option>
            <option value="High" className="bg-slate-900 text-white">High Priority SLA</option>
            <option value="Medium" className="bg-slate-900 text-white">Medium Priority SLA</option>
            <option value="Low" className="bg-slate-900 text-white">Low Priority SLA</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none font-medium transition-all cursor-pointer"
          >
            <option value="All" className="bg-slate-900 text-slate-300">All Status Flags</option>
            <option value="Submitted" className="bg-slate-900 text-white">Submitted (Pending Review)</option>
            <option value="Classified" className="bg-slate-900 text-white">AI Classified</option>
            <option value="In Progress" className="bg-slate-900 text-white">Field Work In Progress</option>
            <option value="Resolved" className="bg-slate-900 text-white">Resolved & Verified</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-[11px] font-extrabold text-amber-400 uppercase tracking-widest border-b border-slate-800">
                <th className="py-4 px-5">Reference ID</th>
                <th className="py-4 px-5">Grievance Summary</th>
                <th className="py-4 px-5">Priority SLA</th>
                <th className="py-4 px-5">Dept Category</th>
                <th className="py-4 px-5">Assigned Nodal Body</th>
                <th className="py-4 px-5">Current Status</th>
                <th className="py-4 px-5 text-right">Officer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 font-medium">
                    <RefreshCw className="w-7 h-7 animate-spin mx-auto text-amber-400 mb-3" />
                    Connecting to municipal database queue...
                  </td>
                </tr>
              ) : grievances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 font-medium">
                    No grievance records match current filter parameters.
                  </td>
                </tr>
              ) : (
                grievances.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedTicket(item)}
                    className="hover:bg-slate-850/60 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-5 font-mono font-extrabold text-amber-400 whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-4 px-5 max-w-xs">
                      <p className="font-bold text-white truncate">{item.title}</p>
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
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : item.status === 'In Progress'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
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
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center space-x-1.5 ml-auto transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Inspect Ticket</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-white shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
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

            {/* AI Diagnostics Banner */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AI Automated Category & Routing Diagnostic</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {(selectedTicket.ai_confidence * 100).toFixed(0)}% Confidence Match
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900 p-3 rounded-xl border border-slate-800">
                {selectedTicket.ai_reasoning || "Automatic classification algorithm evaluated issue parameters."}
              </p>
              <p className="text-xs text-slate-300 font-bold pt-1">
                Designated Authority: <span className="text-white font-semibold">{selectedTicket.department}</span>
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

              <p className="text-xs text-slate-200 bg-slate-950 p-4 rounded-2xl border border-slate-800 leading-relaxed whitespace-pre-line">
                {selectedTicket.description}
              </p>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Attached Photo Evidence</h4>
                {selectedTicket.photo_url ? (
                  <img
                    src={selectedTicket.photo_url}
                    alt="Citizen evidence"
                    className="w-full max-h-56 object-cover rounded-2xl border border-slate-800 shadow-md"
                  />
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-400 text-xs font-medium flex items-center space-x-2.5">
                    <ImageOff className="w-5 h-5 text-slate-500 shrink-0" />
                    <span>No photo evidence uploaded by citizen</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Update Control */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Update Official Grievance Workflow Status
              </label>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  disabled={updatingStatus}
                  className="flex-1 px-4 py-3 bg-slate-950 text-white text-xs font-bold rounded-xl border border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="Submitted">Submitted (Pending Review)</option>
                  <option value="Classified">Classified (AI Assigned)</option>
                  <option value="In Progress">In Progress (Field Action Deployed)</option>
                  <option value="Resolved">Resolved (Work Complete & Verified)</option>
                  <option value="Rejected">Rejected (Duplicate Request)</option>
                </select>

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
