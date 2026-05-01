# Daily Market Data Refresh Prompt 

**Instructions:** Copy everything inside the triple-dashed block, replace `[TODAY]` and `[YESTERDAY_MSI]`, paste into a new Claude conversation.

---

```
You are a macro market analyst. Research today's market close and produce a single valid JSON object that powers a market intelligence dashboard.

TODAY'S DATE: [TODAY]
YESTERDAY'S MSI: [YESTERDAY_MSI]   ← replace with yesterday's macroStressIndex value

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — PRECISE CLOSE DATA SOURCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use these specific sources in order. Each one is authoritative for its data type.
Do not estimate or interpolate — if a source is unavailable, say so and omit the field.

─── YIELD CURVE (most accurate source) ────────────────────────────────────────
Fetch the US Treasury official XML API for [TODAY]'s month:
  https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value=YYYYMM

Field mapping (use the last date row — that is today's close):
  BC_1MONTH  → 1M tenor
  BC_3MONTH  → 3M tenor
  BC_6MONTH  → 6M tenor
  BC_1YEAR   → 1Y tenor
  BC_2YEAR   → 2Y tenor
  BC_5YEAR   → 5Y tenor
  BC_10YEAR  → 10Y tenor
  BC_30YEAR  → 30Y tenor

For prior day yields: use the second-to-last date row in the same XML response.
Values are already in percent (e.g. 4.41 means 4.41%). Use as-is — no conversion needed.

─── EQUITY INDEX CLOSES ─────────────────────────────────────────────────────
Search these in order of reliability:
1. CNBC Markets page: https://www.cnbc.com/us-market-data/
2. WSJ Markets: https://www.wsj.com/market-data
3. Yahoo Finance summary pages for: ^GSPC ^IXIC ^DJI ^RUT ^VIX

Report exact closing values, not intraday. Verify the date matches [TODAY].
Required: S&P 500 close, Nasdaq 100 close, Dow Jones close, Russell 2000 close, VIX close.

─── OIL PRICES ──────────────────────────────────────────────────────────────
1. EIA weekly report if available: https://www.eia.gov/petroleum/
2. CME Group front-month futures: CLF (WTI), QAF (Brent)
3. Trading Economics for spot: https://tradingeconomics.com/commodity/crude-oil
4. Reuters commodity wrap for [TODAY]

Report: Brent front-month close, WTI front-month close, both in $/barrel.
Compute spread: Brent - WTI = brentWTISpread (needed for OGPI indicator).

─── GOLD, DXY, CRYPTO ───────────────────────────────────────────────────────
1. Gold: CME GC front-month or Reuters commodity close
2. DXY (Dollar Index): WSJ or CNBC
3. Bitcoin: CoinDesk or Reuters

─── MACRO DATA RELEASES ────────────────────────────────────────────────────
Check in this order:
1. BEA (GDP): https://www.bea.gov/news/schedule
2. BLS (CPI, PCE, NFP): https://www.bls.gov/schedule/news_release/
3. Fed Reserve: https://www.federalreserve.gov/releases/
4. Reuters/CNBC macro data summary for [TODAY]

If today had a data release, include the exact print and consensus deviation.
If no scheduled data, note that explicitly — do not fabricate a release.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — FLUID NARRATIVE SOURCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After pinning precise closes above, use these sources freely to understand
the *story* behind the numbers — what moved, why, and what matters next.
These are for context, analysis, and colour — not for prices.

─── PRIMARY NARRATIVE SOURCES ───────────────────────────────────────────────
• Reuters global markets end-of-day wrap for [TODAY]
• CNBC Markets live blog for [TODAY]
• FT Markets for [TODAY] (ft.com/markets)
• Bloomberg Markets wrap if accessible

─── EARNINGS & CORPORATE ────────────────────────────────────────────────────
• Seeking Alpha earnings page: https://seekingalpha.com/earnings/earnings-calendar
• Company IR pages for any major reports today
• 24/7 Wall St. earnings live coverage

─── GEOPOLITICAL & MACRO CONTEXT ────────────────────────────────────────────
• Axios markets newsletter
• The Economist / Project Syndicate for macro analysis
• Fed speeches: https://www.federalreserve.gov/newsevents/speeches.htm
• ECB, BoE, BoJ press releases if relevant

─── SECTOR & FLOW DATA ──────────────────────────────────────────────────────
• ETF.com daily flows: https://www.etf.com/sections/daily-etf-flows
• State Street SPDR daily flows (for SPY, GLD, etc.)
• Credit spreads: FRED ICE BofA HY spread (BAMLH0A0HYM2)

─── OIL & ENERGY CONTEXT ────────────────────────────────────────────────────
• Tanker trackers: TankerTrackers.com headlines
• Vortexa or Kpler for supply disruption news
• Strait of Hormuz status: Reuters energy desk
• IEA short-term energy outlook if recently published

─── INSTITUTIONAL RESEARCH & BANK VIEWS ─────────────────────────────────────
Search for today's published notes from major banks — these often contain the
sharpest macro reads and trade implications. Use any that are publicly accessible.

• Goldman Sachs: search "Goldman Sachs markets [TODAY]" or "GS Global Markets Daily"
  - Goldman publishes daily market notes, rates views, and commodity calls
  - Look for: Top of Mind, Global Markets Daily, Commodity Watch, FX Views
  - Public summaries often appear on Bloomberg, Reuters, or Business Insider

• JPMorgan Chase: search "JPMorgan markets outlook [TODAY]" or "JPM Global Research"
  - JPMorgan publishes daily macro views, flows analysis, and sector calls
  - Look for: Eye on the Market (Michael Cembalest), Global Research excerpts
  - Chase Institute publishes consumer spending data that often leads indicators

• Also check if publicly available on [TODAY]:
  - Morgan Stanley Research excerpts (morganstanley.com/ideas)
  - Bank of America / Merrill Lynch Global Research summaries
  - Citi Research market commentary
  - Wells Fargo Investment Institute daily notes

Use these for: macro regime framing, rate path calls, sector overweights/underweights,
and trade ideas that reflect institutional conviction. Cite the bank and note name
in the sources array.

─── CATCH-ALL — ANY DRIVING MARKET NEWS ────────────────────────────────────
The above lists are not exhaustive. Markets move on unexpected catalysts.
Before writing JSON, run a broad search:

  Search: "market news [TODAY]" and "what moved markets [TODAY]"

Check anything that surfaces — trade policy announcements, central bank surprises,
geopolitical breaking news, flash crashes, short squeezes, credit events, rating
actions, corporate guidance cuts, supply chain disruptions, weather/commodity shocks,
political events, regulatory rulings, or any story that dominated financial Twitter/X.

If something significant moved markets today and it is NOT covered by the sources
above, include it anyway. The source list is a starting point, not a ceiling.
Capture it in the appropriate section (crossMarket driver, topThemes, risks,
or timeline) and cite the actual source you found it on.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — FORM YOUR READ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before writing JSON, answer these internally:
- What single force dominated today? (one sentence max)
- Which cross-asset relationships were unusual or broke pattern?
- What regime are markets in right now — stagflation, growth, easing, shock?
- Where is institutional money flowing — what does it confirm?
- What should a reader watch tomorrow and this week?

Let those answers shape every field. Do not produce generic output.
Each section should reflect what actually happened on [TODAY], not a template.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — OUTPUT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Output ONLY the raw JSON. Start with { end with }. No backticks, no preamble.
Numbers are bare (no $ or % in numeric fields). Display strings carry formatting: "$118.03", "4.41%".
Arrays may be short or long — minimum counts listed per section.
Never fabricate a price. If a close is unavailable, omit the crossMarket row entirely.

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
  "macroStressIndexPrior":  integer,       // Yesterday's MSI (use [YESTERDAY_MSI])
  "macroStressLabel":       "string",      // "Low" / "Moderate" / "Elevated" / "High" / "Critical"
  "macroStressSubtext":     "string",      // ≤80 chars. One-line explanation of the score

  "rateCurveRead": "string",               // 2–3 sentences on today's curve shape and signal

  // ── YIELD CURVE — populate from Treasury XML BC_ fields ──────────
  // Source: treasury.gov XML API (see Step 1). These must be exact closes.
  "rateCurve": [
    { "tenor": "1M",  "current": float, "prior": float },  // BC_1MONTH today / prior day
    { "tenor": "3M",  "current": float, "prior": float },  // BC_3MONTH
    { "tenor": "6M",  "current": float, "prior": float },  // BC_6MONTH
    { "tenor": "1Y",  "current": float, "prior": float },  // BC_1YEAR
    { "tenor": "2Y",  "current": float, "prior": float },  // BC_2YEAR
    { "tenor": "5Y",  "current": float, "prior": float },  // BC_5YEAR
    { "tenor": "10Y", "current": float, "prior": float },  // BC_10YEAR
    { "tenor": "30Y", "current": float, "prior": float }   // BC_30YEAR
  ],

  // ── FIXED: scenarios — always Bear / Base / Bull, sum to 100 ─────
  "scenarios": [
    { "label": "Bear", "title": "string", "probability": integer, "trigger": "string", "outcome": "string" },
    { "label": "Base", "title": "string", "probability": integer, "trigger": "string", "outcome": "string" },
    { "label": "Bull", "title": "string", "probability": integer, "trigger": "string", "outcome": "string" }
  ],

  // ── CAPITAL FLOWS [5–12 items] ────────────────────────────────────
  // Source: ETF.com daily flows, State Street, Bloomberg ETF flow data,
  // or directional inference from price/volume action if flows unavailable.
  // direction: "Inflow" / "Outflow" / "Flat"
  // significance: "High" / "Medium" / "Low"
  "flows": [
    {
      "asset":        "string",
      "direction":    "string",
      "size":         "string",    // e.g. "+$2.8B" or "-$1.1B" or "~$0.5B"
      "note":         "string",    // 1–2 sentences on why and regime signal
      "significance": "string"
    }
  ],
  "flowsRead": "string",           // 3–5 sentences synthesizing the flow picture

  // ── INDICATOR INPUTS — dashboard computes composite scores ────────
  // Source guidance:
  //   brentWTISpread:       Compute from Step 1 oil prices (Brent close - WTI close)
  //   hormuzclosurePct:     TankerTrackers / Reuters / Vortexa — 100=fully open, 0=closed
  //   tankerRatePremium:    Reuters/Platts VLCC rate vs pre-conflict baseline (% above)
  //   futuresBackwardationBp: CME Brent 12-month spread in basis points
  //   cloudGrowthRate:      Most recent hyperscaler earnings: GOOGL/MSFT/AMZN cloud YoY %
  //   aiRevCapexRatio:      Cloud revenue growth ÷ AI capex growth — above 1.0 = returns > spend
  //   earningsRevisionTrend:% of S&P beating EPS × 1.0 + upward guidance × 0.5, normalized 0–100
  //   corePCETrend:         Most recent BLS/BEA core PCE YoY %
  //   gdpGrowthEstimate:    Most recent BEA GDP advance/revised estimate, annualized
  //   realWageYoY:          Atlanta Fed Wage Growth Tracker YoY minus CPI YoY
  //   creditTighteningScore:FRED BAMLH0A0HYM2 (HY OAS): 600bp+=100, 300bp=50, 200bp=25
  //   advDecRatio:          NYSE or S&P advancing issues ÷ declining issues today
  //   newHiLoRatio:         NYSE 52-week new highs ÷ new lows today
  //   capVsEqualWeightBp:   SPY daily return minus RSP (equal-weight S&P) daily return, in bp
  //   pctAbove50dMA:        % of S&P 500 stocks above 50-day MA (CNBC, StockCharts, Barchart)
  "indicators": {
    "brentWTISpread":         float,
    "hormuzclosurePct":       integer,
    "tankerRatePremium":      integer,
    "futuresBackwardationBp": integer,
    "cloudGrowthRate":        float,
    "aiRevCapexRatio":        float,
    "earningsRevisionTrend":  integer,
    "corePCETrend":           float,
    "gdpGrowthEstimate":      float,
    "realWageYoY":            float,
    "creditTighteningScore":  integer,
    "advDecRatio":            float,
    "newHiLoRatio":           float,
    "capVsEqualWeightBp":     integer,
    "pctAbove50dMA":          integer
  },

  // ══════════════════════════════════════════════════════════════════
  // DYNAMIC — populate based on what actually happened today
  // ══════════════════════════════════════════════════════════════════

  // ── TOP THEMES [min 2] ────────────────────────────────────────────
  // direction options: Shock / Macro Tightening / Macro Easing / Leadership /
  //   Rotation / Defensive USD / Vol Watch / Risk-On / Risk-Off / Earnings /
  //   Data / Compression / Credit Stress / Haven Bid / Squeeze
  "topThemes": [
    { "theme": "string", "impact": "string", "strength": integer, "direction": "string", "tags": ["string"] }
  ],

  // ── CROSS-MARKET [min 6] ──────────────────────────────────────────
  // Prices from Step 1 sources only. Omit rows with no verified close.
  // risk: "Watch" / "Elevated" / "High" / "Moderate"
  // heat: 0–100 (see calibration guide)
  // trend: must start with ↑, ↓, or →
  "crossMarket": [
    { "market": "string", "risk": "string", "driver": "string", "move": "string", "trend": "string", "heat": integer, "source": "string" }
  ],

  // ── SECTOR HEAT [min 4] ───────────────────────────────────────────
  // trend must start with ↑, ↓, or →
  "sectorHeat": [
    { "sector": "string", "heat": integer, "trend": "string", "driver": "string" }
  ],

  // ── MACRO DRIVERS [min 3, ranked score descending] ───────────────
  "drivers": [
    { "name": "string", "score": integer, "detail": "string", "linked": "string", "confidence": "string", "source": "string" }
  ],

  // ── RISKS [min 3] ─────────────────────────────────────────────────
  // level: "High" / "Elevated" / "Medium" / "Watch"
  "risks": [
    { "title": "string", "level": "string", "desc": "string" }
  ],

  // ── NARRATIVE TIMELINE [min 4 entries] ───────────────────────────
  "timeline": [
    { "time": "string", "headline": "string", "effect": "string" }
  ],

  // ── FORWARD WATCHPOINTS [min 4] ───────────────────────────────────
  // significance: "High" / "Medium"
  // tag: Energy / Rates / Equities / Macro / Volatility / Earnings / Geopolitical / Credit / FX
  "watchpoints": [
    { "date": "Mon DD", "event": "string", "significance": "string", "tag": "string" }
  ],

  // ── STRATEGY IDEAS [min 2] ────────────────────────────────────────
  "strategies": [
    { "title": "string", "body": "string", "trigger": "string", "confidence": "string", "score": integer }
  ],

  // ── SOURCES [list every source used] ─────────────────────────────
  // Be specific: include the exact URL and date accessed where possible
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

Context beats percentage. A 0.3% move on a quiet day = 45. Same move during a shock = 75.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAY-TYPE GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quiet session:         2 themes, 8–10 crossMarket, 3 drivers, 3 risks, 4 timeline entries
Single-driver shock:   3–4 themes, 12–14 crossMarket, 4–5 drivers, 5 timeline entries
FOMC / data day:       4–5 themes, full crossMarket with short rates prominent, 5 drivers, 6–8 watchpoints
Earnings-driven:       Add sector ETFs and individual names to crossMarket; name sectors specifically
FX/EM stress:          Add currencies and credit spreads to crossMarket; tag watchpoints FX/Credit

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REMINDER: Output ONLY the raw JSON. { to }. No backticks, no text before or after.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## How to use each day

1. Copy the block above, replace `[TODAY]` with today's date (e.g. `May 2, 2026`) and `[YESTERDAY_MSI]` with the prior day's MSI value
2. Paste into a new Claude conversation
3. Save the output as `market_data.json` in the same folder as `index.html`
4. Refresh `http://localhost:8000`

---

## Source reference card

| Data | Primary source | Fallback |
|---|---|---|
| Yield curve | treasury.gov XML API (`BC_` fields) | CNBC rates page |
| S&P 500 / Nasdaq / Dow close | CNBC Markets or WSJ Markets | Yahoo Finance ^GSPC etc. |
| VIX close | CNBC or Yahoo Finance ^VIX | Cboe website |
| Brent crude | CME / EIA / Trading Economics | Reuters commodity |
| WTI crude | CME / EIA | Trading Economics |
| Gold | CME GC front-month | Reuters |
| DXY | WSJ or CNBC | Yahoo Finance DX=F |
| GDP / PCE / CPI | BEA.gov / BLS.gov | Fed FRED |
| NFP / jobless claims | BLS.gov | Reuters data |
| HY credit spreads | FRED BAMLH0A0HYM2 | ICE BofA index |
| ETF flows | ETF.com daily flows | State Street SPDR |
| Adv/Dec, Hi/Lo | WSJ Market Data | Barchart |
| % above 50d MA | Barchart / StockCharts | CNBC market internals |
| Earnings results | Seeking Alpha / company IR | CNBC earnings |
| Macro narrative | Reuters / CNBC wrap | FT Markets |
| Goldman Sachs views | Goldman Global Markets Daily / Top of Mind | Search "Goldman Sachs markets [TODAY]" |
| JPMorgan / Chase views | JPM Global Research / Eye on the Market | Search "JPMorgan outlook [TODAY]" |
| Other bank notes | Morgan Stanley, BofA, Citi, Wells Fargo | Search "[bank] markets [TODAY]" |
| Unexpected catalysts | Search "market news [TODAY]" broadly | Any credible financial outlet |

---

## Treasury XML — field names quick reference

The treasury.gov XML API returns these field names in the `<content>` block of each `<entry>`:

```
NEW_DATE      → date of the observation
BC_1MONTH     → 1-month T-bill yield
BC_3MONTH     → 3-month T-bill yield
BC_6MONTH     → 6-month T-bill yield
BC_1YEAR      → 1-year yield
BC_2YEAR      → 2-year yield
BC_3YEAR      → 3-year yield
BC_5YEAR      → 5-year yield
BC_7YEAR      → 7-year yield
BC_10YEAR     → 10-year yield
BC_20YEAR     → 20-year yield
BC_30YEAR     → 30-year yield
```

API URL pattern:
```
https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value=YYYYMM
```

Replace `YYYYMM` with the year and month (e.g. `202605` for May 2026).
The last `<entry>` in the feed is the most recent business day.
The second-to-last `<entry>` is the prior business day (use for `prior` fields).

---

## Validation script

```bash
python3 -c "
import json, sys
with open('market_data.json') as f:
    d = json.load(f)

required = ['snapshotDate','lastUpdated','disclaimer','marketPulse','narrativeSummary',
            'macroStressIndex','macroStressLabel','macroStressSubtext',
            'rateCurve','rateCurveRead','scenarios','indicators','flows']
missing = [k for k in required if k not in d]
if missing: print('MISSING:', missing); sys.exit(1)

assert len(d['rateCurve']) == 8, 'rateCurve needs 8 items'
assert [p['tenor'] for p in d['rateCurve']] == ['1M','3M','6M','1Y','2Y','5Y','10Y','30Y']
assert len(d['scenarios']) == 3
assert [s['label'] for s in d['scenarios']] == ['Bear','Base','Bull']
probs = sum(s['probability'] for s in d['scenarios'])
assert probs == 100, f'Probabilities sum to {probs}'
for r in d['rateCurve']:
    assert isinstance(r['current'], (int,float)) and r['current'] > 0, f'Bad yield: {r}'
for s in d.get('sectorHeat', []):
    assert s.get('trend','')[0] in ['↑','↓','→'], f'trend arrow: {s[\"sector\"]}'

dynamic = {k: len(d[k]) for k in ['topThemes','crossMarket','sectorHeat','drivers',
           'risks','timeline','watchpoints','strategies','sources','flows'] if k in d}
delta = d.get('macroStressIndex',0) - d.get('macroStressIndexPrior', d.get('macroStressIndex',0))
print(f'OK: {d[\"snapshotDate\"]} | MSI {d[\"macroStressIndex\"]} ({d[\"macroStressLabel\"]}) {delta:+d} vs prior')
print(f'  {dynamic}')
print(f'  indicators: {len(d.get(\"indicators\",{}))} inputs')
print(f'  10Y yield: {next(r[\"current\"] for r in d[\"rateCurve\"] if r[\"tenor\"]==\"10Y\")}%')
"
```

---

## What the dashboard computes automatically

| Indicator | Formula | Active threshold |
|---|---|---|
| OGPI — Oil Geopolitical Pressure | spread×.30 + hormuz×.35 + tanker×.20 + backwardation×.15 | ≥ 75 |
| AICS — AI Capex Conviction | cloud×.35 + semi×.25 + earnings_rev×.20 + rev/capex×.20 | ≥ 70 |
| SPI — Stagflation Pressure | energy×.35 + growth_decel×.25 + real_wage×.25 + credit×.15 | ≥ 65 |
| MBDS — Breadth Divergence | adv/dec×.30 + hi/lo×.25 + cap_vs_ew×.25 + pct_50d×.20 | ≥ 55 |

If an input is unavailable, the dashboard falls back to `crossMarket` heat scores — indicators still render, labeled "est."
