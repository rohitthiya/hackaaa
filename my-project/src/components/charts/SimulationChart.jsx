// src/components/charts/SimulationChart.jsx
export default function SimulationChart({ data = [], height = 120 }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Run a simulation to see projection</p>
      </div>
    );
  }

  const w = 500;
  const h = height;
  const pad = 10;
  const values = data.map((d) => d.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;
  const xStep = (w - pad * 2) / (data.length - 1);
  const getX = (i) => pad + i * xStep;
  const getY = (v) => h - pad - ((v - minV) / range) * (h - pad * 2);

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${getX(i).toFixed(1)},${getY(d.value).toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L${(w - pad).toFixed(1)},${h} L${pad},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      <defs>
        <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-emerald)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent-emerald)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#simGrad)" />
      <path d={linePath} fill="none" stroke="var(--accent-emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Start and end dots */}
      {data.length > 0 && (
        <>
          <circle cx={getX(0)} cy={getY(data[0].value)} r={4} fill="var(--accent-emerald)" opacity={0.6} />
          <circle cx={getX(data.length - 1)} cy={getY(data[data.length - 1].value)} r={5} fill="var(--accent-emerald)" />
        </>
      )}
    </svg>
  );
}
