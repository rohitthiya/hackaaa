// src/components/ui/Input.jsx
export default function Input({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  disabled = false,
  name,
  autoComplete,
  className = '',
}) {
  return (
    <div style={{ marginBottom: 4 }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text-secondary)',
          }}
        >
          {label} {required && <span style={{ color: 'var(--accent-rose)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
              display: 'flex',
            }}
          >
            <Icon size={16} />
          </span>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`input-field ${className}`}
          style={{
            paddingLeft: Icon ? 38 : 14,
            borderColor: error ? 'var(--accent-rose)' : undefined,
          }}
        />
      </div>
      {error && (
        <p style={{ marginTop: 4, fontSize: 12, color: 'var(--accent-rose)' }}>{error}</p>
      )}
    </div>
  );
}
