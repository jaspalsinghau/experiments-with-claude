'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/dashboards/markets', label: 'Markets Overview' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link href="/" className="font-bold text-gray-900 text-base hover:text-blue-600 transition-colors">
          Experiments with Claude
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  position: 'relative',
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--ink)' : 'var(--grey-600)',
                  textDecoration: 'none',
                  borderRadius: 8,
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '0.75rem',
                    right: '0.75rem',
                    height: 2,
                    background: 'var(--accent)',
                    borderRadius: 999,
                  }} />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
