import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../common/Card.jsx';

const severityConfig = {
  high: {
    icon: ShieldAlert,
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    iconBg: 'bg-red-100 dark:bg-red-950/60',
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-800 dark:text-red-300',
    textColor: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
  },
  medium: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-950/60',
    iconColor: 'text-amber-600 dark:text-amber-400',
    titleColor: 'text-amber-800 dark:text-amber-300',
    textColor: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
  },
  low: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-950/60',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-800 dark:text-blue-300',
    textColor: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
  },
};

export default function WarningsBlock({ block }) {
  if (!block) return null;
  const { items = [] } = block;

  if (!items.length) return null;

  const sorted = [...items].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.severity] ?? 3) - (order[b.severity] ?? 3);
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">Travel Warnings</h2>
            <p className="text-xs text-surface-500 dark:text-surface-400">{items.length} notice{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.map((warning, i) => {
          const cfg = severityConfig[warning.severity] || severityConfig.low;
          const Icon = cfg.icon;
          return (
            <div
              key={i}
              className={`rounded-xl border ${cfg.bg} ${cfg.border} p-4 flex items-start gap-3`}
            >
              <div className={`w-7 h-7 rounded-lg ${cfg.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className={`w-3.5 h-3.5 ${cfg.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1 flex-wrap">
                  <p className={`text-sm font-semibold ${cfg.titleColor}`}>{warning.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                    {warning.severity}
                  </span>
                  {warning.category && (
                    <span className="text-xs text-surface-400 dark:text-surface-500">{warning.category}</span>
                  )}
                </div>
                {warning.description && (
                  <p className={`text-xs leading-relaxed ${cfg.textColor}`}>{warning.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
