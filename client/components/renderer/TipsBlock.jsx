import { Lightbulb, Globe, Wrench, ShieldCheck, Smartphone } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../common/Card.jsx';

function TipSection({ title, icon: Icon, items, colorClass }) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className={`text-sm font-semibold mb-2.5 flex items-center gap-1.5 ${colorClass}`}>
        <Icon className="w-3.5 h-3.5" /> {title}
      </h3>
      <ul className="space-y-1.5">
        {items.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-400">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TipsBlock({ block }) {
  if (!block) return null;
  const { cultural = [], practical = [], safety = [], apps = [] } = block;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-yellow-100 dark:bg-yellow-950/60 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">Travel Tips</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <TipSection title="Cultural Tips" icon={Globe} items={cultural} colorClass="text-brand-600 dark:text-brand-400" />
        <TipSection title="Practical Tips" icon={Wrench} items={practical} colorClass="text-emerald-600 dark:text-emerald-400" />
        <TipSection title="Safety Tips" icon={ShieldCheck} items={safety} colorClass="text-red-600 dark:text-red-400" />
        {apps.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2.5 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" /> Recommended Apps
            </h3>
            <div className="flex flex-wrap gap-2">
              {apps.map((app, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300">
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
