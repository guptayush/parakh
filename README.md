# Parakh — परख

The assayer in your pocket. Scan a fruit or vegetable, get a verdict.

## Stack

- **Frontend** — Claude Design exports (React + Babel via CDN, no build step). Multiple HTML entry points: `Welcome Screen.html`, `Parakh Mobile.html`, `Parakh Flow.html`, `Sign Up Bottom Sheet.html`, `Brand System.html`.
- **Backend** — single Express server (`server.js`), serves static frontend + `/api/*` routes.
- **Vision** — OpenAI SDK pointed at OpenRouter, model `anthropic/claude-sonnet-4.5`.
- **System prompt** — `api/_lib/cue-cards.md` (food-science cue rubric for the 13 supported items).

## Setup

```bash
npm install
cp .env.example .env       # then paste your OPENROUTER_API_KEY
npm run dev                # → http://localhost:3000
```

Open the entry HTML you want to test, e.g. `http://localhost:3000/Parakh%20Mobile.html`.

## API

### `POST /api/scan`
Body:
```json
{ "image": "data:image/jpeg;base64,..." }
```
Returns:
```json
{
  "name": "Watermelon",
  "emoji": "🍉",
  "verdict": "pass" | "hold" | "skip" | "unknown" | "retake",
  "stampEn": "Buy" | "Check" | "Skip" | "Retake",
  "stampDeva": "खरा" | "ठीक" | "खोटा" | "—",
  "headline": "Buy it. It's ripe.",
  "deva": "खरा है।",
  "sub": "Cut it tonight or tomorrow for the best taste.",
  "list": [
    { "label": "Color", "status": "GOOD", "pip": "pass" },
    { "label": "Surface", "status": "GOOD", "pip": "pass" },
    { "label": "Stem", "status": "OKAY", "pip": "hold" }
  ],
  "checks": [],
  "latency_ms": 2843,
  "model": "anthropic/claude-sonnet-4.5"
}
```

### `GET /api/health`
Sanity check — returns model + supported items.

### `POST /api/feedback`
Stub — logs `{ scanId, wasCorrect, note }`. Wire to Supabase in Phase 2.

## Supported items (13)
Tomato · Watermelon · Mango · Banana · Apple · Onion · Potato · Spinach · Cauliflower · Brinjal · Carrot · Papaya · Grapes

## Calling /api/scan from React

```js
async function scan(blob) {
  const dataUrl = await new Promise((resolve) => {
    const r = new FileReader();
    r.onloadend = () => resolve(r.result);
    r.readAsDataURL(blob);
  });
  const res = await fetch('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: dataUrl }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'scan failed');
  return res.json();
}
```

## Camera capture (browser)

```js
const stream = await navigator.mediaDevices.getUserMedia({
  video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1440 } },
  audio: false,
});
videoEl.srcObject = stream;

// On shutter tap:
const canvas = document.createElement('canvas');
canvas.width = 1280; canvas.height = 960;
canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);
canvas.toBlob((blob) => scan(blob), 'image/jpeg', 0.82);
```

## Project layout

```
parakh/
├── server.js                 # Express + OpenRouter
├── package.json
├── .env                      # gitignored — your API keys
├── .env.example
├── api/
│   └── _lib/
│       └── cue-cards.md      # system prompt source — edit this to tune the model
├── *.html                    # Claude Design entry points
├── *.jsx                     # React components (loaded via Babel CDN)
├── *.css                     # styles per screen
├── countries.js              # country code data for signup
├── supabase/
│   └── migrations/           # (empty — Phase 2)
├── screenshots/
└── uploads/
```

## Phase 2 (later)

- MSG91 phone OTP → `/api/auth/send-otp`, `/api/auth/verify-otp`
- Supabase: users, scans, feedback tables
- `/api/scans` (history)
- PWA install (manifest + service worker)
- Deploy to Vercel / Railway / Fly

## Tuning the model

Edit `api/_lib/cue-cards.md` — the file is loaded into the system prompt at server startup. Restart the server after edits. The cue cards are the source of truth for what counts as PASS/HOLD/SKIP per item.
