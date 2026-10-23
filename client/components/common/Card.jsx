import { cn } from '../../lib/utils.js';

export default function Card({ children, className, hover = false, glass = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 shadow-soft',
        hover && 'card-hover cursor-pointer',
        glass && 'glass-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('px-5 pt-5 pb-3', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('px-5 pb-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'px-5 py-3 border-t border-surface-100 dark:border-surface-800 rounded-b-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
