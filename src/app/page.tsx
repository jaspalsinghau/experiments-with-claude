import Link from 'next/link';

const dashboards = [
  {
    href: '/dashboards/markets',
    title: 'Markets Overview',
    description: 'Daily candlestick charts for global equity indices, gold, and AUD/USD with EMA 50/200 overlays.',
    icon: '📈',
  },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Experiments with Claude</h1>
        <p className="mt-2 text-gray-500">Personal experiments and dashboards built with Claude Code.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {dashboards.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group flex flex-col gap-2 rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div className="text-2xl">{d.icon}</div>
            <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {d.title}
            </h2>
            <p className="text-sm text-gray-500">{d.description}</p>
          </Link>
        ))}

        <div className="flex flex-col gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-gray-400">
          <div className="text-2xl">＋</div>
          <h2 className="font-semibold">More dashboards coming soon</h2>
          <p className="text-sm">New dashboards will appear here as they are built.</p>
        </div>
      </div>
    </div>
  );
}
