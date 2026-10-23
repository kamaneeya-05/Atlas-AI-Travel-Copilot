import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export default function QuickAction({ label, description, icon: Icon, onClick, color = 'brand', disabled = false }) {
  const colors = {
    brand: 'from-brand-500 to-brand-600',
    emerald: 'from-emerald-500 to-emerald-600',
    accent: 'from-accent-500 to-accent-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full text-left rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-4 shadow-soft group transition-all duration-200 hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-card',
        disabled && 'opacity-60 cursor-not-allowed'
      )}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color] || colors.brand} flex items-center justify-center shadow-sm shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{label}</p>
          {description && (
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 line-clamp-1">{description}</p>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-surface-300 dark:text-surface-600 group-hover:text-brand-500 dark:group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
      </div>
    </motion.button>
  );
}
