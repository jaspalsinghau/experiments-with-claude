[← Back to Experiments](../README.md)

# Markets Overview

A dashboard of daily candlestick charts for global equity indices, commodities, and FX, built with Next.js and served as a static site on GitHub Pages. Price data is fetched from the Tiingo API via a scheduled GitHub Actions workflow and stored as CSV files — the browser never calls Tiingo directly.

**Live:** `https://experiments.jaspalsingh.consulting/dashboards/markets`

---

## What's built

### Instruments

| Instrument | Ticker | Source |
|---|---|---|
| Nasdaq | QQQ | Tiingo (stock) |
| S&P 500 | SPY | Tiingo (stock) |
| Dow Jones | DIA | Tiingo (stock) |
| MSCI World | URTH | Tiingo (stock) |
| Gold | GLD | Tiingo (stock) |
| AUD/USD | audusd | Tiingo (forex) |

### Chart features

Each chart shows:
- **Candlestick bars** (green = up, red = down)
- **EMA 50** overlay (blue line)
- **EMA 200** overlay (amber line)
- **Change badge** — percentage change of the most recent bar vs the previous bar
- **Coloured border** — green if last bar closed up, red if down

### Bar granularity toggle

Three buttons above the grid resample the full 2-year dataset:

- **1D** — daily bars (~504 candles)
- **1W** — weekly OHLC bars (~104 candles), aggregated client-side from daily data
- **1M** — monthly OHLC bars (~24 candles), aggregated client-side from daily data

EMA lines are calculated on whichever bar resolution is active. At weekly resolution, EMA 50 appears near the right edge (50 weeks of warmup needed); EMA 200 will not appear because only ~104 weeks of data are available. At monthly resolution, neither EMA is visible. This is expected.

---

## How the data pipeline works

```
GitHub Actions (scheduled Mon–Fri, 22:00 UTC)
    │
    ├─ scripts/fetch-data.mjs
    │       Reads TIINGO_API_KEY secret
    │       For each ticker: checks last date in CSV → fetches only newer bars (incremental)
    │       --full flag: fetches 2 years of history from scratch
    │
    ├─ Commits updated CSVs to main  (public/data/{TICKER}.csv)
    │
    └─ npm run build
            Static export → out/
            Deployed to GitHub Pages (custom domain, served at root)
```

The browser fetches the pre-built CSV files as static assets, parses them with `src/lib/csvParser.ts`, and renders the charts entirely client-side.

CSV format (`public/data/QQQ.csv`):
```
date,open,high,low,close,volume
2024-01-02,374.11,374.85,368.43,370.52,45123456
...
```

---

## Running locally

### Prerequisites
- Node.js 20+
- A [Tiingo API key](https://www.tiingo.com)

### Setup
```bash
npm install
cp .env.example .env.local
# Edit .env.local and set TIINGO_API_KEY=your_key_here
```

### Fetch data
```bash
# Initial full 2-year backfill (run once)
npm run fetch-data:full

# Subsequent incremental updates
npm run fetch-data
```

### Start dev server
```bash
npm run dev
# Open http://localhost:3000/dashboards/markets
```

### Build static export
```bash
NEXT_PUBLIC_BASE_PATH= npm run build
# Output in out/
```

---

## GitHub Pages deployment

1. Go to **Settings → Pages** → set Source to **GitHub Actions**.
2. Go to **Settings → Secrets → Actions** → add `TIINGO_API_KEY` with your Tiingo API token.
3. Push to `main` — the workflow fetches fresh data, commits CSVs, builds, and deploys automatically.

The workflow also runs on a weekday schedule (Mon–Fri 22:00 UTC). Trigger manually via **Actions → deploy → Run workflow**.

---

## Project structure

```
src/
  app/dashboards/markets/     Markets Overview page
  components/
    charts/
      CandlestickChart.tsx    lightweight-charts v5 wrapper (SSR-disabled)
      ChartCard.tsx           Data-fetching card; aggregates bars by period
    dashboard/
      MarketsGrid.tsx         Period toggle + responsive 2-column chart grid
  hooks/
    useChartData.ts           SWR hook — fetches /data/{ticker}.csv
  lib/
    aggregate.ts              Weekly/monthly OHLC aggregation
    chartConfig.ts            Instrument definitions (single source of truth)
    csvParser.ts              Parses CSV text → OHLCVBar[]
    ema.ts                    Exponential moving average calculation
  types/
    market.ts                 Shared TypeScript types
scripts/
  fetch-data.mjs              Node.js data fetcher (Tiingo → CSV)
public/
  data/                       Static CSV files served to the browser
.github/
  workflows/
    deploy.yml                Fetch data → build → deploy to GitHub Pages
```

---

## Adding a new instrument

1. Add an entry to `INSTRUMENTS` in `src/lib/chartConfig.ts`.
2. The ticker must match Tiingo's naming (stocks: uppercase e.g. `MSFT`, forex: lowercase e.g. `eurusd`).
3. On the next workflow run, `scripts/fetch-data.mjs` will create `public/data/{TICKER}.csv` automatically.
