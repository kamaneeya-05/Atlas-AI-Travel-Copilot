import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, Sun, Moon, Monitor, Trash2,
  Shield, Palette, Database, Info, ChevronRight,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import PageTransition from '../components/layout/PageTransition.jsx';
import Button from '../components/common/Button.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import { useTheme } from '../hooks/useTheme.js';
import { useTrips } from '../hooks/useTrips.js';
import { useToast } from '../components/common/Toast.jsx';
import { cn } from '../lib/utils.js';

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun, desc: 'Always use light mode' },
  { value: 'dark', label: 'Dark', icon: Moon, desc: 'Always use dark mode' },
  { value: 'system', label: 'System', icon: Monitor, desc: 'Follow your device settings' },
];

function SettingSection({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 overflow-hidden shadow-soft">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-surface-100 dark:border-surface-800">
        <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-950/60 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
        </div>
        <h2 className="text-sm font-semibold text-surface-800 dark:text-surface-200">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children, className }) {
  return (
    <div className={cn('flex items-start sm:items-center justify-between gap-4 py-3 border-b border-surface-100 dark:border-surface-800/50 last:border-0', className)}>
      <div>
        <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{label}</p>
        {description && <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { trips } = useTrips();
  const { toast } = useToast();
  const [clearOpen, setClearOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleClearData = async () => {
    setClearing(true);
    try {
      localStorage.removeItem('atlas-ai-trips');
      window.location.reload();
    } catch {
      toast('Failed to clear data', 'error');
      setClearing(false);
      setClearOpen(false);
    }
  };

  const storageSize = (() => {
    try {
      const raw = localStorage.getItem('atlas-ai-trips') || '';
      const bytes = new Blob([raw]).size;
      return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
    } catch {
      return 'Unknown';
    }
  })();

  return (
    <AppLayout>
      <PageTransition>
        <div className="page-container py-8 max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <SettingsIcon className="w-5 h-5 text-brand-500" />
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Settings</h1>
          </div>

          <div className="space-y-5">
            {/* Appearance */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <SettingSection title="Appearance" icon={Palette}>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-4">Choose your preferred color theme.</p>
                <div className="grid grid-cols-3 gap-3">
                  {themeOptions.map(({ value, label, icon: Icon, desc }) => (
                    <button
                      key={value}
                      onClick={() => { setTheme(value); toast(`Theme set to ${label}`, 'success'); }}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 text-center',
                        theme === value
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40'
                          : 'border-surface-200 dark:border-surface-700 hover:border-brand-300 dark:hover:border-brand-700 bg-white dark:bg-surface-900'
                      )}
                    >
                      <div className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center',
                        theme === value ? 'bg-brand-100 dark:bg-brand-950/60' : 'bg-surface-100 dark:bg-surface-800'
                      )}>
                        <Icon className={cn('w-4 h-4', theme === value ? 'text-brand-600 dark:text-brand-400' : 'text-surface-500')} />
                      </div>
                      <div>
                        <p className={cn('text-xs font-semibold', theme === value ? 'text-brand-600 dark:text-brand-400' : 'text-surface-700 dark:text-surface-300')}>
                          {label}
                        </p>
                        <p className="text-xs text-surface-400 dark:text-surface-500 hidden sm:block">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </SettingSection>
            </motion.div>

            {/* Data & Storage */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <SettingSection title="Data & Storage" icon={Database}>
                <SettingRow
                  label="Saved Trips"
                  description="Trips are stored locally in your browser."
                >
                  <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">{trips.length}</span>
                </SettingRow>
                <SettingRow
                  label="Storage Used"
                  description="Approximate size of your saved data."
                >
                  <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">{storageSize}</span>
                </SettingRow>
                <SettingRow
                  label="Clear All Data"
                  description="Permanently delete all saved trips and settings."
                >
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setClearOpen(true)}
                    disabled={trips.length === 0}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </Button>
                </SettingRow>
              </SettingSection>
            </motion.div>

            {/* Privacy */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <SettingSection title="Privacy & Security" icon={Shield}>
                <SettingRow
                  label="Local Storage Only"
                  description="Your trips are never uploaded to external servers unless you explicitly share them."
                >
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-medium">
                    Private
                  </span>
                </SettingRow>
                <SettingRow
                  label="API Key Security"
                  description="Your Gemini API key is stored only on the server and never exposed to the browser."
                >
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-medium">
                    Secured
                  </span>
                </SettingRow>
              </SettingSection>
            </motion.div>

            {/* About */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <SettingSection title="About" icon={Info}>
                <SettingRow label="Application" description="ATLAS AI – Intelligent Travel Copilot">
                  <span className="text-xs text-surface-400 dark:text-surface-500">v1.0.0</span>
                </SettingRow>
                <SettingRow label="AI Engine" description="Powered by Google Gemini 1.5 Flash">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 font-medium">
                    Gemini
                  </span>
                </SettingRow>
                <SettingRow label="Tech Stack" description="React · Vite · Tailwind CSS · Express · Framer Motion">
                  <ChevronRight className="w-4 h-4 text-surface-300 dark:text-surface-600" />
                </SettingRow>
              </SettingSection>
            </motion.div>
          </div>
        </div>
      </PageTransition>

      <ConfirmDialog
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        onConfirm={handleClearData}
        title="Clear all data?"
        description={`This will permanently delete all ${trips.length} saved trips and cannot be undone.`}
        confirmLabel="Clear All Data"
        loading={clearing}
      />
    </AppLayout>
  );
}
