import { UtensilsCrossed, MapPin, Clock, Star } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';

const priceVariants = {
  '₹':    'success',
  '₹₹':   'warning',
  '₹₹₹':  'danger',
  '₹₹₹₹': 'danger',
  // fallback for old $ format
  '$':    'success',
  '$$':   'warning',
  '$$$':  'danger',
  '$$$$': 'danger',
};

function RestaurantCard({ restaurant }) {
  return (
    <div className="rounded-xl border border-surface-200 dark:border-surface-700 p-4 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">{restaurant.name}</h3>
          {restaurant.cuisine && (
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{restaurant.cuisine}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {restaurant.rating && (
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {restaurant.rating}
            </span>
          )}
          {restaurant.priceRange && (
            <Badge variant={priceVariants[restaurant.priceRange] || 'default'}>
              {restaurant.priceRange}
            </Badge>
          )}
        </div>
      </div>
      {restaurant.description && (
        <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed mb-2">{restaurant.description}</p>
      )}
      {restaurant.mustTry && (
        <div className="text-xs text-brand-600 dark:text-brand-400 font-medium mb-2">
          Must try: {restaurant.mustTry}
        </div>
      )}
      <div className="flex flex-wrap gap-3 text-xs text-surface-400 dark:text-surface-500">
        {restaurant.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {restaurant.location}
          </span>
        )}
        {restaurant.openHours && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {restaurant.openHours}
          </span>
        )}
      </div>
    </div>
  );
}

export default function RestaurantsBlock({ block }) {
  if (!block) return null;
  const { items = [] } = block;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">Restaurant Recommendations</h2>
            <p className="text-xs text-surface-500 dark:text-surface-400">{items.length} places to eat</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((r, i) => <RestaurantCard key={i} restaurant={r} />)}
          {items.length === 0 && (
            <p className="text-sm text-surface-400 text-center py-4 col-span-2">No restaurant suggestions available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
