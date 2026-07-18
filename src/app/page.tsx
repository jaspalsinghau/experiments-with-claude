'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

const experiments = [
  {
    href: '/dashboards/markets',
    icon: '📈',
    title: 'Markets Overview',
    description: 'A dashboard of daily candlestick charts for global equity indices, commodities, and FX, built with Next.js and served as a static site on GitHub Pages. Price data is fetched from the Tiingo API via a scheduled GitHub Actions workflow and stored as CSV files — the browser never calls Tiingo directly.',
  },
  {
    href: '/experiments/particle-field',
    icon: '✨',
    title: 'Particle Field',
    description: '12,000 particles drifting in cool aquatic tones, pulled toward your cursor and glowing red the closer they get — like a magnet through iron filings. Built with plain canvas 2D — no rendering libraries.',
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
    <>
      {/* Hero */}
      <section style={{
        background: 'var(--ink)',
        position: 'relative',
        overflow: 'hidden',
        padding: '7rem 1.5rem 6rem',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '-120px',
          right: '-80px',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(245,166,35,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', position: 'relative' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.875rem',
              borderRadius: 999,
              border: '1px solid rgba(245,166,35,0.4)',
              background: 'var(--accent-soft)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--accent)',
              letterSpacing: '0.01em',
            }}>
              <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              Designed &amp; built with Claude Code
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--paper)',
            marginBottom: '1.25rem',
            maxWidth: 680,
          }}>
            Personal experiments{' '}
            <span style={{ color: 'var(--accent)' }}>built with Claude Code.</span>
          </h1>

          <p style={{
            fontSize: '0.9375rem',
            color: 'var(--grey-500)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            fontWeight: 500,
            marginBottom: '1.5rem',
          }}>
            JavaScript · Next.js · TypeScript · AI-assisted development
          </p>

          <p style={{
            fontSize: '1.0625rem',
            color: 'var(--grey-300)',
            lineHeight: 1.7,
            maxWidth: 560,
            marginBottom: '2.5rem',
          }}>
            A collection of real-world dashboards and tools I build using Claude Code — shipping ideas faster than I ever could alone.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <a
              href="https://github.com/jaspalsinghau/experiments-with-claude"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
            >
              View on GitHub ↗
            </a>
          </div>
        </div>
      </section>

      {/* Experiments */}
      <section style={{ background: 'var(--grey-50)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>
          <p
            ref={(el) => addRef(el, 0)}
            className="reveal"
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '0.625rem',
            }}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

      {/* Built with Claude Code callout */}
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

      {/* Footer */}
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
