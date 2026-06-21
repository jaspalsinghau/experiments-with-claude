'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

const experiments = [
  {
    href: '/dashboards/markets',
    icon: '📈',
    title: 'Markets Overview',
    description: 'Daily candlestick charts for global equity indices, gold, and AUD/USD with EMA 50/200 overlays. 1D / 1W / 1M bar granularity toggle.',
  },
];

export default function HomePage() {
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLElement | null, i: number) => {
    revealRefs.current[i] = el;
  };

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
            What I&apos;m building
          </p>
          <h2
            ref={(el) => addRef(el, 1)}
            className="reveal"
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              marginBottom: '0.75rem',
            }}
          >
            Experiments
          </h2>
          <p
            ref={(el) => addRef(el, 2)}
            className="reveal"
            style={{
              fontSize: '1.0625rem',
              color: 'var(--grey-500)',
              lineHeight: 1.7,
              maxWidth: 520,
              marginBottom: '3rem',
            }}
          >
            Each project is a standalone experiment — a real tool I actually use, built end-to-end with Claude Code.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {experiments.map((exp, i) => (
              <Link
                key={exp.href}
                href={exp.href}
                ref={(el) => addRef(el as HTMLElement | null, 3 + i)}
                className="reveal"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                  padding: '1.875rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--grey-100)',
                  background: 'var(--paper)',
                  boxShadow: 'var(--shadow)',
                  textDecoration: 'none',
                  transition: 'transform 0.2s var(--ease), box-shadow 0.2s var(--ease), border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--grey-200)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = '';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--grey-100)';
                }}
              >
                <div style={{ fontSize: '1.75rem' }}>{exp.icon}</div>
                <h3 style={{
                  fontWeight: 700,
                  fontSize: '1.0625rem',
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                }}>
                  {exp.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--grey-500)',
                  lineHeight: 1.65,
                  flex: 1,
                }}>
                  {exp.description}
                </p>
                <span style={{
                  alignSelf: 'flex-start',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--accent-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}>
                  Explore →
                </span>
              </Link>
            ))}

            {/* Coming soon placeholder */}
            <div
              ref={(el) => addRef(el, 3 + experiments.length)}
              className="reveal"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
                padding: '1.875rem',
                borderRadius: 'var(--radius)',
                border: '2px dashed var(--grey-200)',
                background: 'transparent',
              }}
            >
              <div style={{ fontSize: '1.75rem', opacity: 0.4 }}>＋</div>
              <h3 style={{ fontWeight: 600, fontSize: '1.0625rem', color: 'var(--grey-500)' }}>More coming soon</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--grey-300)', lineHeight: 1.65 }}>
                New experiments will appear here as they are built.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Built with Claude Code callout ───────────────── */}
      <section style={{ background: 'var(--ink-soft)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', textAlign: 'center' }}>
          <p
            ref={(el) => addRef(el, 10)}
            className="reveal"
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '1rem',
            }}
          >
            The tools I use
          </p>
          <h2
            ref={(el) => addRef(el, 11)}
            className="reveal"
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.375rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--paper)',
              marginBottom: '1.25rem',
              maxWidth: 600,
              margin: '0 auto 1.25rem',
            }}
          >
            Everything in this repo is built with Claude Code
          </h2>
          <p
            ref={(el) => addRef(el, 12)}
            className="reveal"
            style={{
              fontSize: '1.0625rem',
              color: 'var(--grey-300)',
              lineHeight: 1.7,
              maxWidth: 540,
              margin: '0 auto 2.5rem',
            }}
          >
            From architecture decisions to implementation details, Claude Code handles the heavy lifting — letting me focus on what I want to build rather than how to build it.
          </p>
          <a
            ref={(el) => addRef(el, 13)}
            className="reveal btn btn--ghost"
            href="https://github.com/jaspalsinghau/experiments-with-claude"
            target="_blank"
            rel="noopener noreferrer"
          >
            View source on GitHub ↗
          </a>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer style={{
        background: 'var(--ink)',
        padding: '3rem 1.5rem 2.25rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', marginBottom: '2.5rem' }}>
            <div>
              <p style={{
                fontSize: '1.125rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--paper)',
                marginBottom: '0.375rem',
              }}>
                Experiments<span style={{ color: 'var(--accent)' }}>.</span>
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--grey-500)' }}>
                Personal coding experiments built with Claude Code.
              </p>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <Link href="/" style={{ fontSize: '0.875rem', color: 'var(--grey-500)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--paper)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--grey-500)')}
              >
                Home
              </Link>
              <Link href="/dashboards/markets" style={{ fontSize: '0.875rem', color: 'var(--grey-500)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--paper)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--grey-500)')}
              >
                Markets Overview
              </Link>
              <a href="https://github.com/jaspalsinghau/experiments-with-claude" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '0.875rem', color: 'var(--grey-500)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--paper)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--grey-500)')}
              >
                GitHub ↗
              </a>
            </nav>
          </div>

          <div style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--grey-600)' }}>
              © {new Date().getFullYear()} Jaspal Singh. All rights reserved.
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--grey-600)' }}>
              Built with Claude Code
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
