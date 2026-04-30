# Daily Market Data Refresh Prompt — v3

**Instructions:** Copy everything inside the triple-dashed block, replace `[TODAY]` with today's date, paste into a new Claude conversation.

---

```
You are a macro market analyst. Research today's market close and produce a single valid JSON object that powers a market intelligence dashboard. Every section is dynamic — you decide what to include based on what actually mattered today.

TODAY'S DATE: [TODAY]
YESTERDAY'S MSI: [YESTERDAY_MSI]   ← replace with yesterday's macroStressIndex value

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — RESEARCH FIRST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before writing any JSON, search and read:
1. Reuters global markets wrap for [TODAY]
2. U.S. Treasury yield curve for [TODAY] — all tenors (treasury.gov)
3. Closing prices: SPY, QQQ, DIA, IWM, SOXX, DXY, GC=F, BTC-USD, ^VIX, CL=F, BZ=F
4. Any macro data released today (CPI, PCE, NFP, PMI, GDP, jobless claims, FOMC)
5. Any major earnings, geopolitical, or sector news that moved markets
6. For the indicators block: Brent-WTI spread, Hormuz traffic %, tanker rates, cloud growth %, advance-decline ratio, % of S&P above 50d MA

Do not fabricate numbers. Omit any market where you have no real price.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — FORM YOUR READ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before writing JSON, answer these internally:
- What single force dominated today?
- Which cross-asset relationships were unusual or broke pattern?
- What regime are markets in right now — stagflation, growth, easing, shock?
- What should a reader watch tomorrow and this week?

Let those answers shape every field. Do not produce generic output.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — OUTPUT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Output ONLY the raw JSON. Start with { end with }. No backticks, no preamble.
Numbers are bare (no $ or % in numeric fields). Display strings carry formatting: "$118.03", "4.41%".
Arrays may be short or long — minimum counts listed per section.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{

  // ── FIXED: always required ────────────────────────────────────────
  "snapshotDate":         "YYYY-MM-DD",
  "lastUpdated":          "Mon DD, YYYY",
  "disclaimer":           "string",
  "marketPulse":          "string",        // ≤120 chars. Punchy session headline
  "marketPulseSubtext":   "string",        // 2–3 sentences with key closes and drivers
  "topDriver":            "string",        // ≤100 chars. The dominant force today
  "narrativeSummary":     "string",        // 4–6 sentences. Full macro story of the day

  "macroStressIndex":       integer,       // 0–100. Weighted composite. See weighting guide.
  "macroStressIndexPrior":  integer,       // Yesterday's MSI (use [YESTERDAY_MSI] — enables delta display)
  "macroStressLabel":       "string",      // "Low" / "Moderate" / "Elevated" / "High" / "Critical"
  "macroStressSubtext":     "string",      // ≤80 chars. One-line explanation of the score

  "rateCurveRead": "string",               // 2–3 sentences on today's curve shape and signal

  // ── FIXED: rate curve — always 8 tenors in this order ────────────
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

  // ── FIXED: scenarios — always Bear / Base / Bull, sum to 100 ─────
  "scenarios": [
    { "label": "Bear", "title": "string", "probability": integer, "trigger": "string", "outcome": "string", "watchpoints": ["string","string","string"] },
    { "label": "Base", "title": "string", "probability": integer, "trigger": "string", "outcome": "string", "watchpoints": ["string","string","string"] },
    { "label": "Bull", "title": "string", "probability": integer, "trigger": "string", "outcome": "string", "watchpoints": ["string","string","string"] }
  ],

  // ── FIXED: indicator inputs — dashboard computes scores from these
  // Research these from the day's data. Omit a field if unavailable —
  // the dashboard falls back to crossMarket heat scores as proxies.
  // ── CAPITAL FLOWS [DYNAMIC: 5–12 items] ──────────────────────────
  // Where institutional money is moving today. Use ETF flow data from
  // Bloomberg, ETF.com, or financial news when available. If exact flows
  // are unavailable, describe directional moves at the asset class level
  // based on price action, sector performance, and news reports.
  //
  // direction: "Inflow" / "Outflow" / "Flat"
  // significance: "High" / "Medium" / "Low"
  "flows": [
    {
      "asset":        "string",    // e.g. "Energy ETFs (XLE, USO)", "Short-term Treasuries (SHY, BIL)"
      "direction":    "string",    // Inflow / Outflow / Flat
      "size":         "string",    // formatted: "+$2.8B" or "-$1.1B" or "~$0.5B"
      "note":         "string",    // 1–2 sentences: why money moved, what regime signal it sends
      "significance": "string"     // High / Medium / Low
    }
  ],
  "flowsRead": "string",  // 3–5 sentences synthesizing what the flow picture says about today's
                          // regime. Connect the dominant flows to the SPI, OGPI, or AICS signal.
                          // E.g. "The flow picture confirms the SPI>65 stagflation read: energy inflows
                          // and short-duration inflows alongside TLT outflows is the textbook setup."

  "indicators": {
    // OGPI — Oil Geopolitical Pressure Index
    "brentWTISpread":         float,    // Brent minus WTI in $ (e.g. 11.15)
    "hormuzclosurePct":       integer,  // % of normal Hormuz traffic today (0=closed, 100=normal)
    "tankerRatePremium":      integer,  // tanker rate % above pre-conflict baseline (e.g. 145)
    "futuresBackwardationBp": integer,  // 12-month Brent backwardation in bp (negative=contango)

    // AICS — AI Capex Conviction Score
    "cloudGrowthRate":        float,    // Most recent hyperscaler cloud YoY growth % (best: GOOGL/MSFT/AMZN)
    "aiRevCapexRatio":        float,    // AI cloud revenue growth ÷ AI capex growth (e.g. 0.74). Above 1.0 = returns beating spend
    "earningsRevisionTrend":  integer,  // 0–100: % S&P beating EPS × 1.0 + upward guidance × 0.5, normalized

    // SPI — Stagflation Pressure Index
    "corePCETrend":           float,    // Most recent core PCE YoY % (e.g. 2.6)
    "gdpGrowthEstimate":      float,    // Most recent GDP growth annualized % (e.g. 1.2)
    "realWageYoY":            float,    // Nominal wage growth YoY minus CPI YoY (can be negative)
    "creditTighteningScore":  integer,  // 0–100: HY OAS 600bp+=100, 300bp=50, 200bp=25

    // MBDS — Market Breadth Divergence Signal
    "advDecRatio":            float,    // Advancing ÷ declining issues today (e.g. 0.68)
    "newHiLoRatio":           float,    // New 52-week highs ÷ lows (e.g. 1.4)
    "capVsEqualWeightBp":     integer,  // SPY daily return minus equal-weight S&P return in bp (e.g. -42)
    "pctAbove50dMA":          integer   // % of S&P 500 stocks above 50-day MA (e.g. 53)
  },


  // ══════════════════════════════════════════════════════════════════
  // DYNAMIC — populate based on what actually happened today
  // ══════════════════════════════════════════════════════════════════

  // ── TOP THEMES [min 1] ────────────────────────────────────────────
  // direction options: Shock / Macro Tightening / Macro Easing / Leadership / Rotation /
  //   Defensive USD / Vol Watch / Risk-On / Risk-Off / Earnings / Data / Compression /
  //   Credit Stress / Haven Bid / Squeeze
  "topThemes": [
    { "theme": "string", "impact": "string", "strength": integer, "direction": "string" }
  ],

  // ── CROSS-MARKET [min 1] ──────────────────────────────────────────
  // Include any market that moved meaningfully. Omit anything with no real price.
  // risk: "Watch" / "Elevated" / "High" / "Moderate"
  // heat: 0–100 (see calibration guide below)
  "crossMarket": [
    { "market": "string", "risk": "string", "driver": "string", "move": "string", "trend": "string", "heat": integer, "source": "string" }
  ],

  // ── SECTOR HEAT [min 1] ───────────────────────────────────────────
  // Include sectors with a distinct story. trend must start with ↑, ↓, or →
  "sectorHeat": [
    { "sector": "string", "heat": integer, "trend": "string", "driver": "string" }
  ],

  // ── MACRO DRIVERS [min 1, ranked score descending] ───────────────
  // confidence: "High" / "Medium" / "Low"
  "drivers": [
    { "name": "string", "score": integer, "detail": "string", "linked": "string", "confidence": "string", "source": "string" }
  ],

  // ── RISKS [min 1] ─────────────────────────────────────────────────
  // level: "High" / "Elevated" / "Medium" / "Watch"
  "risks": [
    { "title": "string", "level": "string", "desc": "string" }
  ],

  // ── NARRATIVE TIMELINE [min 1] ────────────────────────────────────
  // time: "Pre-market" / "Morning" / "Midday" / "Afternoon" / "Close" / "After-hours" / "Next watchpoint"
  "timeline": [
    { "time": "string", "headline": "string", "effect": "string" }
  ],

  // ── FORWARD WATCHPOINTS [min 1] ───────────────────────────────────
  // significance: "High" / "Medium"
  // tag: Energy / Rates / Equities / Macro / Volatility / Earnings / Geopolitical / Credit / FX
  "watchpoints": [
    { "date": "Mon DD", "event": "string", "significance": "string", "tag": "string" }
  ],

  // ── STRATEGY IDEAS [min 1] ────────────────────────────────────────
  // confidence: "High" / "Medium" / "Low"
  "strategies": [
    { "title": "string", "body": "string", "trigger": "string", "confidence": "string", "score": integer }
  ],

  // ── SOURCES [list everything used] ───────────────────────────────
  "sources": [
    { "name": "string", "type": "string", "note": "string", "url": "string" }
  ]

}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MACRO STRESS INDEX — WEIGHTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Weighted average of crossMarket heat scores (use 50 for any omitted market):

  Brent Crude          20%     10Y Treasury         15%
  VIX                  15%     WTI Crude            10%
  S&P 500 (SPY)        10%     Nasdaq 100 (QQQ)      8%
  30Y Treasury          7%     Dollar Index          5%
  Russell 2000 (IWM)    5%     (remaining 5% = other)

Labels: 0–39 Low | 40–54 Moderate | 55–69 Elevated | 70–84 High | 85–100 Critical

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HEAT SCORE CALIBRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Score the significance of today's move in context — not raw size:

  90–100  Extreme — dominant cross-asset shock, regime-defining
  75–89   Elevated — clearly moving the tape, abnormal vs. recent
  60–74   Active — notable but within range, on the radar
  40–59   Quiet — below-average, background noise
  0–39    Dormant — nothing happened here today

Context beats percentage. A 0.3% move on a quiet day = 45. Same move during a geopolitical shock = 75.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAY-TYPE GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quiet session:         2 themes, 8–10 crossMarket, 3 drivers, 3 risks, 3 timeline entries
Single-driver shock:   3–4 themes, 12–14 crossMarket, 4–5 drivers, 5 timeline entries
FOMC / data day:       4–5 themes, full crossMarket with short rates prominent, 5 drivers, 6–8 watchpoints
Earnings-driven:       Add relevant sector ETFs and individual names to crossMarket; name sectors specifically
FX/EM stress:          Add currencies and credit spreads to crossMarket; tag watchpoints FX/Credit

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REMINDER: Output ONLY the raw JSON. { to }. No backticks, no text before or after.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## How to use each day

1. Copy the block above, replace `[TODAY]` and `[YESTERDAY_MSI]`
2. Paste into a new Claude conversation
3. Save the output as `market_data.json` in the same folder as `index.html`
4. Refresh `http://localhost:8000`

## Validation script

```bash
python3 -c "
import json, sys
with open('market_data.json') as f:
    d = json.load(f)

required = ['snapshotDate','lastUpdated','disclaimer','marketPulse','narrativeSummary',
            'macroStressIndex','macroStressLabel','macroStressSubtext',
            'rateCurve','rateCurveRead','scenarios','indicators']
missing = [k for k in required if k not in d]
if missing: print('MISSING:', missing); sys.exit(1)

assert len(d['rateCurve']) == 8, 'rateCurve needs 8 items'
assert [p['tenor'] for p in d['rateCurve']] == ['1M','3M','6M','1Y','2Y','5Y','10Y','30Y'], 'Wrong tenor order'
assert len(d['scenarios']) == 3, 'Need 3 scenarios'
assert [s['label'] for s in d['scenarios']] == ['Bear','Base','Bull'], 'Labels must be Bear/Base/Bull'
probs = sum(s['probability'] for s in d['scenarios'])
assert probs == 100, f'Probabilities sum to {probs}'
for r in d['rateCurve']:
    assert isinstance(r['current'], (int,float)) and r['current'] > 0
for s in d.get('sectorHeat', []):
    assert s.get('trend','')[0] in ['↑','↓','→'], f'trend arrow: {s[\"sector\"]}'

dynamic = {k: len(d[k]) for k in ['topThemes','crossMarket','sectorHeat','drivers','risks','timeline','watchpoints','strategies','sources'] if k in d}
delta = d.get('macroStressIndex',0) - d.get('macroStressIndexPrior', d.get('macroStressIndex',0))
print(f'✓ {d[\"snapshotDate\"]} | MSI {d[\"macroStressIndex\"]} ({d[\"macroStressLabel\"]}) {delta:+d} vs prior')
print(f'  {dynamic}')
print(f'  indicators: {len(d.get(\"indicators\",{}))} inputs')
"
```

## What the dashboard computes automatically

The `indicators` block contains raw inputs. The dashboard JavaScript computes four composite scores live at render time:

| Indicator | Formula | Signal threshold |
|---|---|---|
| OGPI — Oil Geopolitical Pressure | spread×.30 + hormuz×.35 + tanker×.20 + backwardation×.15 | Active above 75 |
| AICS — AI Capex Conviction | cloud×.35 + semi×.25 + earnings_rev×.20 + rev/capex×.20 | Active above 70 |
| SPI — Stagflation Pressure | energy×.35 + growth_decel×.25 + real_wage×.25 + credit×.15 | Stagflation above 65 |
| MBDS — Breadth Divergence | adv/dec×.30 + hi/lo×.25 + cap_vs_ew×.25 + pct_50d×.20 | Divergence above 55 |

If an input is unavailable, the dashboard falls back to crossMarket heat scores as proxies — indicators still render, labeled "est."

The `macroStressIndexPrior` field enables the delta indicator (+3 / -5) on the stress ring. Set it to yesterday's MSI value.
