import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Experiments with Claude',
  description: 'Personal experiments and dashboards built with Claude Code.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gray-50 antialiased">
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
