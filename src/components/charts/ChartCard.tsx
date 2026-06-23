'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import type { Instrument, Period } from '@/types/market';
import { useChartData } from '@/hooks/useChartData';
import { calculateEMA } from '@/lib/ema';
import { aggregateWeekly, aggregateMonthly } from '@/lib/aggregate';

const CandlestickChart = dynamic(() => import('./CandlestickChart'), { ssr: false });

interface Props {
  instrument: Instrument;
  period: Period;
}

export default function ChartCard({ instrument, period }: Props) {
  const { data, error, isLoading } = useChartData(instrument);

  const { slicedData, slicedEma50, slicedEma200, borderColor, changeText, changeColor } = useMemo(() => {
    if (!data || data.length < 2) {
      return {
        slicedData: [],
        slicedEma50: [],
        slicedEma200: [],
        borderColor: 'border-gray-200',
        changeText: '',
        changeColor: '',
      };
    }

    const bars = period === '1W' ? aggregateWeekly(data) : period === '1M' ? aggregateMonthly(data) : data;

    const closes = bars.map((b) => b.close);
    const ema50 = calculateEMA(closes, 50);
    const ema200 = calculateEMA(closes, 200);

    const last = bars[bars.length - 1];
    const prev = bars[bars.length - 2];
    const change = last.close - prev.close;
    const changePct = (change / prev.close) * 100;
    const borderColor = change >= 0 ? 'border-green-500' : 'border-red-500';
    const changeColor = change >= 0 ? 'text-green-600' : 'text-red-600';
    const sign = change >= 0 ? '+' : '';
    const changeText = `${sign}${changePct.toFixed(2)}%`;

    return {
      slicedData: bars,
      slicedEma50: ema50,
      slicedEma200: ema200,
      borderColor,
      changeText,
      changeColor,
    };
  }, [data, period]);

  return (
    <div className={`bg-white rounded-xl border-2 ${borderColor} shadow-sm flex flex-col overflow-hidden`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <span className="font-semibold text-gray-800 text-sm">{instrument.label}</span>
        {changeText && (
          <span className={`text-xs font-medium ${changeColor}`}>{changeText}</span>
        )}
      </div>

      <div className="h-96">
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-xs text-gray-400">Loading...</div>
          </div>
        )}
        {error && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-xs text-red-400">Failed to load data</div>
          </div>
        )}
        {slicedData.length > 0 && (
          <CandlestickChart data={slicedData} ema50={slicedEma50} ema200={slicedEma200} />
        )}
      </div>

      <div className="px-3 py-1.5 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-0.5 bg-blue-500" />
          EMA 50
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-0.5 bg-amber-500" />
          EMA 200
        </span>
      </div>
    </div>
  );
}
