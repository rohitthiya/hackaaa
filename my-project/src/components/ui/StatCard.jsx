// src/components/ui/StatCard.jsx
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, change, changeLabel, icon: Icon, accent, delay = 0 }) {
  const isPositive = change > 0;
  const isNeutral = change === 0 || change === undefined;

  const accentColors = {
    indigo: 'var(--accent-indigo)',
    emerald: 'var(--accent-emerald)',
    rose: 'var(--accent-rose)',
    amber: 'var(--accent-amber)',
    purple: 'var(--accent-purple)',
  };
  const color = accentColors[accent] || accentColors.indigo;

  return (
    <div
      className="card card-depth animate-fade-in-up"
      style={{
        padding: 20,
        animationDelay: `${delay}ms`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top accent bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: color,
        borderRadius: '16px 16px 0 0',
        opacity: 0.7,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {title}
          </p>
          <p className="stat-number" style={{ fontSize: 24, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {value}
          </p>
          {(change !== undefined || changeLabel) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
              {!isNeutral && (
                isPositive
                  ? <TrendingUp size={14} style={{ color: 'var(--accent-emerald)' }} />
                  : <TrendingDown size={14} style={{ color: 'var(--accent-rose)' }} />
              )}
              {isNeutral && <Minus size={14} style={{ color: 'var(--text-muted)' }} />}
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: isNeutral ? 'var(--text-muted)' : (isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)'),
              }}>
                {change !== undefined && !isNeutral && (isPositive ? '+' : '')}{change !== undefined ? `${change}%` : ''}
                {changeLabel && ` ${changeLabel}`}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${color}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={20} style={{ color }} />
          </div>
        )}
      </div>
    </div>
  );
}
