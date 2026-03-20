# 📊 AI Market Intelligence Dashboard (3-File Version)

A lightweight, self-updating market dashboard powered by AI-generated data.

This project is intentionally minimal by design — it separates **data generation** from **visualization**, allowing you to refresh market insights daily without touching the UI.

---

## 🧠 What This Is

This dashboard provides a structured snapshot of market conditions, including:

- Macro themes
- Cross-market movements (equities, rates, oil, dollar)
- Rate curve changes
- Key market drivers
- Risk radar
- Narrative timeline
- Strategy signals

It is **not a trading system** — it is a **market intelligence layer** designed to summarize the day’s dominant narrative.

---

## 🧩 Architecture (Simple by Design)

This project uses only **3 files**:

```
index.html        → Dashboard UI (presentation only)
market_data.json  → Daily data snapshot (AI-generated)
fetch_data.js     → Script to regenerate the JSON
```

### Data Flow

```
AI → market_data.json → index.html
```

- The **UI never changes**
- The **JSON updates daily**
- The **AI generates structured data only (not UI)**

This keeps everything clean, testable, and easy to maintain.

---

## 🚀 How to Run Locally

### 1. Start a local server

```bash
python -m http.server 8000
```

Then open:

http://localhost:8000

> ⚠️ Do NOT open `index.html` directly — it needs a server to fetch JSON.

---

## 🔄 How to Update the Dashboard (Daily)

### Step 1 — Set your OpenAI API key

```bash
export OPENAI_API_KEY=your_key_here
```

---

### Step 2 — Provide market context

```bash
export MARKET_CONTEXT="Dow down 0.24%, Nasdaq down 1.17%, Brent near 108, yields elevated, geopolitical tensions rising"
```

---

### Step 3 — Run the generator

```bash
node fetch_data.js
```

---

### Step 4 — Refresh the browser

That’s it — your dashboard is updated.

---

## 🧠 How the AI Works

The script:
- Sends your **market context** to the model
- Asks for **strict JSON output**
- Rewrites `market_data.json`

The UI then reads and renders that JSON.

---

## 🎯 Design Philosophy

This project is intentionally:

### 1. **Simple**
- No frameworks required
- No backend required
- No database required

### 2. **Decoupled**
- UI and data are completely separate
- You can swap data sources without touching the UI

### 3. **Extensible**
- Easy to automate (GitHub Actions, cron jobs)
- Easy to upgrade UI later (React, Tailwind, etc.)

---

## ⚠️ Important Notes

- This dashboard is **not real-time**
- It reflects a **daily snapshot**
- AI output should be **reviewed before critical use**
- API keys must **never be exposed in the browser**

---

## 🔮 Future Enhancements (Optional)

- Automate daily refresh via GitHub Actions
- Add schema validation for AI output
- Upgrade UI styling (Tailwind / React)
- Add historical snapshots
- Connect to real market data feeds

---

## 💡 Summary

This project gives you:

✔ A clean, professional dashboard  
✔ A simple daily update workflow  
✔ A scalable foundation for future expansion  

All with just **3 files**.

---

Enjoy building 🚀
