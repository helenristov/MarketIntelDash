# Macro Signal Console

A daily macro intelligence dashboard that reads the market so you don't have to stare at 12 tabs.

One prompt after close → scans prices, yields, news, and flows → drops a JSON file → full narrative read loads automatically. Yesterday it caught Alphabet's Cloud growing 63% while Brent briefly printed $120. Same dashboard, completely different story every day. That's the point.

---

## What it does

Renders a full end-of-day macro snapshot from a single JSON file across 12 collapsible sections:

| Section | What it shows |
|---|---|
| **Hero** | Narrative summary, MSI stress ring with delta, 4 dynamic stat cards |
| **Top Themes** | Session forces color-coded by direction (Shock, Leadership, Rotation, etc.) |
| **Rate Curve** | Full 8-tenor yield curve — current vs. prior session |
| **Cross-Market** | Every market that moved, with click-to-expand driver rows |
| **Capital Flows** | Where institutional money moved — inflows, outflows, size, regime read |
| **Indicator Suite** | 4 custom composite indicators computed live from the JSON |
| **Signal Board** | Indicator-derived signals with entry, exit, and stop conditions |
| **Driver Stack** | Ranked macro forces with confidence scores |
| **Sector Heat** | Dynamic tiles colored by stress intensity |
| **Scenario Matrix** | Bear/Base/Bull with stacked probability bar |
| **Timeline + Watchpoints** | Session narrative + dated forward-looking events |
| **Strategy Ideas** | Illustrative setups derived from the dashboard state |

Every section is **collapsible** — click the title to fold it. Cross-market rows are **expandable** — click any row to reveal the full driver narrative inline.

---

## How to run it

Put both files in the same folder. Start a local server:

```bash
python3 -m http.server 8000
```

Open **http://localhost:8000**. No build step, no dependencies, no backend.

---

## File structure

```
├── index.html                    # Dashboard — fluid and updateable. New Liquid Glass Display
├── market_data.json              # Today's snapshot — replace each day
├── daily_refresh_prompt.md   # The prompt you run each evening
└── README.md
```

---

## Updating daily

1. Copy the prompt block from `daily_refresh_prompt.md`
2. Replace `[TODAY]` with today's date
3. Paste into a new Claude conversation
4. Save the JSON output as `market_data.json`
5. Refresh `http://localhost:8000`

### Quick validation

```bash
python3 -c "
import json, sys
with open('market_data.json') as f:
    d = json.load(f)
required = ['snapshotDate','narrativeSummary','macroStressIndex','rateCurve',
            'scenarios','sectorHeat','crossMarket','flows','indicators']
missing = [k for k in required if k not in d]
if missing: print('MISSING:', missing); sys.exit(1)
assert len(d['rateCurve']) == 8
assert len(d['scenarios']) == 3
assert sum(s['probability'] for s in d['scenarios']) == 100
assert len(d.get('flows',[])) >= 1
for s in d['sectorHeat']:
    assert s['trend'][0] in ['↑','↓','→'], f'Bad trend: {s["sector"]}'
print(f'OK — {d["snapshotDate"]} | MSI {d["macroStressIndex"]} ({d["macroStressLabel"]})')
print(f'  flows: {len(d["flows"])} | markets: {len(d["crossMarket"])} | sources: {len(d["sources"])}')
"
```

---

## The 4 custom indicators

Scores are computed live in the browser from raw `indicators` inputs in the JSON. Claude supplies 15 data points; the dashboard runs the weighted formulas. If an input is missing, the dashboard falls back to estimates from existing heat scores (labeled "est." in the UI).

### OGPI — Oil Geopolitical Pressure Index
How much of today's oil price is geopolitical premium vs. fundamental supply.

```
OGPI = (BrentWTI_spread × 0.30) + (Hormuz_closure × 0.35) + (Tanker_premium × 0.20) + (Backwardation × 0.15)
```
≥75 Active (long energy) · 60–74 Watch · <60 Off

### AICS — AI Capex Conviction Score
Whether AI capex is generating real returns. The revenue-to-capex ratio is the key: above 1.0 = returns beating spend.

```
AICS = (Cloud_growth × 0.35) + (Semi_demand × 0.25) + (Earnings_revisions × 0.20) + (Rev÷Capex × 0.20)
```
≥70 Active (long cloud) · 55–69 Watch · <40 Fire (short AI infra)

### SPI — Stagflation Pressure Index
The macro regime indicator. Above 65, long equity AND long bond strategies both fail simultaneously.

```
SPI = (Energy_inflation × 0.35) + (Growth_decel × 0.25) + (Real_wage_compression × 0.25) + (Credit_tightening × 0.15)
```
≥65 Stagflation · 50–64 Transitional · 35–49 Growth · <35 Deflation

### MBDS — Market Breadth Divergence Signal
Flags when index price action and breadth diverge — the earliest warning for index tops.

```
MBDS = (Adv/Dec × 0.30) + (New_Hi/Lo × 0.25) + (Cap_vs_EW_gap × 0.25) + (Pct_above_50d × 0.20)
```
>55 Fire (active divergence, hedge) · 42–55 Watch · <42 Off

---

## Capital Flows section

Each daily JSON includes flows by asset class:

```json
{
  "asset":        "Energy ETFs (XLE, USO)",
  "direction":    "Inflow",
  "size":         "+$2.8B",
  "note":         "Extended blockade signal driving institutional energy positioning.",
  "significance": "High"
}
```

Plus a `flowsRead` field — a synthesized paragraph connecting the day's flows to the indicator suite (e.g. confirming the SPI stagflation read or the OGPI signal).

The copy button includes flows in the clipboard output.

---

## JSON: fixed vs. dynamic

**Fixed** (dashboard breaks without these):
- `snapshotDate`, `marketPulse`, `topDriver`, `narrativeSummary`
- `macroStressIndex`, `macroStressLabel`, `macroStressSubtext`, `macroStressIndexPrior`
- `rateCurve` — exactly 8 tenors in this order: 1M, 3M, 6M, 1Y, 2Y, 5Y, 10Y, 30Y
- `scenarios` — exactly Bear/Base/Bull, probabilities summing to 100

**Dynamic** (follow the day, any length ≥ 1):
`topThemes`, `crossMarket`, `flows`, `sectorHeat`, `drivers`, `risks`, `timeline`, `watchpoints`, `strategies`, `sources`

**Optional but recommended**:
`indicators` — 15 raw data points that power the 4 composite indicator scores.

---

## Tech

- HTML + CSS + JS — single file, no framework
- Chart.js 4.4 — yield curve chart (CDN)
- Google Fonts — Syne + DM Mono + Inter
- JSON — separate file, fetched at runtime

---

## Day-type guide

**Quiet session** — 2–3 themes, 8 crossMarket rows, 5–6 flows. Short and honest.

**Shock day** (oil spike, geopolitical) — Energy flows prominent, OGPI auto-elevates, 12–15 crossMarket rows, heavy flow commentary.

**FOMC day** — Short-duration inflows, long-duration outflows in flows section. Rate path watchpoints. Powell language in drivers.

**Earnings-driven** — Replace generic `sectorHeat` sector names with specific ones (e.g. "Mega-cap AI"). Add individual stocks to `crossMarket`. AICS reflects the earnings read.

**Stagflation confirmed** (SPI > 65) — Energy and TIPS inflows, TLT outflows. `flowsRead` should confirm the regime directly.

---

## License

Partly by Muxing. Partly by MIT
