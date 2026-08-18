'use client';

import React, { useState } from 'react';
import { Settings, Shield, Sliders, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [autoEscalateHours, setAutoEscalateHours] = useState(24);
  const [highPriorityKeywords, setHighPriorityKeywords] = useState('massive, immediate, hazard, flooding, burst, fire, live wire');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">AI Department Routing & SLA Rules</h1>
        <p className="text-xs text-slate-600">Configure SudhaarAI NLP keywords, confidence thresholds, and automated officer escalation timers.</p>
      </div>

      <form onSubmit={handleSave} className="gov-card p-6 sm:p-8 space-y-6 bg-white border-t-4 border-amber-600">
        {/* Threshold Slider */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-bold text-slate-900 uppercase">Minimum AI Confidence Score</label>
              <p className="text-xs text-slate-600">Grievances scoring below this threshold default to manual officer triage queue.</p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 font-mono font-bold text-xs rounded border border-amber-300">
              {confidenceThreshold}%
            </span>
          </div>

          <input
            type="range"
            min={50}
            max={95}
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        {/* Auto Escalation Timer */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div>
            <label className="text-sm font-bold text-slate-900 uppercase">High Priority Auto-Escalation SLA (Hours)</label>
            <p className="text-xs text-slate-600">Hours before unattended high-urgency complaints trigger SMS alerts to ward nodal supervisors.</p>
          </div>

          <div className="flex items-center space-x-3">
            {[6, 12, 24, 48].map((hours) => (
              <button
                key={hours}
                type="button"
                onClick={() => setAutoEscalateHours(hours)}
                className={`px-4 py-2 rounded text-xs font-bold border transition-all ${
                  autoEscalateHours === hours 
                    ? 'bg-amber-600 text-white border-amber-500 shadow-sm' 
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {hours} Hours SLA
              </button>
            ))}
          </div>
        </div>

        {/* High Priority Keywords Input */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div>
            <label className="text-sm font-bold text-slate-900 uppercase">High Urgency Keyword Signals</label>
            <p className="text-xs text-slate-600">Comma-separated keywords that automatically flag tickets for High Urgency SLA handling.</p>
          </div>

          <textarea
            value={highPriorityKeywords}
            onChange={(e) => setHighPriorityKeywords(e.target.value)}
            rows={3}
            className="w-full p-3 bg-slate-50 text-slate-900 text-xs rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>AI Routing Rules Saved Successfully!</span>
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors flex items-center space-x-2 shadow-sm border border-amber-500 ml-auto"
          >
            <Save className="w-4 h-4" />
            <span>Save Department Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}

