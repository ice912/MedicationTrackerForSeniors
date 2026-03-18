import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  CloudDownload, 
  Hospital, 
  Upload, 
  ShieldCheck, 
  ChevronRight,
  Loader2,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HospitalData {
  id: string;
  name: string;
  location: string;
}

export default function App() {
  const [view, setView] = useState<'home' | 'hospital-list' | 'connecting' | 'uploading' | 'success'>('home');
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<HospitalData | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (view === 'hospital-list') {
      fetch('/api/hospitals')
        .then(res => res.json())
        .then(data => setHospitals(data))
        .catch(err => console.error('Failed to fetch hospitals', err));
    }
  }, [view]);

  const handleConnectHospital = async (hospital: HospitalData) => {
    setSelectedHospital(hospital);
    setView('connecting');
    try {
      const response = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hospitalId: hospital.id })
      });
      const data = await response.json();
      if (data.success) {
        setStatusMessage(data.message);
        setTimeout(() => setView('success'), 500);
      }
    } catch (err) {
      console.error('Connection failed', err);
      setView('home');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setView('uploading');
      try {
        const response = await fetch('/api/upload', {
          method: 'POST'
        });
        const data = await response.json();
        if (data.success) {
          setStatusMessage(data.message);
          setTimeout(() => setView('success'), 500);
        }
      } catch (err) {
        console.error('Upload failed', err);
        setView('home');
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col min-h-screen bg-soft-gray">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="flex items-center space-x-4 max-w-lg mx-auto w-full">
          {view !== 'home' && view !== 'success' && (
            <button 
              onClick={() => setView('home')}
              aria-label="Go back" 
              className="p-2 -ml-2 text-senior-accent hover:bg-senior-blue rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}
          <h1 className="text-senior-title font-bold text-gray-800">Health Sync</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col px-6 py-8 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 flex flex-col h-full"
            >
              <section className="text-center space-y-4">
                <div className="flex justify-center mb-2">
                  <div className="bg-senior-blue p-6 rounded-full">
                    <CloudDownload className="w-12 h-12 text-senior-accent" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold leading-tight px-4">Connect Your Health Information</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Linking your records helps us automatically set up your medication schedule and appointment reminders for you.
                </p>
              </section>

              <section className="space-y-4">
                <button 
                  onClick={() => setView('hospital-list')}
                  className="w-full bg-senior-accent text-white rounded-2xl p-6 flex items-center justify-between shadow-lg active:scale-[0.98] transition-transform touch-target group"
                >
                  <div className="flex items-center space-x-4">
                    <Hospital className="w-8 h-8" />
                    <span className="text-xl font-bold">Connect My Hospital</span>
                  </div>
                  <ChevronRight className="w-6 h-6 opacity-70 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={triggerFileUpload}
                  className="w-full bg-white border-2 border-senior-accent text-senior-accent rounded-2xl p-6 flex items-center justify-between shadow-sm active:scale-[0.98] transition-transform touch-target group"
                >
                  <div className="flex items-center space-x-4">
                    <Upload className="w-8 h-8" />
                    <span className="text-xl font-bold">Upload Paper Records</span>
                  </div>
                  <ChevronRight className="w-6 h-6 opacity-70 group-hover:translate-x-1 transition-transform" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*,.pdf"
                />
              </section>

              <section className="mt-auto pt-8 border-t border-gray-100 text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-500 mb-4">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium uppercase tracking-wider">Secure & Private</span>
                </div>
                <p className="text-sm text-gray-400">
                  Your medical data is encrypted and only used to improve your care. We never share your records with third parties.
                </p>
              </section>
            </motion.div>
          )}

          {view === 'hospital-list' && (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-800">Select Your Hospital</h2>
              <div className="space-y-3">
                {hospitals.length === 0 ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-senior-accent" />
                  </div>
                ) : (
                  hospitals.map(hospital => (
                    <button
                      key={hospital.id}
                      onClick={() => handleConnectHospital(hospital)}
                      className="w-full bg-white p-5 rounded-xl border border-gray-200 text-left flex items-center justify-between hover:border-senior-accent transition-colors shadow-sm"
                    >
                      <div>
                        <p className="font-bold text-lg">{hospital.name}</p>
                        <p className="text-sm text-gray-500">{hospital.location}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {(view === 'connecting' || view === 'uploading') && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-grow flex flex-col items-center justify-center space-y-6 text-center"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-senior-blue rounded-full"></div>
                <Loader2 className="w-24 h-24 text-senior-accent animate-spin absolute top-0 left-0" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  {view === 'connecting' ? 'Connecting to Hospital...' : 'Processing Records...'}
                </h2>
                <p className="text-gray-500">
                  {view === 'connecting' 
                    ? `Securely linking with ${selectedHospital?.name}` 
                    : 'Analyzing your documents for important health details'}
                </p>
              </div>
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-grow flex flex-col items-center justify-center space-y-8 text-center"
            >
              <div className="bg-green-100 p-8 rounded-full">
                <CheckCircle2 className="w-20 h-20 text-green-600" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-gray-800">All Set!</h2>
                <p className="text-xl text-gray-600 px-4">
                  {statusMessage || "Your information has been successfully synced."}
                </p>
              </div>
              <button 
                onClick={() => setView('home')}
                className="bg-senior-accent text-white px-12 py-4 rounded-2xl text-xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Safe Area Spacer */}
      <div className="safe-area-bottom h-8"></div>
    </div>
  );
}
