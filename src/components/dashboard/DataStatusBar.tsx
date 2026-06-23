'use client';

import { INSTRUMENTS } from '@/lib/chartConfig';
import { useChartData } from '@/hooks/useChartData';
import { getDataStaleness, businessDaysSince } from '@/lib/dataStatus';

function StatusIndicator({ lastDate }: { lastDate: string }) {
  const staleness = getDataStaleness(lastDate);
  const daysBehind = businessDaysSince(lastDate);

  const statusConfig = {
    fresh: { dot: 'bg-green-500', label: 'Current', text: 'text-green-700' },
    warn: { dot: 'bg-amber-500', label: `${daysBehind}d behind`, text: 'text-amber-700' },
    stale: { dot: 'bg-red-500', label: `${daysBehind}d behind`, text: 'text-red-700' },
  };

  const config = statusConfig[staleness];

  return (
    <div className="flex items-center justify-center gap-2">
      <span className={`inline-block w-2 h-2 rounded-full ${config.dot}`} />
      <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
    </div>
  );
}

export default function DataStatusBar() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Data Status</h3>
        <a
          href="https://github.com/jaspalsinghau/experiments-with-claude/actions/workflows/deploy.yml"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          View runs
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {INSTRUMENTS.map((instrument) => (
          <InstrumentStatus key={instrument.key} instrument={instrument} />
        ))}
      </div>
    </div>
  );
}

function InstrumentStatus({ instrument }: { instrument: typeof INSTRUMENTS[0] }) {
  const { data, isLoading, error } = useChartData(instrument);

  if (isLoading) {
    return (
      <div className="text-center">
        <p className="text-xs font-medium text-gray-700 mb-1">{instrument.label}</p>
        <p className="text-xs text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="text-center">
        <p className="text-xs font-medium text-gray-700 mb-1">{instrument.label}</p>
        <p className="text-xs text-red-500">Error</p>
      </div>
    );
  }

  const lastDate = data[data.length - 1].time;

  return (
    <div className="text-center">
      <p className="text-xs font-medium text-gray-700 mb-1.5">{instrument.label}</p>
      <p className="text-xs text-gray-600 mb-1">{lastDate}</p>
      <StatusIndicator lastDate={lastDate} />
    </div>
  );
}
