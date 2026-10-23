import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewTrip from './pages/NewTrip.jsx';
import TripDetails from './pages/TripDetails.jsx';
import History from './pages/History.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';
import ApiKeySetup from './components/setup/ApiKeySetup.jsx';
import Spinner from './components/common/Spinner.jsx';
import { useTheme } from './hooks/useTheme.js';
import { useApiKey } from './context/ApiKeyContext.jsx';

export default function App() {
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const { status } = useApiKey();

  return (
    <div className={resolvedTheme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-50 font-sans transition-colors duration-300">

        {/* Checking server status */}
        {status === 'checking' && (
          <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-950 gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-glow animate-pulse">
              <span className="text-white font-black text-2xl">A</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner size="md" />
              <p className="text-sm text-surface-500 dark:text-surface-400">Starting ATLAS AI…</p>
            </div>
          </div>
        )}

        {/* API key not configured */}
        {(status === 'missing') && <ApiKeySetup />}

        {/* App ready */}
        {status === 'ready' && (
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/trip/new" element={<NewTrip />} />
              <Route path="/trip/:id" element={<TripDetails />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
