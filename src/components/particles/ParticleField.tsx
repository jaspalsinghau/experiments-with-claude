'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  driftAngle: number;
  speed: number;
  hueSlot: number;
}

const PARTICLE_COUNT = 12000;
const DOT_SIZE = 1.2;
const MOUSE_RADIUS = 220;
const TRAIL_FADE = 'rgba(255, 255, 255, 0.25)';
const DRIFT_TURN = 0.03;
const MAX_ATTRACT_SPEED = 0.4375;
const HUE_SLOTS = 8;
const PROXIMITY_BUCKETS = 12;
const BUCKET_COUNT = HUE_SLOTS * PROXIMITY_BUCKETS;

const PALETTE: [number, number, number][] = [
  [64, 160, 220], // aquatic blue
  [150, 120, 220], // soft purple
  [60, 190, 140], // calm emerald
];
const RED_TARGET: [number, number, number] = [230, 40, 40];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function paletteColorAt(t: number): [number, number, number] {
  const segments = PALETTE.length - 1;
  const scaled = t * segments;
  const i = Math.min(segments - 1, Math.floor(scaled));
  const localT = scaled - i;
  const a = PALETTE[i];
  const b = PALETTE[i + 1];
  return [lerp(a[0], b[0], localT), lerp(a[1], b[1], localT), lerp(a[2], b[2], localT)];
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function makeParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    driftAngle: Math.random() * Math.PI * 2,
    speed: 0.15 + Math.random() * 0.25,
    hueSlot: Math.min(HUE_SLOTS - 1, Math.floor(Math.random() * HUE_SLOTS)),
  };
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hueBaseColors: [number, number, number][] = Array.from({ length: HUE_SLOTS }, (_, i) =>
      paletteColorAt(i / (HUE_SLOTS - 1))
    );
    const bucketColorTable: string[] = new Array(BUCKET_COUNT);
    for (let hueSlot = 0; hueSlot < HUE_SLOTS; hueSlot++) {
      const base = hueBaseColors[hueSlot];
      for (let proxBucket = 0; proxBucket < PROXIMITY_BUCKETS; proxBucket++) {
        const ratio = proxBucket / (PROXIMITY_BUCKETS - 1);
        const r = Math.round(lerp(base[0], RED_TARGET[0], ratio));
        const g = Math.round(lerp(base[1], RED_TARGET[1], ratio));
        const b = Math.round(lerp(base[2], RED_TARGET[2], ratio));
        bucketColorTable[hueSlot * PROXIMITY_BUCKETS + proxBucket] = `rgb(${r}, ${g}, ${b})`;
      }
    }
    const bucketBuffers: Particle[][] = Array.from({ length: BUCKET_COUNT }, () => []);

    const initialRect = parent.getBoundingClientRect();
    let width = initialRect.width;
    let height = initialRect.height;
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => makeParticle(width, height));
    const mouse = { x: -9999, y: -9999, active: false };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const prevWidth = width;
      const prevHeight = height;
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      if (prevWidth > 0 && prevHeight > 0) {
        const scaleX = width / prevWidth;
        const scaleY = height / prevHeight;
        for (const p of particles) {
          p.x *= scaleX;
          p.y *= scaleY;
        }
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);
    resize();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    if (!reduceMotion) {
      canvas.addEventListener('pointermove', handlePointerMove);
      canvas.addEventListener('pointerleave', handlePointerLeave);
    }

    const step = () => {
      for (const buf of bucketBuffers) buf.length = 0;

      for (const p of particles) {
        p.driftAngle += (Math.random() - 0.5) * DRIFT_TURN;
        const driftVX = Math.cos(p.driftAngle) * p.speed;
        const driftVY = Math.sin(p.driftAngle) * p.speed;

        let ratio = 0;
        let vx = driftVX;
        let vy = driftVY;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < MOUSE_RADIUS * MOUSE_RADIUS) {
            const dist = Math.sqrt(distSq) || 0.001;
            ratio = smoothstep(1 - dist / MOUSE_RADIUS);
            const dirX = dx / dist;
            const dirY = dy / dist;
            const attractSpeed = ratio * MAX_ATTRACT_SPEED;
            vx = driftVX * (1 - ratio) + dirX * attractSpeed;
            vy = driftVY * (1 - ratio) + dirY * attractSpeed;
          }
        }

        p.x += vx;
        p.y += vy;

        if (p.x < 0) p.x += width;
        if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height;
        if (p.y > height) p.y -= height;

        const proxBucket = Math.min(PROXIMITY_BUCKETS - 1, Math.floor(ratio * (PROXIMITY_BUCKETS - 1)));
        const bucketIndex = p.hueSlot * PROXIMITY_BUCKETS + proxBucket;
        bucketBuffers[bucketIndex].push(p);
      }

      ctx.fillStyle = TRAIL_FADE;
      ctx.fillRect(0, 0, width, height);

      const half = DOT_SIZE / 2;
      for (let bucket = 0; bucket < BUCKET_COUNT; bucket++) {
        const buf = bucketBuffers[bucket];
        if (buf.length === 0) continue;
        ctx.beginPath();
        for (const p of buf) {
          ctx.rect(p.x - half, p.y - half, DOT_SIZE, DOT_SIZE);
        }
        ctx.fillStyle = bucketColorTable[bucket];
        ctx.fill();
      }
    };

    let rafId: number | null = null;
    const loop = () => {
      step();
      rafId = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (rafId === null) rafId = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    if (reduceMotion) {
      step();
    } else {
      startLoop();
    }

    const handleVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) stopLoop();
      else startLoop();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
}
