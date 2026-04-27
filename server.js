/* Parakh — परख · server */
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const MODEL = process.env.PARAKH_MODEL || 'anthropic/claude-sonnet-4.5';

if (!process.env.OPENROUTER_API_KEY) {
  console.error('Missing OPENROUTER_API_KEY in .env');
  process.exit(1);
}

const ai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://parakh.in',
    'X-Title': 'Parakh',
  },
});

/* ---------- System prompt ---------- */
const cueCards = fs.readFileSync(
  path.join(__dirname, 'api', '_lib', 'cue-cards.md'),
  'utf8'
);

const SUPPORTED = [
  { name: 'Tomato', emoji: '🍅' },
  { name: 'Watermelon', emoji: '🍉' },
  { name: 'Mango', emoji: '🥭' },
  { name: 'Banana', emoji: '🍌' },
  { name: 'Apple', emoji: '🍎' },
  { name: 'Onion', emoji: '🧅' },
  { name: 'Potato', emoji: '🥔' },
  { name: 'Spinach', emoji: '🥬' },
  { name: 'Cauliflower', emoji: '🥦' },
  { name: 'Brinjal', emoji: '🍆' },
  { name: 'Carrot', emoji: '🥕' },
  { name: 'Papaya', emoji: '🥭' },
  { name: 'Grapes', emoji: '🍇' },
];

const SYSTEM_PROMPT = `You are Parakh — परख — an assayer for fresh produce in Indian markets. You examine a single photo of a fruit or vegetable and return a verdict in plain language: BUY, CHECK (do a quick physical check first), or SKIP.

# Supported items
Identify only these 13: ${SUPPORTED.map(s => s.name).join(', ')}.
If the photo doesn't clearly show one of these, return verdict "unknown".
If the photo is too dark / blurry / occluded, return verdict "retake".

# Verdict rule
- Any STRONG cue from the cue cards failed → "skip"
- Visual cues clean but a non-visual check (smell, bend, wipe) is needed → "hold"
- All visible STRONG cues clean → "pass"

# Voice
Plain everyday English. No jargon. No "carbide-touched" or "snap-test" — say "force-ripened" or "bend it first". Hindi sublines must be exactly: "खरा है।" (pass), "ठीक है।" (hold), "खोटा है।" (skip).

# Stamp labels
- pass → stampEn "Buy", stampDeva "खरा"
- hold → stampEn "Check", stampDeva "ठीक"
- skip → stampEn "Skip", stampDeva "खोटा"

# Output — strict JSON ONLY, no prose, no markdown fences
{
  "name": "Watermelon",
  "emoji": "🍉",
  "verdict": "pass" | "hold" | "skip" | "unknown" | "retake",
  "stampEn": "Buy" | "Check" | "Skip",
  "stampDeva": "खरा" | "ठीक" | "खोटा",
  "headline": "<short italic-friendly sentence, e.g. 'Buy it. It's ripe.'>",
  "deva": "खरा है।" | "ठीक है।" | "खोटा है।",
  "sub": "<one or two sentences, plain language, why this verdict>",
  "list": [
    { "label": "Color",   "status": "GOOD" | "OKAY" | "CHECK" | "BAD", "pip": "pass" | "hold" | "skip" },
    { "label": "Surface", "status": "...", "pip": "..." },
    { "label": "<third dimension specific to the item — Stem, Smell, Skin, Spots, Freshness>", "status": "...", "pip": "..." }
  ],
  "checks": [
    { "icon": "nose" | "hand" | "eye", "title": "<short physical check>", "body": "<1 sentence — what good vs bad looks/smells/feels like>" }
  ]
}

For verdict "pass" or "skip", "checks" should be []. For verdict "hold", include 1–2 checks the shopper can do at the stall.

For verdict "unknown" or "retake", return:
{
  "name": "Unknown" | "Unclear photo",
  "emoji": "❓" | "📷",
  "verdict": "unknown" | "retake",
  "stampEn": "Skip" | "Retake",
  "stampDeva": "—",
  "headline": "<friendly message — 'Couldn't identify this fruit' or 'Photo too dark — try again in better light'>",
  "deva": "—",
  "sub": "<helpful next step>",
  "list": [],
  "checks": []
}

# Cue rubric — apply this for the identified item
${cueCards}
`;

/* ---------- JSON extractor — strips markdown fences Claude likes to add ---------- */
function extractJson(text) {
  if (!text) return '{}';
  // Strip ```json ... ``` or ``` ... ``` fences
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenced) return fenced[1].trim();
  // Otherwise grab the first {...} block
  const brace = text.match(/\{[\s\S]*\}/);
  if (brace) return brace[0];
  return text.trim();
}

/* ---------- App ---------- */
const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' })); // base64 images can be ~5–10MB

// Static — serve everything in the project root (Claude Design HTML/JSX/CSS files)
app.use(express.static(__dirname));

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, model: MODEL, supported: SUPPORTED.map(s => s.name) });
});

// Scan
app.post('/api/scan', async (req, res) => {
  const t0 = Date.now();
  const { image } = req.body || {};

  if (!image || typeof image !== 'string') {
    return res.status(400).json({ error: 'Missing "image" — expected base64 data URL.' });
  }
  if (!image.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Image must be a data URL (data:image/jpeg;base64,...).' });
  }

  try {
    const completion = await ai.chat.completions.create({
      model: MODEL,
      max_tokens: 800,
      temperature: 0.2,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Assess this produce. Return only the JSON verdict.' },
            { type: 'image_url', image_url: { url: image } },
          ],
        },
      ],
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices?.[0]?.message?.content || '{}';
    let verdict;
    try {
      verdict = JSON.parse(extractJson(raw));
    } catch (parseErr) {
      console.error('Model returned invalid JSON:', raw);
      return res.status(502).json({ error: 'Model returned invalid JSON', raw });
    }

    // Minimal schema sanity
    const allowed = ['pass', 'hold', 'skip', 'unknown', 'retake'];
    if (!allowed.includes(verdict.verdict)) {
      return res.status(502).json({ error: `Invalid verdict "${verdict.verdict}"`, verdict });
    }

    const latency_ms = Date.now() - t0;
    console.log(`[scan] ${verdict.name || '?'} → ${verdict.verdict} (${latency_ms}ms)`);

    res.json({ ...verdict, latency_ms, model: MODEL });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ error: err?.message || 'Scan failed' });
  }
});

// Feedback (write-only stub for now — wire to Supabase later)
app.post('/api/feedback', (req, res) => {
  const { scanId, wasCorrect, note } = req.body || {};
  console.log('[feedback]', { scanId, wasCorrect, note });
  res.json({ ok: true });
});

// Fallback to index/welcome for SPA-style routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  // Try common entry HTML files in order
  const candidates = ['Welcome Screen.html', 'Parakh Mobile.html', 'index.html'];
  for (const f of candidates) {
    const p = path.join(__dirname, f);
    if (fs.existsSync(p)) return res.sendFile(p);
  }
  next();
});

app.listen(PORT, () => {
  console.log(`\n🍋  Parakh server\n   → http://localhost:${PORT}\n   → model: ${MODEL}\n`);
});
