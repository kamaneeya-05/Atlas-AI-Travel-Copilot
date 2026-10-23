import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, ChevronDown, ChevronUp, IndianRupee } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';


const categoryColors = {
  sightseeing: 'primary',
  food: 'success',
  transport: 'default',
  activity: 'accent',
  accommodation: 'warning',
};

const categoryIcons = {
  sightseeing: '🏛️',
  food: '🍽️',
  transport: '🚌',
  activity: '🎯',
  accommodation: '🏨',
};

function ActivityItem({ activity }) {
  return (
    <div className="flex gap-3 py-3 border-b border-surface-100 dark:border-surface-800 last:border-0">
      <div className="flex flex-col items-center pt-0.5 w-14 shrink-0">
        <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 tabular-nums">{activity.time}</span>
        <div className="w-px flex-1 bg-surface-200 dark:bg-surface-700 mt-1 min-h-[20px]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{categoryIcons[activity.category] || '📍'}</span>
            <span className="text-sm font-semibold text-surface-900 dark:text-surface-100">{activity.name}</span>
          </div>
          {activity.category && (
            <Badge variant={categoryColors[activity.category] || 'default'} className="shrink-0 text-xs">
              {activity.category}
            </Badge>
          )}
        </div>
        {activity.description && (
          <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed mb-1.5">{activity.description}</p>
        )}
        <div className="flex flex-wrap gap-3 text-xs text-surface-400 dark:text-surface-500">
          {activity.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {activity.location}
            </span>
          )}
          {activity.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {activity.duration}
            </span>
          )}
          {activity.cost && (
            <span className="flex items-center gap-1">
              <IndianRupee className="w-3 h-3" /> {activity.cost}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function DayCard({ day }) {
  const [expanded, setExpanded] = useState(day.day <= 2);

  return (
    <div className="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface-50 dark:bg-surface-800/60 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0">
            {day.day}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{day.title}</p>
            {day.description && (
              <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-1">{day.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default">{day.activities?.length || 0} activities</Badge>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-surface-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-surface-400" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 divide-y divide-surface-100 dark:divide-surface-800">
              {day.activities?.map((activity, i) => (
                <ActivityItem key={i} activity={activity} />
              ))}
              {(!day.activities || day.activities.length === 0) && (
                <p className="py-4 text-sm text-surface-400 dark:text-surface-500 text-center">No activities planned for this day.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TimelineBlock({ block }) {
  if (!block) return null;
  const { days = [] } = block;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">Day-by-Day Itinerary</h2>
            <p className="text-xs text-surface-500 dark:text-surface-400">{days.length} days planned</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {days.length > 0 ? (
          days.map((day) => <DayCard key={day.day} day={day} />)
        ) : (
          <p className="text-sm text-surface-400 dark:text-surface-500 text-center py-4">No itinerary available.</p>
        )}
      </CardContent>
    </Card>
  );
}
