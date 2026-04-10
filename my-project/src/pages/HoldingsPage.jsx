// src/pages/HoldingsPage.jsx
import { TrendingUp, TrendingDown, BarChart2, Wallet, DollarSign } from 'lucide-react';

const HOLDINGS = [
  { name: 'Reliance Industries', ticker: 'RELIANCE', sector: 'Energy', qty: 64, avgPrice: 2650, cmp: 2847, invested: 169600, current: 182208 },
  { name: 'Infosys Ltd', ticker: 'INFY', sector: 'IT', qty: 90, avgPrice: 1560, cmp: 1498, invested: 140400, current: 134820 },
  { name: 'HDFC Bank', ticker: 'HDFCBANK', sector: 'Banking', qty: 60, avgPrice: 1580, cmp: 1642, invested: 94800, current: 98520 },
  { name: 'TCS', ticker: 'TCS', sector: 'IT', qty: 20, avgPrice: 3750, cmp: 3920, invested: 75000, current: 78400 },
  { name: 'Tata Motors', ticker: 'TATAMOTORS', sector: 'Auto', qty: 120, avgPrice: 970, cmp: 924, invested: 116400, current: 110880 },
  { name: 'Nifty Midcap ETF', ticker: 'MIDCAP', sector: 'ETF', qty: 500, avgPrice: 185, cmp: 194, invested: 92500, current: 97000 },
];

const SECTOR_COLORS = { Energy: 'var(--accent-amber)', IT: 'var(--accent-indigo)', Banking: 'var(--accent-emerald)', Auto: 'var(--accent-rose)', ETF: 'var(--accent-purple)' };

export default function HoldingsPage() {
  const totalInvested = HOLDINGS.reduce((s, h) => s + h.invested, 0);
  const totalCurrent = HOLDINGS.reduce((s, h) => s + h.current, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalReturn = ((totalPnL / totalInvested) * 100).toFixed(2);

  const sectorBreakdown = HOLDINGS.reduce((acc, h) => {
    acc[h.sector] = (acc[h.sector] || 0) + h.current;
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', margin: 0 }}>My Holdings</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Track your portfolio positions and performance</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Invested', value: `₹${(totalInvested / 100000).toFixed(2)}L`, icon: Wallet, color: 'var(--accent-indigo)' },
          { label: 'Current Value', value: `₹${(totalCurrent / 100000).toFixed(2)}L`, icon: DollarSign, color: 'var(--accent-emerald)' },
          { label: 'Total P&L', value: `${totalPnL >= 0 ? '+' : ''}₹${Math.abs(totalPnL).toLocaleString('en-IN')}`, icon: totalPnL >= 0 ? TrendingUp : TrendingDown, color: totalPnL >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' },
          { label: 'Overall Return', value: `${totalReturn}%`, icon: BarChart2, color: Number(totalReturn) >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <div key={label} className="card card-depth animate-fade-in-up" style={{ padding: 18, animationDelay: `${i * 80}ms` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</p>
                <p className="stat-number" style={{ fontSize: 20, color }}>{value}</p>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} style={{ color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Holdings table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>All Positions</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Stock', 'Sector', 'Qty', 'Avg Price', 'CMP', 'Invested', 'Current', 'P&L', 'Return'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Stock' || h === 'Sector' ? 'left' : 'right', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOLDINGS.map(h => {
                  const pnl = h.current - h.invested;
                  const ret = ((pnl / h.invested) * 100).toFixed(2);
                  const positive = pnl >= 0;
                  const sc = SECTOR_COLORS[h.sector] || 'var(--text-muted)';
                  return (
                    <tr key={h.ticker}>
                      <td>
                        <div>
                          <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>{h.ticker}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.name}</p>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: `${sc}15`, color: sc, fontWeight: 600 }}>{h.sector}</span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{h.qty}</td>
                      <td style={{ textAlign: 'right' }}>₹{h.avgPrice.toLocaleString()}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: h.cmp >= h.avgPrice ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>₹{h.cmp.toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>₹{h.invested.toLocaleString()}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{h.current.toLocaleString()}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: positive ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                        {positive ? '+' : ''}₹{Math.abs(pnl).toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: positive ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                        {positive ? '+' : ''}{ret}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector breakdown */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Sector Allocation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(sectorBreakdown).map(([sector, val]) => {
              const pct = ((val / totalCurrent) * 100).toFixed(1);
              const color = SECTOR_COLORS[sector] || 'var(--text-muted)';
              return (
                <div key={sector}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{sector}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color }}>{pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
