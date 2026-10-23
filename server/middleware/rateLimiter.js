const requests = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30;

export function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  if (!requests.has(ip)) {
    requests.set(ip, []);
  }

  // Remove old requests outside window
  const userRequests = requests.get(ip).filter((time) => time > windowStart);
  userRequests.push(now);
  requests.set(ip, userRequests);

  if (userRequests.length > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a moment before trying again.',
    });
  }

  next();
}
