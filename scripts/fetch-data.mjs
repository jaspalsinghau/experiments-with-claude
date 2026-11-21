#!/usr/bin/env node
/**
 * Fetches OHLCV data from Tiingo and writes/updates CSV files in public/data/.
 *
 * Usage:
 *   node scripts/fetch-data.mjs          # incremental update (new days only)
 *   node scripts/fetch-data.mjs --full   # full 2-year backfill
 *
 * Requires: TIINGO_API_KEY environment variable
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../public/data');
const FULL = process.argv.includes('--full');

const TOKEN = process.env.TIINGO_API_KEY;
if (!TOKEN) {
  console.error('ERROR: TIINGO_API_KEY environment variable is not set.');
  process.exit(1);
}

// Mirrors src/lib/chartConfig.ts — update both if adding instruments
const INSTRUMENTS = [
  { ticker: 'QQQ',    type: 'stock' },
  { ticker: 'SPY',    type: 'stock' },
  { ticker: 'DIA',    type: 'stock' },
  { ticker: 'URTH',   type: 'stock' },
  { ticker: 'GLD',    type: 'stock' },
  { ticker: 'audusd', type: 'forex' },
];

// Longest normal gap between the newest bar and today: Fri close → Tue run over a long weekend.
const MAX_STALE_DAYS = 5;
const failures = [];

mkdirSync(DATA_DIR, { recursive: true });

function toYMD(isoString) {
  return isoString.slice(0, 10);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function yearsAgo(n) {
  const d = new Date();
  d.setFullYear(d.getFullYear() - n);
  return d.toISOString().slice(0, 10);
}

function daysBetween(fromYmd, toYmd) {
  return Math.round((Date.parse(toYmd + 'T00:00:00Z') - Date.parse(fromYmd + 'T00:00:00Z')) / 86400000);
}

function addDays(ymd, n) {
  const d = new Date(ymd + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// Throws with the HTTP status and Tiingo's error body (never the URL, which contains the token).
async function httpError(label, res) {
  let detail = '';
  try {
    detail = (await res.text()).replace(/\s+/g, ' ').slice(0, 200);
  } catch {
    // body unreadable; status alone will do
  }
  return new Error(`${label} returned ${res.status}${detail ? ` — ${detail}` : ''}`);
}

async function fetchStock(ticker, startDate) {
  const url = `https://api.tiingo.com/tiingo/daily/${ticker}/prices?startDate=${startDate}&token=${TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw await httpError(`Tiingo stock ${ticker}`, res);
  const rows = await res.json();
  return rows.map((r) => ({
    date: toYMD(r.date),
    open: r.open,
    high: r.high,
    low: r.low,
    close: r.close,
    volume: r.volume ?? '',
  }));
}

async function fetchForex(pair, startDate) {
  const url = `https://api.tiingo.com/tiingo/fx/${pair}/prices?startDate=${startDate}&resampleFreq=1day&token=${TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw await httpError(`Tiingo forex ${pair}`, res);
  const rows = await res.json();
  return rows.map((r) => ({
    date: toYMD(r.date),
    open: r.open,
    high: r.high,
    low: r.low,
    close: r.close,
    volume: '',
  }));
}

function readLastDate(csvPath) {
  const text = readFileSync(csvPath, 'utf8').trim();
  const lines = text.split('\n');
  if (lines.length < 2) return null; // only header
  return lines[lines.length - 1].split(',')[0].trim();
}

function rowsToCsv(rows) {
  return rows.map((r) => `${r.date},${r.open},${r.high},${r.low},${r.close},${r.volume}`).join('\n');
}

const HEADER = 'date,open,high,low,close,volume';

for (const inst of INSTRUMENTS) {
  const csvPath = join(DATA_DIR, `${inst.ticker}.csv`);
  const fileExists = existsSync(csvPath);

  let startDate;
  let appendMode = false;
  let lastDate = null;

  if (FULL || !fileExists) {
    startDate = yearsAgo(2);
    console.log(`${inst.ticker}: full fetch from ${startDate}`);
  } else {
    lastDate = readLastDate(csvPath);
    if (!lastDate) {
      startDate = yearsAgo(2);
      console.log(`${inst.ticker}: CSV empty, full fetch from ${startDate}`);
    } else if (lastDate >= today()) {
      console.log(`${inst.ticker}: already up to date (last: ${lastDate}), skipping`);
      continue;
    } else {
      startDate = addDays(lastDate, 1);
      appendMode = true;
      console.log(`${inst.ticker}: incremental fetch from ${startDate} (last: ${lastDate})`);
    }
  }

  let rows;
  try {
    rows = inst.type === 'forex'
      ? await fetchForex(inst.ticker, startDate)
      : await fetchStock(inst.ticker, startDate);
  } catch (err) {
    console.error(`${inst.ticker}: fetch failed — ${err.message}`);
    failures.push(`${inst.ticker}: ${err.message}`);
    continue;
  }

  // Filter out any rows not strictly newer than lastDate (safety dedup)
  if (appendMode && lastDate) {
    rows = rows.filter((r) => r.date > lastDate);
  }

  if (rows.length === 0) {
    console.log(`${inst.ticker}: no new rows returned (market may be closed)`);
    continue;
  }

  if (appendMode && fileExists) {
    const existing = readFileSync(csvPath, 'utf8').trimEnd();
    writeFileSync(csvPath, existing + '\n' + rowsToCsv(rows) + '\n', 'utf8');
  } else {
    writeFileSync(csvPath, HEADER + '\n' + rowsToCsv(rows) + '\n', 'utf8');
  }

  console.log(`${inst.ticker}: wrote ${rows.length} rows (${rows[0].date} → ${rows[rows.length - 1].date})`);
}

// Staleness guard: an API that returns 200 with no rows (plan/entitlement problems, delisted
// ticker) would otherwise look identical to "market closed". Allow for a long weekend.
for (const inst of INSTRUMENTS) {
  const csvPath = join(DATA_DIR, `${inst.ticker}.csv`);
  const last = existsSync(csvPath) ? readLastDate(csvPath) : null;
  if (!last) {
    failures.push(`${inst.ticker}: no data in CSV`);
    continue;
  }
  const age = daysBetween(last, today());
  if (age > MAX_STALE_DAYS) {
    failures.push(`${inst.ticker}: data is stale — last bar ${last} (${age} days old, limit ${MAX_STALE_DAYS})`);
  }
}

if (failures.length > 0) {
  // Fail the process so the GitHub Actions run goes red (and emails) instead of deploying stale data.
  for (const f of failures) {
    console.error(process.env.GITHUB_ACTIONS ? `::error title=Market data update failed::${f}` : `ERROR: ${f}`);
  }
  process.exit(1);
}

console.log('Done.');
