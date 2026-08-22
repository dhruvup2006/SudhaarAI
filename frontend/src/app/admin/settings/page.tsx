'use client';

import React, { useState } from 'react';
import { Settings, Shield, Sliders, Save, Check, Sparkles, Cpu, Zap, Activity } from 'lucide-react';

export default function SettingsPage() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [autoEscalateHours, setAutoEscalateHours] = useState(24);
  const [urgencyMode, setUrgencyMode] = useState<'standard' | 'high_sensitivity' | 'strict'>('high_sensitivity');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct AI Semantic Triage</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Department Routing & SLA Rules</h1>
          <p className="text-xs text-slate-400 mt-1">Direct natural language understanding engine. Analyzes grievances contextually without relying on static keyword lists.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

        {/* AI Engine Status Header */}
        <div className="p-4 bg-slate-950/80 border border-amber-500/20 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white">Direct AI Contextual Triage</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Activity className="w-3 h-3 mr-1 animate-pulse" /> Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Automated zero-shot semantic intent evaluation & situational urgency routing</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-mono font-semibold px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg">
            No Manual Keywords Needed
          </span>
        </div>

        {/* Threshold Slider */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-bold text-white uppercase tracking-wider">Minimum AI Confidence Score</label>
              <p className="text-xs text-slate-400 mt-1">Grievances scoring below this threshold default to manual officer triage queue.</p>
            </div>
            <span className="px-3.5 py-1.5 bg-amber-500/10 text-amber-400 font-mono font-extrabold text-xs rounded-xl border border-amber-500/30">
              {confidenceThreshold}%
            </span>
          </div>

          <input
            type="range"
            min={50}
            max={95}
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-slate-800"
          />
        </div>

        {/* Urgency Sensitivity Mode */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <div>
            <label className="text-sm font-bold text-white uppercase tracking-wider">Direct AI Hazard & Urgency Sensitivity</label>
            <p className="text-xs text-slate-400 mt-1">Controls how aggressively the AI evaluates situational safety risks and structural hazards.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'standard', label: 'Standard Triage', desc: 'Balanced safety & routine issue evaluation' },
              { id: 'high_sensitivity', label: 'High Priority First', desc: 'Proactively elevates potential public hazards' },
              { id: 'strict', label: 'Strict Analysis', desc: 'Requires critical impact context for high urgency' }
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setUrgencyMode(mode.id as any)}
                className={`p-3.5 text-left rounded-2xl border transition-all cursor-pointer ${
                  urgencyMode === mode.id
                    ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold ${urgencyMode === mode.id ? 'text-amber-400' : 'text-slate-300'}`}>
                    {mode.label}
                  </span>
                  {urgencyMode === mode.id && <Zap className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{mode.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Auto Escalation Timer */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <div>
            <label className="text-sm font-bold text-white uppercase tracking-wider">High Priority Auto-Escalation SLA (Hours)</label>
            <p className="text-xs text-slate-400 mt-1">Hours before unattended high-urgency complaints trigger SMS alerts to ward nodal supervisors.</p>
          </div>

          <div className="flex items-center space-x-3">
            {[6, 12, 24, 48].map((hours) => (
              <button
                key={hours}
                type="button"
                onClick={() => setAutoEscalateHours(hours)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  autoEscalateHours === hours 
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md' 
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {hours} Hours SLA
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>AI Engine Direct Routing Rules Saved!</span>
            </span>
          )}

          <button
            type="submit"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs transition-all flex items-center space-x-2 shadow-md cursor-pointer ml-auto"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>Save AI Engine Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}

