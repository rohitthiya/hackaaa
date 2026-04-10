// src/pages/AIResearchPage.jsx
import { useState } from 'react';
import { Brain, TrendingUp, TrendingDown, Shield, Flame, ChevronRight, Zap, BarChart2 } from 'lucide-react';
import { searchNews } from '../api/news';

const RECOMMENDATIONS = [
  { ticker: 'RELIANCE', company: 'Reliance Industries', sector: 'Energy', action: 'BUY', confidence: 87, risk: 18, price: '₹2,847', target: '₹3,200', reasoning: 'Strong Q3 earnings driven by Jio and Retail segments. Green energy pivot adds long-term upside. Technical breakout above 200-day MA. Institutional buying at current levels.' },
  { ticker: 'INFY', company: 'Infosys Ltd', sector: 'IT', action: 'HOLD', confidence: 72, risk: 34, price: '₹1,498', target: '₹1,620', reasoning: 'Sideways consolidation expected in IT sector. Forex headwinds from strong USD may dampen Q4 guidance. Wait for clarity before adding positions.' },
  { ticker: 'HDFCBANK', company: 'HDFC Bank', sector: 'Banking', action: 'BUY', confidence: 83, risk: 22, price: '₹1,642', target: '₹1,900', reasoning: 'Post-merger integration complete. CASA ratio improving. Credit growth well above sector average. RBI rate cycle turning favorable for net interest margin.' },
  { ticker: 'TATAMOTORS', company: 'Tata Motors', sector: 'Auto', action: 'SELL', confidence: 69, risk: 56, price: '₹924', target: '₹780', reasoning: 'JLR volume growth plateauing. EV competition intensifying in UK market. Semiconductor supply chain risks remain. Valuation stretched at current levels.' },
  { ticker: 'MIDCAP ETF', company: 'Nifty Midcap 150 ETF', sector: 'ETF', action: 'BUY', confidence: 81, risk: 20, price: '₹194', target: '₹240', reasoning: 'Domestic demand driving midcap outperformance. FII flows rotating from large-cap to midcap. Favorable macro environment with stable interest rates.' },
];

const ACTION_STYLES = {
  BUY: { bg: 'rgba(52,211,153,0.12)', color: 'var(--accent-emerald)', border: 'rgba(52,211,153,0.25)', label: '▲ BUY' },
  SELL: { bg: 'rgba(251,113,133,0.12)', color: 'var(--accent-rose)', border: 'rgba(251,113,133,0.25)', label: '▼ SELL' },
  HOLD: { bg: 'rgba(251,191,36,0.12)', color: 'var(--accent-amber)', border: 'rgba(251,191,36,0.25)', label: '● HOLD' },
};

export default function AIResearchPage() {
  const [selected, setSelected] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const filtered = RECOMMENDATIONS.filter(r => filter === 'ALL' || r.action === filter);
  const rec = filtered[selected] || filtered[0];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const r = await searchNews(searchQuery);
      setSearchResults(r.data?.slice(0, 5) || []);
    } catch { setSearchResults([]); }
    setSearchLoading(false);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={18} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', margin: 0 }}>AI Research Center</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>ML-powered stock recommendations with real-time reasoning</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['ALL', 'BUY', 'HOLD', 'SELL'].map(f => (
          <button key={f} onClick={() => { setFilter(f); setSelected(0); }} style={{
            padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            background: filter === f ? (f === 'BUY' ? 'rgba(52,211,153,0.15)' : f === 'SELL' ? 'rgba(251,113,133,0.15)' : f === 'HOLD' ? 'rgba(251,191,36,0.15)' : 'rgba(99,102,241,0.12)') : 'var(--bg-card)',
            border: `1px solid ${filter === f ? (f === 'BUY' ? 'rgba(52,211,153,0.3)' : f === 'SELL' ? 'rgba(251,113,133,0.3)' : f === 'HOLD' ? 'rgba(251,191,36,0.3)' : 'var(--accent-indigo)') : 'var(--border-card)'}`,
            color: filter === f ? (f === 'BUY' ? 'var(--accent-emerald)' : f === 'SELL' ? 'var(--accent-rose)' : f === 'HOLD' ? 'var(--accent-amber)' : 'var(--accent-indigo)') : 'var(--text-muted)',
          }}>{f}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, marginBottom: 24 }}>
        {/* Stock list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((r, i) => {
            const style = ACTION_STYLES[r.action];
            const isActive = (selected === i);
            return (
              <button key={r.ticker} onClick={() => setSelected(i)} style={{
                background: isActive ? 'var(--bg-card)' : 'var(--bg-tertiary)',
                border: `1.5px solid ${isActive ? 'var(--accent-indigo)' : 'var(--border-card)'}`,
                borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                textAlign: 'left', transition: 'all 0.15s',
                boxShadow: isActive ? 'var(--shadow-md)' : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{r.ticker}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>{style.label}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{r.company}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Confidence</span>
                  <span style={{ color: style.color, fontWeight: 700 }}>{r.confidence}%</span>
                </div>
                <div style={{ background: 'var(--border-color)', borderRadius: 99, height: 3, marginTop: 6 }}>
                  <div style={{ width: `${r.confidence}%`, height: '100%', borderRadius: 99, background: style.color }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        {rec && (() => {
          const style = ACTION_STYLES[rec.action];
          return (
            <div className="card card-depth" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: `${style.color}08`, filter: 'blur(40px)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span className="gradient-text" style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Poppins, sans-serif' }}>{rec.ticker}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, padding: '4px 14px', borderRadius: 99, background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>{style.label}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{rec.company} • {rec.sector}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Current Price</p>
                  <p className="stat-number" style={{ fontSize: 22, color: 'var(--text-primary)' }}>{rec.price}</p>
                  <p style={{ fontSize: 12, color: 'var(--accent-emerald)', fontWeight: 600 }}>Target: {rec.target}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'AI Confidence', value: `${rec.confidence}%`, color: style.color, icon: Zap },
                  { label: 'Risk Level', value: `${rec.risk}%`, color: rec.risk > 40 ? 'var(--accent-rose)' : 'var(--accent-amber)', icon: Shield },
                  { label: 'Signal', value: rec.action, color: style.color, icon: BarChart2 },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                    <Icon size={18} style={{ color, marginBottom: 6 }} />
                    <p style={{ fontSize: 18, fontWeight: 800, color, fontFamily: 'Poppins, sans-serif' }}>{value}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Brain size={15} style={{ color: 'var(--accent-indigo)' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-indigo)' }}>AI Reasoning</span>
                  <Flame size={13} style={{ color: 'var(--accent-amber)' }} />
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{rec.reasoning}</p>
              </div>

              {/* Search related news */}
              <form onSubmit={(e) => { setSearchQuery(rec.company); handleSearch(e); }} style={{ display: 'flex', gap: 8 }}>
                <input className="input-field" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={`Search news for ${rec.ticker}…`} style={{ flex: 1, height: 38, fontSize: 13 }} />
                <button type="submit" disabled={searchLoading} className="btn-primary" style={{ height: 38, padding: '0 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ChevronRight size={14} /> {searchLoading ? 'Loading…' : 'Get News'}
                </button>
              </form>
            </div>
          );
        })()}
      </div>

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Related News</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {searchResults.map((a, i) => (
              <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                >
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.title}</p>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{a.source?.name}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
