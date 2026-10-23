import { motion } from 'framer-motion';
import { cn } from '../../lib/utils.js';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-surface-400 dark:text-surface-500" />
        </div>
      )}
      <h3 className="text-base font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-surface-500 dark:text-surface-400 max-w-xs leading-relaxed mb-5">
          {description}
        </p>
      )}
      {action}
    </motion.div>
  );
}
