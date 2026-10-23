# Atlas AI travel copilot

**A thoughtful travel-planning workspace that turns a trip idea into a detailed, editable itinerary.**

ATLAS AI combines a React trip-planning interface with a small Express API and Groq-powered generation. Describe where you want to go, how long you have, and what matters to you; then review a day-by-day plan, budget, places to eat, packing checklist, local tips, weather notes, and travel advisories.

## At a glance

| | |
| --- | --- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **API** | Node.js, Express |
| **AI provider** | Groq API |
| **Trip storage** | Browser `localStorage` |
| **Export** | Downloadable PDF itinerary |

## What you can do

- Generate destination-specific itineraries with day-by-day activities.
- Review an estimated budget, restaurant ideas, packing checklist, weather, tips, and warnings.
- Reorder itinerary sections, add notes, duplicate trips, and manage trip history.
- Export a trip as a PDF and use light, dark, or system appearance settings.
- Keep saved trips in your browser without setting up a database.

## Get started

### Requirements

- Node.js 18 or newer and npm.
- A Groq API key from [console.groq.com/keys](https://console.groq.com/keys).

### Install

```bash
git clone <your-repository-url>
cd <repository-folder>
npm install
```

Create a `.env` file in the project root. You can start from the included template:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

Replace the placeholder with your key, then launch both the frontend and API:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Vite serves the React app and forwards `/api` requests to the Express server on port `3001`.

> Keep `.env` private. It is excluded from Git; never commit or share your API key.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite frontend and Express API together. |
| `npm run client` | Start only the frontend on port `3000`. |
| `npm run server` | Start only the API with Node watch mode. |
| `npm run lint` | Run ESLint with warnings treated as failures. |
| `npm run build` | Create the production frontend bundle in `dist/`. |
| `npm run preview` | Preview the built frontend on port `4000`. |
| `npm run format` | Format supported JavaScript, JSX, CSS, JSON, and Markdown files. |

## How it works

1. The trip form sends a prompt and trip preferences to the Express API.
2. The server uses Groq chat completions to create itinerary content and generate long trips in day-sized chunks.
3. The frontend renders the returned itinerary blocks and saves the trip in browser `localStorage`.
4. PDF export formats the selected trip for download in the browser.

The browser talks to the API through Vite's `/api` proxy during development. The Groq key stays on the server and must not be placed in frontend environment variables.

## API

The running server in `server/index.js` currently exposes:

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/generate` | Generate an itinerary. Send JSON containing `prompt`; optional fields include `destination`, `duration`, `budget`, `travelers`, and `preferences`. |
| `GET` | `/api/health` | Check server health and whether the Groq key is configured. |

Example request:

```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Plan five relaxed days in Kyoto focused on gardens and local food","destination":"Kyoto, Japan","duration":"5 days","budget":"mid-range","travelers":2}'
```

The response contains the generated trip under `data`. Generation requires a valid Groq key and an internet connection.

## Project layout

```text
client/
  components/     Shared UI, trip forms, itinerary block renderers, and layout
  context/        Theme, trip, and API health state
  hooks/          Reusable React hooks
  pages/          Landing, dashboard, trip creation, history, and settings
  services/       Client-side PDF export and API helpers
  styles/         Global styles
server/
  index.js        Active Groq-backed generation and health endpoints
  controllers/    Trip API controller modules
  middleware/     Request validation, logging, rate limiting, and error handling
  prompts/        Itinerary prompt definitions
  routes/         Additional trip route definitions
  services/       AI provider and trip-store modules
  validation/     Trip response schema
public/           Static public assets
```

The active browser flow uses `/api/generate` and stores trips locally. Additional route/controller and Gemini service modules are present in `server/`, but are not mounted by the current `server/index.js` entry point.

## Notes and limitations

- Browser-saved trips belong to the current browser profile. Clearing site data removes them; there is no user account or durable database configured.
- AI-generated places, prices, schedules, weather, and advisories can be inaccurate or change over time. Verify important details with official and current sources before traveling.
- The API currently allows cross-origin requests and has no authentication. Add appropriate access controls before exposing it publicly.
- The PDF uses standard fonts; some symbols may be simplified for compatibility.

## Contributing

Install dependencies, run `npm run lint` and `npm run build`, then open a pull request with a clear summary and verification notes.