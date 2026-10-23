import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, Copy, Trash2, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import { formatRelativeTime, getDestinationImage } from '../../lib/utils.js';

export default function TripCard({ trip, onDelete, onDuplicate }) {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(trip.tripId);
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    onDuplicate?.(trip.tripId);
  };

  const budgetBlock = trip.blocks?.find((b) => b.type === 'budget');
  const timelineBlock = trip.blocks?.find((b) => b.type === 'timeline');
  const daysCount = timelineBlock?.days?.length ?? 0;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-soft overflow-hidden cursor-pointer"
      onClick={() => navigate(`/trip/${trip.tripId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/trip/${trip.tripId}`)}
      aria-label={`View ${trip.title || trip.destination} trip`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-brand-400 to-accent-500">
        <img
          src={getDestinationImage(trip.destination)}
          alt={trip.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-base line-clamp-1">{trip.title || trip.destination}</h3>
          <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
            <MapPin className="w-3 h-3" />
            <span>{trip.destination}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleDuplicate}
            className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            title="Duplicate trip"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500/70 transition-colors"
            title="Delete trip"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {trip.duration && (
            <Badge variant="primary" className="text-xs">
              <Clock className="w-3 h-3" /> {trip.duration}
            </Badge>
          )}
          {daysCount > 0 && (
            <Badge variant="default" className="text-xs">
              <Calendar className="w-3 h-3" /> {daysCount} days
            </Badge>
          )}
          {budgetBlock?.budgetLevel && (
            <Badge
              variant={
                budgetBlock.budgetLevel === 'luxury' ? 'danger' :
                budgetBlock.budgetLevel === 'mid-range' ? 'warning' : 'success'
              }
              className="text-xs capitalize"
            >
              {budgetBlock.budgetLevel}
            </Badge>
          )}
        </div>

        {trip.summary && (
          <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 mb-3 leading-relaxed">
            {trip.summary}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-surface-400 dark:text-surface-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatRelativeTime(trip.createdAt)}
          </span>
          <span className="text-xs text-brand-600 dark:text-brand-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            View trip <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
