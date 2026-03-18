import React, { useState, useEffect } from 'react';
import { Sun, Sunrise, Moon, CheckCircle2, Clock, Plus, Home, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Medication {
  id: string;
  name: string;
  description: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  taken: boolean;
  lastTakenDate: string | null;
}

export default function App() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', description: '', timeOfDay: 'Morning' as const });

  const fetchMedications = async () => {
    try {
      const response = await fetch('/api/medications');
      const data = await response.json();
      setMedications(data);
    } catch (error) {
      console.error('Failed to fetch medications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleTakeMed = async (id: string) => {
    try {
      const response = await fetch(`/api/medications/${id}/take`, {
        method: 'POST',
      });
      if (response.ok) {
        setMedications(prev =>
          prev.map(med =>
            med.id === id ? { ...med, taken: true, lastTakenDate: new Date().toISOString().split('T')[0] } : med
          )
        );
      }
    } catch (error) {
      console.error('Failed to mark medication as taken:', error);
    }
  };

  const handleAddMed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMed),
      });
      if (response.ok) {
        const addedMed = await response.json();
        setMedications(prev => [...prev, addedMed]);
        setShowAddModal(false);
        setNewMed({ name: '', description: '', timeOfDay: 'Morning' });
      }
    } catch (error) {
      console.error('Failed to add medication:', error);
    }
  };

  const groupedMeds = {
    Morning: medications.filter(m => m.timeOfDay === 'Morning'),
    Afternoon: medications.filter(m => m.timeOfDay === 'Afternoon'),
    Evening: medications.filter(m => m.timeOfDay === 'Evening'),
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5]">
        <div className="text-2xl font-bold text-gray-600 animate-pulse">Loading your meds...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#2C3E50] p-4 pb-24 font-sans">
      <header className="mb-8 pt-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Daily Meds</h1>
        <p className="text-xl text-gray-600 font-semibold">{today}</p>
      </header>

      <main className="space-y-8">
        <MedicationGroup
          title="Morning"
          icon={<Sunrise className="w-8 h-8 text-orange-600" />}
          iconBg="bg-orange-100"
          meds={groupedMeds.Morning}
          onTake={handleTakeMed}
        />
        <MedicationGroup
          title="Afternoon"
          icon={<Sun className="w-8 h-8 text-yellow-600" />}
          iconBg="bg-yellow-100"
          meds={groupedMeds.Afternoon}
          onTake={handleTakeMed}
        />
        <MedicationGroup
          title="Evening"
          icon={<Moon className="w-8 h-8 text-indigo-600" />}
          iconBg="bg-indigo-100"
          meds={groupedMeds.Evening}
          onTake={handleTakeMed}
        />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-100 px-6 py-4 flex justify-around items-center shadow-2xl">
        <button className="flex flex-col items-center text-orange-600">
          <Home className="w-8 h-8" />
          <span className="text-xs font-bold uppercase mt-1">Home</span>
        </button>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex flex-col items-center text-gray-400 hover:text-orange-600 transition-colors"
        >
          <Plus className="w-8 h-8" />
          <span className="text-xs font-bold uppercase mt-1">Add New</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <User className="w-8 h-8" />
          <span className="text-xs font-bold uppercase mt-1">Profile</span>
        </button>
      </nav>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Add Medication</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-8 h-8" />
                </button>
              </div>
              <form onSubmit={handleAddMed} className="space-y-6">
                <div>
                  <label className="block text-lg font-bold mb-2">Name</label>
                  <input
                    required
                    type="text"
                    value={newMed.name}
                    onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                    className="w-full p-4 text-xl border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-0"
                    placeholder="e.g. Lisinopril"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-2">What is it for?</label>
                  <input
                    required
                    type="text"
                    value={newMed.description}
                    onChange={e => setNewMed({ ...newMed, description: e.target.value })}
                    className="w-full p-4 text-xl border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-0"
                    placeholder="e.g. Blood pressure"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-2">Time of Day</label>
                  <select
                    value={newMed.timeOfDay}
                    onChange={e => setNewMed({ ...newMed, timeOfDay: e.target.value as any })}
                    className="w-full p-4 text-xl border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-0"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-5 rounded-2xl text-2xl font-bold shadow-lg border-b-4 border-orange-700 active:translate-y-1 active:border-b-0 transition-all"
                >
                  SAVE MEDICATION
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MedicationGroupProps {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  meds: Medication[];
  onTake: (id: string) => void;
}

function MedicationGroup({ title, icon, iconBg, meds, onTake }: MedicationGroupProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <span className={`p-2 ${iconBg} rounded-full`}>
          {icon}
        </span>
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
      <div className="space-y-4">
        {meds.length === 0 ? (
          <p className="text-gray-400 italic text-lg p-4">No medications scheduled.</p>
        ) : (
          meds.map(med => (
            <MedicationCard key={med.id} med={med} onTake={onTake} />
          ))
        )}
      </div>
    </section>
  );
}

interface MedicationCardProps {
  key?: string | number;
  med: Medication;
  onTake: (id: string) => void;
}

function MedicationCard({ med, onTake }: MedicationCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-5"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-black text-gray-900">{med.name}</h3>
          <p className="text-lg text-gray-700 mt-1">{med.description}</p>
        </div>
        <div className="flex flex-col items-center">
          {med.taken ? (
            <div className="flex flex-col items-center text-green-600">
              <CheckCircle2 className="w-10 h-10" />
              <span className="text-sm font-bold uppercase">Taken</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-yellow-500 opacity-60">
              <Clock className="w-10 h-10" />
              <span className="text-sm font-bold uppercase">Pending</span>
            </div>
          )}
        </div>
      </div>
      <button
        disabled={med.taken}
        onClick={() => onTake(med.id)}
        className={`w-full py-5 rounded-2xl text-xl font-bold shadow-md transition-all ${
          med.taken
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-b-4 border-gray-200'
            : 'bg-orange-500 hover:bg-orange-600 text-white border-b-4 border-orange-700 active:translate-y-1 active:border-b-0'
        }`}
      >
        {med.taken ? 'ALREADY TAKEN' : 'I TOOK THIS'}
      </button>
    </motion.article>
  );
}
