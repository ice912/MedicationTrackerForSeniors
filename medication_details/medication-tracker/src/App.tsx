import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Clock, 
  Utensils, 
  AlertCircle, 
  RotateCcw, 
  CheckCircle2,
  Calendar,
  Archive,
  HelpCircle
} from 'lucide-react';

interface Instruction {
  type: string;
  text: string;
  subtext: string;
  icon: string;
}

interface Medication {
  name: string;
  dosage: string;
  purpose: string;
  instructions: Instruction[];
  lastTaken: string;
  pillImageUrl: string;
}

export default function App() {
  const [medication, setMedication] = useState<Medication | null>(null);
  const [isTaken, setIsTaken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/medication')
      .then(res => res.json())
      .then(data => {
        setMedication(data);
        setLoading(false);
      });
  }, []);

  const handleMarkTaken = async () => {
    if (isTaken) return;
    
    try {
      const response = await fetch('/api/medication/take', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setIsTaken(true);
        setMedication(prev => prev ? { ...prev, lastTaken: data.lastTaken } : null);
      }
    } catch (error) {
      console.error('Error marking as taken:', error);
    }
  };

  if (loading || !medication) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-md">
        <div className="flex items-center gap-4 mb-2">
          <button aria-label="Go back" className="p-2 -ml-2 hover:bg-blue-700 rounded-full transition-colors">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <h1 className="text-3xl font-bold tracking-tight">{medication.name}</h1>
        </div>
        <p className="text-blue-100 text-lg">{medication.dosage}</p>
      </header>

      {/* Main Content */}
      <main className="p-5 max-w-lg mx-auto space-y-6 pb-24">
        {/* Purpose Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-500 uppercase tracking-wide mb-3">What is this for?</h2>
          <p className="text-2xl font-medium leading-snug">
            {medication.purpose}
          </p>
        </motion.section>

        {/* Dosage Instructions Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-500 uppercase tracking-wide mb-3">How to take</h2>
          <div className="space-y-4">
            {medication.instructions.map((inst, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${inst.icon === 'clock' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                  {inst.icon === 'clock' ? (
                    <Clock className="w-6 h-6 text-blue-700" />
                  ) : (
                    <Utensils className="w-6 h-6 text-orange-700" />
                  )}
                </div>
                <div>
                  <p className="text-xl font-bold">{inst.text}</p>
                  <p className="text-gray-600 text-lg">{inst.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Visual Aid Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full flex justify-center py-2"
        >
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center w-full">
            <p className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Your Pill Looks Like This</p>
            <img 
              alt={`Visual representation of the ${medication.name} pill`} 
              className="mx-auto rounded-lg max-w-full h-auto border border-gray-100" 
              src={medication.pillImageUrl}
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Action Section */}
        <section className="pt-4">
          <button 
            id="mark-taken-btn"
            onClick={handleMarkTaken}
            disabled={isTaken}
            className={`w-full font-bold py-6 px-8 rounded-2xl shadow-lg transition-all active:scale-95 flex flex-col items-center justify-center gap-2 ${
              isTaken 
                ? 'bg-gray-400 cursor-default' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <span className="text-3xl uppercase tracking-wider flex items-center gap-2">
              {isTaken && <CheckCircle2 className="w-8 h-8" />}
              {isTaken ? 'Marked as Taken!' : 'Mark as Taken'}
            </span>
            <span className="text-lg font-normal opacity-90">
              Last taken: {medication.lastTaken}
            </span>
          </button>

          <div className="mt-8 flex gap-4">
            <button className="flex-1 bg-white border-2 border-gray-200 py-4 px-4 rounded-xl font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <AlertCircle className="w-6 h-6 text-gray-500" />
              Side Effects
            </button>
            <button className="flex-1 bg-white border-2 border-gray-200 py-4 px-4 rounded-xl font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <RotateCcw className="w-6 h-6 text-gray-500" />
              Refill Soon
            </button>
          </div>
        </section>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center z-50">
        <div className="flex flex-col items-center text-blue-600 cursor-pointer">
          <Calendar className="w-8 h-8" />
          <span className="text-xs font-bold">Today</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
          <Archive className="w-8 h-8" />
          <span className="text-xs font-bold">Cabinet</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
          <HelpCircle className="w-8 h-8" />
          <span className="text-xs font-bold">Help</span>
        </div>
      </footer>
    </div>
  );
}
