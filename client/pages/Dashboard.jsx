import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Globe, Clock, MapPin,
  LayoutDashboard, TrendingUp, Compass, History,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import PageTransition from '../components/layout/PageTransition.jsx';
import StatCard from '../components/cards/StatCard.jsx';
import TripCard from '../components/cards/TripCard.jsx';
import QuickAction from '../components/cards/QuickAction.jsx';
import SearchBar from '../components/forms/SearchBar.jsx';
import FilterBar from '../components/forms/FilterBar.jsx';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import { useTrips } from '../hooks/useTrips.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useToast } from '../components/common/Toast.jsx';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { trips, deleteTrip, duplicateTrip } = useTrips();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt-desc');
  const [filter, setFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  const debouncedSearch = useDebounce(search, 250);

  const filteredTrips = useMemo(() => {
    let result = [...trips];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (t) =>
          t.destination?.toLowerCase().includes(q) ||
          t.title?.toLowerCase().includes(q) ||
          t.summary?.toLowerCase().includes(q)
      );
    }

    if (filter !== 'all') {
      result = result.filter((t) => {
        const budget = t.blocks?.find((b) => b.type === 'budget');
        return budget?.budgetLevel === filter;
      });
    }

    const [field, dir] = sort.split('-');
    result.sort((a, b) => {
      const va = a[field] ?? '';
      const vb = b[field] ?? '';
      return dir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

    return result;
  }, [trips, debouncedSearch, filter, sort]);

  const stats = useMemo(() => {
    const destinations = new Set(trips.map((t) => t.destination?.split(',')[0]).filter(Boolean));
    const totalDays = trips.reduce((sum, t) => {
      const tl = t.blocks?.find((b) => b.type === 'timeline');
      return sum + (tl?.days?.length || 0);
    }, 0);
    const thisMonth = trips.filter((t) => {
      const d = new Date(t.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return { total: trips.length, destinations: destinations.size, totalDays, thisMonth };
  }, [trips]);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteTrip(deleteId);
    toast('Trip deleted', 'success');
    setDeleteId(null);
  };

  const handleDuplicate = (tripId) => {
    const copy = duplicateTrip(tripId);
    if (copy) {
      toast('Trip duplicated!', 'success');
      navigate(`/trip/${copy.tripId}`);
    }
  };

  const quickActions = [
    { label: 'New Trip', description: 'Plan a new adventure with AI', icon: Plus, color: 'brand', onClick: () => navigate('/trip/new') },
    { label: 'Browse History', description: 'View all your saved trips', icon: History, color: 'emerald', onClick: () => navigate('/history') },
    { label: 'Explore Ideas', description: 'Get inspired for your next trip', icon: Compass, color: 'accent', onClick: () => navigate('/trip/new') },
  ];

  return (
    <AppLayout>
      <PageTransition>
        <div className="page-container py-8">
          {/* Header */}
          <motion.div
            variants={stagger} initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <motion.div variants={fadeUp}>
              <div className="flex items-center gap-2 mb-1">
                <LayoutDashboard className="w-5 h-5 text-brand-500" />
                <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Dashboard</h1>
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {trips.length > 0
                  ? `You have ${trips.length} saved trip${trips.length !== 1 ? 's' : ''}`
                  : 'Start planning your first adventure'}
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Button variant="primary" onClick={() => navigate('/trip/new')}>
                <Plus className="w-4 h-4" /> New Trip
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={stagger} initial="hidden" animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Total Trips', value: stats.total, icon: Globe, color: 'brand' },
              { label: 'Destinations', value: stats.destinations, icon: MapPin, color: 'emerald' },
              { label: 'Days Planned', value: stats.totalDays, icon: Clock, color: 'amber' },
              { label: 'This Month', value: stats.thisMonth, icon: TrendingUp, color: 'accent' },
            ].map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <StatCard {...s} />
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-5">
              {trips.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
                  <SearchBar value={search} onChange={setSearch} placeholder="Search trips by destination or title…" />
                  <FilterBar sort={sort} onSortChange={setSort} filter={filter} onFilterChange={setFilter} />
                </motion.div>
              )}

              {filteredTrips.length > 0 ? (
                <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredTrips.map((trip) => (
                    <motion.div key={trip.tripId} variants={fadeUp}>
                      <TripCard trip={trip} onDelete={(id) => setDeleteId(id)} onDuplicate={handleDuplicate} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : trips.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900">
                  <EmptyState
                    icon={Globe}
                    title="No trips yet"
                    description="Create your first AI-powered travel itinerary. It takes less than 30 seconds."
                    action={
                      <Button variant="primary" onClick={() => navigate('/trip/new')}>
                        <Plus className="w-4 h-4" /> Plan my first trip
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900">
                  <EmptyState
                    icon={MapPin}
                    title="No trips match your search"
                    description="Try a different search term or clear the filters."
                    action={
                      <Button variant="secondary" onClick={() => { setSearch(''); setFilter('all'); }}>
                        Clear filters
                      </Button>
                    }
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Quick Actions</h2>
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <QuickAction key={action.label} {...action} />
                  ))}
                </div>
              </motion.div>

              {trips.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 shadow-soft"
                >
                  <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Recent Trips</h2>
                  <div className="space-y-1">
                    {trips.slice(0, 5).map((trip) => (
                      <button
                        key={trip.tripId}
                        onClick={() => navigate(`/trip/${trip.tripId}`)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors group text-left"
                      >
                        <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-surface-800 dark:text-surface-200 truncate">{trip.title || trip.destination}</p>
                          <p className="text-xs text-surface-400 dark:text-surface-500 truncate">{trip.destination}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {trips.length > 5 && (
                    <button onClick={() => navigate('/history')} className="w-full text-center text-xs text-brand-600 dark:text-brand-400 font-medium mt-3 hover:underline">
                      View all {trips.length} trips →
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </PageTransition>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete this trip?"
        description="This action cannot be undone. The trip will be permanently removed from your history."
        confirmLabel="Delete"
      />
    </AppLayout>
  );
}
