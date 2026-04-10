// src/pages/GoalsPage.jsx
import { useState, useEffect } from 'react';
import { Target, Plus, Brain, Calendar, TrendingUp, ChevronDown, ChevronUp, MapPin, Lightbulb, Sparkles, CheckCircle } from 'lucide-react';
import { createGoal, getGoals } from '../api/goals';

const RISK_COLORS = { low: 'var(--accent-emerald)', medium: 'var(--accent-amber)', high: 'var(--accent-rose)' };

// ─── Parse ## Section headers from AI plan text ────────────────────────────
function parsePlan(text) {
  if (!text) return [];
  const sectionIcons = {
    'where to invest': MapPin,
    'why this works': Lightbulb,
    'what to expect': TrendingUp,
    'smart tips': Sparkles,
  };
  const sectionColors = {
    'where to invest': 'var(--accent-indigo)',
    'why this works': 'var(--accent-emerald)',
    'what to expect': 'var(--accent-amber)',
    'smart tips': 'var(--accent-rose)',
  };

  const sections = [];
  const parts = text.split(/^##\s+/m).filter(p => p.trim());

  for (const part of parts) {
    const lines = part.trim().split('\n');
    const heading = lines[0].trim().replace(/\*\*/g, '');
    const body = lines.slice(1).join('\n').trim().replace(/\*\*/g, '');
    if (!heading) continue;

    const key = Object.keys(sectionIcons).find(k => heading.toLowerCase().includes(k));
    sections.push({
      heading,
      body,
      Icon: key ? sectionIcons[key] : Brain,
      color: key ? sectionColors[key] : 'var(--accent-indigo)',
    });
  }

  // Fallback: if no sections parsed, return raw text in one block
  if (sections.length === 0 && text.trim()) {
    sections.push({ heading: 'AI Investment Plan', body: text.trim(), Icon: Brain, color: 'var(--accent-indigo)' });
  }

  return sections;
}

// ─── Render body text: numbered lists and normal paragraphs ───────────────
function PlanBody({ text }) {
  if (!text) return null;
  const lines = text.split('\n').filter(l => l.trim());
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {lines.map((line, i) => {
        const numbered = line.match(/^(\d+)\.\s+(.*)/);
        if (numbered) {
          return (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: 'rgba(99,102,241,0.15)', color: 'var(--accent-indigo)',
                fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{numbered[1]}</span>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0, paddingTop: 2 }}>
                {numbered[2]}
              </p>
            </div>
          );
        }
        return (
          <p key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

// ─── AI Plan accordion display ─────────────────────────────────────────────
function AIPlanDisplay({ plan }) {
  const sections = parsePlan(plan);
  if (sections.length === 0) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Brain size={14} style={{ color: 'var(--accent-indigo)' }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-indigo)' }}>AI Investment Plan</span>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'rgba(99,102,241,0.1)', color: 'var(--accent-indigo)', fontWeight: 600 }}>Personalized</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {sections.map(({ heading, body, Icon, color }, i) => (
          <div key={i} style={{
            background: 'var(--bg-tertiary)', borderRadius: 12, padding: 16,
            border: `1px solid ${color}20`,
            borderTop: `3px solid ${color}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={13} style={{ color }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {heading}
              </span>
            </div>
            <PlanBody text={body} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [form, setForm] = useState({ targetAmount: '', years: '', months: '', riskLevel: 'medium' });

  useEffect(() => {
    getGoals()
      .then(r => {
        const raw = Array.isArray(r) ? r : (Array.isArray(r.data) ? r.data : []);
        setGoals(raw);
        // Auto-expand first goal if it has an AI plan
        if (raw[0]?.ai_plan) setExpandedGoal(0);
      })
      .catch(() => setGoals([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.targetAmount || (!form.years && !form.months)) {
      setError('Please fill amount and at least one of years or months');
      return;
    }
    setFormLoading(true); setError('');
    try {
      const payload = {
        targetAmount: Number(form.targetAmount),
        riskLevel: form.riskLevel,
        ...(form.years && { years: Number(form.years) }),
        ...(form.months && !form.years && { months: Number(form.months) }),
      };
      const res = await createGoal(payload);
      const newGoal = Array.isArray(res) ? res[0] : (res.goal || res.data?.goal || res.data || res);
      setGoals(prev => [newGoal, ...prev]);
      setExpandedGoal(0); // auto-expand the new goal to show its AI plan
      setShowForm(false);
      setForm({ targetAmount: '', years: '', months: '', riskLevel: 'medium' });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create goal');
    } finally { setFormLoading(false); }
  };

  return (
    <div style={{ maxWidth: 980, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', margin: 0 }}>Investment Goals</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>AI-powered SIP planning with personalized strategy</p>
        </div>
        <button onClick={() => setShowForm(p => !p)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '10px 18px' }}>
          <Plus size={15} /> New Goal
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card animate-fade-in-up" style={{ padding: 24, marginBottom: 20, border: '1px solid rgba(99,102,241,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Brain size={18} style={{ color: 'var(--accent-indigo)' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Create New Goal</h3>
          </div>
          {error && (
            <div style={{ background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--accent-rose)' }}>{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Target Amount (₹) *</label>
                <input className="input-field" type="number" placeholder="e.g. 100000" value={form.targetAmount} onChange={e => setForm(p => ({ ...p, targetAmount: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Risk Level *</label>
                <select className="input-field" value={form.riskLevel} onChange={e => setForm(p => ({ ...p, riskLevel: e.target.value }))}>
                  <option value="low">Low — Conservative (8% p.a.)</option>
                  <option value="medium">Medium — Balanced (12% p.a.)</option>
                  <option value="high">High — Aggressive (16% p.a.)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Years</label>
                <input className="input-field" type="number" placeholder="e.g. 2" value={form.years} onChange={e => setForm(p => ({ ...p, years: e.target.value, months: '' }))} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, display: 'block', marginBottom: 6 }}>OR Months</label>
                <input className="input-field" type="number" placeholder="e.g. 18" value={form.months} onChange={e => setForm(p => ({ ...p, months: e.target.value, years: '' }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ fontSize: 14, padding: '10px 20px' }}>Cancel</button>
              <button type="submit" disabled={formLoading} className="btn-primary" style={{ flex: 1, fontSize: 14, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {formLoading
                  ? <><span className="spinner" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /></>
                  : null}
                {formLoading ? 'Generating AI Plan…' : <><Brain size={15} /> Generate AI Plan</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 16 }} />)}
        </div>
      ) : goals.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <Target size={44} style={{ color: 'var(--text-muted)', marginBottom: 14 }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>No goals yet</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Create your first investment goal and let AI generate a personalized plan</p>
          <button onClick={() => setShowForm(true)} className="btn-primary" style={{ fontSize: 13, padding: '10px 20px' }}>Create First Goal</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {goals.map((goal, i) => {
            const color = RISK_COLORS[goal.risk_level] || 'var(--accent-amber)';
            const isExpanded = expandedGoal === i;
            const progressPct = goal.progress_pct || 28;
            return (
              <div key={goal.id || i} className="card card-depth animate-fade-in-up" style={{ padding: 22, borderLeft: `3px solid ${color}` }}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Target size={21} style={{ color }} />
                    </div>
                    <div>
                      <p className="stat-number" style={{ fontSize: 24, color: 'var(--text-primary)' }}>
                        ₹{Number(goal.target_amount).toLocaleString('en-IN')}
                      </p>
                      <div style={{ display: 'flex', gap: 8, marginTop: 5 }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: `${color}15`, color, fontWeight: 700, border: `1px solid ${color}30` }}>
                          {goal.risk_level?.toUpperCase()} RISK
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Calendar size={10} /> {goal.time_period_months}m plan
                        </span>
                        {goal.ai_plan && (
                          <span style={{ fontSize: 11, color: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(99,102,241,0.08)', padding: '2px 8px', borderRadius: 99 }}>
                            <CheckCircle size={10} /> AI Plan Ready
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedGoal(isExpanded ? null : i)}
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-card)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}
                  >
                    {isExpanded ? <><ChevronUp size={14} /> Collapse</> : <><ChevronDown size={14} /> View Plan</>}
                  </button>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                  {[
                    { label: 'Monthly SIP', value: `₹${Number(goal.monthly_investment).toLocaleString('en-IN')}`, color: 'var(--accent-indigo)', Icon: TrendingUp },
                    { label: 'Expected Return', value: `${goal.expected_return}% p.a.`, color: 'var(--accent-emerald)', Icon: TrendingUp },
                    { label: 'Duration', value: `${goal.time_period_months} months`, color, Icon: Calendar },
                  ].map(({ label, value, color: c, Icon }) => (
                    <div key={label} style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: '12px 14px' }}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: c }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: isExpanded ? 4 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                    <span>Progress</span>
                    <span>{progressPct}% complete</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progressPct}%`, background: color }} />
                  </div>
                </div>

                {/* AI Plan — rendered with rich section cards */}
                {isExpanded && (
                  <AIPlanDisplay plan={goal.ai_plan} />
                )}

                {/* Expanded but no plan */}
                {isExpanded && !goal.ai_plan && (
                  <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: 'var(--bg-tertiary)', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                    AI plan not available for this goal.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
