# Macro Signal Console

A daily macro intelligence dashboard that reads the market so you don't have to stare at 12 tabs.

One prompt after close → scans prices, yields, and news → drops a JSON file → full narrative read loads automatically. Yesterday it caught an oil shock and a semiconductor leadership split. Today it caught Intel's best day since 1987 running alongside an all-time record low in consumer sentiment. Same dashboard, completely different story. That's the point.

![Dashboard preview](preview.png)

---

## What it does

Renders a full end-of-day macro snapshot from a single JSON file:

- **Narrative summary** — 4–6 sentence read on what actually happened and why it matters
- **Macro Stress Index** — weighted composite score across key markets, with a ring gauge
- **Top themes** — the dominant forces of the session, color-coded by type (shock, leadership, rotation, etc.)
- **Rate curve chart** — full 8-tenor yield curve, current vs. prior, rendered with Chart.js
- **Cross-asset table** — every market that moved, with risk badge, heat score, and driver narrative
- **Sector heat map** — dynamic sectors based on what actually mattered today, not a fixed list
- **Driver stack** — ranked macro forces with confidence scores and signal probability
- **Scenario matrix** — Bear / Base / Bull with trigger conditions and explicit probabilities
- **Narrative timeline** — how the session unfolded, pre-market through close
- **Forward watchpoints** — dated, specific events to watch in the next 1–5 days
- **Strategy ideas** — illustrative signal setups derived from the current dashboard state
- **Source references** — every source used, linked

---

## How to run it

Both files must live in the same folder. Start a local server from that folder:

```bash
# Python (built in — easiest)
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser.

That's it. No build step, no dependencies, no backend. Pure HTML + Chart.js.

---

## File structure

```
├── index.html          # The dashboard — never needs editing
├── market_data.json    # Today's snapshot — replace this each day
├── README.md
└── daily_refresh_prompt_v3.md   # The prompt you run each evening
```

---

## Updating it daily

1. Open `daily_refresh_prompt_v3.md`
2. Copy the prompt block, replace `[TODAY]` with today's date
3. Paste into a new Claude conversation
4. Claude researches markets and outputs a raw JSON object
5. Save it as `market_data.json` in this folder
6. Refresh `http://localhost:8000`

Optional — validate before loading:

```bash
python3 -c "
import json, sys
with open('market_data.json') as f:
    d = json.load(f)
required = ['snapshotDate','narrativeSummary','macroStressIndex','rateCurve','scenarios','sectorHeat']
missing = [k for k in required if k not in d]
if missing: print('MISSING:', missing); sys.exit(1)
assert len(d['rateCurve']) == 8
assert len(d['scenarios']) == 3
assert sum(s['probability'] for s in d['scenarios']) == 100
print(f'✓ {d[\"snapshotDate\"]} | MSI {d[\"macroStressIndex\"]} ({d[\"macroStressLabel\"]})')
"
```

---

## What makes it dynamic

Most dashboards have a fixed structure — same markets, same sectors, same number of rows every day. This one doesn't. The prompt instructs Claude to populate sections based on what actually happened:

- A quiet session might have 2 themes and 8 cross-market rows
- A multi-shock session expands to 6 themes, 14+ rows, a detailed timeline
- Sectors are chosen by relevance — on an earnings week "Mega-cap AI" and "Software / Cloud" appear instead of generic sector names
- New markets get added to the cross-market table when they're relevant (a specific currency, credit spread, or single stock that moved the tape)

The only fixed elements are the ones the dashboard's rendering logic structurally requires:

| Fixed | Why |
|---|---|
| `rateCurve` — 8 tenors in order | Chart.js needs consistent tenor sequence |
| `scenarios` — Bear / Base / Bull | CSS color classes are keyed to these labels |
| Top-level header strings | Accessed directly by name in the JS |

Everything else — markets, sectors, array lengths — follows the day.

---

## Tech

- **HTML / CSS / JS** — single file, no framework
- **Chart.js 4.4** — yield curve chart, loaded from CDN
- **Google Fonts** — Syne (display), DM Mono (data), Inter (body)
- **JSON** — all data, separate file, fetched at runtime via `fetch()`

No npm. No webpack. No React. Open `index.html` with a local server and it works.

---

## Customizing the JSON

The dashboard renders whatever the JSON contains — no hardcoded market names or sector lists. To add a new market to the cross-market table, just add an object to the `crossMarket` array. To change the sectors shown, change the `sectorHeat` array. The dashboard adapts.

The schema with all field descriptions and allowed values is documented in `daily_refresh_prompt_v3.md`.

---

## License

Partly by Muxing. Partly by MIT.
