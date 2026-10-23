import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, IndianRupee, UtensilsCrossed, CheckSquare, Sparkles, Calendar, Shield } from 'lucide-react';

const STEPS = [
  { icon: Globe,          label: 'Analyzing your destination…',     color: 'text-brand-500',   duration: 3000 },
  { icon: Calendar,       label: 'Planning day-by-day itinerary…',  color: 'text-emerald-500', duration: 6000 },
  { icon: Calendar,       label: 'Generating all trip days…',       color: 'text-emerald-400', duration: 8000 },
  { icon: IndianRupee,    label: 'Calculating ₹ budget breakdown…', color: 'text-amber-500',   duration: 4000 },
  { icon: UtensilsCrossed,label: 'Curating restaurant picks…',      color: 'text-orange-500',  duration: 3000 },
  { icon: CheckSquare,    label: 'Building packing checklist…',     color: 'text-accent-500',  duration: 3000 },
  { icon: Shield,         label: 'Gathering travel advisories…',    color: 'text-red-400',     duration: 2000 },
  { icon: Sparkles,       label: 'Finalising your perfect trip…',   color: 'text-brand-500',   duration: 2000 },
];

export default function GeneratingLoader() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    let step = 0;
    const advance = () => {
      if (step < STEPS.length - 1) {
        setCompletedSteps(prev => [...prev, step]);
        step++;
        setActiveStep(step);
        setTimeout(advance, STEPS[step].duration);
      }
    };
    setTimeout(advance, STEPS[0].duration);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Animated globe */}
      <div className="relative mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 rounded-full border-4 border-brand-100 dark:border-brand-900 border-t-brand-500 dark:border-t-brand-400"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-glow"
          >
            <Globe className="w-7 h-7 text-white" />
          </motion.div>
        </div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-1"
      >
        Crafting your perfect itinerary
      </motion.h2>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-8 max-w-xs">
        Atlas AI is building every day of your trip with real details…
      </p>

      {/* Steps */}
      <div className="w-full max-w-sm space-y-2">
        {STEPS.map((step, i) => {
          const isDone   = completedSteps.includes(i);
          const isActive = activeStep === i;
          const isPending= i > activeStep;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: isPending ? 0.35 : 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                isDone
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                  : isActive
                  ? 'bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800'
                  : 'bg-surface-50 dark:bg-surface-800/50 border-surface-200 dark:border-surface-700'
              }`}
            >
              {/* Icon */}
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                isDone ? 'bg-emerald-500' : isActive ? 'bg-brand-500' : 'bg-surface-200 dark:bg-surface-700'
              }`}>
                {isDone ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <step.icon className={`w-3 h-3 ${isActive ? 'text-white' : 'text-surface-400 dark:text-surface-500'}`} />
                )}
              </div>

              {/* Label */}
              <span className={`text-sm flex-1 text-left ${
                isDone   ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-70' :
                isActive ? 'text-surface-900 dark:text-surface-100 font-medium' :
                           'text-surface-400 dark:text-surface-500'
              }`}>
                {step.label}
              </span>

              {/* Spinner for active */}
              {isActive && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 rounded-full border-2 border-brand-200 border-t-brand-500 shrink-0"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-xs text-surface-400 dark:text-surface-500 mt-6 max-w-xs"
      >
        Long trips may take 30–60 seconds. We generate every day in full detail.
      </motion.p>
    </div>
  );
}
