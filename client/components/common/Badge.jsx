import { cn } from '../../lib/utils.js';

const variants = {
  default: 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300',
  primary: 'bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300',
  success: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
  warning: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
  danger: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300',
  accent: 'bg-accent-100 dark:bg-accent-950/60 text-accent-700 dark:text-accent-300',
  outline: 'border border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400',
};

export default function Badge({ children, variant = 'default', className, dot = false, ...props }) {
  return (
    <span
      className={cn('badge', variants[variant], className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-emerald-500',
            variant === 'warning' && 'bg-amber-500',
            variant === 'danger' && 'bg-red-500',
            variant === 'primary' && 'bg-brand-500',
            (!['success', 'warning', 'danger', 'primary'].includes(variant)) && 'bg-surface-400'
          )}
        />
      )}
      {children}
    </span>
  );
}
