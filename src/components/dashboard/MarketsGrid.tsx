'use client';

import { useState } from 'react';
import { INSTRUMENTS } from '@/lib/chartConfig';
import ChartCard from '@/components/charts/ChartCard';
import type { Period } from '@/types/market';

const PERIODS: Period[] = ['1D', '1W', '1M'];

export default function MarketsGrid() {
  const [period, setPeriod] = useState<Period>('1D');

  return (
    <div>
      <div className="flex items-center gap-1 px-4 py-2">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              period === p
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {INSTRUMENTS.map((instrument) => (
          <ChartCard key={instrument.key} instrument={instrument} period={period} />
        ))}
      </div>
    </div>
  );
}
