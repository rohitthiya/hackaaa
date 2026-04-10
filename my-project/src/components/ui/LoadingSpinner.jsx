// src/components/ui/LoadingSpinner.jsx
export default function LoadingSpinner({ size = 24, className = '' }) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '2.5px solid var(--border-color)',
        borderTop: '2.5px solid var(--accent-indigo)',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block',
      }}
    />
  );
}

export function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <LoadingSpinner size={40} />
        <p style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: 14 }}>Loading…</p>
      </div>
    </div>
  );
}
