import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Plus, Globe } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import PageTransition from '../components/layout/PageTransition.jsx';
import TripCard from '../components/cards/TripCard.jsx';
import SearchBar from '../components/forms/SearchBar.jsx';
import FilterBar from '../components/forms/FilterBar.jsx';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import { useTrips } from '../hooks/useTrips.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useToast } from '../components/common/Toast.jsx';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
};

export default function History() {
  const navigate = useNavigate();
  const { trips, deleteTrip, duplicateTrip } = useTrips();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt-desc');
  const [filter, setFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  const debouncedSearch = useDebounce(search, 250);

  const filtered = useMemo(() => {
    let result = [...trips];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((t) =>
        t.destination?.toLowerCase().includes(q) ||
        t.title?.toLowerCase().includes(q) ||
        t.summary?.toLowerCase().includes(q)
      );
    }
    if (filter !== 'all') {
      result = result.filter((t) => {
        const b = t.blocks?.find((b) => b.type === 'budget');
        return b?.budgetLevel === filter;
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

  return (
    <AppLayout>
      <PageTransition>
        <div className="page-container py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HistoryIcon className="w-5 h-5 text-brand-500" />
                <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Trip History</h1>
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {trips.length} trip{trips.length !== 1 ? 's' : ''} saved locally
              </p>
            </div>
            <Button variant="primary" onClick={() => navigate('/trip/new')}>
              <Plus className="w-4 h-4" /> New Trip
            </Button>
          </div>

          {trips.length > 0 && (
            <div className="space-y-3 mb-6">
              <SearchBar value={search} onChange={setSearch} placeholder="Search by destination, title…" />
              <FilterBar sort={sort} onSortChange={setSort} filter={filter} onFilterChange={setFilter} />
            </div>
          )}

          {filtered.length > 0 ? (
            <motion.div
              variants={stagger} initial="hidden" animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((trip) => (
                <motion.div key={trip.tripId} variants={fadeUp}>
                  <TripCard trip={trip} onDelete={(id) => setDeleteId(id)} onDuplicate={handleDuplicate} />
                </motion.div>
              ))}
            </motion.div>
          ) : trips.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900">
              <EmptyState
                icon={Globe}
                title="No trips in history"
                description="All your AI-generated trips will appear here. Start planning your first adventure."
                action={
                  <Button variant="primary" onClick={() => navigate('/trip/new')}>
                    <Plus className="w-4 h-4" /> Create my first trip
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900">
              <EmptyState
                icon={Globe}
                title="No trips match your search"
                description="Try different keywords or clear the active filters."
                action={
                  <Button variant="secondary" onClick={() => { setSearch(''); setFilter('all'); }}>
                    Clear filters
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </PageTransition>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete trip?"
        description="This action cannot be undone."
        confirmLabel="Delete"
      />
    </AppLayout>
  );
}
