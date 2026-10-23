import { Cloud, Thermometer, Umbrella, Shirt } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../common/Card.jsx';

export default function WeatherBlock({ block }) {
  if (!block) return null;
  const { season, averageTemp, conditions, whatToWear = [], weatherWarnings = [] } = block;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/60 flex items-center justify-center">
            <Cloud className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">Weather & Climate</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {season && (
            <div className="rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 p-3 text-center">
              <p className="text-xs text-sky-600 dark:text-sky-400 font-medium mb-1">Season</p>
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">{season}</p>
            </div>
          )}
          {averageTemp && (
            <div className="rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 p-3 text-center">
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1 flex items-center justify-center gap-1">
                <Thermometer className="w-3 h-3" /> Temperature
              </p>
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">{averageTemp}</p>
            </div>
          )}
          {conditions && (
            <div className="rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 p-3 text-center">
              <p className="text-xs text-surface-500 dark:text-surface-400 font-medium mb-1">Conditions</p>
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">{conditions}</p>
            </div>
          )}
        </div>

        {whatToWear.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 flex items-center gap-1.5">
              <Shirt className="w-3.5 h-3.5 text-brand-500" /> What to Wear
            </h3>
            <div className="flex flex-wrap gap-2">
              {whatToWear.map((item, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {weatherWarnings.length > 0 && (
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
            <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2">
              <Umbrella className="w-3.5 h-3.5" /> Weather Warnings
            </h3>
            <ul className="space-y-1">
              {weatherWarnings.map((w, i) => (
                <li key={i} className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
