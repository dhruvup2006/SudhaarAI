'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { cn } from '@/lib/utils';
import { 
  Mic, 
  MicOff, 
  Upload, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  Volume2,
  Trash2,
  Copy,
  Check,
  Crosshair,
  Brain,
  Database,
  Palette,
  Zap,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { apiFetch, API_BASE_URL } from '@/lib/api';

export default function RegisterGrievancePage() {
  const router = useRouter();
  
  // Wizard Step (1: Voice/Text, 2: Photo, 3: Location & Submit)
  const [step, setStep] = useState(1);

  // Form State
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Voice Recording State
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [selectedLang, setSelectedLang] = useState('en-IN'); // 'en-IN' or 'hi-IN'
  const [micPermissionState, setMicPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'requesting'>('prompt');
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // System State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLang;

        recognition.onstart = () => {
          setIsListening(true);
          setMicPermissionState('granted');
          setErrorMessage('');
          setRecordingSeconds(0);
          timerIntervalRef.current = setInterval(() => {
            setRecordingSeconds((prev) => prev + 1);
          }, 1000);
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            setDescription((prev) => (prev ? `${prev} ${finalTranscript}` : finalTranscript));
          }
          setInterimTranscript(currentInterim);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          clearInterval(timerIntervalRef.current);
          if (event.error === 'not-allowed') {
            setMicPermissionState('denied');
            setErrorMessage('Microphone access denied. Please allow microphone permissions in your browser settings.');
          } else {
            setErrorMessage(`Voice input issue (${event.error}). You can also type your description below.`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
          clearInterval(timerIntervalRef.current);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, [selectedLang]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setErrorMessage('Speech Recognition is not supported by this browser. Please type your grievance in the text box below.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
      setIsListening(false);
      clearInterval(timerIntervalRef.current);
    } else {
      try {
        setErrorMessage('');
        setMicPermissionState('requesting');
        recognitionRef.current.lang = selectedLang;
        recognitionRef.current.start();
      } catch (err) {
        console.error('Start error:', err);
        setIsListening(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setErrorMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setErrorMessage('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(`GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (Near Municipal Zone)`);
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        setLocation('Central Ward - Main City Zone');
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleCopyText = () => {
    if (description) {
      navigator.clipboard.writeText(description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClearText = () => {
    setDescription('');
    setInterimTranscript('');
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMessage('Please describe your grievance before submitting.');
      setStep(1);
      return;
    }
    if (!location.trim()) {
      setErrorMessage('Please enter or auto-detect the grievance location.');
      setStep(3);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        title: `Civic Report`,
        description: description.trim(),
        location: location.trim(),
        photo_url: photoPreview || null
      };

      const res = await apiFetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to submit grievance to API server.');
      }

      const data = await res.json();
      router.push(`/track/${data.id}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Unable to connect to backend on ${API_BASE_URL}. Make sure the backend server is running.`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1017] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white relative overflow-hidden font-sans">
      {/* CONSTANT TRICOLOR BACKGROUND SETUP */}
      {/* Fixed Background Image - Indian Flag Artwork Preserved CONSTANT */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-75 pointer-events-none z-0"
        style={{ backgroundImage: `url('/login-bg.jpg')` }}
      />
      {/* Vignette & Contrast Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/90 via-[#0d1017]/85 to-black/95 pointer-events-none z-0" />

      {/* Tricolor Ambient Glow Spheres (CONSTANT TRICOLOR BG) */}
      <div className="fixed top-12 left-12 w-96 h-96 bg-rose-600/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-12 right-12 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/2 right-1/4 w-80 h-80 bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full relative z-10 space-y-16">
        
        {/* FEATURE VELOCITY STYLE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-800/80 pb-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-rose-500 text-xs font-mono uppercase tracking-widest font-bold">
              <Zap className="size-4 animate-pulse" />
              <span>SudhaarAI High-Velocity Engine</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              High Velocity
              <br />
              <span className="bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Civic Dispatch.
              </span>
            </h1>
          </div>
          <div className="flex flex-col items-start md:items-end space-y-4">
            <Link href="/">
              <span className="text-xs font-mono font-semibold text-slate-300 hover:text-white flex items-center space-x-2 bg-neutral-950/80 px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-rose-500/50 transition-all shadow-sm">
                <ArrowLeft className="size-3.5" />
                <span>RETURN TO HOME</span>
              </span>
            </Link>
            <p className="max-w-xs text-slate-400 font-mono text-xs leading-relaxed uppercase tracking-widest">
              Multi-lingual voice AI & automated municipal SLA dispatch.
            </p>
          </div>
        </div>

        {/* FEATURE VELOCITY INTERACTIVE STEP CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              stepNum: 1,
              title: "Neural Link",
              label: "01. Statement & AI Speech",
              color: "from-rose-500/30",
              icon: Brain,
              desc: "Voice AI transcription or text grievance input"
            },
            {
              stepNum: 2,
              title: "Data Core",
              label: "02. Visual Evidence",
              color: "from-amber-500/30",
              icon: Database,
              desc: "Attach photo evidence for instant verification"
            },
            {
              stepNum: 3,
              title: "Fluid UI",
              label: "03. Location & Dispatch",
              color: "from-emerald-500/30",
              icon: MapPin,
              desc: "GPS location tagging and SLA routing"
            },
          ].map((card) => {
            const isActive = step === card.stepNum;
            const isDone = step > card.stepNum;
            return (
              <button
                key={card.stepNum}
                type="button"
                onClick={() => setStep(card.stepNum)}
                className={cn(
                  "group text-left relative bg-neutral-950/90 border rounded-2xl p-6 sm:p-8 overflow-hidden transition-all duration-500 cursor-pointer backdrop-blur-xl",
                  isActive
                    ? "border-rose-500 ring-2 ring-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.2)]"
                    : isDone
                    ? "border-rose-500/40 opacity-90"
                    : "border-neutral-800/80 hover:border-neutral-700 opacity-70 hover:opacity-100"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
                    card.color,
                    isActive && "opacity-100"
                  )}
                />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "size-12 rounded-2xl flex items-center justify-center transition-colors",
                      isActive ? "bg-rose-500 text-white" : "bg-white/10 text-white"
                    )}>
                      <card.icon className="size-6" />
                    </div>
                    {isDone && (
                      <span className="flex items-center space-x-1 text-xs font-mono text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
                        <CheckCircle2 className="size-3.5" />
                        <span>DONE</span>
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">
                      {card.label}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
                      {card.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 leading-normal">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* MAIN FEATURE VELOCITY FORM CONTAINER */}
        <div className="relative bg-neutral-950/95 border border-neutral-800/90 rounded-3xl p-6 sm:p-10 md:p-12 overflow-hidden shadow-2xl backdrop-blur-2xl">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#252525_0px_1px,transparent_1px_8px)] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
          
          {/* Top Tricolor Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-500 z-10" />

          <div className="relative z-10 space-y-8">

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2.5 shadow-md">
                <AlertCircle className="size-5 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: VOICE / TEXT STATEMENT */}
            {step === 1 && (
              <div className="space-y-8">
                
                {/* Voice Recorder AI Hub */}
                <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-6 shadow-inner relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="size-5 text-rose-400" />
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">
                        Neural Voice AI Input Module
                      </span>
                    </div>

                    {/* Language Switcher */}
                    <div className="flex items-center space-x-1 bg-black p-1.5 rounded-xl border border-neutral-800 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setSelectedLang('en-IN')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          selectedLang === 'en-IN'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedLang('hi-IN')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          selectedLang === 'hi-IN'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        हिंदी (Hindi)
                      </button>
                    </div>
                  </div>

                  {/* Mic Button */}
                  <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={`size-24 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative shadow-xl ${
                        isListening
                          ? 'bg-rose-600 text-white ring-8 ring-rose-500/30 animate-pulse'
                          : 'bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:scale-105 text-white shadow-rose-500/20'
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="size-10" />
                      ) : (
                        <Mic className="size-10" />
                      )}
                    </button>

                    <div className="text-center space-y-1">
                      <p className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                        {isListening ? `Recording Active (${formatTimer(recordingSeconds)})` : 'Click Microphone to Voice Record'}
                      </p>
                      <p className="text-xs font-mono text-slate-400">
                        {isListening ? 'Speak clearly in your selected language' : 'AI Speech-to-Text with automatic translation engine'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Text Description */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
                      Grievance Description <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-slate-500">
                      {description.length} CHARS
                    </span>
                  </div>

                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the civic issue in detail (e.g., Overflowing sewage pipe near Market Road gate)..."
                    className="w-full p-4 bg-black/80 text-white border border-neutral-800 rounded-xl font-mono text-xs sm:text-sm focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all placeholder-slate-600"
                  />

                  {description && (
                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCopyText}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-xs font-mono text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors"
                      >
                        {copied ? <Check className="size-3.5 text-rose-400" /> : <Copy className="size-3.5" />}
                        <span>{copied ? 'COPIED' : 'COPY'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleClearText}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-xs font-mono text-slate-300 hover:text-rose-400 flex items-center space-x-1.5 transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                        <span>CLEAR</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Next Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!description.trim()) {
                        setErrorMessage('Please describe the issue before proceeding.');
                        return;
                      }
                      setErrorMessage('');
                      setStep(2);
                    }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-mono font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center space-x-3 cursor-pointer active:scale-[0.99]"
                  >
                    <span>PROCEED TO PHOTO EVIDENCE</span>
                    <ArrowRight className="size-4 text-white" />
                  </button>
                </div>

              </div>
            )}

            {/* STEP 2: PHOTO ATTACHMENT */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
                    Attach Photo Evidence (Optional)
                  </label>
                  
                  {/* Photo Drop Zone */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-700 hover:border-rose-500/80 bg-black/60 p-10 rounded-2xl text-center space-y-4 cursor-pointer transition-all hover:bg-black/80 group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {photoPreview ? (
                      <div className="space-y-4">
                        <img
                          src={photoPreview}
                          alt="Uploaded evidence"
                          className="w-full max-h-64 object-cover rounded-xl border border-neutral-800 shadow-xl mx-auto"
                        />
                        <p className="text-xs font-mono text-rose-400 font-bold flex items-center justify-center space-x-2">
                          <Check className="size-4" />
                          <span>PHOTO ATTACHED SUCCESSFULLY. CLICK TO REPLACE.</span>
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="size-14 rounded-2xl bg-neutral-900 border border-neutral-800 text-slate-400 group-hover:text-white flex items-center justify-center mx-auto transition-colors">
                          <Upload className="size-7 text-rose-400" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                            CLICK OR DRAG PHOTO EVIDENCE HERE
                          </p>
                          <p className="text-[11px] font-mono text-slate-500">
                            SUPPORTED FORMATS: JPG, PNG, WEBP (MAX 5MB)
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-neutral-900 hover:bg-neutral-800 text-slate-300 font-mono font-bold py-4 rounded-xl border border-neutral-700 text-xs uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    BACK
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-2/3 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-mono font-extrabold py-4 rounded-xl shadow-lg shadow-rose-500/20 transition-all text-xs uppercase tracking-wider cursor-pointer active:scale-[0.99] flex items-center justify-center space-x-2"
                  >
                    <span>PROCEED TO LOCATION</span>
                    <ArrowRight className="size-4 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: LOCATION & SUBMIT */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
                    Grievance Location Address <span className="text-rose-500">*</span>
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <MapPin className="size-4 text-rose-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Type location address or auto-detect with GPS..."
                        className="w-full pl-11 pr-4 py-4 bg-black/80 text-white placeholder-slate-600 text-xs sm:text-sm rounded-xl border border-neutral-800 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 font-mono transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isLocating}
                      className="px-5 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-rose-400 text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {isLocating ? <Loader2 className="size-4 animate-spin" /> : <Crosshair className="size-4" />}
                      <span>{isLocating ? 'LOCATING...' : 'GPS AUTO-DETECT'}</span>
                    </button>
                  </div>
                </div>

                {/* Info Note */}
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-slate-400 text-xs font-mono leading-relaxed flex items-center space-x-3">
                  <ShieldCheck className="size-5 text-emerald-400 shrink-0" />
                  <span>
                    Your report will be automatically categorized, geotagged, and assigned to the local municipal authority SLA queue.
                  </span>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={isSubmitting}
                    className="w-1/3 bg-neutral-900 hover:bg-neutral-800 text-slate-300 font-mono font-bold py-4 rounded-xl border border-neutral-700 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    BACK
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-2/3 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-mono font-extrabold py-4 rounded-xl shadow-lg shadow-rose-500/25 transition-all text-xs uppercase tracking-wider cursor-pointer active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin text-white" />
                        <span>DISPATCHING REPORT...</span>
                      </>
                    ) : (
                      <>
                        <span>SUBMIT GRIEVANCE REPORT</span>
                        <ArrowRight className="size-4 text-white" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
