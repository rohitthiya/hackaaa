// src/components/layout/Navbar.jsx
import { Sun, Moon, Bell, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ pageTitle }) {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Investor';
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <header style={{
      height: 60,
      background: 'var(--bg-navbar)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* Page title */}
      <div style={{ flex: '0 0 auto', marginRight: 8 }}>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          {pageTitle}
        </h1>
      </div>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 340, position: 'relative' }}>
        <Search size={15} style={{
          position: 'absolute', left: 12, top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
        }} />
        <input
          className="input-field"
          placeholder="Search markets, stocks…"
          style={{ paddingLeft: 36, height: 36, fontSize: 13 }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Notifications */}
      <button style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'var(--bg-input)', border: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', position: 'relative',
      }}>
        <Bell size={16} style={{ color: 'var(--text-secondary)' }} />
        <span style={{
          position: 'absolute', top: 7, right: 7,
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--accent-rose)',
          border: '1.5px solid var(--bg-navbar)',
        }} />
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--bg-input)', border: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'transform 0.2s',
        }}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark
          ? <Sun size={16} style={{ color: 'var(--accent-amber)' }} />
          : <Moon size={16} style={{ color: 'var(--accent-indigo)' }} />
        }
      </button>

      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'var(--gradient-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: 'white',
          boxShadow: 'var(--shadow-accent)',
        }}>
          {initials}
        </div>
        <div style={{ display: 'none' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</p>
        </div>
      </div>
    </header>
  );
}
