#!/usr/bin/env node
/*
  Minimal generator for market_data.json
  Usage:
    export OPENAI_API_KEY=...
    export MARKET_CONTEXT="Dow down 0.24%, Nasdaq down 1.17%, Brent near 108, yields elevated..."
    node fetch_data.js

  This script expects Node 18+ for global fetch.
*/

const fs = require('fs/promises');
const path = require('path');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MARKET_CONTEXT = process.env.MARKET_CONTEXT || '';
const MODEL = process.env.OPENAI_MODEL || 'gpt-5';
const OUTFILE = path.join(__dirname, 'market_data.json');

if (!OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY');
  process.exit(1);
}

const schemaExample = {
  snapshotDate: 'March 20, 2026',
  marketPulse: 'Risk-Off',
  marketPulseSubtext: 'Momentum accelerating down',
  topDriver: 'Middle East + Rates',
  topDriverSubtext: 'Oil and inflation shock',
  lastUpdated: 'Mar 20, 2026',
  lastUpdatedSubtext: 'Manual refresh snapshot',
  disclaimer: 'Prototype disclaimer: ...',
  topThemes: [{ theme: '', impact: '', strength: 0, direction: '' }],
  rateCurve: [{ tenor: '2Y', current: 0, prior: 0 }],
  rateCurveRead: '',
  crossMarket: [{ market: '', risk: 'Watch', driver: '', move: '', trend: '', heat: 0 }],
  drivers: [{ name: '', score: 0, detail: '', linked: '', confidence: 'High' }],
  risks: [{ title: '', level: 'High', desc: '' }],
  timeline: [{ time: '', headline: '', effect: '' }],
  strategies: [{ title: '', body: '', trigger: '', confidence: 'High', score: 0 }]
};

const prompt = `You generate only valid JSON for a static market dashboard.
Return JSON only. No markdown. No commentary.
Use this exact top-level shape: ${JSON.stringify(schemaExample)}

Rules:
- Keep exactly 4 topThemes, 3 rateCurve points, 8 crossMarket rows, 4 drivers, 4 risks, 4 timeline items, 4 strategies.
- topThemes.strength and all heat/score fields must be integers 0-100.
- Use concise executive market language.
- Make the data coherent across all sections.
- lastUpdated should be a short human-readable date.
- snapshotDate should be a long human-readable date.
- rateCurveRead should be 1 concise sentence.
- disclaimer should begin with 'Prototype disclaimer:'.
- confidence must be one of High, Medium, Low.
- risk must be one of Watch, Moderate, Elevated, High.
- risk level must be one of Medium, Elevated, High.

Today's market context:
${MARKET_CONTEXT || 'No explicit market context was provided. Use a cautious neutral placeholder snapshot.'}`;

function validate(data) {
  const requiredArrays = ['topThemes', 'rateCurve', 'crossMarket', 'drivers', 'risks', 'timeline', 'strategies'];
  for (const key of requiredArrays) {
    if (!Array.isArray(data[key])) throw new Error(`Missing array: ${key}`);
  }
  if (data.topThemes.length !== 4) throw new Error('topThemes must have length 4');
  if (data.rateCurve.length !== 3) throw new Error('rateCurve must have length 3');
  if (data.crossMarket.length !== 8) throw new Error('crossMarket must have length 8');
  if (data.drivers.length !== 4) throw new Error('drivers must have length 4');
  if (data.risks.length !== 4) throw new Error('risks must have length 4');
  if (data.timeline.length !== 4) throw new Error('timeline must have length 4');
  if (data.strategies.length !== 4) throw new Error('strategies must have length 4');
}

async function main() {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      input: prompt
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${text}`);
  }

  const payload = await response.json();
  const text = payload.output_text;
  if (!text) throw new Error('No output_text returned by Responses API');

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error(`Model did not return valid JSON: ${err.message}\n\nRaw output:\n${text}`);
  }

  validate(data);
  await fs.writeFile(OUTFILE, JSON.stringify(data, null, 2));
  console.log(`Wrote ${OUTFILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
