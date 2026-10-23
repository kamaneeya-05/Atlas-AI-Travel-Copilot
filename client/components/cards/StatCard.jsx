import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils.js';

const colorSchemes = {
  brand: {
    bg: 'bg-brand-50 dark:bg-brand-950/40',
    iconBg: 'bg-brand-100 dark:bg-brand-950/70',
    iconColor: 'text-brand-600 dark:text-brand-400',
    trend: 'text-brand-600 dark:text-brand-400',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/70',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    trend: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    iconBg: 'bg-amber-100 dark:bg-amber-950/70',
    iconColor: 'text-amber-600 dark:text-amber-400',
    trend: 'text-amber-600 dark:text-amber-400',
  },
  accent: {
    bg: 'bg-accent-50 dark:bg-accent-950/40',
    iconBg: 'bg-accent-100 dark:bg-accent-950/70',
    iconColor: 'text-accent-600 dark:text-accent-400',
    trend: 'text-accent-600 dark:text-accent-400',
  },
};

export default function StatCard({ label, value, icon: Icon, color = 'brand', trend, className }) {
  const scheme = colorSchemes[color] || colorSchemes.brand;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 shadow-soft',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${scheme.iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${scheme.iconColor}`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium flex items-center gap-1 ${scheme.trend}`}>
            <TrendingUp className="w-3 h-3" /> {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-0.5">{value}</p>
      <p className="text-sm text-surface-500 dark:text-surface-400">{label}</p>
    </motion.div>
  );
}
