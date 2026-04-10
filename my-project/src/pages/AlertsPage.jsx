// src/pages/AlertsPage.jsx
import { AlertTriangle, TrendingUp, Shield, Bell, Zap, CheckCircle, Clock, ChevronRight } from 'lucide-react';

const ALERTS = [
  { id: 1, type: 'danger', icon: AlertTriangle, title: 'High Collapse Risk — INFY', body: 'Infosys showing 90% probability of 8–12% correction in the next 48 hours. Forex headwinds from strong USD are eroding margins. Consider trimming position.', time: '2 min ago', tag: 'Risk Alert', actionable: true },
  { id: 2, type: 'success', icon: TrendingUp, title: 'Growth Opportunity — Midcap ETF', body: 'Nifty Midcap 150 ETF is breaking out from a 3-month consolidation. FII inflows picking up. This is a high-conviction setup with risk:reward of 1:3.', time: '14 min ago', tag: 'Opportunity', actionable: true },
  { id: 3, type: 'warning', icon: Shield, title: 'Portfolio Rebalancing Needed', body: 'Your IT sector exposure is at 27% — above your risk-adjusted target of 20%. Recommended: reduce INFY position by 30% and rotate to banking sector.', time: '1 hour ago', tag: 'Portfolio', actionable: true },
  { id: 4, type: 'info', icon: Bell, title: 'Earnings Season Alert', body: 'Q4 earnings season begins next week. Expect high volatility in RELIANCE, TCS, HDFCBANK. AI models will update recommendations post-earnings.', time: '3 hours ago', tag: 'Market Update', actionable: false },
  { id: 5, type: 'success', icon: Zap, title: 'SIP Reminder — Monthly Goal', body: 'Your monthly SIP of ₹12,500 for the House goal is due in 3 days. Ensure sufficient balance to stay on track.', time: '5 hours ago', tag: 'Goal', actionable: false },
  { id: 6, type: 'danger', icon: AlertTriangle, title: 'News Sentiment Flip — Auto Sector', body: 'Auto sector news sentiment has turned negative (-68%) following EV subsidy policy revision. TATAMOTORS faces short-term selling pressure.', time: '8 hours ago', tag: 'Sentiment', actionable: true },
];

const TYPE_STYLES = {
  danger: { color: 'var(--accent-rose)', bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.2)', left: 'var(--accent-rose)', badgeBg: 'rgba(251,113,133,0.12)' },
  success: { color: 'var(--accent-emerald)', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', left: 'var(--accent-emerald)', badgeBg: 'rgba(52,211,153,0.12)' },
  warning: { color: 'var(--accent-amber)', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', left: 'var(--accent-amber)', badgeBg: 'rgba(251,191,36,0.12)' },
  info: { color: 'var(--accent-indigo)', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)', left: 'var(--accent-indigo)', badgeBg: 'rgba(99,102,241,0.12)' },
};

const SUMMARY = [
  { label: 'Risk Alerts', count: 2, color: 'var(--accent-rose)', icon: AlertTriangle },
  { label: 'Opportunities', count: 2, color: 'var(--accent-emerald)', icon: TrendingUp },
  { label: 'Portfolio Updates', count: 1, color: 'var(--accent-amber)', icon: Shield },
  { label: 'Market Updates', count: 1, color: 'var(--accent-indigo)', icon: Bell },
];

export default function AlertsPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', margin: 0 }}>Alerts & Signals</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Real-time risk warnings and market opportunities</p>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {SUMMARY.map(s => (
          <div key={s.label} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="stat-number" style={{ fontSize: 22, color: s.color }}>{s.count}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ALERTS.map((alert, i) => {
          const s = TYPE_STYLES[alert.type];
          return (
            <div key={alert.id} className="card animate-fade-in-up" style={{
              padding: '18px 20px', borderLeft: `3px solid ${s.left}`,
              animationDelay: `${i * 60}ms`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <alert.icon size={17} style={{ color: s.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{alert.title}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: s.badgeBg, color: s.color }}>{alert.tag}</span>
                    {alert.actionable && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(99,102,241,0.1)', color: 'var(--accent-indigo)' }}>Actionable</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>{alert.body}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{alert.time}</span>
                    </div>
                    {alert.actionable && (
                      <button style={{
                        display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600,
                        color: s.color, background: s.bg, border: `1px solid ${s.border}`,
                        borderRadius: 8, padding: '5px 12px', cursor: 'pointer', transition: 'opacity 0.15s',
                      }}>
                        View Details <ChevronRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* All clear indicator */}
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 10, background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
        <CheckCircle size={15} style={{ color: 'var(--accent-emerald)' }} />
        <span style={{ fontSize: 12, color: 'var(--accent-emerald)', fontWeight: 500 }}>All 6 alerts reviewed. AI is monitoring markets 24/7.</span>
      </div>
    </div>
  );
}
