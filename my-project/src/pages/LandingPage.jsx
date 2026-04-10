// src/pages/LandingPage.jsx  (replaces old HomePage.jsx route)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Zap, TrendingUp, Shield, Target, Newspaper, Brain, ArrowRight, CheckCircle, BarChart2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const STATS = [
  { value: '₹12.8M+', label: 'Assets Tracked' },
  { value: '24/7', label: 'AI Monitoring' },
  { value: '150+', label: 'Goal Templates' },
];

const FEATURES = [
  { icon: Brain, title: 'AI Market Research', desc: 'ML-powered buy/sell/hold recommendations with reasoning and confidence scores.' },
  { icon: TrendingUp, title: 'Portfolio Tracking', desc: 'Real-time P&L, sector allocation, and performance against benchmarks.' },
  { icon: Shield, title: 'Risk Intelligence', desc: 'Portfolio collapse probability and rebalancing alerts before losses happen.' },
  { icon: Target, title: 'Goal Planning', desc: 'SIP calculations for any financial goal with AI-suggested investment strategies.' },
  { icon: Newspaper, title: 'Smart News Feed', desc: 'Personalized market news with sentiment indicators for your holdings.' },
  { icon: BarChart2, title: 'Investment Simulation', desc: 'Test any amount, duration, and risk level with realistic growth projections.' },
];

const STEPS = [
  { step: '01', title: 'Create your account', text: 'Sign up and set your risk profile and financial goals in minutes.' },
  { step: '02', title: 'AI researches the market', text: 'Our models scan news, technicals, and fundamentals based on your profile.' },
  { step: '03', title: 'Get personalized insights', text: 'Receive clear buy/sell/hold signals with transparent reasoning you can trust.' },
  { step: '04', title: 'Track and optimize', text: 'Monitor your portfolio, simulate returns, and hit your goals faster.' },
];

export default function LandingPage() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Navbar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: scrolled ? 'var(--bg-navbar)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-accent)' }}>
              <Zap size={18} color="white" />
            </div>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>InvestIQ</span>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {['Features', 'How it works', 'Trust'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{item}</a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={toggleTheme} style={{
              width: 36, height: 36, borderRadius: 10, background: 'var(--bg-input)',
              border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              {isDark ? <Sun size={16} style={{ color: 'var(--accent-amber)' }} /> : <Moon size={16} style={{ color: 'var(--accent-indigo)' }} />}
            </button>
            <button onClick={() => navigate('/login')} className="btn-secondary" style={{ fontSize: 14, padding: '8px 18px' }}>Sign In</button>
            <button onClick={() => navigate('/signup')} className="btn-primary" style={{ fontSize: 14, padding: '8px 18px' }}>Get Started</button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-hero)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,0.07)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: 350, height: 350, borderRadius: '50%', background: 'rgba(52,211,153,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 100px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <div className="animate-fade-in-up" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 99, marginBottom: 24,
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            }}>
              <Zap size={13} style={{ color: 'var(--accent-indigo)' }} />
              <span style={{ fontSize: 13, color: 'var(--accent-indigo)', fontWeight: 600 }}>AI-Powered Investment Intelligence</span>
            </div>

            <h1 className="animate-fade-in-up stagger-1" style={{
              fontSize: 52, fontWeight: 800, color: 'var(--text-primary)',
              fontFamily: 'Poppins, sans-serif', lineHeight: 1.18,
              letterSpacing: '-0.03em', marginBottom: 22,
            }}>
              Invest smarter with an AI that{' '}
              <span className="gradient-text">actually understands</span>{' '}
              your goals
            </h1>

            <p className="animate-fade-in-up stagger-2" style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 36, maxWidth: 600, margin: '0 auto 36px' }}>
              A premium fintech platform that researches markets, tracks your portfolio,
              plans your goals, and explains every recommendation clearly.
            </p>

            <div className="animate-fade-in-up stagger-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 52 }}>
              <button onClick={() => navigate('/signup')} className="btn-primary" style={{ fontSize: 15, padding: '13px 28px', display: 'flex', alignItems: 'center', gap: 8 }}>
                Start for free <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('/login')} className="btn-secondary" style={{ fontSize: 15, padding: '13px 28px' }}>
                Sign In
              </button>
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up stagger-4" style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              {STATS.map(s => (
                <div key={s.label} className="card" style={{ padding: '14px 24px', textAlign: 'center', minWidth: 140 }}>
                  <p className="stat-number" style={{ fontSize: 26, color: 'var(--text-primary)' }}>{s.value}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Dashboard Preview ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div className="card" style={{ borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-color)' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
            ))}
            <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>investiq.app/dashboard</span>
          </div>
          <div style={{ padding: 20, background: 'var(--bg-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {[
              { label: 'Portfolio Value', value: '₹7.87L', change: '+2.43%', color: 'var(--accent-indigo)' },
              { label: 'Today\'s Return', value: '+₹19,134', change: '+2.43%', color: 'var(--accent-emerald)' },
              { label: 'AI Signal', value: '▲ BUY', change: '87% confidence', color: 'var(--accent-emerald)' },
            ].map(({ label, value, change, color }) => (
              <div key={label} style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, border: '1px solid var(--border-card)' }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                <p className="stat-number" style={{ fontSize: 22, color }}>{value}</p>
                <p style={{ fontSize: 12, color: 'var(--accent-emerald)', marginTop: 4 }}>{change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-indigo)', marginBottom: 12 }}>Features</p>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
            Everything you need to invest intelligently
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="card card-depth animate-fade-in-up" style={{ padding: 24, animationDelay: `${i * 80}ms`, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={22} style={{ color: 'var(--accent-indigo)' }} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-indigo)', marginBottom: 12 }}>How it works</p>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
            From signup to strategy in 4 steps
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {STEPS.map(({ step, title, text }, i) => (
            <div key={step} className="card animate-fade-in-up" style={{ padding: 24, animationDelay: `${i * 100}ms` }}>
              <div className="gradient-text" style={{ fontSize: 40, fontWeight: 800, fontFamily: 'Poppins, sans-serif', marginBottom: 14 }}>{step}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust ── */}
      <section id="trust" style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <div className="card" style={{ padding: '48px 40px', background: 'var(--gradient-card)', borderRadius: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-indigo)', marginBottom: 12 }}>Trust & Transparency</p>
              <h2 style={{ fontSize: 34, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em', marginBottom: 16 }}>
                You always know why we suggest something
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Every recommendation comes with clear reasoning, confidence scores, and
                market context so you can make informed decisions with full visibility.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Every signal includes AI confidence score',
                'Plain-language explanations for every recommendation',
                'Risk percentage shown for all positions',
                'Market news context linked to suggestions',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 10 }}>
                  <CheckCircle size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px 80px' }}>
        <div style={{
          borderRadius: 24, padding: '56px 40px', textAlign: 'center',
          background: 'var(--gradient-accent)',
          boxShadow: 'var(--shadow-accent)',
        }}>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: 'white', fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Ready to invest with AI on your side?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 36 }}>
            Join thousands of investors making smarter decisions every day.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/signup')} style={{ padding: '14px 32px', borderRadius: 12, background: 'white', color: '#4f46e5', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'transform 0.15s, opacity 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Create Free Account <ArrowRight size={15} style={{ display: 'inline', marginLeft: 6 }} />
            </button>
            <button onClick={() => navigate('/login')} style={{ padding: '14px 32px', borderRadius: 12, background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 15, fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          © 2024 InvestIQ · AI-powered investment intelligence · Built for the future of finance
        </p>
      </footer>
    </div>
  );
}
