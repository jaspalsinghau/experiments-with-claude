# Experiments with Claude

A collection of personal projects built with [Claude Code](https://claude.ai/code), deployed as a static site on GitHub Pages.

## Experiments

| Experiment | Description | Details |
|---|---|---|
| Markets Overview | Candlestick charts for global equity indices, gold, and AUD/USD with EMA overlays and a daily/weekly/monthly toggle | [docs/markets-overview.md](docs/markets-overview.md) |

---

## Tech stack

- [Next.js 16](https://nextjs.org) — static export (`output: 'export'`)
- TypeScript · [Tailwind CSS v4](https://tailwindcss.com)
- [lightweight-charts v5](https://tradingview.github.io/lightweight-charts/) for charting
- [SWR](https://swr.vercel.app) for client-side data fetching
- Deployed to [GitHub Pages](https://pages.github.com) via GitHub Actions

## Local development

```bash
npm install
npm run dev   # http://localhost:3000
```

See each experiment's detail page for experiment-specific setup (API keys, data fetching scripts, etc.).

---

## Adding a new experiment

1. Create a page under `src/app/dashboards/<name>/page.tsx`
2. Add a card to the `dashboards` array in `src/app/page.tsx`
3. Add a nav link in `src/components/NavBar.tsx`
4. Add a row to the Experiments table above
5. Create `docs/<name>.md` with experiment-specific documentation
