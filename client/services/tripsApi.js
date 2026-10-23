/**
 * Client-side API service for trips.
 * All requests proxy through Vite to the Express server.
 */

const BASE = '/api/trips';

async function request(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }
    return data;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.');
    if (!navigator.onLine) throw new Error('You are offline. Please check your connection.');
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export const tripsApi = {
  generate: (body) =>
    request(`${BASE}/generate`, { method: 'POST', body: JSON.stringify(body) }),

  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`${BASE}${qs ? `?${qs}` : ''}`);
  },

  getById: (id) => request(`${BASE}/${id}`),

  delete: (id) => request(`${BASE}/${id}`, { method: 'DELETE' }),

  duplicate: (id) => request(`${BASE}/${id}/duplicate`, { method: 'POST' }),
};
