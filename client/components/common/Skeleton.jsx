import { cn } from '../../lib/utils.js';

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-surface-200 dark:bg-surface-800 relative overflow-hidden',
        className
      )}
      aria-hidden="true"
      {...props}
    >
      <div className="absolute inset-0 shimmer" />
    </div>
  );
}

export function TripCardSkeleton() {
  return (
    <div className="rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden bg-white dark:bg-surface-900 shadow-soft">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BlockSkeleton() {
  return (
    <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 space-y-3 shadow-soft">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-4/5" />
      <Skeleton className="h-3.5 w-2/3" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <BlockSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <BlockSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
