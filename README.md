# Markets Dashboard

A personal stock market dashboard built with Next.js and deployed as a static site on GitHub Pages. Charts are rendered with TradingView's lightweight-charts library, and price data is fetched from the Tiingo API via a scheduled GitHub Actions workflow.

## What's built

### Landing page
A home page listing all available dashboards, with a persistent top navigation bar.

### Markets Overview dashboard (`/dashboards/markets`)
A 2-column responsive grid showing 6 instruments:

| Instrument | Ticker | Source |
|---|---|---|
| Nasdaq | QQQ | Tiingo (stock) |
| S&P 500 | SPY | Tiingo (stock) |
| Dow Jones | DIA | Tiingo (stock) |
| MSCI World | URTH | Tiingo (stock) |
| Gold | GLD | Tiingo (stock) |
| AUD/USD | audusd | Tiingo (forex) |

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
    └─ npm run build  (NEXT_PUBLIC_BASE_PATH=/markets-dashboard)
            Static export → _site/
            Deployed to GitHub Pages
```

The browser **never calls Tiingo**. It fetches the pre-built CSV files as static assets, parses them with `src/lib/csvParser.ts`, and renders the charts entirely client-side.

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
# Open http://localhost:3000
```

### Build static export
```bash
NEXT_PUBLIC_BASE_PATH= npm run build
# Output in out/
```

---

## GitHub Pages deployment

1. Fork or clone this repo.
2. Go to **Settings → Pages** → set Source to **GitHub Actions**.
3. Go to **Settings → Secrets → Actions** → add `TIINGO_API_KEY` with your Tiingo API token.
4. Push to `main` — the workflow runs automatically and deploys the site to `https://<username>.github.io/markets-dashboard/`.

The workflow also runs on a weekday schedule (Mon–Fri 22:00 UTC) to keep data current. You can trigger it manually via **Actions → deploy → Run workflow**.

---

## Project structure

```
src/
  app/                     Next.js App Router pages
    page.tsx               Landing page
    dashboards/markets/    Markets Overview dashboard
    layout.tsx             Root layout + NavBar
  components/
    charts/
      CandlestickChart.tsx lightweight-charts wrapper (SSR-disabled)
      ChartCard.tsx        Data-fetching card; aggregates bars by period
    dashboard/
      MarketsGrid.tsx      Period toggle + responsive chart grid
    NavBar.tsx
  hooks/
    useChartData.ts        SWR hook — fetches /data/{ticker}.csv
  lib/
    aggregate.ts           Weekly/monthly OHLC aggregation
    chartConfig.ts         Instrument definitions (single source of truth)
    csvParser.ts           Parses CSV text → OHLCVBar[]
    ema.ts                 Exponential moving average calculation
  types/
    market.ts              Shared TypeScript types
scripts/
  fetch-data.mjs           Node.js data fetcher (Tiingo → CSV)
public/
  data/                    Static CSV files served to the browser
.github/
  workflows/
    deploy.yml             Fetch data → build → deploy to GitHub Pages
```

## Adding a new instrument

1. Add an entry to `INSTRUMENTS` in `src/lib/chartConfig.ts`.
2. The ticker name must match what Tiingo uses (stock: uppercase like `MSFT`, forex: lowercase like `eurusd`).
3. On the next workflow run, `scripts/fetch-data.mjs` will create `public/data/{TICKER}.csv` automatically.

## Adding a new dashboard

1. Create a new page under `src/app/dashboards/<name>/page.tsx`.
2. Add a card for it in the `DASHBOARDS` array in `src/app/page.tsx`.
3. Add a nav link in `src/components/NavBar.tsx`.
