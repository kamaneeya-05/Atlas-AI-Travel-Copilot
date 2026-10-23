/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const TripsContext = createContext(null);

const STORAGE_KEY = 'atlas-ai-trips';

// ── Reducer ──────────────────────────────────────────────────────────────────
function tripsReducer(state, action) {
  switch (action.type) {
    case 'SET_TRIPS':
      return { ...state, trips: action.payload };

    case 'ADD_TRIP':
      return { ...state, trips: [action.payload, ...state.trips] };

    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map((t) =>
          t.tripId === action.payload.tripId ? { ...t, ...action.payload } : t
        ),
      };

    case 'DELETE_TRIP':
      return {
        ...state,
        trips: state.trips.filter((t) => t.tripId !== action.payload),
      };

    case 'SET_GENERATING':
      return { ...state, generating: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

const initialState = {
  trips: [],
  generating: false,
  error: null,
};

// ── Provider ──────────────────────────────────────────────────────────────────
export function TripsProvider({ children }) {
  const [state, dispatch] = useReducer(tripsReducer, initialState);

  // Load trips from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'SET_TRIPS', payload: parsed });
        }
      }
    } catch (err) {
      console.error('[TripsContext] Failed to load trips:', err);
    }
  }, []);

  // Persist trips to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.trips));
    } catch (err) {
      console.error('[TripsContext] Failed to persist trips:', err);
    }
  }, [state.trips]);

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Generate a new trip by calling the backend API (POST /api/generate).
   * The backend returns JSON, which we store in localStorage.
   */
  const generateTrip = useCallback(async (formData) => {
    dispatch({ type: 'SET_GENERATING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: AbortSignal.timeout(180000), // 3 min timeout for long trips (25+ days)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      const trip = result.data || result;

      // Add client-side metadata
      trip.createdAt = trip.createdAt || new Date().toISOString();
      trip.updatedAt = new Date().toISOString();

      dispatch({ type: 'ADD_TRIP', payload: trip });
      return trip;
    } catch (err) {
      const message =
        err.name === 'TimeoutError'
          ? 'Request timed out. The AI is taking too long. Please try again.'
          : err.name === 'TypeError' && !navigator.onLine
          ? 'You are offline. Please check your internet connection.'
          : err.message || 'Failed to generate trip. Please try again.';
      
      dispatch({ type: 'SET_ERROR', payload: message });
      throw new Error(message);
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  }, []);

  /**
   * Delete a trip (client-side only, localStorage).
   */
  const deleteTrip = useCallback((tripId) => {
    dispatch({ type: 'DELETE_TRIP', payload: tripId });
  }, []);

  /**
   * Duplicate a trip (client-side, creates a copy in localStorage).
   */
  const duplicateTrip = useCallback((tripId) => {
    const original = state.trips.find((t) => t.tripId === tripId);
    if (!original) return null;

    const copy = {
      ...JSON.parse(JSON.stringify(original)),
      tripId: `trip-${Date.now()}-copy`,
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_TRIP', payload: copy });
    return copy;
  }, [state.trips]);

  /**
   * Get a trip by ID from local state.
   */
  const getTripById = useCallback(
    (tripId) => state.trips.find((t) => t.tripId === tripId) || null,
    [state.trips]
  );

  /**
   * Update a trip (client-side, localStorage).
   */
  const updateTrip = useCallback((updatedTrip) => {
    updatedTrip.updatedAt = new Date().toISOString();
    dispatch({ type: 'UPDATE_TRIP', payload: updatedTrip });
  }, []);

  /**
   * Clear error state.
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <TripsContext.Provider
      value={{
        trips: state.trips,
        generating: state.generating,
        error: state.error,
        generateTrip,
        deleteTrip,
        duplicateTrip,
        getTripById,
        updateTrip,
        clearError,
      }}
    >
      {children}
    </TripsContext.Provider>
  );
}

export function useTripsContext() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error('useTripsContext must be used within TripsProvider');
  return ctx;
}
