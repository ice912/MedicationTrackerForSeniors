import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Languages, 
  CheckCircle, 
  Bell, 
  Volume2, 
  ChevronRight, 
  HelpCircle, 
  Phone, 
  AlertCircle,
  Home,
  Pill,
  Settings as SettingsIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Settings {
  language: string;
  notifications: boolean;
  volume: number;
}

const LANGUAGES = [
  { name: "English", native: "English" },
  { name: "Korean", native: "한국어" },
  { name: "Spanish", native: "Español" },
  { name: "French", native: "Français" },
  { name: "Chinese", native: "中文" },
  { name: "Japanese", native: "日本語" },
];

export default function App() {
  const [settings, setSettings] = useState<Settings>({
    language: "English",
    notifications: true,
    volume: 80,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch settings:", err);
        setLoading(false);
      });
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  const handleEmergencyCall = () => {
    // In a real app, this might trigger a phone call or alert
    alert("Emergency call triggered! (911)");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-24">
      <header className="sticky top-0 z-20 flex items-center bg-background-light dark:bg-background-dark border-b border-primary/10 p-4 justify-between">
        <button className="flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-primary/5 rounded-full transition-colors">
          <ArrowLeft className="w-8 h-8 text-primary" />
        </button>
        <h1 className="text-2xl font-bold leading-tight tracking-tight flex-1 text-center pr-12">Settings</h1>
      </header>

      <main className="flex-1 px-4 py-6 max-w-xl mx-auto w-full">
        {/* Profile Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 px-1 text-primary">Your Profile</h2>
          <div className="flex items-center gap-5 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-primary/5">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 border-2 border-primary"
              style={{ backgroundImage: 'url("https://picsum.photos/seed/senior/200/200")' }}
            />
            <div className="flex flex-col justify-center">
              <p className="text-xl font-bold line-clamp-1">John Anderson</p>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Daily Meds User</p>
              <button className="mt-2 text-primary font-bold text-left underline hover:text-primary/80">Edit Profile</button>
            </div>
          </div>
        </motion.section>

        {/* Language Setting */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 px-1 text-primary">App Language</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-primary/10">
            <div className="custom-scroll max-h-72 overflow-y-auto">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.name}
                  onClick={() => updateSettings({ language: lang.name })}
                  className={`w-full flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors ${
                    settings.language === lang.name ? "bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Languages className={`w-8 h-8 ${settings.language === lang.name ? "text-primary" : "text-slate-400"}`} />
                    <span className={`text-xl font-bold ${settings.language === lang.name ? "text-primary" : "text-slate-700 dark:text-slate-200"}`}>
                      {lang.native} ({lang.name})
                    </span>
                  </div>
                  {settings.language === lang.name ? (
                    <CheckCircle className="w-8 h-8 text-primary fill-primary/20" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-slate-300" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Notification Settings */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 px-1 text-primary">Reminder Alerts</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <Bell className="w-8 h-8 text-slate-600 dark:text-slate-300" />
                <span className="text-xl font-semibold">Sound & Vibration</span>
              </div>
              <button 
                onClick={() => updateSettings({ notifications: !settings.notifications })}
                className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors focus:outline-none ${
                  settings.notifications ? "bg-primary" : "bg-slate-300"
                }`}
              >
                <motion.span
                  animate={{ x: settings.notifications ? 28 : 4 }}
                  className="inline-block w-6 h-6 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <Volume2 className="w-8 h-8 text-slate-600 dark:text-slate-300" />
                <span className="text-xl font-semibold">Volume Level</span>
              </div>
              <ChevronRight className="w-8 h-8 text-primary" />
            </div>
          </div>
        </motion.section>

        {/* Support Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 px-1 text-primary">Help & Support</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            <button className="w-full flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-4">
                <HelpCircle className="w-8 h-8 text-slate-600 dark:text-slate-300" />
                <span className="text-xl font-semibold">How to use</span>
              </div>
              <ChevronRight className="w-8 h-8 text-primary" />
            </button>
            <button className="w-full flex items-center justify-between p-6 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors">
              <div className="flex items-center gap-4">
                <Phone className="w-8 h-8 text-red-600 dark:text-red-400" />
                <span className="text-xl font-semibold">Emergency Contacts</span>
              </div>
              <ChevronRight className="w-8 h-8 text-primary" />
            </button>
            <div className="p-6 pt-2">
              <button 
                onClick={handleEmergencyCall}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
              >
                <AlertCircle className="w-8 h-8 fill-white/20" />
                <span className="text-xl">Call Emergency Services (911)</span>
              </button>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-primary/10 bg-white dark:bg-background-dark px-4 pb-8 pt-3 z-30">
        <div className="flex gap-2 max-w-xl mx-auto">
          <button className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <Home className="w-8 h-8" />
            <p className="text-sm font-bold">Home</p>
          </button>
          <button className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <Pill className="w-8 h-8" />
            <p className="text-sm font-bold">Meds</p>
          </button>
          <button className="flex flex-1 flex-col items-center justify-center gap-1 text-primary">
            <SettingsIcon className="w-8 h-8 fill-primary/20" />
            <p className="text-sm font-bold">Settings</p>
          </button>
        </div>
      </nav>
    </div>
  );
}
