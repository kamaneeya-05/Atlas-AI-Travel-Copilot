/**
 * In-memory trips store (server-side).
 * In production, replace with a database.
 */
const trips = new Map();

export const tripsStore = {
  save(trip) {
    trips.set(trip.tripId, trip);
    return trip;
  },

  getAll() {
    return Array.from(trips.values());
  },

  getById(id) {
    return trips.get(id) || null;
  },

  delete(id) {
    if (!trips.has(id)) return false;
    trips.delete(id);
    return true;
  },

  update(id, updates) {
    const existing = trips.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    trips.set(id, updated);
    return updated;
  },

  count() {
    return trips.size;
  },
};
