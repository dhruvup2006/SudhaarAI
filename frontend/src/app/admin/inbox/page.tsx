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
  Building
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
          <h1 className="text-2xl font-extrabold text-slate-900">Department Grievance Inbox</h1>
          <p className="text-xs text-slate-600">Central queue of incoming citizen complaints automatically prioritized by AI urgency and SLA rules.</p>
        </div>

        <button
          onClick={fetchGrievances}
          className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Filter Control Bar */}
      <div className="gov-card p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Reference ID or keyword..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 text-slate-900 text-xs rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none font-semibold"
          >
            <option value="All">All Department Categories</option>
            <option value="Roads">Public Works (Roads)</option>
            <option value="Water">Jal Board (Water)</option>
            <option value="Sanitation">Sanitation & Waste</option>
            <option value="Electricity">Electricity & Power</option>
            <option value="Public Safety">Public Safety</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Urgency Filter */}
        <div className="relative">
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 text-slate-900 text-xs rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none font-semibold"
          >
            <option value="All">All Priority Levels</option>
            <option value="High">High Priority SLA</option>
            <option value="Medium">Medium Priority SLA</option>
            <option value="Low">Low Priority SLA</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 text-slate-900 text-xs rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none font-semibold"
          >
            <option value="All">All Status Flags</option>
            <option value="Submitted">Lodged (Submitted)</option>
            <option value="Classified">AI Classified</option>
            <option value="In Progress">Field Work In Progress</option>
            <option value="Resolved">Resolved & Verified</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Data Table */}
      <div className="gov-card overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-[11px] font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-4">Reference ID</th>
                <th className="py-3 px-4">Grievance Summary</th>
                <th className="py-3 px-4">Priority SLA</th>
                <th className="py-3 px-4">Dept Category</th>
                <th className="py-3 px-4">Assigned Body</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Officer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-600 font-medium">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-600 mb-2" />
                    Loading municipal database...
                  </td>
                </tr>
              ) : grievances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-600 font-medium">
                    No grievance records match current filter parameters.
                  </td>
                </tr>
              ) : (
                grievances.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedTicket(item)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.location}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <UrgencyBadge urgency={item.urgency} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <CategoryBadge category={item.category} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold truncate max-w-[180px]">
                      {item.department}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded border ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : item.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
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
                        className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center space-x-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-700" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="gov-card max-w-2xl w-full rounded-md border-t-4 border-amber-600 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto bg-white shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-6 right-6 p-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title Header */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-mono text-lg font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedTicket.id}
                </span>
                <UrgencyBadge urgency={selectedTicket.urgency} size="sm" />
                <CategoryBadge category={selectedTicket.category} size="sm" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{selectedTicket.title}</h2>
              <p className="text-xs text-slate-600 mt-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{selectedTicket.location}</span>
              </p>
            </div>

            {/* AI Diagnostics Banner */}
            <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>AI Automated Category & Routing Diagnostic</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {(selectedTicket.ai_confidence * 100).toFixed(0)}% Confidence Match
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white p-2.5 rounded border border-slate-200">
                {selectedTicket.ai_reasoning || "Automatic classification algorithm evaluated issue parameters."}
              </p>
              <p className="text-xs text-slate-700 font-bold">
                Designated Authority: <span className="text-slate-900">{selectedTicket.department}</span>
              </p>
            </div>

            {/* Description & Photo */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Citizen Full Statement</h4>
              <p className="text-xs text-slate-800 bg-slate-50 p-4 rounded border border-slate-200 leading-relaxed whitespace-pre-line">
                {selectedTicket.description}
              </p>

              {selectedTicket.photo_url && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Attached Photo Evidence</h4>
                  <img
                    src={selectedTicket.photo_url}
                    alt="Citizen evidence"
                    className="w-full max-h-56 object-cover rounded border border-slate-300 shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Interactive Status Dropdown Control */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Update Official Grievance Workflow Status
              </label>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  disabled={updatingStatus}
                  className="flex-1 px-4 py-2.5 bg-slate-50 text-slate-900 text-xs font-bold rounded border border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Submitted">Submitted (Pending Officer Review)</option>
                  <option value="Classified">Classified (AI Dept Assigned)</option>
                  <option value="In Progress">In Progress (Field Work Dispatch)</option>
                  <option value="Resolved">Resolved (Work Complete & Verified)</option>
                  <option value="Rejected">Rejected (Duplicate/Invalid Request)</option>
                </select>

                <a
                  href={`/track/${selectedTicket.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1"
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

