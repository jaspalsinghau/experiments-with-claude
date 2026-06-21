import type { Metadata } from 'next';
import MarketsGrid from '@/components/dashboard/MarketsGrid';

export const metadata: Metadata = {
  title: 'Markets Overview | Experiments with Claude',
};

export default function MarketsPage() {
  return (
    <div>
      <div className="px-4 pt-6 pb-2 max-w-screen-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">Markets Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Daily candlestick charts · EMA 50 <span className="text-blue-500">━</span> · EMA 200 <span className="text-amber-500">━</span>
        </p>
      </div>
      <div className="max-w-screen-2xl mx-auto">
        <MarketsGrid />
      </div>
    </div>
  );
}
