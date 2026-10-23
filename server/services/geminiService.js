import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemPrompt, buildUserPrompt } from '../prompts/itineraryPrompt.js';
import { validateTripSchema } from '../validation/tripSchema.js';

let genAI = null;

function getClient() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Generate a travel itinerary using Gemini AI.
 * Retries once on JSON parse failure.
 */
export async function generateItinerary(params) {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
    systemInstruction: buildSystemPrompt(),
  });

  const userPrompt = buildUserPrompt(params);

  let attempt = 0;
  let lastError = null;

  while (attempt < 2) {
    attempt++;
    try {
      const result = await model.generateContent(userPrompt);
      const responseText = result.response.text();

      // Strip any accidental markdown fences
      const cleaned = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      const validated = validateTripSchema(parsed);
      return validated;
    } catch (err) {
      lastError = err;
      console.error(`[Gemini] Attempt ${attempt} failed:`, err.message);
      if (attempt < 2) {
        // Wait 500ms before retry
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  throw new Error(`Failed to generate itinerary after 2 attempts: ${lastError?.message}`);
}
