import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, ArrowLeft, Compass, Home } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Navbar from '../components/layout/Navbar.jsx';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar variant="app" />
      <main className="flex-1 flex items-center justify-center pt-16 px-4">
        <div className="text-center max-w-md">
          {/* Animated compass */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative inline-flex items-center justify-center mb-8"
          >
            <div className="w-28 h-28 rounded-3xl gradient-bg shadow-glow-lg flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 20, -20, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              >
                <Compass className="w-12 h-12 text-white" />
              </motion.div>
            </div>
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-3 -right-3 text-4xl font-black text-surface-200 dark:text-surface-700"
            >
              404
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl font-extrabold text-surface-900 dark:text-surface-100 mb-3"
          >
            You&apos;re off the map
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-surface-500 dark:text-surface-400 mb-8 leading-relaxed"
          >
            This page doesn&apos;t exist or has been moved. Let&apos;s get you back to your adventures.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button variant="secondary" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" /> Go Back
            </Button>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              <Home className="w-4 h-4" /> Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate('/trip/new')}>
              <Globe className="w-4 h-4" /> Plan a Trip
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
