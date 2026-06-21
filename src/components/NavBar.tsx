import Link from 'next/link';

const navLinks = [
  { href: '/dashboards/markets', label: 'Markets Overview' },
];

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link href="/" className="font-bold text-gray-900 text-base hover:text-blue-600 transition-colors">
          Experiments with Claude
        </Link>
        <div className="flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
