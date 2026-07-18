import type { Metadata } from 'next';
import Link from 'next/link';
import ParticleFieldSection from '@/components/particles/ParticleFieldSection';

export const metadata: Metadata = {
  title: 'Particle Field | Experiments with Claude',
  description: '12,000 drifting particles in cool aquatic tones that glow red and rush toward your cursor like a magnet.',
};

export default function ParticleFieldPage() {
  return (
    <div>
      <div className="px-4 pt-6 pb-2 max-w-screen-2xl mx-auto">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← Back to experiments
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Particle Field</h1>
        <p className="mt-1 text-sm text-gray-500">
          12,000 particles drifting in cool aquatic tones, pulled toward your cursor and glowing red the closer they get — like a magnet through iron filings.
        </p>
      </div>

      <div
        className="mt-4"
        style={{ background: '#ffffff', borderTop: '1px solid var(--grey-100)', height: '70vh', minHeight: 420 }}
      >
        <ParticleFieldSection />
      </div>

      <div style={{ background: 'var(--grey-50)', padding: '3rem 1.5rem' }}>
        <div className="max-w-screen-2xl mx-auto">
          <p style={{ fontSize: '0.9375rem', color: 'var(--grey-500)', lineHeight: 1.7, maxWidth: 640 }}>
            Each of the 12,000 particles drifts on its own slow, curving current, colored from a random
            cool palette of aquatic blues, soft purples, and calm emeralds. When your cursor comes
            within range, nearby particles are pulled toward it, morphing smoothly into a bright red
            the closer they get. Motion trails come from painting a translucent white layer each frame
            instead of clearing the canvas — cheaper than tracking a position history per particle, and
            it lets thousands of dots move at once. Colors are grouped into a small set of buckets so
            the whole field can be drawn in a handful of batched fill calls per frame. Rendered with
            plain canvas 2D — no rendering libraries — and paused automatically when the tab is hidden
            or when your system has reduced motion enabled.
          </p>
        </div>
      </div>
    </div>
  );
}
