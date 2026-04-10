// src/components/ui/Badge.jsx
const variants = {
  buy: 'badge-buy',
  sell: 'badge-sell',
  hold: 'badge-hold',
  success: 'badge-buy',
  danger: 'badge-sell',
  warning: 'badge-hold',
};

export default function Badge({ children, variant = 'hold', className = '' }) {
  return (
    <span
      className={`${variants[variant] || ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 10px',
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
    >
      {children}
    </span>
  );
}
