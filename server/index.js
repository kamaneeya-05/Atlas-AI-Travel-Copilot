/**
 * ATLAS AI – Backend
 * POST /api/generate — Groq-powered trip generation
 * Supports long trips (up to 30+ days) via chunked day generation
 */

import express from 'express';
import cors    from 'cors';
import dotenv  from 'dotenv';
import Groq    from 'groq-sdk';
import { z }   from 'zod';
import { fileURLToPath } from 'url';
import { dirname, join }  from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '4mb' }));

// ─── Groq models ─────────────────────────────────────────────────────────────
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama3-70b-8192',
  'llama3-8b-8192',
];

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const TripSchema = z.object({
  tripId:          z.string().default(() => `trip-${Date.now()}`),
  title:           z.string().default('My Trip'),
  destination:     z.string().default(''),
  duration:        z.string().default(''),
  summary:         z.string().default(''),
  coverImage:      z.string().default('travel'),
  bestTimeToVisit: z.string().default(''),
  currency:        z.string().default('INR - Indian Rupee (₹)'),
  language:        z.string().default(''),
  timezone:        z.string().default(''),
  blocks:          z.array(z.record(z.unknown())).default([]),
}).passthrough();

// ─── Core Groq caller ─────────────────────────────────────────────────────────
async function callGroq(systemPrompt, userPrompt, maxTokens = 8000) {
  const apiKey = (process.env.GROQ_API_KEY || '').trim();
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY not set in .env. Get a free key at https://console.groq.com');
  }

  const groq = new Groq({ apiKey });
  let lastError = null;

  for (const model of GROQ_MODELS) {
    try {
      console.log(`[Groq] model=${model} max_tokens=${maxTokens}`);
      const response = await groq.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt },
        ],
        temperature:     0.75,
        max_tokens:      maxTokens,
        response_format: { type: 'json_object' },
      });

      const raw     = response.choices?.[0]?.message?.content || '';
      if (!raw.trim()) throw new Error('Empty response');

      const cleaned = raw
        .replace(/^```json\s*/im, '').replace(/^```\s*/im, '').replace(/```\s*$/im, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      console.log(`[Groq] ✅ Success — model=${model}`);
      return parsed;

    } catch (err) {
      lastError     = err;
      const msg     = (err.message || '').toLowerCase();
      const tryNext = msg.includes('model_not_found') || msg.includes('not found') ||
                      msg.includes('deprecated')      || msg.includes('rate_limit') ||
                      msg.includes('429')             || msg.includes('503')        ||
                      msg.includes('overloaded')      || msg.includes('rate limit');

      console.warn(`[Groq] ✗ ${model}: ${err.message.substring(0, 100)}`);
      if (!tryNext) throw err;
      if (msg.includes('rate_limit') || msg.includes('429')) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }
  throw lastError || new Error('All Groq models failed');
}

// ─── System prompts ───────────────────────────────────────────────────────────

const MAIN_SYSTEM_PROMPT = `You are Atlas AI, an expert travel planning assistant.

ABSOLUTE RULES:
1. Return ONLY a valid JSON object. Nothing else.
2. No markdown, no code fences, no explanation.
3. ALL money in Indian Rupees with ₹ symbol (e.g. ₹5,000 — never $50 or USD).
4. ALL content must be SPECIFIC to the requested destination — real place names, real food, real transport.
5. NEVER give generic advice like "remove shoes at temples", "avoid revealing clothes", "keep ID copies".
6. Generate rich, detailed, destination-specific content that feels handcrafted.

RETURN THIS JSON STRUCTURE:
{
  "tripId": "trip-unique-id",
  "title": "X Days in Destination",
  "destination": "City, Country",
  "duration": "X days",
  "summary": "3 engaging sentences specific to this destination and trip style",
  "coverImage": "destination-keyword",
  "bestTimeToVisit": "specific months with reason",
  "currency": "INR - Indian Rupee (₹)",
  "language": "local language",
  "timezone": "timezone",
  "blocks": [
    {
      "type": "overview",
      "highlights": ["4-5 specific highlights unique to this destination"],
      "mustSee": ["5-6 specific must-see places with brief reason"],
      "localTips": ["4-5 highly specific local insider tips for this exact place"],
      "transportation": "Detailed paragraph on real local transport options, costs, apps"
    },
    {
      "type": "budget",
      "currency": "INR",
      "totalEstimate": "₹X,XX,XXX",
      "breakdown": [
        { "category": "Accommodation", "amount": "₹XX,XXX", "percentage": 35, "notes": "specific hotel types for this destination" },
        { "category": "Food & Dining", "amount": "₹XX,XXX", "percentage": 25, "notes": "specific dining options for this destination" },
        { "category": "Transport", "amount": "₹XX,XXX", "percentage": 20, "notes": "specific transport costs for this destination" },
        { "category": "Activities", "amount": "₹XX,XXX", "percentage": 15, "notes": "specific activities costs for this destination" },
        { "category": "Shopping & Misc", "amount": "₹XX,XXX", "percentage": 5, "notes": "specific shopping for this destination" }
      ],
      "savingTips": ["4 specific money-saving tips for this exact destination"],
      "budgetLevel": "budget|mid-range|luxury"
    },
    {
      "type": "checklist",
      "categories": [
        {
          "name": "Documents",
          "icon": "file-text",
          "items": [
            { "id": "d1", "label": "Passport (valid 6+ months)", "essential": true },
            { "id": "d2", "label": "Visa documents", "essential": true },
            { "id": "d3", "label": "Travel insurance policy", "essential": true },
            { "id": "d4", "label": "Hotel & flight confirmations", "essential": true }
          ]
        },
        {
          "name": "Clothing",
          "icon": "shirt",
          "items": [
            { "id": "c1", "label": "destination-appropriate clothing item 1", "essential": true },
            { "id": "c2", "label": "destination-appropriate clothing item 2", "essential": true },
            { "id": "c3", "label": "destination-appropriate clothing item 3", "essential": false }
          ]
        },
        {
          "name": "Essentials",
          "icon": "package",
          "items": [
            { "id": "e1", "label": "destination-specific essential 1", "essential": true },
            { "id": "e2", "label": "destination-specific essential 2", "essential": true },
            { "id": "e3", "label": "Power bank (20000 mAh for long trips)", "essential": true },
            { "id": "e4", "label": "Universal power adapter", "essential": true }
          ]
        }
      ]
    },
    {
      "type": "restaurants",
      "items": [
        {
          "name": "Real restaurant name specific to destination",
          "cuisine": "specific cuisine type",
          "priceRange": "₹₹",
          "mustTry": "specific signature dish name",
          "description": "why this specific restaurant is worth visiting",
          "location": "specific area/neighbourhood",
          "openHours": "HH:MM - HH:MM",
          "rating": "4.2"
        }
      ]
    },
    {
      "type": "weather",
      "season": "season during travel",
      "averageTemp": "XX°C - XX°C",
      "conditions": "specific weather description",
      "whatToWear": ["specific clothing for this destination's weather"],
      "weatherWarnings": ["specific weather-related warnings for this destination"]
    },
    {
      "type": "tips",
      "cultural": ["Highly specific cultural tip unique to this destination", "Another unique local custom"],
      "practical": ["Specific practical tip for this destination with real details", "Another destination-specific practical tip"],
      "safety": ["Specific safety concern unique to this destination", "Another real safety tip for this place"],
      "apps": ["destination-specific useful apps", "Google Maps", "local taxi app", "local food delivery app"]
    },
    {
      "type": "warnings",
      "items": [
        {
          "severity": "low|medium|high",
          "category": "specific category",
          "title": "specific warning title for this destination",
          "description": "specific actionable warning description"
        }
      ]
    }
  ]
}

IMPORTANT: The "blocks" array above must NOT include "timeline". Days will be added separately.`;

const DAYS_SYSTEM_PROMPT = `You are Atlas AI, a travel day planner.

RULES:
1. Return ONLY valid JSON. Nothing else. No markdown. No fences.
2. ALL costs in Indian Rupees ₹.
3. Generate EXACTLY the days requested — no more, no less.
4. Each day must have 4-6 activities with real place names.
5. Activities must flow logically (morning sightseeing → afternoon lunch → evening activity).
6. Costs must be realistic for the destination.

RETURN THIS JSON:
{
  "days": [
    {
      "day": 1,
      "title": "Specific Day Title",
      "description": "1-sentence summary of this day",
      "activities": [
        {
          "time": "09:00",
          "name": "Real specific activity/place name",
          "description": "What to do and why it is special",
          "duration": "2 hours",
          "cost": "₹500",
          "category": "sightseeing",
          "location": "Specific neighbourhood, City"
        }
      ]
    }
  ]
}`;

// ─── Parse number of days from duration string ────────────────────────────────
function parseDays(duration, prompt) {
  const src = `${duration || ''} ${prompt || ''}`.toLowerCase();
  // Match "25 days", "25-day", "25day", "25 night"
  const match = src.match(/(\d+)\s*(?:days?|nights?|-day)/i);
  if (match) return Math.min(parseInt(match[1], 10), 60); // cap at 60 days
  // Match "X weeks"
  const weeks = src.match(/(\d+)\s*weeks?/i);
  if (weeks) return Math.min(parseInt(weeks[1], 10) * 7, 60);
  return 7; // default
}

// ─── Generate days in chunks to avoid token limits ───────────────────────────
async function generateDaysInChunks(destination, totalDays, tripContext) {
  const CHUNK_SIZE = 7; // generate 7 days at a time
  const allDays = [];
  const chunks = Math.ceil(totalDays / CHUNK_SIZE);

  for (let chunk = 0; chunk < chunks; chunk++) {
    const startDay = chunk * CHUNK_SIZE + 1;
    const endDay   = Math.min(startDay + CHUNK_SIZE - 1, totalDays);
    const count    = endDay - startDay + 1;

    console.log(`[Days] Generating days ${startDay}–${endDay} of ${totalDays}`);

    const userPrompt = [
      `Destination: ${destination}`,
      `Trip context: ${tripContext}`,
      `Generate days ${startDay} through ${endDay} (${count} days total in this chunk).`,
      `Day numbering starts at ${startDay}.`,
      `ALL costs in Indian Rupees ₹. Real place names. 4-5 activities per day.`,
      `Return ONLY the JSON with "days" array containing exactly ${count} days.`,
    ].join('\n');

    try {
      const result = await callGroq(DAYS_SYSTEM_PROMPT, userPrompt, 8000);
      const days   = result.days || [];

      // Ensure day numbers are correct
      days.forEach((d, i) => { d.day = startDay + i; });
      allDays.push(...days);

      // Small delay between chunks to avoid rate limiting
      if (chunk < chunks - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (err) {
      console.error(`[Days] Chunk ${chunk + 1} failed:`, err.message);
      // Add placeholder days for failed chunk
      for (let d = startDay; d <= endDay; d++) {
        allDays.push({
          day: d,
          title: `Day ${d} — ${destination}`,
          description: `Explore ${destination} on day ${d}`,
          activities: [],
        });
      }
    }
  }

  return allDays;
}

// ─── Main generation function ─────────────────────────────────────────────────
async function generateTrip(params) {
  const { prompt, destination, duration, budget, travelers, preferences } = params;

  const totalDays = parseDays(duration, prompt);
  const dest      = destination || 'the destination';

  console.log(`\n[Generate] Destination: ${dest} | Days: ${totalDays}`);

  // ── Step 1: Generate main trip info (no timeline) ──────────────────────────
  const mainPromptLines = [
    `Travel request: ${prompt}`,
    destination && `Destination: ${destination}`,
    `Duration: ${totalDays} days`,
    budget     && `Budget: ${budget}`,
    travelers  && `Travelers: ${travelers}`,
    preferences?.length && `Interests: ${[].concat(preferences).join(', ')}`,
    'ALL prices in ₹ INR. ALL content specific to this exact destination.',
    'Do NOT include timeline/days in the blocks array — days will be generated separately.',
    'Return ONLY the JSON.',
  ].filter(Boolean).join('\n');

  const mainData = await callGroq(MAIN_SYSTEM_PROMPT, mainPromptLines, 8000);

  // ── Step 2: Generate ALL days in chunks ────────────────────────────────────
  const tripContext = [
    prompt,
    budget && `budget: ${budget}`,
    travelers && `travelers: ${travelers}`,
    preferences?.length && `interests: ${[].concat(preferences).join(', ')}`,
  ].filter(Boolean).join(', ');

  const days = await generateDaysInChunks(dest, totalDays, tripContext);

  // ── Step 3: Merge ──────────────────────────────────────────────────────────
  const timelineBlock = { type: 'timeline', days };

  // Insert timeline as second block (after overview)
  const blocks = mainData.blocks || [];
  const overviewIdx = blocks.findIndex(b => b.type === 'overview');
  const insertAt    = overviewIdx >= 0 ? overviewIdx + 1 : 0;
  blocks.splice(insertAt, 0, timelineBlock);
  mainData.blocks = blocks;

  // Validate
  const result    = TripSchema.safeParse(mainData);
  const validated = result.success ? result.data : { ...mainData };

  validated.currency = 'INR - Indian Rupee (₹)';
  validated.duration = `${totalDays} days`;
  if (!validated.tripId) validated.tripId = `trip-${Date.now()}`;

  return validated;
}

// ─── POST /api/generate ───────────────────────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  const { prompt, destination, duration, budget, travelers, preferences } = req.body ?? {};

  if (!prompt || String(prompt).trim().length < 3) {
    return res.status(400).json({ error: 'Please provide a trip description.' });
  }

  try {
    const trip = await generateTrip({
      prompt:      String(prompt).trim(),
      destination, duration, budget, travelers, preferences,
    });
    trip.createdAt = new Date().toISOString();
    trip.prompt    = String(prompt).trim();
    res.json({ success: true, data: trip });
  } catch (err) {
    console.error('[/api/generate]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/health ──────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  const key   = (process.env.GROQ_API_KEY || '').trim();
  const valid = key.length > 10 && key !== 'your_groq_api_key_here';
  res.json({
    status:           'ok',
    geminiConfigured: valid,
    provider:         'groq',
    message:          valid ? '✅ Groq key loaded — ready!' : '❌ GROQ_API_KEY missing',
    timestamp:        new Date().toISOString(),
  });
});

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  const key   = (process.env.GROQ_API_KEY || '').trim();
  const valid = key.length > 10 && key !== 'your_groq_api_key_here';
  console.log('\n══════════════════════════════════════════════');
  console.log('  🌍  ATLAS AI  —  Backend');
  console.log('  ⚡  Powered by Groq  |  Chunked day generation');
  console.log('══════════════════════════════════════════════');
  console.log(`  API : http://localhost:${PORT}/api/generate`);
  console.log(`  Key : ${valid ? `✅ ${key.substring(0,8)}...` : '❌ missing'}`);
  console.log('══════════════════════════════════════════════\n');
});
