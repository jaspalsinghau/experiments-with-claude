'use client';

import { useState } from 'react';
import ParticleField from './ParticleField';

export default function ParticleFieldSection() {
  const [interacted, setInteracted] = useState(false);

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onPointerMove={() => setInteracted(true)}
      onPointerDown={() => setInteracted(true)}
    >
      <ParticleField />
      <span
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          fontSize: '0.8125rem',
          fontWeight: 500,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--grey-500)',
          opacity: interacted ? 0 : 1,
          transition: 'opacity 0.6s var(--ease)',
          pointerEvents: 'none',
        }}
      >
        Move your mouse
      </span>
    </div>
  );
}
