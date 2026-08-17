'use client';

import React, { useState } from 'react';
import { Settings, Sparkles, Shield, Sliders, Save, Check } from 'lucide-react';

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
        <h1 className="text-2xl font-extrabold text-white">AI Routing & Classifier Settings</h1>
        <p className="text-xs text-slate-400">Configure SudhaarAI NLP keywords, confidence thresholds, and department routing rules.</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        {/* Threshold Slider */}
        <div className="space-y-3 border-b border-slate-800 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-white">Minimum AI Confidence Score</label>
              <p className="text-xs text-slate-400">Grievances scoring below this threshold default to manual review queue.</p>
            </div>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs rounded-lg border border-indigo-500/30">
              {confidenceThreshold}%
            </span>
          </div>

          <input
            type="range"
            min={50}
            max={95}
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Auto Escalation Timer */}
        <div className="space-y-3 border-b border-slate-800 pb-6">
          <div>
            <label className="text-sm font-semibold text-white">High Priority Auto-Escalation SLA (Hours)</label>
            <p className="text-xs text-slate-400">Hours before unattended high-urgency tickets trigger SMS/Email supervisor alerts.</p>
          </div>

          <div className="flex items-center space-x-3">
            {[6, 12, 24, 48].map((hours) => (
              <button
                key={hours}
                type="button"
                onClick={() => setAutoEscalateHours(hours)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  autoEscalateHours === hours 
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30' 
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {hours} Hours
              </button>
            ))}
          </div>
        </div>

        {/* High Priority Keywords Input */}
        <div className="space-y-3 border-b border-slate-800 pb-6">
          <div>
            <label className="text-sm font-semibold text-white">High Urgency Keyword Signals</label>
            <p className="text-xs text-slate-400">Comma-separated keywords that automatically flag tickets as High Priority.</p>
          </div>

          <textarea
            value={highPriorityKeywords}
            onChange={(e) => setHighPriorityKeywords(e.target.value)}
            rows={3}
            className="w-full p-3 bg-slate-900 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>AI Routing Rules Saved Successfully!</span>
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center space-x-2 shadow-lg shadow-indigo-600/30 ml-auto"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
