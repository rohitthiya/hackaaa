// src/components/ui/Button.jsx
import LoadingSpinner from './LoadingSpinner';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  style = {},
}) {
  const sizeMap = { sm: '8px 14px', md: '11px 20px', lg: '14px 28px' };
  const fontMap = { sm: 13, md: 14, lg: 16 };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={variant === 'primary' ? `btn-primary ${className}` : `btn-secondary ${className}`}
      style={{
        padding: sizeMap[size],
        fontSize: fontMap[size],
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        opacity: disabled && !loading ? 0.5 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {loading && <LoadingSpinner size={16} />}
      {children}
    </button>
  );
}
