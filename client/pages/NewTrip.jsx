import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Globe, ArrowLeft, Wand2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import PageTransition from '../components/layout/PageTransition.jsx';
import TripForm from '../components/forms/TripForm.jsx';
import GeneratingLoader from '../components/loading/GeneratingLoader.jsx';
import ErrorMessage from '../components/error/ErrorMessage.jsx';
import { useTrips } from '../hooks/useTrips.js';
import { useToast } from '../components/common/Toast.jsx';

const inspirationCards = [
  { emoji: '🏖️', destination: 'Goa',        tagline: 'Beach & Vibes' },
  { emoji: '🏔️', destination: 'Manali',      tagline: 'Mountains & Snow' },
  { emoji: '🕌', destination: 'Rajasthan',   tagline: 'Forts & Culture' },
  { emoji: '🌴', destination: 'Kerala',      tagline: 'Backwaters & Spice' },
  { emoji: '🌊', destination: 'Andaman',     tagline: 'Islands & Diving' },
  { emoji: '🏯', destination: 'Hampi',       tagline: 'History & Ruins' },
];

export default function NewTrip() {
  const navigate = useNavigate();
  const { generateTrip, generating, error, clearError } = useTrips();
  const { toast } = useToast();
  const [lastFormData, setLastFormData] = useState(null);

  const handleSubmit = async (formData) => {
    clearError();
    setLastFormData(formData);
    try {
      const trip = await generateTrip(formData);
      toast('Your itinerary is ready! 🎉', 'success');
      navigate(`/trip/${trip.tripId}`);
    } catch (err) {
      // error is already set in context, toast shows extra
      toast(err.message || 'Failed to generate trip', 'error');
    }
  };

  const handleRetry = () => {
    clearError();
    if (lastFormData) handleSubmit(lastFormData);
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="page-container py-8">
          {/* Back button */}
          <button onClick={() => navigate(-1)} className="btn-ghost mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {generating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-3xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-card overflow-hidden"
                >
                  <GeneratingLoader />
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg shadow-glow mb-4"
                    >
                      <Wand2 className="w-7 h-7 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                      Plan your next trip
                    </h1>
                    <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto">
                      Describe your ideal trip and Atlas AI will craft a complete, personalized itinerary in seconds.
                    </p>
                  </div>

                  {/* Inspiration cards */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3 text-center">
                      Popular destinations
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {inspirationCards.map((card) => (
                        <motion.button
                          key={card.destination}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => document.querySelector('textarea')?.focus()}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-soft transition-all duration-200"
                        >
                          <span className="text-xl">{card.emoji}</span>
                          <span className="text-xs font-semibold text-surface-700 dark:text-surface-300 text-center leading-tight">{card.destination}</span>
                          <span className="text-xs text-surface-400 dark:text-surface-500 text-center leading-tight hidden sm:block">{card.tagline}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Error message */}
                  {error && (
                    <ErrorMessage
                      message={error}
                      onRetry={handleRetry}
                      className="mb-5"
                    />
                  )}

                  {/* Form card */}
                  <div className="rounded-3xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-card p-6 sm:p-8">
                    <TripForm onSubmit={handleSubmit} loading={generating} />
                  </div>

                  {/* Trust badges */}
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-5 text-xs text-surface-400 dark:text-surface-500">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-brand-500" />
                      India & worldwide destinations
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                      Powered by Groq AI (Llama 3.3)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Budget in ₹ INR
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
