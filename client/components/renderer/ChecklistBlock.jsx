import { useState } from 'react';
import { CheckSquare, Square, Package, ShoppingBag, FileText, Shield, Shirt, Pill, Star } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';

const categoryIcons = {
  documents: FileText,
  clothing: Shirt,
  toiletries: Pill,
  electronics: Package,
  safety: Shield,
  essentials: Star,
  shopping: ShoppingBag,
  default: Package,
};

function getCategoryIcon(name) {
  const lower = name?.toLowerCase() || '';
  for (const [key, Icon] of Object.entries(categoryIcons)) {
    if (lower.includes(key)) return Icon;
  }
  return categoryIcons.default;
}

function ChecklistCategory({ category, checkedItems, onToggle }) {
  const Icon = getCategoryIcon(category.name);
  const checkedCount = category.items?.filter((item) => checkedItems[item.id]).length || 0;
  const total = category.items?.length || 0;
  const allDone = checkedCount === total && total > 0;

  return (
    <div className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-surface-50 dark:bg-surface-800/50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-950/50 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          </div>
          <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">{category.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={allDone ? 'success' : 'default'}>
            {checkedCount}/{total}
          </Badge>
        </div>
      </div>
      <div className="divide-y divide-surface-100 dark:divide-surface-800">
        {category.items?.map((item) => {
          const checked = !!checkedItems[item.id];
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors text-left group"
            >
              {checked ? (
                <CheckSquare className="w-4 h-4 text-brand-500 dark:text-brand-400 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-surface-300 dark:text-surface-600 group-hover:text-surface-400 shrink-0" />
              )}
              <span className={`text-sm flex-1 ${checked ? 'line-through text-surface-400 dark:text-surface-500' : 'text-surface-700 dark:text-surface-300'}`}>
                {item.label}
              </span>
              {item.essential && !checked && (
                <Badge variant="warning" className="text-xs shrink-0">Essential</Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ChecklistBlock({ block }) {
  const categories = block?.categories || [];

  const [checkedItems, setCheckedItems] = useState(() => {
    const initial = {};
    categories.forEach((cat) => {
      cat.items?.forEach((item) => { initial[item.id] = false; });
    });
    return initial;
  });

  if (!block) return null;

  const toggle = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalItems = categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent-100 dark:bg-accent-950/60 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">Packing Checklist</h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">{checkedCount}/{totalItems} packed</p>
            </div>
          </div>
          <div className="w-24 h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
            <div
              className="h-full gradient-bg rounded-full transition-all duration-500"
              style={{ width: `${totalItems ? (checkedCount / totalItems) * 100 : 0}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {categories.map((cat, i) => (
          <ChecklistCategory key={i} category={cat} checkedItems={checkedItems} onToggle={toggle} />
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-surface-400 text-center py-4">No checklist available.</p>
        )}
      </CardContent>
    </Card>
  );
}
