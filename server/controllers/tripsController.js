import { generateItinerary } from '../services/geminiService.js';
import { tripsStore } from '../services/tripsStore.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/trips/generate
 */
export async function generateTrip(req, res, next) {
  try {
    const { prompt, destination, duration, budget, travelers, preferences } = req.body;

    const tripData = await generateItinerary({
      prompt,
      destination,
      duration,
      budget,
      travelers,
      preferences,
    });

    // Assign a server-side tripId if not returned by AI
    if (!tripData.tripId) {
      tripData.tripId = uuidv4();
    }

    tripData.createdAt = new Date().toISOString();
    tripData.updatedAt = new Date().toISOString();
    tripData.prompt = prompt;

    tripsStore.save(tripData);

    res.status(201).json({ success: true, data: tripData });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/trips
 */
export async function getAllTrips(req, res, next) {
  try {
    const { search, sortBy = 'createdAt', order = 'desc' } = req.query;
    let trips = tripsStore.getAll();

    if (search) {
      const q = search.toLowerCase();
      trips = trips.filter(
        (t) =>
          t.destination?.toLowerCase().includes(q) ||
          t.title?.toLowerCase().includes(q)
      );
    }

    trips.sort((a, b) => {
      const valA = a[sortBy] ?? '';
      const valB = b[sortBy] ?? '';
      return order === 'asc'
        ? valA > valB ? 1 : -1
        : valA < valB ? 1 : -1;
    });

    res.json({ success: true, data: trips, count: trips.length });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/trips/:id
 */
export async function getTripById(req, res, next) {
  try {
    const trip = tripsStore.getById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/trips/:id
 */
export async function deleteTrip(req, res, next) {
  try {
    const deleted = tripsStore.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/trips/:id/duplicate
 */
export async function duplicateTrip(req, res, next) {
  try {
    const original = tripsStore.getById(req.params.id);
    if (!original) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }

    const duplicate = {
      ...JSON.parse(JSON.stringify(original)),
      tripId: uuidv4(),
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tripsStore.save(duplicate);

    res.status(201).json({ success: true, data: duplicate });
  } catch (err) {
    next(err);
  }
}
