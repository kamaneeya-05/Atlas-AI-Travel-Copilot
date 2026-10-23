import { IndianRupee, TrendingDown, PiggyBank } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';

const categoryColors = {
  Accommodation: 'bg-brand-500',
  Food: 'bg-emerald-500',
  Transport: 'bg-amber-500',
  Activities: 'bg-accent-500',
  Shopping: 'bg-pink-500',
  Miscellaneous: 'bg-surface-400',
  Other: 'bg-surface-400',
};

function getBarColor(category) {
  for (const [key, color] of Object.entries(categoryColors)) {
    if (category?.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return 'bg-brand-500';
}

const budgetLevelBadge = {
  budget: 'success',
  'mid-range': 'warning',
  luxury: 'danger',
};

export default function BudgetBlock({ block }) {
  if (!block) return null;
  const { currency, totalEstimate, breakdown = [], savingTips = [], budgetLevel } = block;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">Budget Breakdown</h2>
              {currency && <p className="text-xs text-surface-500 dark:text-surface-400">{currency}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {budgetLevel && (
              <Badge variant={budgetLevelBadge[budgetLevel] || 'default'}>{budgetLevel}</Badge>
            )}
            {totalEstimate && (
              <span className="text-lg font-bold text-surface-900 dark:text-surface-100">{totalEstimate}</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {breakdown.length > 0 && (
          <div className="space-y-3">
            {breakdown.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${getBarColor(item.category)}`} />
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.notes && (
                      <span className="text-xs text-surface-400 dark:text-surface-500 hidden sm:block">{item.notes}</span>
                    )}
                    <span className="text-sm font-semibold text-surface-900 dark:text-surface-100">{item.amount}</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getBarColor(item.category)} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.min(item.percentage || 0, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="text-xs text-surface-400 dark:text-surface-500">{item.percentage?.toFixed(0) ?? 0}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {savingTips.length > 0 && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4">
            <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2.5">
              <PiggyBank className="w-4 h-4" /> Money-Saving Tips
            </h3>
            <ul className="space-y-1.5">
              {savingTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                  <TrendingDown className="w-3 h-3 mt-0.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
