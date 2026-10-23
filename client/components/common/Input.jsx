import { forwardRef } from 'react';
import { cn } from '../../lib/utils.js';

const Input = forwardRef(function Input(
  { className, label, error, helperText, icon: Icon, fullWidth = true, ...props },
  ref
) {
  const inputId = props.id || props.name;

  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-surface-700 dark:text-surface-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'input-base',
            Icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500/40 focus:border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-surface-500 dark:text-surface-400">{helperText}</p>
      )}
    </div>
  );
});

export default Input;

export const Textarea = forwardRef(function Textarea(
  { className, label, error, helperText, fullWidth = true, rows = 4, ...props },
  ref
) {
  const inputId = props.id || props.name;

  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-surface-700 dark:text-surface-300"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={cn(
          'input-base resize-none',
          error && 'border-red-500 focus:ring-red-500/40 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-surface-500 dark:text-surface-400">{helperText}</p>
      )}
    </div>
  );
});

export const Select = forwardRef(function Select(
  { className, label, error, helperText, fullWidth = true, children, ...props },
  ref
) {
  const inputId = props.id || props.name;

  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-surface-700 dark:text-surface-300"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={cn(
          'input-base cursor-pointer',
          error && 'border-red-500 focus:ring-red-500/40 focus:border-red-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-surface-500 dark:text-surface-400">{helperText}</p>
      )}
    </div>
  );
});
