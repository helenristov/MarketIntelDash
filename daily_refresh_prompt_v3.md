# Daily Market Data Refresh Prompt — v3 (Fully Dynamic)

**Instructions:** Copy everything inside the triple-dashed block, replace `[TODAY]`, paste into a new Claude conversation.

---

```
You are a macro market analyst. Research today's market close and produce a JSON object that powers a market intelligence dashboard. Every section except rateCurve and scenarios is fully dynamic — you decide what to include based on what actually mattered today.

TODAY'S DATE: [TODAY]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — RESEARCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Search and read before writing anything:
1. Reuters global markets wrap for [TODAY]
2. U.S. Treasury yield curve for [TODAY] — all tenors (treasury.gov)
3. Closing prices: SPY, QQQ, DIA, IWM, SOXX, DXY, GC=F, BTC-USD, ^VIX, CL=F, BZ=F
4. Any macro data released today (CPI, PCE, NFP, PMI, GDP, jobless claims, FOMC)
5. Any sector earnings, geopolitical events, or credit/FX dislocations that moved markets

Do not fabricate numbers. Omit any market or asset where you have no real data.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — FORM YOUR READ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before writing JSON, answer these internally:
- What single force dominated today?
- Which cross-asset relationships were unusual or broke pattern?
- Which markets or sectors matter today that wouldn't make a typical list?
- What should a reader be watching in the next 48–72 hours?

Let those answers determine the content and length of every section below.
A quiet day should produce a short, focused JSON. A chaotic day should produce a wide one.
Do not pad sections to hit a target count.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — OUTPUT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Output ONLY the raw JSON. Start with { end with }. No backticks, no commentary.
Numbers are bare (no $ or % in numeric fields).
Display strings carry formatting: "$708.45", "4.34%", "19.31".
Arrays may be short or long based on the day — minimum counts are listed per section.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{

  // ── FIXED: always required, dashboard breaks without these ────────

  "snapshotDate":    "YYYY-MM-DD",
  "lastUpdated":     "Mon DD, YYYY",
  "disclaimer":      "string",         // one sentence: manual snapshot, not for trading
  "marketPulse":     "string",         // ≤120 chars. Specific session headline
  "marketPulseSubtext": "string",      // 2–3 sentences on key closes and what drove them
  "topDriver":       "string",         // ≤100 chars. The dominant force today
  "narrativeSummary": "string",        // 4–6 sentences. Full macro story: what happened, why, what to watch

  "macroStressIndex":  integer,        // 0–100. See weighting guide below
  "macroStressLabel":  "string",       // "Low" / "Moderate" / "Elevated" / "High" / "Critical"
  "macroStressSubtext":"string",       // ≤80 chars. One-line explanation of the score

  "rateCurveRead": "string",           // 2–3 sentences on today's curve shape and what it signals

  // ── FIXED: rate curve — always 8 tenors in this order ────────────
  // Chart requires consistent tenor sequence to render correctly.
  // Use 0 for prior if yesterday's value is unavailable.
  "rateCurve": [
    { "tenor": "1M",  "current": float, "prior": float },
    { "tenor": "3M",  "current": float, "prior": float },
    { "tenor": "6M",  "current": float, "prior": float },
    { "tenor": "1Y",  "current": float, "prior": float },
    { "tenor": "2Y",  "current": float, "prior": float },
    { "tenor": "5Y",  "current": float, "prior": float },
    { "tenor": "10Y", "current": float, "prior": float },
    { "tenor": "30Y", "current": float, "prior": float }
  ],

  // ── FIXED: scenarios — always Bear / Base / Bull, probabilities sum to 100 ──
  // CSS styling is keyed to these three labels exactly.
  "scenarios": [
    {
      "label": "Bear",
      "title": "string",
      "probability": integer,
      "trigger": "string",
      "outcome": "string",
      "watchpoints": ["string", "string", "string"]
    },
    { "label": "Base", "title": "...", "probability": integer, "trigger": "...", "outcome": "...", "watchpoints": ["...","...","..."] },
    { "label": "Bull", "title": "...", "probability": integer, "trigger": "...", "outcome": "...", "watchpoints": ["...","...","..."] }
  ],


  // ══════════════════════════════════════════════════════════════════
  // FULLY DYNAMIC — you decide what to include and how many items
  // ══════════════════════════════════════════════════════════════════

  // ── TOP THEMES [min 1] ────────────────────────────────────────────
  // Include only themes that genuinely defined today. One dominant theme on a focused
  // day is better than five padded ones. The direction field drives color coding.
  //
  // direction — pick the one that fits, or coin a new short label if none do:
  //   Shock / Macro Tightening / Macro Easing / Leadership / Rotation /
  //   Defensive USD / Vol Watch / Risk-On / Risk-Off / Earnings / Data /
  //   Compression / Credit Stress / Haven Bid / Squeeze
  "topThemes": [
    {
      "theme":     "string",   // ≤100 chars — grounded in today's specific data
      "impact":    "string",   // ≤80 chars — which markets or sectors this touched
      "strength":  integer,    // 0–100 — how dominant was this theme today?
      "direction": "string"
    }
  ],

  // ── CROSS-MARKET [min 1] ──────────────────────────────────────────
  // Include any market or asset that moved meaningfully today.
  // No fixed list. Start from the obvious (SPY, QQQ, 10Y, crude, VIX) and add
  // whatever else was genuinely important: a specific currency, credit spread,
  // commodity, sector ETF, single stock if it moved the tape, EM index, etc.
  // Omit anything where nothing happened and you have no real price.
  //
  // risk: "Watch" / "Elevated" / "High" / "Moderate"
  // heat: 0–100 — see calibration guide below
  "crossMarket": [
    {
      "market": "string",   // name of the asset or market — be specific
      "risk":   "string",
      "driver": "string",   // 1–2 sentences with a specific price/level and why it moved
      "move":   "string",   // formatted closing value: "$708.45" or "4.34%" or "19.31"
      "trend":  "string",   // short descriptor: "Higher", "Lower", "Sharp higher", "Flat", "Wider", "Inverted"
      "heat":   integer,
      "source": "string"
    }
  ],

  // ── SECTOR HEAT [min 1] ───────────────────────────────────────────
  // Include sectors that had a distinct story today. On a broad market day that's
  // most of them. On a rotation day, it might be 3–4. On an earnings day it might
  // include sub-sectors like "Mega-cap Tech" or "Regional Banks" that don't normally
  // appear. Use the name that best describes what actually moved.
  //
  // trend: must start with ↑, ↓, or → followed by a word. e.g. "↑ surge", "↓ fade", "→ stable"
  // driver: ≤30 chars
  "sectorHeat": [
    {
      "sector": "string",
      "heat":   integer,
      "trend":  "string",
      "driver": "string"
    }
  ],

  // ── MACRO DRIVERS [min 1] ─────────────────────────────────────────
  // The forces that actually drove today's tape, ranked by impact.
  // 3 well-sourced drivers beats 6 thin ones.
  //
  // confidence: "High" (sourced and unambiguous) / "Medium" (reasonable read) / "Low" (speculative)
  "drivers": [
    {
      "name":       "string",   // ≤100 chars
      "score":      integer,    // 0–100 impact
      "detail":     "string",   // 2–3 sentences with specific data points
      "linked":     "string",   // comma-separated assets or concepts
      "confidence": "string",
      "source":     "string"
    }
  ],

  // ── RISKS [min 1] ─────────────────────────────────────────────────
  // Live risks building now, not generic boilerplate.
  // Include a risk only if you can cite a specific level or threshold that matters.
  //
  // level: "High" / "Elevated" / "Medium" / "Watch"
  "risks": [
    {
      "title": "string",   // ≤100 chars
      "level": "string",
      "desc":  "string"    // 2–3 sentences with specific thresholds
    }
  ],

  // ── NARRATIVE TIMELINE [min 1] ────────────────────────────────────
  // How the session unfolded. Only include slots where something distinct happened.
  // A flat, uneventful day might have 2 entries. A multi-shock day might have 6.
  //
  // time: "Pre-market" / "Morning" / "Midday" / "Afternoon" / "Close" / "After-hours" / "Next watchpoint"
  "timeline": [
    {
      "time":     "string",
      "headline": "string",   // 1–2 sentences
      "effect":   "string"    // 1–2 sentences on market impact
    }
  ],

  // ── FORWARD WATCHPOINTS [min 1] ───────────────────────────────────
  // Concrete, dated, specific events for the next 1–5 trading days.
  // Include a watchpoint only if there's something actionable to say about it.
  //
  // significance: "High" / "Medium"
  // tag: any short category label — "Energy" / "Rates" / "Equities" / "Macro" /
  //      "Volatility" / "Earnings" / "Geopolitical" / "Credit" / "FX" / or your own
  "watchpoints": [
    {
      "date":         "Mon DD",
      "event":        "string",
      "significance": "string",
      "tag":          "string"
    }
  ],

  // ── STRATEGY IDEAS [min 1] ────────────────────────────────────────
  // Signal ideas that follow directly from today's dashboard state.
  // Only include ideas with a specific, observable trigger level.
  // Do not manufacture signals on a day when the setup isn't there.
  //
  // confidence: "High" / "Medium" / "Low"
  "strategies": [
    {
      "title":      "string",   // ≤60 chars
      "body":       "string",   // 2–3 sentences on the signal logic
      "trigger":    "string",   // specific trigger with levels
      "confidence": "string",
      "score":      integer     // 0–100 conviction
    }
  ],

  // ── SOURCES [list everything you actually used] ───────────────────
  "sources": [
    {
      "name": "string",
      "type": "string",   // Macro News / Rates Data / Market Data / Earnings / Energy News /
                          // Research / Volatility Data / Credit News / FX News / or your own
      "note": "string",   // 1 sentence on what this source contributed today
      "url":  "string"    // full URL or ""
    }
  ]

}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MACRO STRESS INDEX — WEIGHTING GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Base weights for the composite (use the heat score you assigned in crossMarket):

  Brent Crude or dominant energy instrument    20%
  10Y Treasury                                 15%
  VIX                                          15%
  S&P 500 (SPY or equivalent)                  12%
  Nasdaq 100 (QQQ or equivalent)                8%
  WTI Crude (or skip if Brent already used)     8%
  30Y Treasury                                  7%
  Dollar Index                                  5%
  Russell 2000 or small-cap proxy               5%
  Any other market you judged highly stressed   5% (optional, substitute)

If a market in the weighting isn't in your crossMarket, use 50 as a neutral default.

Labels: 0–39 Low | 40–54 Moderate | 55–69 Elevated | 70–84 High | 85–100 Critical

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HEAT SCORE CALIBRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Score the significance of today's move in context — not just its size:

  90–100  Extreme — dominant cross-asset shock, multi-sigma, regime-defining
  75–89   Elevated — clearly moving the tape, abnormal vs. recent behavior
  60–74   Active — notable but within range, on the radar
  40–59   Quiet — below-average, background noise
  0–39    Dormant — nothing happened here worth noting

Context beats percentage. A 0.3% equity move on a calm day is a 45.
The same move on a day with crude spiking and VIX jumping is a 75.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REMINDER: Output ONLY the raw JSON. { to }. No backticks, no text before or after.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## What's fixed vs. dynamic

| Field | Why |
|---|---|
| `rateCurve` — 8 tenors in order | Chart.js plots a connected line; tenor sequence must be consistent |
| `scenarios` — Bear / Base / Bull labels | CSS classes `sc-bear` / `sc-base` / `sc-bull` are keyed to these exact strings |
| All top-level header strings | Dashboard JS accesses these directly by name, no guards |
| Everything else | Pure `.map()` — renders whatever the JSON contains |

**sectorHeat and crossMarket are now fully open.** The dashboard renders any sector name or market name you give it. On an earnings week you might include "Mega-cap Tech" and "Regional Banks" as sectors. On a currency crisis day you'd add EUR/USD or USD/JPY to crossMarket. The dashboard adapts.

---

## Validation script

```bash
python3 -c "
import json, sys
with open('market_data.json') as f:
    d = json.load(f)

# Fixed fields
required = ['snapshotDate','lastUpdated','disclaimer','marketPulse','marketPulseSubtext',
            'topDriver','narrativeSummary','macroStressIndex','macroStressLabel',
            'macroStressSubtext','rateCurve','rateCurveRead','scenarios']
missing = [k for k in required if k not in d]
if missing: print('MISSING FIXED KEYS:', missing); sys.exit(1)

# rateCurve
assert len(d['rateCurve']) == 8, f'rateCurve needs 8 items, got {len(d[\"rateCurve\"])}'
assert [p['tenor'] for p in d['rateCurve']] == ['1M','3M','6M','1Y','2Y','5Y','10Y','30Y'], 'Wrong tenor order'
for r in d['rateCurve']:
    assert isinstance(r['current'],(int,float)), f'Non-numeric current: {r}'

# scenarios
assert len(d['scenarios']) == 3, 'Need exactly 3 scenarios'
assert [s['label'] for s in d['scenarios']] == ['Bear','Base','Bull'], 'Labels must be Bear, Base, Bull in order'
probs = sum(s['probability'] for s in d['scenarios'])
assert probs == 100, f'Probabilities sum to {probs}, need 100'

# sectorHeat trend arrows
for s in d.get('sectorHeat',[]):
    assert s.get('trend','')[0:1] in ['↑','↓','→'], f'trend must start with ↑↓→: {s[\"sector\"]}'

# Dynamic array minimums
dynamic = {k: len(d[k]) for k in ['topThemes','crossMarket','sectorHeat','drivers','risks',
           'timeline','watchpoints','strategies','sources'] if k in d}
for k, n in dynamic.items():
    assert n >= 1, f'{k} must have at least 1 item'

print(f'✓ {d[\"snapshotDate\"]} | MSI {d[\"macroStressIndex\"]} ({d[\"macroStressLabel\"]})')
print(f'  {dynamic}')
"
```

---

## Day-type guide

**Quiet session** (low vol, no catalysts): 2 themes, 8–10 crossMarket rows, 3 drivers, 3 risks, 3 timeline entries, 3 strategies. Tight and honest.

**Single-driver shock** (oil spike, geopolitical event): 3–4 themes, 12–15 crossMarket rows including the specific commodity and related spreads, 4–5 drivers, 4–5 risks, 5 timeline entries.

**FOMC / major data day**: 4–5 themes, full crossMarket including short-end rates prominently, 5–6 drivers, 5 timeline entries with specific time stamps, 6–8 watchpoints covering the next meeting path.

**Earnings-driven rotation**: Add relevant sector ETFs and individual names to crossMarket. Replace generic sector names in sectorHeat with specific ones like "Mega-cap Tech", "Semis", "Regional Banks" if those are what actually moved.

**FX/EM stress day**: Add EUR/USD, USD/JPY, EM basket, credit spreads to crossMarket. Include "FX" and "Credit" tagged watchpoints.
