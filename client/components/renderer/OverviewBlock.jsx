import { Star, Eye, Lightbulb, Train } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';

export default function OverviewBlock({ block }) {
  if (!block) return null;
  const { highlights = [], mustSee = [], localTips = [], transportation = '' } = block;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-950/60 flex items-center justify-center">
            <Eye className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">Destination Overview</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {highlights.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2.5 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500" /> Highlights
            </h3>
            <div className="flex flex-wrap gap-2">
              {highlights.map((h, i) => (
                <Badge key={i} variant="primary">{h}</Badge>
              ))}
            </div>
          </div>
        )}

        {mustSee.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2.5 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-500" /> Must-See
            </h3>
            <ul className="space-y-1.5">
              {mustSee.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {localTips.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-yellow-500" /> Local Tips
            </h3>
            <ul className="space-y-1.5">
              {localTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {transportation && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
            <Train className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-0.5">Getting Around</p>
              <p className="text-sm text-surface-600 dark:text-surface-400">{transportation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
