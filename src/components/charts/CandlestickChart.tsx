'use client';

import { useEffect, useRef } from 'react';
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  CrosshairMode,
  type IChartApi,
} from 'lightweight-charts';
import type { OHLCVBar } from '@/types/market';

interface Props {
  data: OHLCVBar[];
  ema50: (number | null)[];
  ema200: (number | null)[];
}

export default function CandlestickChart({ data, ema50, ema200 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#374151',
      },
      grid: {
        vertLines: { color: '#f3f4f6' },
        horzLines: { color: '#f3f4f6' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#e5e7eb',
      },
      timeScale: {
        borderColor: '#e5e7eb',
        timeVisible: true,
      },
    });
    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    const ema50Series = chart.addSeries(LineSeries, {
      color: '#3b82f6',
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const ema200Series = chart.addSeries(LineSeries, {
      color: '#f59e0b',
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    candleSeries.setData(
      data.map((b) => ({
        time: b.time as `${number}-${number}-${number}`,
        open: b.open,
        high: b.high,
        low: b.low,
        close: b.close,
      }))
    );

    ema50Series.setData(
      data
        .map((b, i) => (ema50[i] !== null ? { time: b.time as `${number}-${number}-${number}`, value: ema50[i]! } : null))
        .filter((x): x is { time: `${number}-${number}-${number}`; value: number } => x !== null)
    );

    ema200Series.setData(
      data
        .map((b, i) => (ema200[i] !== null ? { time: b.time as `${number}-${number}-${number}`, value: ema200[i]! } : null))
        .filter((x): x is { time: `${number}-${number}-${number}`; value: number } => x !== null)
    );

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [data, ema50, ema200]);

  return <div ref={containerRef} className="w-full h-full" />;
}
