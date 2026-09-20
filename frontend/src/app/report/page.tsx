'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
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
  FileText,
  Camera,
  ShieldCheck,
  Heart
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
    <div className="h-screen max-h-screen bg-[#0d1017] text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white relative overflow-hidden font-sans">
      {/* CONSTANT TRICOLOR BACKGROUND SETUP */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-75 pointer-events-none z-0"
        style={{ backgroundImage: `url('/login-bg.jpg')` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/90 via-[#0d1017]/85 to-black/95 pointer-events-none z-0" />

      {/* Tricolor Ambient Glow Spheres (CONSTANT TRICOLOR BG) */}
      <div className="fixed top-12 left-12 w-96 h-96 bg-rose-600/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-12 right-12 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/2 right-1/4 w-80 h-80 bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar />

      <main className="flex-1 flex flex-col justify-between py-2 sm:py-3 px-4 sm:px-6 max-w-5xl mx-auto w-full relative z-10 overflow-hidden space-y-3 sm:space-y-4">
        
        {/* COMPACT HEADER */}
        <div className="flex flex-row items-center justify-between gap-4 border-b border-neutral-800/80 pb-2.5 shrink-0">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
              High Velocity{' '}
              <span className="bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Dispatch.
              </span>
            </h1>
          </div>
          <Link href="/">
            <span className="text-[11px] font-mono font-semibold text-slate-300 hover:text-white flex items-center space-x-1.5 bg-neutral-950/80 px-3.5 py-1.5 rounded-lg border border-neutral-800 hover:border-rose-500/50 transition-all shadow-sm">
              <ArrowLeft className="size-3" />
              <span>HOME</span>
            </span>
          </Link>
        </div>

        {/* CLEAN 3 BOXES GRID (Statement, Photo Upload, Location) */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
          {[
            {
              stepNum: 1,
              title: "Statement",
              color: "from-rose-500/30",
              icon: FileText,
              desc: "Voice AI or text grievance description"
            },
            {
              stepNum: 2,
              title: "Photo Upload",
              color: "from-amber-500/30",
              icon: Camera,
              desc: "Attach image evidence"
            },
            {
              stepNum: 3,
              title: "Location",
              color: "from-emerald-500/30",
              icon: MapPin,
              desc: "GPS auto-detect or address"
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
                  "group text-left relative bg-neutral-950/90 border rounded-xl p-3 sm:p-4 overflow-hidden transition-all duration-300 cursor-pointer backdrop-blur-xl",
                  isActive
                    ? "border-rose-500 ring-2 ring-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
                    : isDone
                    ? "border-rose-500/40 opacity-90"
                    : "border-neutral-800/80 hover:border-neutral-700 opacity-70 hover:opacity-100"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                    card.color,
                    isActive && "opacity-100"
                  )}
                />
                <div className="relative z-10 flex flex-col justify-between h-full space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "size-8 rounded-lg flex items-center justify-center transition-colors",
                      isActive ? "bg-rose-500 text-white" : "bg-white/10 text-white"
                    )}>
                      <card.icon className="size-4" />
                    </div>
                    {isDone && (
                      <CheckCircle2 className="size-4 text-rose-400 shrink-0" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-mono text-slate-400 line-clamp-1 mt-0.5">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* COMPACT MAIN FORM CONTAINER */}
        <div className="relative bg-neutral-950/95 border border-neutral-800/90 rounded-2xl p-4 sm:p-5 overflow-hidden shadow-2xl backdrop-blur-2xl flex-1 flex flex-col justify-between min-h-0">
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#252525_0px_1px,transparent_1px_8px)] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
          
          {/* Top Tricolor Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-500 z-10" />

          <div className="relative z-10 flex-1 flex flex-col justify-between space-y-3 min-h-0">

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2 shrink-0">
                <AlertCircle className="size-4 text-rose-400 shrink-0" />
                <span className="truncate">{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: STATEMENT (COMPACT MINIMIZED VOICE AI) */}
            {step === 1 && (
              <div className="flex-1 flex flex-col justify-between space-y-3 min-h-0">
                
                {/* Minimized Voice Bar */}
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={cn(
                        "size-11 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md",
                        isListening
                          ? "bg-rose-600 text-white ring-4 ring-rose-500/30 animate-pulse"
                          : "bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white hover:scale-105"
                      )}
                    >
                      {isListening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
                    </button>
                    <div>
                      <p className="text-xs font-mono font-bold text-white uppercase">
                        {isListening ? `Recording (${formatTimer(recordingSeconds)})` : 'Voice AI Recorder'}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {isListening ? 'Speak your complaint clearly' : 'Click mic to speak in English or Hindi'}
                      </p>
                    </div>
                  </div>

                  {/* Language Switcher */}
                  <div className="flex items-center space-x-1 bg-black p-1 rounded-lg border border-neutral-800 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedLang('en-IN')}
                      className={cn(
                        "px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all",
                        selectedLang === 'en-IN' ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"
                      )}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLang('hi-IN')}
                      className={cn(
                        "px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all",
                        selectedLang === 'hi-IN' ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"
                      )}
                    >
                      हिंदी
                    </button>
                  </div>
                </div>

                {/* Text Area Description Input */}
                <div className="flex-1 flex flex-col justify-between space-y-1.5 min-h-0">
                  <div className="flex items-center justify-between shrink-0">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                      Grievance Description <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">
                      {description.length} CHARS
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the civic issue in detail (e.g. Overflowing sewage pipe near Market Road gate)..."
                    className="w-full flex-1 p-3 bg-black/80 text-white border border-neutral-800 rounded-xl font-mono text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 transition-all placeholder-slate-600 resize-none min-h-[70px]"
                  />

                  {description && (
                    <div className="flex items-center justify-end space-x-2 pt-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopyText}
                        className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-[10px] font-mono text-slate-300 hover:text-white flex items-center space-x-1"
                      >
                        {copied ? <Check className="size-3 text-rose-400" /> : <Copy className="size-3" />}
                        <span>{copied ? 'COPIED' : 'COPY'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleClearText}
                        className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-[10px] font-mono text-slate-300 hover:text-rose-400 flex items-center space-x-1"
                      >
                        <Trash2 className="size-3" />
                        <span>CLEAR</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Next Button */}
                <div className="shrink-0 pt-1">
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
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-mono font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99]"
                  >
                    <span>PROCEED TO PHOTO UPLOAD</span>
                    <ArrowRight className="size-3.5 text-white" />
                  </button>
                </div>

              </div>
            )}

            {/* STEP 2: PHOTO UPLOAD */}
            {step === 2 && (
              <div className="flex-1 flex flex-col justify-between space-y-3 min-h-0">
                <div className="space-y-2 flex-1 flex flex-col justify-center">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                    Attach Photo Evidence (Optional)
                  </label>
                  
                  {/* Photo Drop Zone */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-700 hover:border-rose-500/80 bg-black/60 p-6 rounded-xl text-center space-y-2 cursor-pointer transition-all hover:bg-black/80 group flex flex-col items-center justify-center"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {photoPreview ? (
                      <div className="space-y-2">
                        <img
                          src={photoPreview}
                          alt="Uploaded evidence"
                          className="max-h-36 object-cover rounded-lg border border-neutral-800 shadow-md mx-auto"
                        />
                        <p className="text-[11px] font-mono text-rose-400 font-bold flex items-center justify-center space-x-1">
                          <Check className="size-3.5" />
                          <span>PHOTO ATTACHED. CLICK TO REPLACE.</span>
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="size-10 rounded-xl bg-neutral-900 border border-neutral-800 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
                          <Upload className="size-5 text-rose-400" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-mono font-bold text-white uppercase">
                            CLICK OR DRAG PHOTO HERE
                          </p>
                          <p className="text-[10px] font-mono text-slate-500">
                            JPG, PNG, WEBP (MAX 5MB)
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-neutral-900 hover:bg-neutral-800 text-slate-300 font-mono font-bold py-2.5 rounded-xl border border-neutral-700 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    BACK
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-2/3 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-mono font-extrabold py-2.5 rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer active:scale-[0.99] flex items-center justify-center space-x-2"
                  >
                    <span>PROCEED TO LOCATION</span>
                    <ArrowRight className="size-3.5 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: LOCATION & SUBMIT */}
            {step === 3 && (
              <div className="flex-1 flex flex-col justify-between space-y-3 min-h-0">
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                    Grievance Location Address <span className="text-rose-500">*</span>
                  </label>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <MapPin className="size-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Type location address or auto-detect with GPS..."
                        className="w-full pl-10 pr-3 py-2.5 bg-black/80 text-white placeholder-slate-600 text-xs rounded-xl border border-neutral-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isLocating}
                      className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-rose-400 text-xs font-mono font-bold flex items-center justify-center space-x-1.5 shrink-0 disabled:opacity-50"
                    >
                      {isLocating ? <Loader2 className="size-3.5 animate-spin" /> : <Crosshair className="size-3.5" />}
                      <span>{isLocating ? 'LOCATING...' : 'GPS DETECT'}</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-slate-400 text-[11px] font-mono flex items-center space-x-2.5">
                    <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                    <span>Automatically categorized, geotagged & assigned to municipal SLA queue.</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={isSubmitting}
                    className="w-1/3 bg-neutral-900 hover:bg-neutral-800 text-slate-300 font-mono font-bold py-2.5 rounded-xl border border-neutral-700 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    BACK
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-2/3 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-mono font-extrabold py-2.5 rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin text-white" />
                        <span>DISPATCHING REPORT...</span>
                      </>
                    ) : (
                      <>
                        <span>SUBMIT GRIEVANCE REPORT</span>
                        <ArrowRight className="size-3.5 text-white" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </main>

      {/* MINIMAL FOOTER STRIP TO ENSURE NO VERTICAL SCROLLING */}
      <footer className="border-t border-neutral-800/80 bg-black/90 py-2 px-4 text-center text-[10px] font-mono text-slate-400 shrink-0 relative z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span>© 2026 Sudhaar AI • Govt Resolution Platform</span>
          <span className="hidden sm:inline">Toll-Free Helpline: 1800-11-SUDHAAR</span>
        </div>
      </footer>
    </div>
  );
}
