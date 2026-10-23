import { SlidersHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils.js';

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest first' },
  { value: 'createdAt-asc', label: 'Oldest first' },
  { value: 'title-asc', label: 'A → Z' },
  { value: 'title-desc', label: 'Z → A' },
];

const FILTER_TAGS = [
  { value: 'all', label: 'All' },
  { value: 'budget', label: 'Budget' },
  { value: 'mid-range', label: 'Mid-range' },
  { value: 'luxury', label: 'Luxury' },
];

export default function FilterBar({ sort, onSortChange, filter, onFilterChange, className }) {
  return (
    <div className={cn('flex items-center gap-3 flex-wrap', className)}>
      <div className="flex items-center gap-1.5">
        <SlidersHorizontal className="w-3.5 h-3.5 text-surface-400" />
        <span className="text-xs text-surface-500 dark:text-surface-400 font-medium">Sort:</span>
      </div>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <div className="flex items-center gap-1">
        {FILTER_TAGS.map((tag) => (
          <button
            key={tag.value}
            onClick={() => onFilterChange(tag.value)}
            className={cn(
              'text-xs px-3 py-1.5 rounded-full border transition-all duration-150',
              filter === tag.value
                ? 'bg-brand-600 border-brand-600 text-white font-medium'
                : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-600 dark:hover:text-brand-400'
            )}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}
