import { HelpCircle } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../common/Card.jsx';

export default function FallbackBlock({ block }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-surface-400" />
          </div>
          <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100 capitalize">
            {block?.type || 'Unknown'} Block
          </h2>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-surface-400 dark:text-surface-500">
          This section type (<code className="font-mono text-xs bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">{block?.type}</code>) is not yet supported.
        </p>
        {block && Object.keys(block).filter((k) => k !== 'type').length > 0 && (
          <pre className="mt-3 text-xs bg-surface-50 dark:bg-surface-800 rounded-lg p-3 overflow-auto text-surface-500 dark:text-surface-400 max-h-40">
            {JSON.stringify(block, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
