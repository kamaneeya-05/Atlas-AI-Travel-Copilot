import { GenerateTripRequestSchema } from '../validation/tripSchema.js';

export function validateGenerateTrip(req, res, next) {
  const result = GenerateTripRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request data',
      details: result.error.flatten().fieldErrors,
    });
  }
  req.body = result.data;
  next();
}
