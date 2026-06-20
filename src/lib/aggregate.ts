import type { OHLCVBar } from '@/types/market';

function getMondayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  const day = d.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const offset = (day + 6) % 7; // days since Monday
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}

function getMonthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // YYYY-MM
}

function groupAndReduce(
  bars: OHLCVBar[],
  keyFn: (dateStr: string) => string,
  timeFn: (group: OHLCVBar[]) => string,
): OHLCVBar[] {
  const groups = new Map<string, OHLCVBar[]>();
  for (const bar of bars) {
    const key = keyFn(bar.time);
    const group = groups.get(key);
    if (group) {
      group.push(bar);
    } else {
      groups.set(key, [bar]);
    }
  }

  const result: OHLCVBar[] = [];
  for (const group of groups.values()) {
    const vol = group.reduce((s, b) => s + (b.volume ?? 0), 0);
    result.push({
      time: timeFn(group),
      open: group[0].open,
      high: Math.max(...group.map((b) => b.high)),
      low: Math.min(...group.map((b) => b.low)),
      close: group[group.length - 1].close,
      volume: group.every((b) => b.volume === undefined) ? undefined : vol,
    });
  }

  return result.sort((a, b) => (a.time < b.time ? -1 : 1));
}

export function aggregateWeekly(bars: OHLCVBar[]): OHLCVBar[] {
  return groupAndReduce(
    bars,
    (d) => getMondayDate(d),
    (group) => getMondayDate(group[0].time),
  );
}

export function aggregateMonthly(bars: OHLCVBar[]): OHLCVBar[] {
  return groupAndReduce(
    bars,
    (d) => getMonthKey(d),
    (group) => group[0].time,
  );
}
