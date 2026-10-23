import { cn } from '../../lib/utils.js';

const sizes = {
  sm: 'w-3.5 h-3.5 border-[1.5px]',
  md: 'w-5 h-5 border-2',
  lg: 'w-7 h-7 border-2',
  xl: 'w-10 h-10 border-[3px]',
};

export default function Spinner({ size = 'md', className }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'rounded-full border-surface-300 dark:border-surface-700 border-t-brand-500 dark:border-t-brand-400 animate-spin',
        sizes[size],
        className
      )}
    />
  );
}
