'use client';

import React, { useState } from 'react';
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
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  AlertCircle, 
  Image as ImageIcon,
  Loader2
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

  // Sample quick photo templates for mock upload
  const mockPhotos = [
    { label: 'Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80' },
    { label: 'Water Burst', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600&auto=format&fit=crop&q=80' },
    { label: 'Garbage Dump', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80' },
    { label: 'Power Pole', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80' }
  ];

  // Quick address pills
  const sampleLocations = [
    '5th Avenue & Oak Street',
    '742 Evergreen Terrace, Sector 4',
    'Central Market Square, Block B',
    'Highland Avenue & 14th Street'
  ];

  // Quick live prediction preview based on user text
  const getLivePreview = () => {
    const text = description.toLowerCase();
    if (text.includes('pothole') || text.includes('road') || text.includes('asphalt')) {
      return { category: 'Roads', urgency: text.includes('massive') || text.includes('urgent') ? 'High' : 'Medium' };
    }
    if (text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('drain')) {
      return { category: 'Water', urgency: text.includes('flooding') || text.includes('burst') ? 'High' : 'Medium' };
    }
    if (text.includes('garbage') || text.includes('waste') || text.includes('trash') || text.includes('dump')) {
      return { category: 'Sanitation', urgency: 'Medium' };
    }
    if (text.includes('electric') || text.includes('power') || text.includes('wire') || text.includes('pole')) {
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
        photo_url: photoPreview || mockPhotos[0].url
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
      setErrorMessage('Unable to connect to FastAPI backend on http://127.0.0.1:8000. Make sure the server is running.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Automated Grievance Classifier</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Report a Civic Issue</h1>
          <p className="text-sm text-slate-400">Complete 3 easy steps to route your grievance directly to authorities.</p>
        </div>

        {/* Multi-step Stepper Header */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 mb-8">
          <div className="flex items-center justify-between relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />
            
            {/* Step 1 */}
            <button
              onClick={() => setStep(1)}
              className={`relative z-10 flex flex-col items-center group focus:outline-none`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step === 1 ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-600/40' : step > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-700'
              }`}>
                {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <span className={`text-xs mt-1.5 font-medium ${step === 1 ? 'text-indigo-400' : 'text-slate-400'}`}>1. Details</span>
            </button>

            {/* Step 2 */}
            <button
              onClick={() => setStep(2)}
              className={`relative z-10 flex flex-col items-center group focus:outline-none`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step === 2 ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-600/40' : step > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-700'
              }`}>
                {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
              </div>
              <span className={`text-xs mt-1.5 font-medium ${step === 2 ? 'text-indigo-400' : 'text-slate-400'}`}>2. Photo</span>
            </button>

            {/* Step 3 */}
            <button
              onClick={() => setStep(3)}
              className={`relative z-10 flex flex-col items-center group focus:outline-none`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step === 3 ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-600/40' : 'bg-slate-900 text-slate-500 border border-slate-700'
              }`}>
                <MapPin className="w-5 h-5" />
              </div>
              <span className={`text-xs mt-1.5 font-medium ${step === 3 ? 'text-indigo-400' : 'text-slate-400'}`}>3. Location</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 1: Text Description */}
        {step === 1 && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <label className="block text-base font-semibold text-white mb-2">
                Describe the issue in detail <span className="text-indigo-400">*</span>
              </label>
              <p className="text-xs text-slate-400 mb-3">
                Include details like pothole size, severity of water leak, stinking garbage, or broken power line.
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Example: There is a massive pothole near 5th avenue intersection causing severe traffic bottlenecks and tire damage..."
                className="w-full p-4 bg-slate-900 text-white placeholder-slate-500 text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors leading-relaxed"
              />
            </div>

            {/* Live AI Real-Time Keyword Preview */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Real-Time AI Signal Detection</span>
                </div>
                <span className="text-[10px] text-slate-400">Live Preview</span>
              </div>
              
              <div className="flex items-center space-x-3 pt-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Predicted Dept:</span>
                  <CategoryBadge category={livePrediction.category} size="sm" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Urgency:</span>
                  <UrgencyBadge urgency={livePrediction.urgency} size="sm" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => {
                  if (!description.trim()) {
                    setErrorMessage('Please enter a description of the issue.');
                    return;
                  }
                  setErrorMessage('');
                  setStep(2);
                }}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
              >
                <span>Continue to Photo Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Upload Photo */}
        {step === 2 && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <label className="block text-base font-semibold text-white mb-2">
                Upload Photo Evidence (Optional)
              </label>
              <p className="text-xs text-slate-400 mb-4">
                Visual proof helps municipal engineers assess repair priorities faster.
              </p>

              {/* Upload Drop Zone */}
              <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-900/60 rounded-2xl p-8 text-center transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {photoPreview ? (
                  <div className="space-y-3">
                    <img
                      src={photoPreview}
                      alt="Grievance preview"
                      className="max-h-48 mx-auto rounded-xl border border-slate-700 object-cover shadow-lg"
                    />
                    <p className="text-xs text-emerald-400 font-medium">Photo attached successfully! Click to change.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-indigo-400 hover:underline">Click to upload image</span>
                      <span className="text-sm text-slate-400"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG or WEBP up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Mock Sample Photos */}
            <div>
              <span className="text-xs text-slate-400 block mb-2 font-medium">Or select a mock sample image for testing:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {mockPhotos.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhotoPreview(item.url)}
                    className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                      photoPreview === item.url ? 'border-indigo-500 bg-indigo-950/60 text-white' : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <img src={item.url} alt={item.label} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                    <span className="text-xs font-medium truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors flex items-center space-x-2 border border-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
              >
                <span>Continue to Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <label className="block text-base font-semibold text-white mb-2">
                Incident Location <span className="text-indigo-400">*</span>
              </label>
              <p className="text-xs text-slate-400 mb-3">
                Specify street name, landmark, ward number, or building address.
              </p>

              <div className="relative">
                <MapPin className="w-5 h-5 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. 5th Avenue & Oak Street, Ward 12"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-900 text-white placeholder-slate-500 text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Quick Sample Location Pills */}
            <div>
              <span className="text-xs text-slate-400 block mb-2 font-medium">Quick Location Presets:</span>
              <div className="flex flex-wrap gap-2">
                {sampleLocations.map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-950/60 border border-slate-700 text-xs text-slate-300 hover:text-indigo-300 transition-colors"
                  >
                    + {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Box Before Final Submit */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Submission Review</h4>
              <div className="space-y-1 text-xs text-slate-400">
                <p><span className="text-slate-200 font-medium">Description:</span> {description || 'Not provided'}</p>
                <p><span className="text-slate-200 font-medium">Location:</span> {location || 'Not provided'}</p>
                <p><span className="text-slate-200 font-medium">Photo:</span> {photoPreview ? 'Attached' : 'Mock photo will be auto-attached'}</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors flex items-center space-x-2 border border-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition-all flex items-center space-x-2 shadow-xl shadow-indigo-600/30 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI Engine Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-300" />
                    <span>Submit & Run AI Classifier</span>
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
