import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Share2, Download, Copy, Trash2, RefreshCw,
  MapPin, Clock, Globe, Calendar, CheckCheck, Edit3,
  ExternalLink, MoreHorizontal, Sparkles, StickyNote,
} from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AppLayout from '../components/layout/AppLayout.jsx';
import PageTransition from '../components/layout/PageTransition.jsx';
import BlockRenderer from '../components/renderer/BlockRenderer.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import Modal from '../components/common/Modal.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useTrips } from '../hooks/useTrips.js';
import { useClipboard } from '../hooks/useClipboard.js';
import { useToast } from '../components/common/Toast.jsx';
import { formatDate, getDestinationImage, tripItineraryToText } from '../lib/utils.js';
import { exportToPDF } from '../services/pdfExport.js';

// ── Sortable Block ─────────────────────────────────────────────────────────
function SortableBlock({ block }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.type });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-6 top-4 hidden md:flex flex-col gap-0.5 justify-center items-center w-5 h-8 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity text-surface-300 dark:text-surface-600 hover:text-surface-500 select-none"
        aria-label="Drag to reorder"
      >
        {[0, 1, 2].map((i) => <div key={i} className="w-3 h-0.5 bg-current rounded" />)}
      </div>
      <BlockRenderer blocks={[block]} />
    </div>
  );
}

// ── Share Modal ────────────────────────────────────────────────────────────
function ShareModal({ open, onClose, trip }) {
  const { copied, copy } = useClipboard();
  const { toast } = useToast();
  const shareUrl = `${window.location.origin}/trip/${trip?.tripId}`;
  const shareText = trip ? tripItineraryToText(trip) : '';

  return (
    <Modal open={open} onClose={onClose} title="Share Trip" size="sm">
      <div className="space-y-4">
        <div>
          <p className="text-xs text-surface-500 dark:text-surface-400 mb-2 font-medium">Share link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 text-xs bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl px-3 py-2.5 text-surface-500 truncate font-mono">
              {shareUrl}
            </div>
            <Button variant="secondary" size="sm" onClick={async () => { const ok = await copy(shareUrl); if (ok) toast('Link copied!', 'success'); }}>
              {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
        <div className="pt-2 border-t border-surface-100 dark:border-surface-800">
          <p className="text-xs text-surface-500 dark:text-surface-400 mb-2 font-medium">Copy full itinerary</p>
          <Button variant="secondary" className="w-full" onClick={async () => { const ok = await copy(shareText); if (ok) toast('Itinerary copied!', 'success'); }}>
            <Copy className="w-4 h-4" /> Copy as Text
          </Button>
        </div>
        {typeof navigator.share === 'function' && (
          <Button variant="primary" className="w-full" onClick={() => navigator.share({ title: trip?.title, text: shareText, url: shareUrl }).catch(() => {})}>
            <Share2 className="w-4 h-4" /> Share via…
          </Button>
        )}
      </div>
    </Modal>
  );
}

// ── Notes Modal ────────────────────────────────────────────────────────────
function NotesModal({ open, onClose, notes, onSave }) {
  const [value, setValue] = useState(notes || '');

  return (
    <Modal open={open} onClose={onClose} title="Trip Notes" size="md">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add notes, reminders, or ideas for this trip…"
        rows={6}
        className="input-base resize-none mb-4"
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={() => { onSave(value); onClose(); }}>Save Notes</Button>
      </div>
    </Modal>
  );
}

// ── Map Placeholder ────────────────────────────────────────────────────────
function MapPlaceholder({ destination }) {
  return (
    <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-900 h-44 flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        aria-hidden="true"
      />
      <div className="text-center relative z-10 px-4">
        <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950/60 flex items-center justify-center mx-auto mb-2">
          <MapPin className="w-5 h-5 text-brand-500" />
        </div>
        <p className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1">{destination}</p>
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(destination || '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:underline"
        >
          Open in Maps <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// ── Action Dropdown Menu ───────────────────────────────────────────────────
function ActionMenu({ onShare, onExport, onCopy, onDuplicate, onDelete, onNotes, exporting }) {
  const [open, setOpen] = useState(false);
  const items = [
    { icon: Share2,   label: 'Share',          onClick: onShare },
    { icon: Download, label: exporting ? 'Exporting…' : 'Export PDF', onClick: onExport, disabled: exporting },
    { icon: Copy,     label: 'Copy text',       onClick: onCopy },
    { icon: RefreshCw,label: 'Duplicate',       onClick: onDuplicate },
    { icon: StickyNote,label: 'Notes',          onClick: onNotes },
    { icon: Trash2,   label: 'Delete',          onClick: onDelete, danger: true },
  ];

  return (
    <div className="relative">
      <Button variant="secondary" size="icon" onClick={() => setOpen((v) => !v)} aria-label="More actions">
        <MoreHorizontal className="w-4 h-4" />
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            onMouseLeave={() => setOpen(false)}
            className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl shadow-card z-50 overflow-hidden"
          >
            {items.map((item) => (
              <button
                key={item.label}
                disabled={item.disabled}
                onClick={() => { item.onClick(); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors disabled:opacity-50 text-left ${
                  item.danger
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
                    : 'text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTripById, deleteTrip, duplicateTrip, updateTrip } = useTrips();
  const { copy } = useClipboard();
  const { toast } = useToast();

  const trip = getTripById(id);

  // Keep local block order so drag & drop feels instant
  // Always sync from localStorage-backed trip on first render
  const [blocks, setBlocks] = useState(() => trip?.blocks || []);
  const [notes, setNotes]   = useState(() => trip?.notes || '');

  // If blocks are empty (page was refreshed) re-sync from trip
  useEffect(() => {
    if (trip?.blocks?.length && blocks.length === 0) {
      setBlocks(trip.blocks);
    }
    if (trip?.notes && !notes) {
      setNotes(trip.notes);
    }
  }, [trip, blocks.length, notes]);
  const [shareOpen, setShareOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const contentRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      setActiveId(null);
      if (!over || active.id === over.id) return;
      setBlocks((prev) => {
        const from = prev.findIndex((b) => b.type === active.id);
        const to   = prev.findIndex((b) => b.type === over.id);
        const reordered = arrayMove(prev, from, to);
        // Persist reordered blocks to localStorage via context
        if (trip) updateTrip({ ...trip, blocks: reordered });
        return reordered;
      });
    },
    [trip, updateTrip]
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleDelete = () => {
    deleteTrip(id);
    toast('Trip deleted', 'success');
    navigate('/dashboard');
  };

  const handleDuplicate = () => {
    const copied = duplicateTrip(id);
    if (copied) {
      toast('Trip duplicated!', 'success');
      navigate(`/trip/${copied.tripId}`);
    }
  };

  const handleExportPDF = async () => {
    if (!trip) return;
    setExporting(true);
    try {
      await exportToPDF(trip);
      toast('PDF exported!', 'success');
    } catch (err) {
      toast(`Export failed: ${err.message}`, 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleCopyText = async () => {
    const text = tripItineraryToText(trip);
    const ok = await copy(text);
    if (ok) toast('Itinerary copied to clipboard!', 'success');
  };

  const handleSaveNotes = (val) => {
    setNotes(val);
    if (trip) updateTrip({ ...trip, notes: val });
    toast('Notes saved', 'success');
  };

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!trip) {
    return (
      <AppLayout>
        <PageTransition>
          <div className="page-container py-16">
            <EmptyState
              icon={Globe}
              title="Trip not found"
              description="This trip doesn't exist or has been deleted from your history."
              action={
                <Button variant="primary" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              }
            />
          </div>
        </PageTransition>
      </AppLayout>
    );
  }

  const budgetBlock   = blocks.find((b) => b.type === 'budget');
  const timelineBlock = blocks.find((b) => b.type === 'timeline');

  return (
    <AppLayout>
      <PageTransition>
        {/* ── Hero ── */}
        <div className="relative h-64 sm:h-80 overflow-hidden bg-gradient-to-br from-brand-500 to-accent-600">
          <img
            src={getDestinationImage(trip.destination)}
            alt={trip.destination}
            className="w-full h-full object-cover opacity-70 dark:opacity-50"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute top-4 left-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/30 backdrop-blur-sm text-white text-sm hover:bg-black/40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="page-container">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 drop-shadow">
                  {trip.title || trip.destination}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 text-white/80 text-sm"><MapPin className="w-4 h-4" />{trip.destination}</span>
                  {trip.duration && <span className="flex items-center gap-1.5 text-white/80 text-sm"><Clock className="w-4 h-4" />{trip.duration}</span>}
                  {trip.createdAt && <span className="flex items-center gap-1.5 text-white/80 text-sm"><Calendar className="w-4 h-4" />{formatDate(trip.createdAt)}</span>}
                  {budgetBlock?.budgetLevel && (
                    <Badge variant={budgetBlock.budgetLevel === 'luxury' ? 'danger' : budgetBlock.budgetLevel === 'mid-range' ? 'warning' : 'success'} className="capitalize">
                      {budgetBlock.budgetLevel}
                    </Badge>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="page-container py-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {trip.language     && <Badge variant="default"><Globe className="w-3 h-3" /> {trip.language}</Badge>}
              {trip.bestTimeToVisit && <Badge variant="primary"><Sparkles className="w-3 h-3" /> Best: {trip.bestTimeToVisit}</Badge>}
              {trip.currency     && <Badge variant="default">{trip.currency}</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShareOpen(true)}><Share2 className="w-3.5 h-3.5" /> Share</Button>
                <Button variant="secondary" size="sm" onClick={handleExportPDF} disabled={exporting}>
                  <Download className="w-3.5 h-3.5" /> {exporting ? 'Exporting…' : 'Export PDF'}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleCopyText}><Copy className="w-3.5 h-3.5" /> Copy</Button>
              </div>
              <ActionMenu
                onShare={() => setShareOpen(true)}
                onExport={handleExportPDF}
                onCopy={handleCopyText}
                onDuplicate={handleDuplicate}
                onDelete={() => setDeleteOpen(true)}
                onNotes={() => setNotesOpen(true)}
                exporting={exporting}
              />
            </div>
          </div>

          {/* Summary banner */}
          {trip.summary && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 p-5 mb-6">
              <p className="text-sm text-brand-800 dark:text-brand-300 leading-relaxed">{trip.summary}</p>
            </motion.div>
          )}

          {/* Notes banner */}
          {notes && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 mb-6 flex items-start gap-3">
              <StickyNote className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">My Notes</p>
                <p className="text-sm text-amber-700 dark:text-amber-400 whitespace-pre-wrap leading-relaxed">{notes}</p>
              </div>
              <button onClick={() => setNotesOpen(true)} className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {/* Main 2-col grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Draggable Blocks ── */}
            <div className="lg:col-span-2" ref={contentRef}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={(e) => setActiveId(e.active.id)}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={blocks.map((b) => b.type)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-5 pl-6">
                    {blocks.map((block) => (
                      <SortableBlock key={block.type} block={block} />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeId && (
                    <div className="opacity-90 shadow-card rounded-2xl pointer-events-none">
                      <BlockRenderer blocks={[blocks.find((b) => b.type === activeId)].filter(Boolean)} />
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-4">
              <MapPlaceholder destination={trip.destination} />

              {/* Trip Info */}
              <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 shadow-soft">
                <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Trip Info</h3>
                <dl className="space-y-2.5">
                  {[
                    { label: 'Destination', value: trip.destination,  icon: MapPin },
                    { label: 'Duration',    value: trip.duration,     icon: Clock },
                    { label: 'Days',        value: timelineBlock?.days?.length ? `${timelineBlock.days.length} days` : null, icon: Calendar },
                    { label: 'Est. Budget', value: budgetBlock?.totalEstimate },
                    { label: 'Currency',    value: trip.currency },
                    { label: 'Language',    value: trip.language },
                    { label: 'Timezone',    value: trip.timezone },
                  ].filter((i) => i.value).map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-2">
                      <dt className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1.5">
                        {item.icon && <item.icon className="w-3 h-3" />} {item.label}
                      </dt>
                      <dd className="text-xs font-semibold text-surface-800 dark:text-surface-200 text-right">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Actions */}
              <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 shadow-soft">
                <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Actions</h3>
                <div className="space-y-1">
                  {[
                    { icon: StickyNote, label: 'Add / Edit Notes',  onClick: () => setNotesOpen(true) },
                    { icon: RefreshCw,  label: 'Duplicate Trip',     onClick: handleDuplicate },
                    { icon: Download,   label: 'Export as PDF',      onClick: handleExportPDF, disabled: exporting },
                    { icon: Copy,       label: 'Copy Itinerary',     onClick: handleCopyText },
                    { icon: Share2,     label: 'Share Trip',         onClick: () => setShareOpen(true) },
                  ].map((a) => (
                    <button key={a.label} onClick={a.onClick} disabled={a.disabled}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 transition-colors disabled:opacity-50 text-left">
                      <a.icon className="w-4 h-4 shrink-0 text-brand-500" /> {a.label}
                    </button>
                  ))}
                  <button onClick={() => setDeleteOpen(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left">
                    <Trash2 className="w-4 h-4 shrink-0" /> Delete Trip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>

      {/* ── Modals ── */}
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} trip={trip} />
      <NotesModal open={notesOpen} onClose={() => setNotesOpen(false)} notes={notes} onSave={handleSaveNotes} />
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete this trip?"
        description="This permanently removes the trip from your local history. Cannot be undone."
        confirmLabel="Delete Trip"
      />
    </AppLayout>
  );
}
