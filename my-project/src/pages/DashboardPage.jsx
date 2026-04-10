// src/pages/DashboardPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Brain,
  AlertTriangle,
  Target,
  Zap,
  ArrowUpRight,
  ChevronRight,
  RefreshCw,
  Clock,
  Flame,
  Shield,
  Newspaper,
  Activity,
  DollarSign,
  CheckCircle,
  Sparkles,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../context/OnboardingContext';
import { getTopHeadlines } from '../api/news';
import { runSimulation } from '../api/simulation';
import { getGoals } from '../api/goals';

/* ─────────────────────────────────────────────
   Mock Data
───────────────────────────────────────────── */
const PORTFOLIO_POINTS = (() => {
  let v = 780000;
  return Array.from({ length: 30 }, (_, i) => {
    v += (Math.random() - 0.38) * 22000;
    return { day: i + 1, value: Math.max(v, 600000) };
  });
})();

const HOLDINGS = [
  { name: 'Reliance Industries', ticker: 'RELIANCE', sector: 'Energy', value: 182000, change: 2.4, weight: 23 },
  { name: 'Infosys Ltd', ticker: 'INFY', sector: 'IT', value: 134000, change: -0.8, weight: 17 },
  { name: 'HDFC Bank', ticker: 'HDFCBANK', sector: 'Finance', value: 98000, change: 1.2, weight: 12 },
  { name: 'TCS', ticker: 'TCS', sector: 'IT', value: 76000, change: 3.1, weight: 10 },
];

const AI_INSIGHTS = [
  {
    ticker: 'RELIANCE',
    action: 'BUY',
    confidence: 87,
    reason: 'Strong Q3 earnings + green energy pivot signals upward momentum',
    risk: 18,
  },
  {
    ticker: 'INFY',
    action: 'HOLD',
    confidence: 72,
    reason: 'Sideways movement expected; wait for Q4 IT sector clarity',
    risk: 34,
  },
  {
    ticker: 'MIDCAP ETF',
    action: 'BUY',
    confidence: 81,
    reason: 'Midcap rotation underway; favorable macro environment',
    risk: 22,
  },
];

const ALERTS = [
  {
    type: 'danger',
    icon: AlertTriangle,
    title: 'High volatility warning',
    body: 'INFY showing elevated downside risk over the next 48h due to forex headwinds.',
    time: '2m ago',
  },
  {
    type: 'success',
    icon: TrendingUp,
    title: 'Growth opportunity detected',
    body: 'Midcap IT sector is showing renewed momentum — consider adding exposure.',
    time: '14m ago',
  },
  {
    type: 'warning',
    icon: Shield,
    title: 'Portfolio risk elevated',
    body: 'IT sector overweight at 27% — consider a rebalance for better diversification.',
    time: '1h ago',
  },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function getSignalStyles(action) {
  if (action === 'BUY') {
    return {
      color: 'var(--success)',
      bg: 'var(--success-soft)',
      border: '1px solid rgba(5,150,105,0.18)',
    };
  }
  if (action === 'SELL') {
    return {
      color: 'var(--error)',
      bg: 'var(--error-soft)',
      border: '1px solid rgba(220,38,38,0.16)',
    };
  }
  return {
    color: 'var(--warning)',
    bg: 'var(--warning-soft)',
    border: '1px solid rgba(217,119,6,0.16)',
  };
}

function getAlertStyles(type) {
  if (type === 'success') {
    return {
      color: 'var(--success)',
      bg: 'var(--success-soft)',
      border: '1px solid rgba(5,150,105,0.18)',
    };
  }
  if (type === 'danger') {
    return {
      color: 'var(--error)',
      bg: 'var(--error-soft)',
      border: '1px solid rgba(220,38,38,0.16)',
    };
  }
  return {
    color: 'var(--warning)',
    bg: 'var(--warning-soft)',
    border: '1px solid rgba(217,119,6,0.16)',
  };
}

function MiniChart({ data, color = 'var(--accent-primary)', height = 70, fillOpacity = 0.22 }) {
  const w = 320;
  const h = height;
  const p = 6;
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;

  const xs = data.map((_, i) => p + (i / (data.length - 1)) * (w - p * 2));
  const ys = vals.map((v) => h - p - ((v - min) / range) * (h - p * 2));

  const line = xs
    .map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`)
    .join(' ');

  const area = `${line} L${xs[xs.length - 1].toFixed(1)},${h} L${xs[0].toFixed(1)},${h} Z`;
  const id = `g${String(color).replace(/[^a-z0-9]/gi, '')}${height}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RiskRing({ percent, size = 86 }) {
  const r = 30;
  const cx = 40;
  const cy = 40;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  const color =
    percent > 70 ? 'var(--error)' : percent > 40 ? 'var(--warning)' : 'var(--success)';

  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border-color)" strokeWidth="8" />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill={color}
        fontFamily="Poppins, sans-serif"
      >
        {percent}%
      </text>
    </svg>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 18,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'var(--gradient-accent-soft)',
            border: '1px solid var(--border-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={18} style={{ color: 'var(--accent-primary)' }} />
        </div>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </h2>
          {subtitle ? (
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</p>
          ) : null}
        </div>
      </div>

      {action ? (
        <button
          onClick={action.onClick}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 36,
            padding: '0 12px',
            borderRadius: 10,
            border: '1px solid var(--border-card)',
            background: 'var(--bg-secondary)',
            color: 'var(--accent-primary)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {action.label}
          <ChevronRight size={13} />
        </button>
      ) : null}
    </div>
  );
}

function SummaryCard({ label, value, subtext, icon: Icon, iconColor, iconBg, trend, chartColor, children }) {
  return (
    <div className="card card-depth animate-fade-in-up" style={{ padding: 20, minHeight: 178 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: 'var(--text-muted)',
            }}
          >
            {label}
          </p>
          <div className="stat-number" style={{ marginTop: 8, fontSize: 30, color: 'var(--text-primary)' }}>
            {value}
          </div>
          {subtext ? (
            <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{subtext}</p>
          ) : null}
        </div>

        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: iconBg,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid var(--border-card)',
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      {trend ? (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            borderRadius: 999,
            background: trend.bg,
            color: trend.color,
            fontSize: 12,
            fontWeight: 700,
            border: trend.border,
          }}
        >
          {trend.icon}
          {trend.label}
        </div>
      ) : null}

      {children ? <div style={{ marginTop: 16 }}>{children}</div> : null}

      {chartColor ? (
        <div style={{ marginTop: 16 }}>
          <MiniChart data={PORTFOLIO_POINTS.slice(-15)} color={chartColor} height={52} fillOpacity={0.18} />
        </div>
      ) : null}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main
───────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isComplete, status, personalizedData, step } = useOnboarding();

  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  const [goals, setGoals] = useState([]);

  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'Investor';

  const totalValue = isComplete && personalizedData
    ? personalizedData.totalCurrentValue + personalizedData.investmentAmount
    : 787400;

  const totalInvested = isComplete && personalizedData
    ? personalizedData.totalInvested || personalizedData.investmentAmount
    : 700000;

  const pnl = totalValue - totalInvested;
  const dailyChange = 2.43;
  const weeklyChange = 5.81;
  const onboardingPct = Math.round((step / 21) * 100);

  const totalValueFmt = isComplete && personalizedData
    ? `₹${(totalValue / 100000).toFixed(2)}L`
    : '₹7.87L';

  const pnlFmt = isComplete && personalizedData
    ? `${pnl >= 0 ? '+' : ''}₹${Math.abs(pnl).toLocaleString('en-IN')}`
    : '+₹87,400';

  const pnlColor = pnl >= 0 || !isComplete ? 'var(--success)' : 'var(--error)';

  const riskPercent = isComplete && personalizedData?.riskProfile === 'returns' ? 65 : 34;
  const riskLabel =
    isComplete && personalizedData?.riskProfile
      ? personalizedData.riskProfile === 'safety'
        ? 'Low'
        : personalizedData.riskProfile === 'balanced'
          ? 'Medium'
          : 'High'
      : 'Medium';

  const newsCategory =
    isComplete && personalizedData?.preferredAssets?.length
      ? personalizedData.preferredAssets.includes('Crypto')
        ? 'technology'
        : 'business'
      : 'business';

  const marketMood = useMemo(() => {
    if (dailyChange >= 2) return 'Bullish momentum';
    if (dailyChange > 0) return 'Positive session';
    return 'Mixed session';
  }, [dailyChange]);

  useEffect(() => {
    getTopHeadlines({ country: 'in', category: newsCategory })
      .then((r) => {
        const raw = Array.isArray(r) ? r : Array.isArray(r.data) ? r.data : [];
        setNews(raw.slice(0, 5));
      })
      .catch(() => setNews([]))
      .finally(() => setNewsLoading(false));

    getGoals()
      .then((r) => setGoals(Array.isArray(r) ? r : r.data || []))
      .catch(() => setGoals([]));
  }, [newsCategory]);

  const handleQuickSim = async () => {
    setSimLoading(true);
    const simAmount =
      isComplete && personalizedData?.investmentAmount > 0
        ? personalizedData.investmentAmount
        : 50000;

    try {
      const r = await runSimulation({
        amount: simAmount,
        duration: 12,
        investmentType: 'mutual',
      });
      setSimResult(r.data);
    } catch {
      // no-op
    }

    setSimLoading(false);
  };

  const latestGoal = goals[0];

  return (
    <div
      style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: '8px 0 28px',
      }}
    >
      {!isComplete && (
        <div
          className="animate-fade-in-up"
          style={{
            marginBottom: 22,
            borderRadius: 18,
            border: '1px solid var(--border-card)',
            background:
              status === 'deferred'
                ? 'linear-gradient(135deg, rgba(217,119,6,0.10), rgba(217,119,6,0.03))'
                : 'linear-gradient(135deg, rgba(2,132,199,0.10), rgba(14,165,233,0.04))',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background:
                  status === 'deferred'
                    ? 'rgba(217,119,6,0.14)'
                    : 'rgba(2,132,199,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {status === 'in_progress' ? (
                <CheckCircle size={18} style={{ color: 'var(--accent-primary)' }} />
              ) : (
                <Brain
                  size={18}
                  style={{ color: status === 'deferred' ? 'var(--warning)' : 'var(--accent-primary)' }}
                />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 220 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
                {status === 'deferred'
                  ? 'Your dashboard is showing generic data'
                  : status === 'in_progress'
                    ? `Profile ${onboardingPct}% complete — resume your setup`
                    : 'Set up your profile to unlock a personalized dashboard'}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
                {status === 'deferred'
                  ? 'Complete your investor profile to see personalized numbers, recommendations, and risk insights.'
                  : status === 'in_progress'
                    ? 'Your answers are saved. Resume and finish the remaining steps in under a minute.'
                    : 'Answer 21 quick questions and InvestIQ will personalize every number, recommendation, and signal you see.'}
              </p>
            </div>

            {status === 'in_progress' && (
              <div
                style={{
                  minWidth: 120,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 86,
                    height: 6,
                    borderRadius: 999,
                    background: 'var(--border-color)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${onboardingPct}%`,
                      height: '100%',
                      background: 'var(--gradient-accent)',
                      borderRadius: 999,
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 800 }}>
                  {onboardingPct}%
                </span>
              </div>
            )}

            <button
              onClick={() => navigate('/onboarding')}
              className="btn-primary"
              style={{ flexShrink: 0 }}
            >
              {status === 'in_progress' ? 'Resume Setup' : 'Complete Profile'}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      <div
        className="hero-panel animate-fade-in-up"
        style={{
          padding: 24,
          marginBottom: 24,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 0.95fr)',
          gap: 18,
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 12px',
              borderRadius: 999,
              background: 'var(--accent-primary-soft)',
              color: 'var(--accent-primary)',
              border: '1px solid var(--border-card)',
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            <Sparkles size={14} />
            AI-powered portfolio intelligence
          </div>

          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} 👋
          </p>

          <h1
            className="heading-display"
            style={{
              margin: '6px 0 8px',
              fontSize: 34,
              lineHeight: 1.1,
              color: 'var(--text-primary)',
            }}
          >
            Welcome back, <span className="gradient-text">{name}</span>
          </h1>

          <p
            style={{
              maxWidth: 700,
              margin: 0,
              fontSize: 14,
              color: 'var(--text-secondary)',
            }}
          >
            {isComplete
              ? `${personalizedData?.primaryGoal || 'Wealth growth'} · ${personalizedData?.experienceLevel || 'Investor'} · AI-backed signals, risk tracking, and opportunity monitoring`
              : 'A clean overview of your portfolio, AI signals, smart alerts, and market-moving news.'}
          </p>

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginTop: 18,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 12px',
                borderRadius: 12,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                fontSize: 12,
                color: 'var(--text-secondary)',
              }}
            >
              <Activity size={14} style={{ color: 'var(--success)' }} />
              <span style={{ fontWeight: 700, color: 'var(--success)' }}>Markets Open</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 12px',
                borderRadius: 12,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                fontSize: 12,
                color: 'var(--text-secondary)',
              }}
            >
              <Clock size={14} style={{ color: 'var(--accent-primary)' }} />
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 12px',
                borderRadius: 12,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                fontSize: 12,
                color: 'var(--text-secondary)',
              }}
            >
              <BarChart2 size={14} style={{ color: 'var(--accent-info)' }} />
              {marketMood}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>Portfolio snapshot</p>
              <div className="stat-number" style={{ marginTop: 8, fontSize: 32, color: 'var(--text-primary)' }}>
                {totalValueFmt}
              </div>
              <div
                style={{
                  marginTop: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 10px',
                  borderRadius: 999,
                  background: 'var(--success-soft)',
                  color: 'var(--success)',
                  border: '1px solid rgba(5,150,105,0.18)',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                <TrendingUp size={13} />
                +{dailyChange}% today
              </div>
            </div>

            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                background: 'var(--gradient-accent-soft)',
                border: '1px solid var(--border-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Briefcase size={22} style={{ color: 'var(--accent-primary)' }} />
            </div>
          </div>

          <MiniChart data={PORTFOLIO_POINTS} color="var(--accent-primary)" height={112} fillOpacity={0.18} />

          <div
            style={{
              marginTop: 14,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 10,
            }}
          >
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Invested</p>
              <p style={{ margin: '5px 0 0', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                ₹{totalInvested.toLocaleString('en-IN')}
              </p>
            </div>

            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>P&amp;L</p>
              <p style={{ margin: '5px 0 0', fontSize: 15, fontWeight: 700, color: pnlColor }}>
                {pnlFmt}
              </p>
            </div>

            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Weekly</p>
              <p style={{ margin: '5px 0 0', fontSize: 15, fontWeight: 700, color: 'var(--accent-info)' }}>
                +{weeklyChange}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <SummaryCard
          label="Portfolio Value"
          value={totalValueFmt}
          subtext="Live market-adjusted valuation"
          icon={Wallet}
          iconColor="var(--accent-primary)"
          iconBg="var(--accent-primary-soft)"
          trend={{
            icon: <TrendingUp size={13} />,
            label: `+${dailyChange}% today`,
            color: 'var(--success)',
            bg: 'var(--success-soft)',
            border: '1px solid rgba(5,150,105,0.18)',
          }}
          chartColor="var(--accent-primary)"
        />

        <SummaryCard
          label="Daily Return"
          value={`+${dailyChange}%`}
          subtext="+₹19,134 in today’s session"
          icon={TrendingUp}
          iconColor="var(--success)"
          iconBg="var(--success-soft)"
          trend={{
            icon: <ArrowUpRight size={13} />,
            label: `Weekly +${weeklyChange}%`,
            color: 'var(--accent-info)',
            bg: 'var(--accent-info-soft)',
            border: '1px solid rgba(37,99,235,0.16)',
          }}
        />

        <SummaryCard
          label={isComplete ? 'Total P&L' : 'Total Profit'}
          value={pnlFmt}
          subtext={isComplete ? `Invested ₹${(totalInvested / 1000).toFixed(0)}K` : 'Since inception'}
          icon={DollarSign}
          iconColor={pnlColor}
          iconBg={pnl >= 0 || !isComplete ? 'var(--success-soft)' : 'var(--error-soft)'}
        >
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: isComplete
                  ? `${Math.min((Math.abs(pnl) / Math.max(totalInvested, 1)) * 100 * 5, 100)}%`
                  : '62%',
                background: pnl >= 0 || !isComplete ? 'var(--gradient-success)' : 'var(--gradient-danger)',
              }}
            />
          </div>
          <p style={{ margin: '7px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>
            {isComplete
              ? `${((Math.abs(pnl) / Math.max(totalInvested, 1)) * 100).toFixed(1)}% overall return`
              : '62% to annual target'}
          </p>
        </SummaryCard>

        <div className="card card-depth animate-fade-in-up" style={{ padding: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                }}
              >
                Portfolio Risk
              </p>
              <div className="stat-number" style={{ marginTop: 8, fontSize: 30, color: 'var(--text-primary)' }}>
                {riskLabel}
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
                Collapse probability: {riskPercent}%
              </p>
            </div>

            <RiskRing percent={riskPercent} size={80} />
          </div>

          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 12,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-card)',
            }}
          >
            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Risk profile</p>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              Balanced allocation with moderate sector concentration and controlled downside exposure.
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.45fr) minmax(320px, 0.95fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card card-depth animate-fade-in-up" style={{ padding: 22 }}>
          <SectionHeader
            icon={BarChart2}
            title="Portfolio Growth"
            subtitle="30-day performance overview with holding-level movement"
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 220px',
              gap: 18,
              alignItems: 'stretch',
            }}
          >
            <div
              style={{
                padding: 18,
                borderRadius: 16,
                background: 'var(--gradient-accent-soft)',
                border: '1px solid var(--border-card)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginBottom: 14,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div className="stat-number" style={{ fontSize: 34, color: 'var(--text-primary)' }}>
                    ₹7,87,400
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--success)', fontWeight: 700 }}>
                    ↑ +₹87,400 total gain
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Invested</p>
                  <p style={{ margin: '5px 0 0', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹7,00,000
                  </p>
                </div>
              </div>

              <MiniChart data={PORTFOLIO_POINTS} color="var(--accent-primary)" height={200} fillOpacity={0.22} />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {HOLDINGS.map((h) => {
                const positive = h.change >= 0;
                return (
                  <div
                    key={h.ticker}
                    style={{
                      padding: 14,
                      borderRadius: 14,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-card)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 10,
                        alignItems: 'flex-start',
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                          {h.ticker}
                        </p>
                        <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>
                          {h.sector} · {h.weight}% weight
                        </p>
                      </div>

                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: positive ? 'var(--success)' : 'var(--error)',
                        }}
                      >
                        {positive ? '+' : ''}
                        {h.change}%
                      </span>
                    </div>

                    <p style={{ margin: '10px 0 6px', fontSize: 13, color: 'var(--text-secondary)' }}>
                      ₹{h.value.toLocaleString('en-IN')}
                    </p>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${h.weight}%`,
                          background: positive ? 'var(--gradient-success)' : 'var(--gradient-danger)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card card-depth animate-fade-in-up stagger-1" style={{ padding: 22 }}>
          <SectionHeader
            icon={Brain}
            title="AI Market Insights"
            subtitle="Signal confidence, risk, and reasoning"
          />

          <div
            style={{
              padding: 14,
              borderRadius: 16,
              background: 'var(--gradient-accent-soft)',
              border: '1px solid var(--border-card)',
              marginBottom: 14,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 999,
                background: 'var(--success-soft)',
                color: 'var(--success)',
                border: '1px solid rgba(5,150,105,0.18)',
                fontSize: 12,
                fontWeight: 800,
                marginBottom: 10,
              }}
            >
              <TrendingUp size={13} />
              OVERALL BUY SIGNAL
            </div>

            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
              Market breadth remains constructive with strong support from large-cap energy and resilient domestic flows.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {AI_INSIGHTS.map((ins, i) => {
              const signal = getSignalStyles(ins.action);

              return (
                <div
                  key={i}
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-card)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 10,
                      alignItems: 'center',
                      marginBottom: 10,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
                        {ins.ticker}
                      </span>
                      <span
                        style={{
                          padding: '4px 9px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 800,
                          color: signal.color,
                          background: signal.bg,
                          border: signal.border,
                        }}
                      >
                        {ins.action}
                      </span>
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      Confidence <strong style={{ color: 'var(--text-primary)' }}>{ins.confidence}%</strong>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {ins.reason}
                  </p>

                  <div
                    style={{
                      marginTop: 12,
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 8,
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Shield size={12} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Risk {ins.risk}%</span>
                    </div>

                    <div style={{ width: 92 }}>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${ins.risk}%`,
                            background:
                              ins.risk > 50
                                ? 'var(--gradient-danger)'
                                : ins.risk > 25
                                  ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'
                                  : 'var(--gradient-success)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 0.95fr) minmax(0, 0.95fr) minmax(0, 1.1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card card-depth animate-fade-in-up" style={{ padding: 20 }}>
          <SectionHeader icon={Zap} title="Live Alerts" subtitle="Risk and opportunity signals" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ALERTS.map((alert, i) => {
              const styles = getAlertStyles(alert.type);
              const Icon = alert.icon;

              return (
                <div
                  key={i}
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    background: styles.bg,
                    border: styles.border,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={15} style={{ color: styles.color }} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
                        {alert.title}
                      </p>
                      <p style={{ margin: '5px 0 0', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                        {alert.body}
                      </p>
                      <p style={{ margin: '7px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>{alert.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card card-depth animate-fade-in-up stagger-1" style={{ padding: 20 }}>
          <SectionHeader icon={Activity} title="Quick Simulation" subtitle="Project your returns instantly" />

          <div
            style={{
              padding: 14,
              borderRadius: 16,
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-card)',
              marginBottom: 14,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 12,
                marginBottom: 14,
              }}
            >
              {[
                {
                  label: 'Amount',
                  value:
                    isComplete && personalizedData?.investmentAmount
                      ? `₹${personalizedData.investmentAmount.toLocaleString('en-IN')}`
                      : '₹50,000',
                },
                { label: 'Duration', value: '12 months' },
                { label: 'Type', value: 'Mutual Fund' },
                { label: 'Risk', value: 'Medium' },
              ].map((item) => (
                <div key={item.label}>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleQuickSim}
              disabled={simLoading}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              <RefreshCw size={14} style={{ animation: simLoading ? 'spin 1s linear infinite' : 'none' }} />
              {simLoading ? 'Simulating…' : 'Run Simulation'}
            </button>
          </div>

          {simResult ? (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {[
                  {
                    label: 'Final Value',
                    value: `₹${simResult.final?.toLocaleString('en-IN')}`,
                    color: 'var(--text-primary)',
                  },
                  {
                    label: 'Profit',
                    value: `+₹${simResult.profit?.toLocaleString('en-IN')}`,
                    color: 'var(--success)',
                  },
                  {
                    label: 'Risk',
                    value: simResult.risk,
                    color: 'var(--warning)',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: 10,
                      borderRadius: 12,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-card)',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</p>
                    <p style={{ margin: '6px 0 0', fontSize: 13, fontWeight: 800, color: item.color }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {simResult.growth ? (
                <div
                  style={{
                    padding: 10,
                    borderRadius: 14,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-card)',
                  }}
                >
                  <MiniChart
                    data={simResult.growth.map((g) => ({ value: g.value }))}
                    color="var(--success)"
                    height={74}
                    fillOpacity={0.16}
                  />
                </div>
              ) : null}
            </>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '16px 6px 8px',
                color: 'var(--text-muted)',
                fontSize: 12,
              }}
            >
              Run a simulation to preview projected value, profit, and risk.
            </div>
          )}
        </div>

        <div className="card card-depth animate-fade-in-up stagger-2" style={{ padding: 20 }}>
          <SectionHeader icon={Target} title="Goal Planning" subtitle="SIP guidance and next target" />

          {latestGoal ? (
            <>
              <div
                style={{
                  padding: 18,
                  borderRadius: 16,
                  background: 'var(--gradient-accent-soft)',
                  border: '1px solid var(--border-card)',
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 10,
                    alignItems: 'flex-start',
                    marginBottom: 14,
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>Target Amount</p>
                    <div className="stat-number" style={{ marginTop: 8, fontSize: 28, color: 'var(--text-primary)' }}>
                      ₹{Number(latestGoal.target_amount).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '6px 10px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 800,
                      background: 'var(--success-soft)',
                      color: 'var(--success)',
                      border: '1px solid rgba(5,150,105,0.18)',
                    }}
                  >
                    {latestGoal.risk_level?.toUpperCase()} RISK
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-card)',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Monthly SIP</p>
                    <p style={{ margin: '5px 0 0', fontSize: 15, fontWeight: 800, color: 'var(--accent-primary)' }}>
                      ₹{Number(latestGoal.monthly_investment).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-card)',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Expected Return</p>
                    <p style={{ margin: '5px 0 0', fontSize: 15, fontWeight: 800, color: 'var(--success)' }}>
                      {latestGoal.expected_return}% p.a.
                    </p>
                  </div>
                </div>

                <div className="progress-bar" style={{ marginBottom: 6 }}>
                  <div className="progress-fill" style={{ width: '28%' }} />
                </div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>
                  28% progress · {latestGoal.time_period_months} month plan
                </p>
              </div>

              {latestGoal.ai_plan ? (
                <div
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-card)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Brain size={14} style={{ color: 'var(--accent-primary)' }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-primary)' }}>
                      AI Suggestion
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {latestGoal.ai_plan.slice(0, 190)}…
                  </p>
                </div>
              ) : null}
            </>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '28px 8px',
              }}
            >
              <Target size={34} style={{ color: 'var(--text-muted)', margin: '0 auto 10px' }} />
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
                No goals yet. Create your first investment goal.
              </p>
              <button
                onClick={() => navigate('/goals')}
                className="btn-primary"
                style={{ marginTop: 14 }}
              >
                Create Goal
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card card-depth animate-fade-in-up" style={{ padding: 22 }}>
        <SectionHeader
          icon={Newspaper}
          title="Smart News Feed"
          subtitle="Personalized market intelligence and sector movement"
          action={{ label: 'View all news', onClick: () => navigate('/news') }}
        />

        {newsLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  padding: 14,
                  borderRadius: 14,
                  border: '1px solid var(--border-card)',
                  background: 'var(--bg-secondary)',
                }}
              >
                <div className="skeleton" style={{ height: 12, width: '32%', marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: '76%', marginBottom: 14 }} />
                <div className="skeleton" style={{ height: 86, borderRadius: 12 }} />
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 12,
            }}
          >
            {news.map((article, i) => {
              const sector = article.sector || ['Markets', 'Finance', 'Economy', 'Banking', 'Energy'][i % 5];
              const sentiment = article.sentiment || ['positive', 'neutral', 'negative'][i % 3];

              const sentimentStyle =
                sentiment === 'positive'
                  ? {
                      background: 'var(--success-soft)',
                      color: 'var(--success)',
                      border: '1px solid rgba(5,150,105,0.18)',
                      label: 'Bullish',
                    }
                  : sentiment === 'negative'
                    ? {
                        background: 'var(--error-soft)',
                        color: 'var(--error)',
                        border: '1px solid rgba(220,38,38,0.16)',
                        label: 'Bearish',
                      }
                    : {
                        background: 'var(--accent-info-soft)',
                        color: 'var(--accent-info)',
                        border: '1px solid rgba(37,99,235,0.16)',
                        label: 'Neutral',
                      };

              return (
                <a
                  key={article.url || i}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      height: '100%',
                      padding: 14,
                      borderRadius: 14,
                      border: '1px solid var(--border-card)',
                      background: 'var(--bg-secondary)',
                      transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      e.currentTarget.style.borderColor = 'var(--border-strong)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'var(--border-card)';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        flexWrap: 'wrap',
                        marginBottom: 10,
                      }}
                    >
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: '0.05em',
                          background: 'var(--bg-tertiary)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border-card)',
                        }}
                      >
                        {sector}
                      </span>

                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 800,
                          color: sentimentStyle.color,
                          background: sentimentStyle.background,
                          border: sentimentStyle.border,
                        }}
                      >
                        {sentimentStyle.label}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        lineHeight: 1.45,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: 62,
                      }}
                    >
                      {article.title}
                    </p>

                    <div
                      style={{
                        marginTop: 14,
                        paddingTop: 12,
                        borderTop: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: 11,
                          color: 'var(--text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {article.source?.name || 'Financial News'}
                      </p>

                      {article.publishedAt ? (
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>
                          {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <Newspaper size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 10px' }} />
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>
              News loading failed. Make sure NEWSAPIKEY is set in server .env
            </p>
          </div>
        )}
      </div>
    </div>
  );
}