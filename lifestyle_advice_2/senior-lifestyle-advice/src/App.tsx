/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  RefreshCw, 
  Home, 
  Clock, 
  User, 
  Footprints, 
  Droplets, 
  Accessibility, 
  PhoneCall 
} from 'lucide-react';
import { Language, Advice, translations } from './types';
import { generateAdvice } from './services/geminiService';

const defaultAdvice: Record<Language, Advice[]> = {
  en: [
    { id: '1', category: 'walking', text: 'Walk for ', highlight: '10 minutes', subtext: 'Good for your heart and energy.' },
    { id: '2', category: 'water', text: 'Drink a ', highlight: 'glass of water', subtext: 'Helps your kidneys stay healthy.' },
    { id: '3', category: 'posture', text: 'Stretch your ', highlight: 'arms and back', subtext: 'Reduces stiffness and keeps you flexible.' },
    { id: '4', category: 'social', text: 'Call a ', highlight: 'friend or family', subtext: 'Connecting with others boosts your mood.' },
  ],
  ko: [
    { id: '1', category: 'walking', text: '오늘 ', highlight: '10분 동안', subtext: '심장 건강과 에너지에 좋습니다.' },
    { id: '2', category: 'water', text: '지금 ', highlight: '물 한 잔', subtext: '신장 건강을 유지하는 데 도움이 됩니다.' },
    { id: '3', category: 'posture', text: '당신의 ', highlight: '팔과 등을', subtext: '뻣뻣함을 줄이고 유연성을 유지해 줍니다.' },
    { id: '4', category: 'social', text: '친구나 가족에게 ', highlight: '전화하기', subtext: '다른 사람들과 소통하면 기분이 좋아집니다.' },
  ],
};

const getIcon = (category: string) => {
  switch (category) {
    case 'walking': return <Footprints className="w-8 h-8 text-orange-600" />;
    case 'water': return <Droplets className="w-8 h-8 text-blue-600" />;
    case 'posture': return <Accessibility className="w-8 h-8 text-green-600" />;
    case 'social': return <PhoneCall className="w-8 h-8 text-purple-600" />;
    default: return <Clock className="w-8 h-8 text-slate-600" />;
  }
};

const getBgColor = (category: string) => {
  switch (category) {
    case 'walking': return 'bg-orange-100';
    case 'water': return 'bg-blue-100';
    case 'posture': return 'bg-green-100';
    case 'social': return 'bg-purple-100';
    default: return 'bg-slate-100';
  }
};

const getHighlightColor = (category: string) => {
  switch (category) {
    case 'walking': return 'text-orange-600';
    case 'water': return 'text-blue-600';
    case 'posture': return 'text-green-600';
    case 'social': return 'text-purple-600';
    default: return 'text-slate-600';
  }
};

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [adviceList, setAdviceList] = useState<Advice[]>(defaultAdvice['en']);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('advice');

  const t = translations[language];

  useEffect(() => {
    // Update advice list when language changes if not loading
    if (!isLoading) {
      setAdviceList(defaultAdvice[language]);
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ko' : 'en');
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const freshAdvice = await generateAdvice(language);
      if (freshAdvice && freshAdvice.length > 0) {
        setAdviceList(freshAdvice);
      }
    } catch (error) {
      console.error("Error refreshing advice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 safe-area-inset-top">
        <div className="px-6 py-4 flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleLanguage}
              aria-label={t.language}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-bold"
            >
              <Globe className="w-5 h-5" />
              <span>{t.language}</span>
            </button>
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              aria-label={t.refresh}
              className={`p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors ${isLoading ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-4 max-w-md mx-auto">
        <section className="mb-6 px-2">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg text-slate-500 font-medium"
          >
            {t.greeting}
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold text-slate-900"
          >
            {t.suggestions}
          </motion.h2>
        </section>

        <AnimatePresence mode="wait">
          <motion.div 
            key={`${language}-${isLoading}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {adviceList.map((advice, index) => (
              <motion.article 
                key={advice.id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${getBgColor(advice.category)} flex items-center justify-center flex-shrink-0`}>
                    {getIcon(advice.category)}
                  </div>
                  <p className="text-xl sm:text-2xl text-slate-800 font-medium leading-tight">
                    {language === 'ko' ? (
                      <>
                        {advice.text} <span className={`${getHighlightColor(advice.category)} font-bold`}>{advice.highlight}</span>
                      </>
                    ) : (
                      <>
                        {advice.text} <span className={`${getHighlightColor(advice.category)} font-bold`}>{advice.highlight}</span> {advice.category === 'walking' ? 'today' : advice.category === 'water' ? 'now' : ''}
                      </>
                    )}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-base text-slate-600 italic">{advice.subtext}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white border-t border-slate-200 fixed bottom-0 w-full safe-area-inset-bottom">
        <nav className="flex justify-around items-center py-3 max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-semibold">{t.home}</span>
          </button>
          <button 
            onClick={() => setActiveTab('advice')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'advice' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs font-bold">{t.advice}</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-semibold">{t.profile}</span>
          </button>
        </nav>
      </footer>
    </div>
  );
}
