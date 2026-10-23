import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Tags, Wand2 } from 'lucide-react';
import Button from '../common/Button.jsx';
import Input, { Select } from '../common/Input.jsx';
import { cn } from '../../lib/utils.js';

const PREFERENCE_OPTIONS = [
  'Adventure', 'Culture', 'Food & Dining', 'Nature', 'Beach',
  'History', 'Shopping', 'Nightlife', 'Family-friendly', 'Budget',
  'Luxury', 'Photography', 'Sports', 'Wellness & Spa', 'Local Experience',
];

const EXAMPLE_PROMPTS = [
  '5 days in Goa for a couple on a mid-range budget',
  '7 days in Rajasthan — Jaipur, Jodhpur and Udaipur',
  'Weekend trip to Coorg from Bangalore for nature lovers',
  'Family vacation in Kerala backwaters for 5 days',
  '10 days in Himachal Pradesh — Manali and Spiti Valley',
  '3 days in Pondicherry for a solo traveler on a budget',
];

const DURATION_OPTIONS = [
  { value: '', label: 'Select duration…' },
  { value: '2 days', label: '2 Days (Weekend)' },
  { value: '3 days', label: '3 Days' },
  { value: '5 days', label: '5 Days' },
  { value: '7 days', label: '1 Week' },
  { value: '10 days', label: '10 Days' },
  { value: '14 days', label: '2 Weeks' },
  { value: '21 days', label: '3 Weeks' },
  { value: '25 days', label: '25 Days' },
  { value: '30 days', label: '1 Month' },
];

const BUDGET_OPTIONS = [
  { value: '', label: 'Select budget…' },
  { value: 'Budget (under ₹15,000)', label: 'Budget (under ₹15,000)' },
  { value: 'Mid-range (₹15,000-₹50,000)', label: 'Mid-range (₹15,000–₹50,000)' },
  { value: 'Comfortable (₹50,000-₹1,50,000)', label: 'Comfortable (₹50,000–₹1,50,000)' },
  { value: 'Luxury (₹1,50,000+)', label: 'Luxury (₹1,50,000+)' },
];

const TRAVELERS_OPTIONS = [
  { value: '', label: 'Select travelers…' },
  { value: 'Solo traveler', label: 'Solo' },
  { value: 'Couple', label: 'Couple' },
  { value: 'Family with kids', label: 'Family with kids' },
  { value: 'Group of friends', label: 'Group of friends' },
  { value: 'Business traveler', label: 'Business' },
];

export default function TripForm({ onSubmit, loading = false }) {
  const [form, setForm] = useState({
    prompt: '',
    destination: '',
    duration: '',
    budget: '',
    travelers: '',
    preferences: [],
  });
  const [errors, setErrors] = useState({});

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const togglePref = (pref) => {
    setForm((f) => ({
      ...f,
      preferences: f.preferences.includes(pref)
        ? f.preferences.filter((p) => p !== pref)
        : [...f.preferences, pref],
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.prompt.trim()) errs.prompt = 'Please describe your trip.';
    else if (form.prompt.trim().length < 10) errs.prompt = 'Please provide more detail (at least 10 characters).';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  const applyExamplePrompt = (prompt) => {
    set('prompt', prompt);
    // Auto-extract destination hint
    const destMatch = prompt.match(/in ([A-Z][a-zA-Z\s]+?)(?:\s+for|\s+on|\s+with|$)/);
    if (destMatch) set('destination', destMatch[1].trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main prompt */}
      <div>
        <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
          Describe your dream trip <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            value={form.prompt}
            onChange={(e) => set('prompt', e.target.value)}
            placeholder="e.g. 7 days in Tokyo for a solo traveler interested in food, culture, and anime..."
            rows={4}
            className={cn(
              'input-base resize-none',
              errors.prompt && 'border-red-500 focus:ring-red-500/40 focus:border-red-500'
            )}
          />
          <Sparkles className="absolute right-3 top-3 w-4 h-4 text-brand-400 pointer-events-none" />
        </div>
        {errors.prompt && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.prompt}</p>
        )}

        {/* Example prompts */}
        <div className="mt-3">
          <p className="text-xs text-surface-400 dark:text-surface-500 mb-2">Try an example:</p>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_PROMPTS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyExamplePrompt(p)}
                className="text-xs px-2.5 py-1 rounded-full border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-brand-300 dark:hover:border-brand-600 hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-1"
              >
                {p.length > 48 ? p.slice(0, 48) + '…' : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Optional fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Destination (optional)"
          placeholder="e.g. Tokyo, Japan"
          value={form.destination}
          onChange={(e) => set('destination', e.target.value)}
          icon={MapPin}
          name="destination"
        />
        <Select
          label="Duration (optional)"
          value={form.duration}
          onChange={(e) => set('duration', e.target.value)}
          name="duration"
        >
          {DURATION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
        <Select
          label="Budget (optional)"
          value={form.budget}
          onChange={(e) => set('budget', e.target.value)}
          name="budget"
        >
          {BUDGET_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
        <Select
          label="Travelers (optional)"
          value={form.travelers}
          onChange={(e) => set('travelers', e.target.value)}
          name="travelers"
        >
          {TRAVELERS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>

      {/* Preferences */}
      <div>
        <p className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 flex items-center gap-1.5">
          <Tags className="w-4 h-4 text-brand-500" /> Travel Style (optional)
        </p>
        <div className="flex flex-wrap gap-2">
          {PREFERENCE_OPTIONS.map((pref) => (
            <button
              key={pref}
              type="button"
              onClick={() => togglePref(pref)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full border transition-all duration-150',
                form.preferences.includes(pref)
                  ? 'bg-brand-600 border-brand-600 text-white font-medium'
                  : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-brand-300 dark:hover:border-brand-600 hover:text-brand-600 dark:hover:text-brand-400'
              )}
            >
              {pref}
            </button>
          ))}
        </div>
      </div>

      {/* Duration notice for long trips */}
      {form.duration && parseInt(form.duration) >= 14 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800"
        >
          <span className="text-lg">⏱️</span>
          <p className="text-xs text-brand-700 dark:text-brand-400 leading-relaxed">
            <strong>{form.duration}</strong> trip detected. Atlas AI will generate every single day in full detail — this may take 30–60 seconds. Worth the wait!
          </p>
        </motion.div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full"
      >
        {loading ? 'Crafting your itinerary…' : (
          <>
            <Wand2 className="w-5 h-5" />
            Generate My Itinerary
          </>
        )}
      </Button>

      {loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-center text-surface-500 dark:text-surface-400"
        >
          Atlas AI is crafting a personalized itinerary just for you. This usually takes 10–30 seconds.
        </motion.p>
      )}
    </form>
  );
}
