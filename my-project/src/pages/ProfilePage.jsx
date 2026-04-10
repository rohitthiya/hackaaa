// src/pages/ProfilePage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Bell, Moon, Sun, CheckCircle, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const RISK_OPTIONS = [
  { value: 'low', label: 'Conservative', desc: 'Safety first — FDs, bonds, low-risk ETFs', color: 'var(--accent-emerald)' },
  { value: 'medium', label: 'Moderate', desc: 'Balanced mix — equity + debt', color: 'var(--accent-amber)' },
  { value: 'high', label: 'Aggressive', desc: 'High growth — stocks, midcaps, crypto', color: 'var(--accent-rose)' },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [risk, setRisk] = useState('medium');
  const [notifications, setNotifications] = useState({ alerts: true, news: false, goals: true });
  const [saved, setSaved] = useState(false);

  const name = user?.user_metadata?.full_name || 'Investor';
  const email = user?.email || '—';
  const initials = name.slice(0, 2).toUpperCase();

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', margin: 0 }}>Profile & Settings</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <div className="card card-depth animate-fade-in-up" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Account Info</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
          <div style={{ width: 68, height: 68, borderRadius: 18, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: 'white', boxShadow: 'var(--shadow-accent)', flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}>{name}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{email}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: 'Full Name', value: name, icon: User },
            { label: 'Email Address', value: email, icon: Mail },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
              <div style={{ position: 'relative' }}>
                <Icon size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input className="input-field" defaultValue={value} style={{ paddingLeft: 34, fontSize: 13 }} readOnly />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk preference */}
      <div className="card card-depth animate-fade-in-up stagger-1" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <Shield size={18} style={{ color: 'var(--accent-indigo)' }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Risk Preference</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {RISK_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setRisk(opt.value)} style={{
              background: risk === opt.value ? `${opt.color}10` : 'var(--bg-tertiary)',
              border: `1.5px solid ${risk === opt.value ? opt.color : 'var(--border-card)'}`,
              borderRadius: 12, padding: '12px 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', transition: 'all 0.15s',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{opt.label}</span>
                  {risk === opt.value && <CheckCircle size={14} style={{ color: opt.color }} />}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{opt.desc}</p>
              </div>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: opt.color, flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="card card-depth animate-fade-in-up stagger-2" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <Bell size={18} style={{ color: 'var(--accent-indigo)' }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Notification Preferences</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'alerts', label: 'Risk Alerts', desc: 'Get notified about critical market risks and portfolio warnings' },
            { key: 'news', label: 'Market News', desc: 'Daily digest of relevant financial news' },
            { key: 'goals', label: 'Goal Reminders', desc: 'SIP due dates and goal milestone alerts' },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{label}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</p>
              </div>
              <button
                onClick={() => setNotifications(p => ({ ...p, [key]: !p[key] }))}
                style={{
                  width: 46, height: 26, borderRadius: 99, flexShrink: 0, cursor: 'pointer',
                  background: notifications[key] ? 'var(--gradient-accent)' : 'var(--bg-tertiary)',
                  border: `1px solid ${notifications[key] ? 'transparent' : 'var(--border-card)'}`,
                  position: 'relative', transition: 'all 0.2s',
                }}
              >
                <div style={{
                  position: 'absolute', top: 3,
                  left: notifications[key] ? 23 : 3,
                  width: 18, height: 18, borderRadius: '50%', background: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s',
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Theme toggle */}
      <div className="card card-depth animate-fade-in-up stagger-3" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isDark ? <Moon size={18} style={{ color: 'var(--accent-indigo)' }} /> : <Sun size={18} style={{ color: 'var(--accent-amber)' }} />}
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Toggle between themes</p>
            </div>
          </div>
          <button onClick={toggleTheme} style={{
            padding: '8px 18px', borderRadius: 10, cursor: 'pointer',
            background: 'var(--gradient-accent)', color: 'white', border: 'none', fontSize: 13, fontWeight: 600,
          }}>
            Switch to {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* Save + Logout */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleSave} className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {saved ? <><CheckCircle size={16} /> Saved!</> : 'Save Preferences'}
        </button>
        <button onClick={handleLogout} style={{
          padding: '12px 20px', borderRadius: 10, cursor: 'pointer',
          background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.25)',
          color: 'var(--accent-rose)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );
}
