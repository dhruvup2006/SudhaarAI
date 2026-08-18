'use client';

import React, { useState } from 'react';
import { Settings, Shield, Sliders, Save, Check, Sparkles, Building } from 'lucide-react';

export default function SettingsPage() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [autoEscalateHours, setAutoEscalateHours] = useState(24);
  const [highPriorityKeywords, setHighPriorityKeywords] = useState('massive, immediate, hazard, flooding, burst, fire, live wire, electrical shock');
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
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>AI NLP Configuration</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Department Routing & SLA Rules</h1>
          <p className="text-xs text-slate-400 mt-1">Configure SudhaarAI NLP keywords, confidence thresholds, and automated officer escalation timers.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

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

        {/* High Priority Keywords Input */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <div>
            <label className="text-sm font-bold text-white uppercase tracking-wider">High Urgency Keyword Signals</label>
            <p className="text-xs text-slate-400 mt-1">Comma-separated keywords that automatically flag tickets for High Urgency SLA handling.</p>
          </div>

          <textarea
            value={highPriorityKeywords}
            onChange={(e) => setHighPriorityKeywords(e.target.value)}
            rows={3}
            className="w-full p-4 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono transition-all"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>AI Routing Rules Saved Successfully!</span>
            </span>
          )}

          <button
            type="submit"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs transition-all flex items-center space-x-2 shadow-md cursor-pointer ml-auto"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>Save AI Engine Rules</span>
          </button>
        </div>
      </form>
    </div>
  );
}
