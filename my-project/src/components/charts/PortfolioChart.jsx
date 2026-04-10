// src/components/charts/PortfolioChart.jsx
import { useState } from 'react';

const generateMockData = () => {
  const points = [];
  let val = 85000;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months.forEach((m) => {
    val += (Math.random() - 0.35) * 8000;
    val = Math.max(val, 60000);
    points.push({ label: m, value: Math.round(val) });
  });
  return points;
};

const DATA = generateMockData();

function toSvgPath(data, w, h, pad = 16) {
  const minV = Math.min(...data.map((d) => d.value));
  const maxV = Math.max(...data.map((d) => d.value));
  const range = maxV - minV || 1;
  const xStep = (w - pad * 2) / (data.length - 1);

  return data
    .map((d, i) => {
      const x = pad + i * xStep;
      const y = h - pad - ((d.value - minV) / range) * (h - pad * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function toAreaPath(data, w, h, pad = 16) {
  const line = toSvgPath(data, w, h, pad);
  return `${line} L${(w - pad).toFixed(1)},${h} L${pad},${h} Z`;
}

export default function PortfolioChart({ data = DATA, height = 200 }) {
  const [tooltip, setTooltip] = useState(null);
  const w = 600;
  const h = height;
  const pad = 20;

  const minV = Math.min(...data.map((d) => d.value));
  const maxV = Math.max(...data.map((d) => d.value));
  const range = maxV - minV || 1;
  const xStep = (w - pad * 2) / (data.length - 1);

  const getX = (i) => pad + i * xStep;
  const getY = (v) => h - pad - ((v - minV) / range) * (h - pad * 2);

  const linePath = toSvgPath(data, w, h, pad);
  const areaPath = toAreaPath(data, w, h, pad);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height, overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-indigo)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent-indigo)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path d={areaPath} fill="url(#chartGrad)" />
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent-indigo)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((frac) => {
          const y = h - pad - frac * (h - pad * 2);
          return (
            <line key={frac} x1={pad} y1={y} x2={w - pad} y2={y}
              stroke="var(--border-color)" strokeDasharray="4 4" />
          );
        })}
        {/* Hover dots */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.value);
          return (
            <g key={i}>
              <circle
                cx={x} cy={y} r={14}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setTooltip({ x, y, label: d.label, value: d.value })}
                onMouseLeave={() => setTooltip(null)}
              />
              {tooltip?.label === d.label && (
                <circle cx={x} cy={y} r={5} fill="var(--accent-indigo)" stroke="var(--bg-card)" strokeWidth="2" />
              )}
            </g>
          );
        })}
        {/* X labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={getX(i)}
            y={h - 2}
            textAnchor="middle"
            fontSize="11"
            fill="var(--text-muted)"
            fontFamily="Inter, sans-serif"
          >
            {d.label}
          </text>
        ))}
        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={tooltip.x - 46}
              y={tooltip.y - 38}
              width={92}
              height={28}
              rx={6}
              fill="var(--bg-tertiary)"
              stroke="var(--border-color)"
              strokeWidth="1"
            />
            <text x={tooltip.x} y={tooltip.y - 18} textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontFamily="Inter">
              {tooltip.label}
            </text>
            <text x={tooltip.x} y={tooltip.y - 6} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--text-primary)" fontFamily="Inter">
              ₹{tooltip.value.toLocaleString('en-IN')}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
