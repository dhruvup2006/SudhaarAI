'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
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
  ShieldCheck
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

      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full relative z-10">
        
        {/* Portal Top Header & Multi-Step Wizard Indicator */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Lodge a civic grievance
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Multi-lingual voice AI, automated category classification & direct municipal SLA dispatch.
              </p>
            </div>

            <Link href="/" className="self-start sm:self-auto">
              <span className="text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1.5 bg-zinc-950/80 px-4 py-2 rounded-xl border border-zinc-800 transition-colors shadow-sm">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </span>
            </Link>
          </div>

          {/* Wizard Step Progress Bar (Sleek Rectangular Cards - No Pills) */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { num: 1, title: '01. Statement', desc: 'Voice or text description' },
              { num: 2, title: '02. Photo Evidence', desc: 'Upload photo (optional)' },
              { num: 3, title: '03. Location & Dispatch', desc: 'GPS & municipal SLA' }
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  step === s.num
                    ? 'bg-zinc-900/90 border-rose-500/80 ring-2 ring-rose-500/20 text-white shadow-lg shadow-rose-500/10'
                    : step > s.num
                    ? 'bg-zinc-950/80 border-rose-500/40 text-rose-400'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-slate-400 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold font-mono tracking-wide">{s.title}</span>
                  {step > s.num && <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />}
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:block mt-0.5">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Centered Main Form Glowing Red-Rose Card Container */}
        <div className="bg-[#0d1017]/95 backdrop-blur-2xl border border-rose-500/60 shadow-[0_0_30px_rgba(244,63,94,0.25)] rounded-3xl p-6 sm:p-8 relative overflow-hidden space-y-6">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500" />

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2.5 shadow-md">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: VOICE / TEXT STATEMENT */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Voice Recorder AI Hub */}
              <div className="p-6 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 space-y-4 shadow-inner relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Multi-Lingual Voice AI Input
                    </span>
                  </div>

                  {/* Language Selector Switcher */}
                  <div className="flex items-center space-x-1 bg-black p-1 rounded-xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setSelectedLang('en-IN')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
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
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        selectedLang === 'hi-IN'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      हिंदी (Hindi)
                    </button>
                  </div>
                </div>

                {/* Mic Recorder Button */}
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative shadow-xl ${
                      isListening
                        ? 'bg-rose-600 text-white ring-8 ring-rose-500/30 animate-pulse'
                        : 'bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white hover:scale-105 shadow-rose-500/20'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-8 h-8" />
                    ) : (
                      <Mic className="w-8 h-8" />
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-xs font-bold text-white">
                      {isListening ? `Recording... (${formatTimer(recordingSeconds)})` : 'Click microphone to speak your complaint'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isListening ? 'Speak clearly in your chosen language' : 'Automatic speech-to-text translation engine'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Text Area Description Input */}
              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Or Type Full Description <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {description.length} characters
                  </span>
                </div>

                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the civic issue in detail (e.g. Broken water pipe overflowing near main market gate)..."
                  className="w-full p-4 bg-black/90 text-white border border-zinc-800 rounded-xl font-sans text-xs sm:text-sm focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all placeholder-slate-600 shadow-inner"
                />

                {description && (
                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyText}
                      className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-rose-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClearText}
                      className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-rose-400 flex items-center space-x-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Continue Step 1 Button */}
              <div className="pt-2">
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
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-sm tracking-tight shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>Proceed to Photo Evidence</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: PHOTO ATTACHMENT */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Attach Photo Evidence (Optional)
                </label>
                
                {/* Photo Drop Zone */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-700 hover:border-rose-500/60 bg-zinc-950/60 p-8 rounded-2xl text-center space-y-3 cursor-pointer transition-all hover:bg-zinc-950/80 group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {photoPreview ? (
                    <div className="space-y-3">
                      <img
                        src={photoPreview}
                        alt="Uploaded evidence"
                        className="w-full max-h-56 object-cover rounded-xl border border-zinc-800 shadow-md mx-auto"
                      />
                      <p className="text-xs text-rose-400 font-semibold flex items-center justify-center space-x-1">
                        <Check className="w-4 h-4" />
                        <span>Photo attached successfully. Click to replace photo.</span>
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-slate-400 group-hover:text-white flex items-center justify-center mx-auto transition-colors">
                        <Upload className="w-6 h-6 text-rose-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Click or drag photo evidence here</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG or WEBP (Max 5MB)</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-zinc-900 hover:bg-zinc-800 text-slate-300 font-semibold py-3.5 rounded-xl border border-zinc-700 text-xs tracking-tight cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-500/25 transition-all text-sm tracking-tight cursor-pointer active:scale-[0.98]"
                >
                  Proceed to Location →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION & SUBMIT */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Specify Grievance Location Address <span className="text-rose-500">*</span>
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Type location address or click GPS Auto-Detect..."
                      className="w-full pl-10 pr-4 py-3.5 bg-black/90 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl border border-zinc-800 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 font-medium transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className="px-4 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-rose-400 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'GPS Auto-Detect'}</span>
                  </button>
                </div>
              </div>

              {/* Terms Notice */}
              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                By submitting this report, you certify that the grievance information is accurate and genuine for municipal resolution.
              </p>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                  className="w-1/3 bg-zinc-900 hover:bg-zinc-800 text-slate-300 font-semibold py-3.5 rounded-xl border border-zinc-700 text-xs tracking-tight cursor-pointer disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-2/3 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-500/25 transition-all text-sm tracking-tight cursor-pointer active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Grievance Report</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
}
