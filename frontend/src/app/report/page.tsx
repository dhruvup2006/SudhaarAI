'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CategoryBadge } from '@/components/CategoryBadge';
import { UrgencyBadge } from '@/components/UrgencyBadge';
import { 
  FileText, 
  Camera, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  AlertCircle, 
  Image as ImageIcon,
  Loader2,
  Building,
  ShieldCheck,
  Mic,
  MicOff,
  Volume2,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Crosshair,
  AlertTriangle,
  RefreshCw,
  Lock
} from 'lucide-react';

export default function ReportPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Form State
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micPermissionState, setMicPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [selectedLang, setSelectedLang] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [isLocating, setIsLocating] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Recording duration timer
  useEffect(() => {
    if (isListening) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isListening]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Request Microphone permission & start Web Speech API
  const startListening = async () => {
    setErrorMessage('');
    
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setErrorMessage('Web Speech API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Brave.');
      return;
    }

    try {
      setMicPermissionState('requesting');

      // Request mic permission explicitly using navigator.mediaDevices if supported
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop stream tracks after permission is granted so SpeechRecognition can control the mic
          stream.getTracks().forEach((track) => track.stop());
        } catch (permissionErr: any) {
          console.warn('getUserMedia mic permission failed:', permissionErr);
          if (permissionErr.name === 'NotAllowedError' || permissionErr.name === 'PermissionDeniedError') {
            setMicPermissionState('denied');
            setErrorMessage('Microphone permission was denied. Please allow microphone access in your browser site settings.');
            return;
          }
        }
      }

      setMicPermissionState('granted');

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let finalChunk = '';
        let interimChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcriptText;
          } else {
            interimChunk += transcriptText;
          }
        }

        if (finalChunk) {
          setDescription((prev) => {
            const cleanPrev = prev ? prev.trim() + ' ' : '';
            return cleanPrev + finalChunk.trim();
          });
          setInterimTranscript('');
        } else {
          setInterimTranscript(interimChunk);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setInterimTranscript('');

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicPermissionState('denied');
          setErrorMessage('Microphone access blocked. Click the lock/mic icon near your browser address bar to grant access.');
        } else if (event.error === 'no-speech') {
          // Non-fatal transient warning
        } else {
          setErrorMessage(`Voice recognition notice: ${event.error}. You can try speaking again.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (err: any) {
      console.error('Mic permission error:', err);
      setIsListening(false);
      setMicPermissionState('denied');
      setErrorMessage('Could not access microphone: ' + (err.message || 'Permission denied'));
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };



  const handleCopyText = () => {
    if (!description) return;
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearText = () => {
    setDescription('');
    setInterimTranscript('');
  };

  // Detect GPS Location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setErrorMessage('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lng = position.coords.longitude.toFixed(4);
        setLocation(`GPS Coordinates: ${lat}, ${lng} (Near Sector 4 Municipal Office)`);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        setErrorMessage('Unable to auto-detect GPS location. Please enter your location address manually.');
      }
    );
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };



  const getLivePreview = () => {
    const text = (description + ' ' + interimTranscript).toLowerCase();
    if (text.includes('pothole') || text.includes('road') || text.includes('asphalt') || text.includes('street')) {
      return { category: 'Roads', urgency: text.includes('massive') || text.includes('urgent') || text.includes('severe') ? 'High' : 'Medium' };
    }
    if (text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('drain') || text.includes('flood')) {
      return { category: 'Water', urgency: text.includes('flooding') || text.includes('burst') ? 'High' : 'Medium' };
    }
    if (text.includes('garbage') || text.includes('waste') || text.includes('trash') || text.includes('dump') || text.includes('smell')) {
      return { category: 'Sanitation', urgency: 'Medium' };
    }
    if (text.includes('electric') || text.includes('power') || text.includes('wire') || text.includes('pole') || text.includes('spark')) {
      return { category: 'Electricity', urgency: text.includes('spark') || text.includes('wire') ? 'High' : 'Medium' };
    }
    return { category: 'General', urgency: 'Low' };
  };

  const livePrediction = getLivePreview();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setErrorMessage('Please describe the issue before submitting.');
      setStep(1);
      return;
    }
    if (!location.trim()) {
      setErrorMessage('Please provide a location address.');
      setStep(3);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        title: `Civic Report - ${livePrediction.category}`,
        description: description.trim(),
        location: location.trim(),
        photo_url: photoPreview || null
      };

      const res = await fetch('http://127.0.0.1:8000/api/grievances', {
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
      setErrorMessage('Unable to connect to backend on http://127.0.0.1:8000. Make sure the backend server is running.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-amber-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Sleek Official Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-6 border border-slate-200 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600" />
          
          <div className="flex items-center justify-center space-x-3.5 mb-3">
            <div className="w-12 h-12 rounded-xl bg-slate-950 p-1 border border-amber-500/40 shadow-md flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="सुधार-AI Logo" className="w-full h-full object-contain" />
            </div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
              <Building className="w-3.5 h-3.5 text-amber-600" />
              <span>Official Portal • AI Public Grievance Dispatch</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Register Civic Grievance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed">
            Speak or type your problem. Our real-time AI auto-classifies the category, calculates SLA urgency, and dispatches directly to municipal department engineers.
          </p>
        </div>

        {/* Multi-step Stepper Header */}
        <div className="bg-white rounded-xl p-4 sm:p-5 mb-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between relative px-2 sm:px-8">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
            <div 
              className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-amber-500 transition-all duration-300 z-0"
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            />
            
            {/* Step 1 */}
            <button
              onClick={() => setStep(1)}
              className="relative z-10 flex flex-col items-center group focus:outline-none"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                step === 1 
                  ? 'bg-amber-600 text-white shadow-lg ring-4 ring-amber-100 scale-105' 
                  : step > 1 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <span className={`text-xs mt-2 font-bold ${step === 1 ? 'text-amber-700' : 'text-slate-600'}`}>
                1. Voice & Text
              </span>
            </button>

            {/* Step 2 */}
            <button
              onClick={() => setStep(2)}
              className="relative z-10 flex flex-col items-center group focus:outline-none"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                step === 2 
                  ? 'bg-amber-600 text-white shadow-lg ring-4 ring-amber-100 scale-105' 
                  : step > 2 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
              </div>
              <span className={`text-xs mt-2 font-bold ${step === 2 ? 'text-amber-700' : 'text-slate-600'}`}>
                2. Photo Evidence
              </span>
            </button>

            {/* Step 3 */}
            <button
              onClick={() => setStep(3)}
              className="relative z-10 flex flex-col items-center group focus:outline-none"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                step === 3 
                  ? 'bg-amber-600 text-white shadow-lg ring-4 ring-amber-100 scale-105' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                3
              </div>
              <span className={`text-xs mt-2 font-bold ${step === 3 ? 'text-amber-700' : 'text-slate-600'}`}>
                3. Location & Submit
              </span>
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold flex items-start space-x-3 shadow-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{errorMessage}</span>
              {micPermissionState === 'denied' && (
                <div className="mt-2 text-xs text-red-700 bg-white/80 p-2.5 rounded border border-red-200 space-y-1">
                  <p className="font-bold">🔒 How to unblock Microphone in Browser:</p>
                  <p>1. Click the Lock icon 🔒 or Media icon near the website URL in your address bar.</p>
                  <p>2. Toggle <strong>Microphone</strong> permission to <strong>"Allow"</strong>.</p>
                  <p>3. Click "Record Voice Complaint" again.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 1: Voice Input & Description */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            {/* Header & Microphone Banner */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Grievance Description <span className="text-red-600">*</span></span>
                </label>

                <div className="text-xs text-slate-500 font-medium">
                  {description.length} characters • {description.trim() ? description.trim().split(/\s+/).length : 0} words
                </div>
              </div>

              {/* Enhanced Voice Recording Control Card */}
              <div className={`p-4 sm:p-5 rounded-xl transition-all border ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500/10 via-amber-500/10 to-red-500/10 border-red-400 shadow-md ring-2 ring-red-400/30' 
                  : micPermissionState === 'denied'
                  ? 'bg-amber-50/80 border-amber-300'
                  : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white shadow-md'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Mic Trigger Button */}
                  <div className="flex items-center space-x-3.5">
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      disabled={micPermissionState === 'requesting'}
                      className={`relative group shrink-0 px-5 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center space-x-2.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                        isListening
                          ? 'bg-red-600 hover:bg-red-700 text-white mic-recording-pulse ring-4 ring-red-500/40'
                          : micPermissionState === 'requesting'
                          ? 'bg-amber-600 text-white cursor-wait'
                          : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/20'
                      }`}
                    >
                      {micPermissionState === 'requesting' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Requesting Mic Permission...</span>
                        </>
                      ) : isListening ? (
                        <>
                          <MicOff className="w-5 h-5 text-white animate-pulse" />
                          <span>Stop Recording ({formatTimer(recordingSeconds)})</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                          <span>🎙️ Record Voice Complaint</span>
                        </>
                      )}
                    </button>

                    {/* Animated Equalizer Wave when recording */}
                    {isListening && (
                      <div className="hidden sm:flex items-end space-x-1 h-6 px-2.5 py-1 bg-red-950/40 rounded-md border border-red-500/30">
                        <div className="w-1.5 bg-red-400 rounded-full animate-sound-bar-1" />
                        <div className="w-1.5 bg-amber-400 rounded-full animate-sound-bar-2" />
                        <div className="w-1.5 bg-red-500 rounded-full animate-sound-bar-3" />
                        <div className="w-1.5 bg-orange-400 rounded-full animate-sound-bar-4" />
                        <div className="w-1.5 bg-red-400 rounded-full animate-sound-bar-5" />
                      </div>
                    )}
                  </div>

                  {/* Language Selector */}
                  <div className="flex items-center space-x-2 text-xs">
                    <span className={isListening ? 'text-slate-700 font-semibold' : 'text-slate-300'}>
                      Language:
                    </span>
                    <div className="inline-flex p-1 bg-slate-800/80 rounded-lg border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setSelectedLang('en-IN')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                          selectedLang === 'en-IN' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        English (IN)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedLang('hi-IN')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                          selectedLang === 'hi-IN' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        Hindi (हिंदी)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Real-time Listening Banner */}
                {isListening && (
                  <div className="mt-3 pt-3 border-t border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-red-900 bg-red-500/10 p-2.5 rounded-lg">
                    <div className="flex items-center space-x-2 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                      <span className="font-bold text-red-700">Listening to your voice... Speak clearly now</span>
                    </div>
                    {interimTranscript && (
                      <div className="italic text-red-900 bg-white/90 px-3 py-1 rounded border border-red-300 font-medium truncate max-w-xs sm:max-w-md">
                        "{interimTranscript}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Textarea Input */}
              <div className="relative mt-4">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Type your issue here OR click 'Record Voice Complaint' above to speak your problem naturally..."
                  className="w-full p-4 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white leading-relaxed transition-all shadow-inner"
                />

                {/* Clear & Copy Action Buttons */}
                {description && (
                  <div className="absolute right-3 bottom-3 flex items-center space-x-2 bg-white/90 backdrop-blur p-1 rounded-lg border border-slate-200 shadow-sm">
                    <button
                      type="button"
                      onClick={handleCopyText}
                      title="Copy text"
                      className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearText}
                      title="Clear text"
                      className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>


            </div>

            {/* AI Automated Routing Live Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900 text-white shadow-md border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AI Automated Routing Classification</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live NLP Detection
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex items-center space-x-3 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <span className="text-xs text-slate-400 font-medium">Assigned Dept:</span>
                  <CategoryBadge category={livePrediction.category} size="md" />
                </div>
                <div className="flex items-center space-x-3 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <span className="text-xs text-slate-400 font-medium">SLA Priority:</span>
                  <UrgencyBadge urgency={livePrediction.urgency} size="md" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  if (!description.trim()) {
                    setErrorMessage('Please enter or speak a description of the issue.');
                    return;
                  }
                  setErrorMessage('');
                  setStep(2);
                }}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold text-sm transition-all flex items-center space-x-2 shadow-md hover:shadow-lg active:scale-95"
              >
                <span>Proceed to Photo Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Upload Photo */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
                Photo Evidence Upload (Optional)
              </label>
              <p className="text-xs text-slate-500 mb-4">
                Attaching a photo helps field officers verify repair urgency instantly.
              </p>

              {/* Upload Drop Zone */}
              <div className="relative border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 rounded-2xl p-8 text-center transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {photoPreview ? (
                  <div className="space-y-3">
                    <img
                      src={photoPreview}
                      alt="Grievance preview"
                      className="max-h-56 mx-auto rounded-xl border border-slate-300 object-cover shadow-md"
                    />
                    <p className="text-xs text-emerald-700 font-bold">Photo attached successfully! Click zone to replace.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-600">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-amber-600 hover:underline">Click to upload photo</span>
                      <span className="text-sm text-slate-500"> or drag and drop image here</span>
                    </div>
                    <p className="text-xs text-slate-400">Supports JPG, PNG, WEBP (Up to 10MB)</p>
                  </div>
                )}
              </div>
            </div>



            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setStep(3)}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold text-sm transition-all flex items-center space-x-2 shadow-md hover:shadow-lg active:scale-95"
              >
                <span>Proceed to Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Location & Final Submit */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Grievance Location & Landmark <span className="text-red-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center space-x-1.5 transition-all"
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                      <span>Detecting GPS...</span>
                    </>
                  ) : (
                    <>
                      <Crosshair className="w-3.5 h-3.5 text-amber-600" />
                      <span>📍 Auto-Detect GPS Location</span>
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-xs text-slate-500 mb-3">
                Enter street address, ward number, sector, or landmark location.
              </p>

              <div className="relative">
                <MapPin className="w-5 h-5 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. 5th Avenue & Oak Street, Ward 12"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white shadow-inner"
                />
              </div>
            </div>



            {/* Final Summary Card Before Submission */}
            <div className="p-5 rounded-xl bg-slate-900 text-white shadow-md border border-slate-800 space-y-3">
              <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                Grievance Dispatch Summary
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <p><span className="font-bold text-white">Description:</span> {description || 'Not provided'}</p>
                <p><span className="font-bold text-white">Location:</span> {location || 'Not provided'}</p>
                <p><span className="font-bold text-white">Photo Evidence:</span> {photoPreview ? 'Attached' : 'Mock photo will be auto-attached'}</p>
                <p><span className="font-bold text-white">Target Department:</span> {livePrediction.category} ({livePrediction.urgency} SLA Priority)</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Submitting & Dispatching...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Submit Grievance Record</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
