// src/pages/SignupPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Zap, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const pwdStrength = (() => {
    const p = form.password;
    if (p.length === 0) return 0;
    if (p.length < 6) return 1;
    if (p.length < 10) return 2;
    return 3;
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await signup(form);
      if (res.data?.needsEmailConfirmation) {
        setSuccess(true);
      } else {
        // Go directly to onboarding — the time-choice gate lives there
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-hero)', padding: 24 }}>
      <div className="card animate-fade-in-up" style={{ width: '100%', maxWidth: 400, padding: 40, textAlign: 'center' }}>
        <CheckCircle size={52} style={{ color: 'var(--accent-emerald)', marginBottom: 16 }} />
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Check your email!</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
          We sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{form.email}</strong>. Click it to activate your account.
        </p>
        <Link to="/login" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 10, background: 'var(--gradient-accent)', color: 'white', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
          Go to Login
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-hero)', padding: 24 }}>
      <div style={{ position: 'fixed', top: '15%', right: '15%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(124,58,237,0.07)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div className="card animate-fade-in-up" style={{ width: '100%', maxWidth: 440, padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: 'var(--shadow-accent)' }}>
            <Zap size={22} color="white" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', margin: 0 }}>Create account</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Start your AI-powered investing journey</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: 13, color: 'var(--accent-rose)' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input name="fullName" required value={form.fullName} onChange={handleChange} placeholder="John Doe" className="input-field" style={{ paddingLeft: 38 }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input name="email" type="email" required autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input-field" style={{ paddingLeft: 38 }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input name="password" type={showPwd ? 'text' : 'password'} required value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className="input-field" style={{ paddingLeft: 38, paddingRight: 42 }} />
              <button type="button" onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {form.password.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= pwdStrength ? (pwdStrength === 1 ? 'var(--accent-rose)' : pwdStrength === 2 ? 'var(--accent-amber)' : 'var(--accent-emerald)') : 'var(--border-color)', transition: 'background 0.3s' }} />
                  ))}
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{['', 'Weak', 'Moderate', 'Strong'][pwdStrength]} password</p>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, padding: '12px' }}>
            {loading ? 'Creating account…' : 'Get Started'} {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-indigo)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 10 }}>
          <Link to="/" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
