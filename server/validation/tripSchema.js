import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const ActivitySchema = z.object({
  time: z.string().default(''),
  name: z.string().default('Activity'),
  description: z.string().default(''),
  duration: z.string().default(''),
  cost: z.string().default(''),
  category: z.string().default('activity'),
  location: z.string().default(''),
});

const DaySchema = z.object({
  day: z.number(),
  title: z.string().default('Day'),
  description: z.string().default(''),
  activities: z.array(ActivitySchema).default([]),
});

const TimelineBlockSchema = z.object({
  type: z.literal('timeline'),
  days: z.array(DaySchema).default([]),
});

const BudgetBreakdownSchema = z.object({
  category: z.string(),
  amount: z.string(),
  percentage: z.number().default(0),
  notes: z.string().default(''),
});

const BudgetBlockSchema = z.object({
  type: z.literal('budget'),
  currency: z.string().default('USD'),
  totalEstimate: z.string().default(''),
  breakdown: z.array(BudgetBreakdownSchema).default([]),
  savingTips: z.array(z.string()).default([]),
  budgetLevel: z.string().default('mid-range'),
});

const ChecklistItemSchema = z.object({
  id: z.string().default(() => uuidv4()),
  label: z.string(),
  essential: z.boolean().default(false),
});

const ChecklistCategorySchema = z.object({
  name: z.string(),
  icon: z.string().default('package'),
  items: z.array(ChecklistItemSchema).default([]),
});

const ChecklistBlockSchema = z.object({
  type: z.literal('checklist'),
  categories: z.array(ChecklistCategorySchema).default([]),
});

const RestaurantSchema = z.object({
  name: z.string(),
  cuisine: z.string().default(''),
  priceRange: z.string().default('$$'),
  mustTry: z.string().default(''),
  description: z.string().default(''),
  location: z.string().default(''),
  openHours: z.string().default(''),
  rating: z.string().default(''),
});

const RestaurantsBlockSchema = z.object({
  type: z.literal('restaurants'),
  items: z.array(RestaurantSchema).default([]),
});

const OverviewBlockSchema = z.object({
  type: z.literal('overview'),
  highlights: z.array(z.string()).default([]),
  mustSee: z.array(z.string()).default([]),
  localTips: z.array(z.string()).default([]),
  transportation: z.string().default(''),
});

const WeatherBlockSchema = z.object({
  type: z.literal('weather'),
  season: z.string().default(''),
  averageTemp: z.string().default(''),
  conditions: z.string().default(''),
  whatToWear: z.array(z.string()).default([]),
  weatherWarnings: z.array(z.string()).default([]),
});

const TipsBlockSchema = z.object({
  type: z.literal('tips'),
  cultural: z.array(z.string()).default([]),
  practical: z.array(z.string()).default([]),
  safety: z.array(z.string()).default([]),
  apps: z.array(z.string()).default([]),
});

const WarningItemSchema = z.object({
  severity: z.enum(['low', 'medium', 'high']).default('low'),
  category: z.string().default('General'),
  title: z.string(),
  description: z.string().default(''),
});

const WarningsBlockSchema = z.object({
  type: z.literal('warnings'),
  items: z.array(WarningItemSchema).default([]),
});

const BlockSchema = z.discriminatedUnion('type', [
  OverviewBlockSchema,
  TimelineBlockSchema,
  BudgetBlockSchema,
  ChecklistBlockSchema,
  RestaurantsBlockSchema,
  WeatherBlockSchema,
  TipsBlockSchema,
  WarningsBlockSchema,
]).or(z.object({ type: z.string() }).passthrough());

const TripSchema = z.object({
  tripId: z.string().default(() => uuidv4()),
  title: z.string().default('My Trip'),
  destination: z.string().default(''),
  duration: z.string().default(''),
  summary: z.string().default(''),
  coverImage: z.string().default('travel'),
  bestTimeToVisit: z.string().default(''),
  currency: z.string().default('USD'),
  language: z.string().default(''),
  timezone: z.string().default(''),
  blocks: z.array(BlockSchema).default([]),
});

export function validateTripSchema(data) {
  const result = TripSchema.safeParse(data);
  if (!result.success) {
    console.error('[Validation] Schema validation errors:', result.error.flatten());
    // Return a partial result with defaults applied
    return TripSchema.parse({ ...data });
  }
  return result.data;
}

// Validate the generate request body
export const GenerateTripRequestSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters').max(1000),
  destination: z.string().optional(),
  duration: z.string().optional(),
  budget: z.string().optional(),
  travelers: z.string().optional(),
  preferences: z.array(z.string()).optional(),
});
