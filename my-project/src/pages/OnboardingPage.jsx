// src/pages/OnboardingPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, ChevronLeft, ChevronRight, CheckCircle, Plus, Trash2,
  User, DollarSign, Shield, Target, TrendingUp, Brain, BarChart2,
} from 'lucide-react';
import { useOnboarding } from '../context/OnboardingContext';
import { saveProgress } from '../api/profile';
import { Clock, ArrowRight } from 'lucide-react';

/* ─── Question Definition ─────────────────────────────────────────────── */
// Returns the ordered list of question IDs, skipping conditional ones
function getQuestionFlow(answers) {
  const flow = [
    'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7',
    ...(answers.hasLiabilities === true ? ['q8'] : []),
    'q9',
    ...(answers.hasExistingInvestments === true ? ['q10'] : []),
    'q11', 'q12', 'q13',
    'q14', 'q15', 'q16',
    'q17', 'q18',
    ...(answers.hasInvestedBefore === true ? ['q19'] : []),
    'q20', 'q21',
  ];
  return flow;
}

const SECTIONS = [
  { id: 1, label: 'Basic Profile', icon: User, qs: ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10'] },
  { id: 2, label: 'Investment Goals', icon: Target, qs: ['q11','q12','q13'] },
  { id: 3, label: 'Risk Tolerance', icon: Shield, qs: ['q14','q15','q16'] },
  { id: 4, label: 'Experience', icon: Brain, qs: ['q17','q18','q19','q20','q21'] },
];

function getSectionForQ(qid) {
  return SECTIONS.find(s => s.qs.includes(qid)) || SECTIONS[0];
}

const LIABILITY_TYPES = [
  'Personal loan', 'Education loan', 'Home loan', 'Credit card debt', 'Vehicle loan', 'Other',
];
const INVESTMENT_TYPES = [
  'Stocks', 'Mutual Funds', 'ETFs', 'Bonds', 'Gold', 'Real Estate', 'Crypto', 'Fixed Deposits', 'Other',
];
const ASSET_TYPES = ['Stocks', 'Mutual Funds', 'ETFs', 'Bonds', 'Gold', 'Real Estate', 'Crypto'];

/* ─── Reusable sub-components ────────────────────────────────────────────── */
function OptionButton({ selected, onClick, color = 'var(--accent-indigo)', children, accent }) {
  const c = accent || color;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '14px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
        width: '100%', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s',
        background: selected ? `${c}12` : 'var(--bg-tertiary)',
        border: `1.5px solid ${selected ? c : 'var(--border-card)'}`,
        color: selected ? c : 'var(--text-secondary)',
        fontWeight: selected ? 600 : 400, fontSize: 14,
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected ? c : 'var(--border-color)'}`,
        background: selected ? c : 'transparent', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
      </div>
      {children}
    </button>
  );
}

function ChipButton({ active, onClick, color = 'var(--accent-indigo)', children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13,
        transition: 'all 0.15s', fontWeight: active ? 600 : 400,
        background: active ? `${color}12` : 'var(--bg-tertiary)',
        border: `1.5px solid ${active ? color : 'var(--border-card)'}`,
        color: active ? color : 'var(--text-secondary)',
      }}
    >
      {active && '✓ '}{children}
    </button>
  );
}

function CurrencyInput({ label, value, onChange, placeholder = 'e.g. 50000', required }) {
  return (
    <div>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>{label}{required && <span style={{ color: 'var(--accent-rose)' }}> *</span>}</label>}
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, fontWeight: 700, color: 'var(--text-muted)' }}>₹</span>
        <input
          type="number" min="0"
          className="input-field"
          style={{ paddingLeft: 28 }}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const navigate = useNavigate();
  const { answers, step: savedStep, status, updateAnswers, advance, complete, defer } = useOnboarding();

  // Show intro gate only for genuinely new users (step=0 and not in_progress)
  const isResuming = savedStep > 0;
  const [showIntro, setShowIntro] = useState(() => !isResuming && status !== 'in_progress');
  const [deferring, setDeferring] = useState(false);

  // Local state for the current question index within the flow
  const flow = getQuestionFlow(answers);
  const [qIndex, setQIndex] = useState(() => {
    // Resume from saved step, clamped to current flow length
    const s = typeof savedStep === 'number' ? savedStep : 0;
    return Math.min(s, flow.length - 1);
  });

  // Animation state
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('forward'); // 'forward' | 'backward'
  const [localAnswers, setLocalAnswers] = useState(answers);
  const [errors, setErrors] = useState({});
  const [autoSaveCount, setAutoSaveCount] = useState(0);

  const currentQId = flow[qIndex];
  const isLast = qIndex === flow.length - 1;
  const section = getSectionForQ(currentQId);
  const progress = ((qIndex + 1) / flow.length) * 100;

  // Keep localAnswers in sync when context answers update externally
  useEffect(() => {
    setLocalAnswers(prev => ({ ...answers, ...prev }));
  }, []);

  const update = (key, val) => {
    setLocalAnswers(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  // ─── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    switch (currentQId) {
      case 'q1': if (!localAnswers.ageGroup) errs.ageGroup = 'Please select your age group'; break;
      case 'q2': if (!localAnswers.monthlyIncome || Number(localAnswers.monthlyIncome) <= 0) errs.monthlyIncome = 'Please enter a valid income'; break;
      case 'q3': if (!localAnswers.monthlySavings) errs.monthlySavings = 'Enter your monthly savings (enter 0 if none)'; break;
      case 'q4': if (!localAnswers.totalSavings) errs.totalSavings = 'Enter available capital (enter 0 if none)'; break;
      case 'q5': if (localAnswers.hasEmergencyFund === null) errs.hasEmergencyFund = 'Please select an option'; break;
      case 'q6': if (!localAnswers.investmentAmount || Number(localAnswers.investmentAmount) <= 0) errs.investmentAmount = 'Enter the amount you can invest'; break;
      case 'q7': if (localAnswers.hasLiabilities === null) errs.hasLiabilities = 'Please select an option'; break;
      case 'q8':
        if (!localAnswers.liabilities || localAnswers.liabilities.length === 0) errs.liabilities = 'Add at least one liability';
        else {
          const hasEmpty = localAnswers.liabilities.some(l => !l.amount || Number(l.amount) <= 0);
          if (hasEmpty) errs.liabilities = 'Please enter an amount for each liability';
        }
        break;
      case 'q9': if (localAnswers.hasExistingInvestments === null) errs.hasExistingInvestments = 'Please select an option'; break;
      case 'q10':
        if (!localAnswers.existingInvestments || localAnswers.existingInvestments.length === 0) errs.existingInvestments = 'Add at least one investment';
        else {
          const hasEmpty = localAnswers.existingInvestments.some(inv => !inv.type || !inv.name || !inv.amountInvested || Number(inv.amountInvested) <= 0);
          if (hasEmpty) errs.existingInvestments = 'Complete all required fields for each investment';
        }
        break;
      case 'q11': if (!localAnswers.primaryGoal) errs.primaryGoal = 'Select your primary goal'; break;
      case 'q12': if (!localAnswers.investmentHorizon) errs.investmentHorizon = 'Select your time horizon'; break;
      case 'q13': if (!localAnswers.preferredAssetTypes?.length) errs.preferredAssetTypes = 'Select at least one asset type'; break;
      case 'q14': if (!localAnswers.lossReaction) errs.lossReaction = 'Please select an option'; break;
      case 'q15': if (!localAnswers.priority) errs.priority = 'Please select an option'; break;
      case 'q16': if (!localAnswers.marketComfort) errs.marketComfort = 'Please select an option'; break;
      case 'q17': if (!localAnswers.experienceLevel) errs.experienceLevel = 'Select your experience level'; break;
      case 'q18': if (localAnswers.hasInvestedBefore === null) errs.hasInvestedBefore = 'Please select an option'; break;
      case 'q19': if (!localAnswers.previousInvestments?.length) errs.previousInvestments = 'Select at least one option'; break;
      case 'q20': if (!localAnswers.marketTrackingFrequency) errs.marketTrackingFrequency = 'Select how often you track markets'; break;
      case 'q21': if (!localAnswers.understoodInstruments?.length) errs.understoodInstruments = 'Select all that you understand'; break;
    }
    return errs;
  };

  // ─── Navigation ──────────────────────────────────────────────────────────
  const goNext = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    updateAnswers(localAnswers);

    if (isLast) {
      await complete(localAnswers);
      navigate('/dashboard');
      return;
    }

    setDirection('forward');
    setAnimating(true);
    setTimeout(() => {
      const newIndex = qIndex + 1;
      setQIndex(newIndex);
      setErrors({});
      setAnimating(false);
      setAutoSaveCount(prev => {
        const next = prev + 1;
        // Auto-save every 3 questions
        if (next % 3 === 0) {
          saveProgress(newIndex, localAnswers, 'in_progress').catch(() => {});
        }
        return next;
      });
      advance(newIndex, localAnswers, false);
    }, 220);
  };

  const goBack = () => {
    if (qIndex === 0) return;
    updateAnswers(localAnswers);
    setDirection('backward');
    setAnimating(true);
    setTimeout(() => {
      setQIndex(q => q - 1);
      setErrors({});
      setAnimating(false);
    }, 220);
  };

  // ─── Question Renderers ──────────────────────────────────────────────────
  const renderQ = () => {
    switch (currentQId) {
      case 'q1': return (
        <div>
          <h2 style={qTitle}>What is your age group?</h2>
          <p style={qSub}>This helps us tailor investment recommendations to your life stage.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {['Under 18', '18–25', '26–40', '40+'].map(opt => (
              <OptionButton key={opt} selected={localAnswers.ageGroup === opt} onClick={() => update('ageGroup', opt)}>{opt}</OptionButton>
            ))}
          </div>
          {errors.ageGroup && <p style={errStyle}>{errors.ageGroup}</p>}
        </div>
      );

      case 'q2': return (
        <div>
          <h2 style={qTitle}>What is your monthly income?</h2>
          <p style={qSub}>Helps us understand what investment amounts are realistic for you.</p>
          <div style={{ marginTop: 20 }}>
            <CurrencyInput value={localAnswers.monthlyIncome} onChange={v => update('monthlyIncome', v)} placeholder="e.g. 75000" required />
            {errors.monthlyIncome && <p style={errStyle}>{errors.monthlyIncome}</p>}
          </div>
        </div>
      );

      case 'q3': return (
        <div>
          <h2 style={qTitle}>How much do you save per month?</h2>
          <p style={qSub}>Enter 0 if you haven't started saving yet — no judgement.</p>
          <div style={{ marginTop: 20 }}>
            <CurrencyInput value={localAnswers.monthlySavings} onChange={v => update('monthlySavings', v)} placeholder="e.g. 15000" required />
            {errors.monthlySavings && <p style={errStyle}>{errors.monthlySavings}</p>}
          </div>
        </div>
      );

      case 'q4': return (
        <div>
          <h2 style={qTitle}>What is your total available investment capital?</h2>
          <p style={qSub}>Total savings or liquid funds you can invest right now.</p>
          <div style={{ marginTop: 20 }}>
            <CurrencyInput value={localAnswers.totalSavings} onChange={v => update('totalSavings', v)} placeholder="e.g. 200000" required />
            {errors.totalSavings && <p style={errStyle}>{errors.totalSavings}</p>}
          </div>
        </div>
      );

      case 'q5': return (
        <div>
          <h2 style={qTitle}>Do you have an emergency fund?</h2>
          <p style={qSub}>An emergency fund is 3–6 months of expenses saved separately.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            <OptionButton selected={localAnswers.hasEmergencyFund === true} onClick={() => update('hasEmergencyFund', true)} accent="var(--accent-emerald)">Yes, I have one</OptionButton>
            <OptionButton selected={localAnswers.hasEmergencyFund === false} onClick={() => update('hasEmergencyFund', false)} accent="var(--accent-rose)">No, not yet</OptionButton>
          </div>
          {errors.hasEmergencyFund && <p style={errStyle}>{errors.hasEmergencyFund}</p>}
        </div>
      );

      case 'q6': return (
        <div>
          <h2 style={qTitle}>How much would you like to invest?</h2>
          <p style={qSub}>The amount you're ready to put into the market initially.</p>
          <div style={{ marginTop: 20 }}>
            <CurrencyInput value={localAnswers.investmentAmount} onChange={v => update('investmentAmount', v)} placeholder="e.g. 50000" required />
            {errors.investmentAmount && <p style={errStyle}>{errors.investmentAmount}</p>}
          </div>
        </div>
      );

      case 'q7': return (
        <div>
          <h2 style={qTitle}>Do you currently have any liabilities?</h2>
          <p style={qSub}>Loans, credit card debt, or any ongoing payments.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            <OptionButton selected={localAnswers.hasLiabilities === false} onClick={() => update('hasLiabilities', false)} accent="var(--accent-emerald)">No, I'm debt-free</OptionButton>
            <OptionButton selected={localAnswers.hasLiabilities === true} onClick={() => update('hasLiabilities', true)} accent="var(--accent-amber)">Yes, I have some</OptionButton>
          </div>
          {errors.hasLiabilities && <p style={errStyle}>{errors.hasLiabilities}</p>}
        </div>
      );

      case 'q8': return (
        <div>
          <h2 style={qTitle}>Tell us about your liabilities</h2>
          <p style={qSub}>Select each type and enter the exact outstanding amount.</p>
          <div style={{ marginTop: 20 }}>
            {/* Type selector */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {LIABILITY_TYPES.map(type => {
                const active = localAnswers.liabilities?.some(l => l.type === type);
                return (
                  <ChipButton key={type} active={active} color="var(--accent-amber)"
                    onClick={() => {
                      const current = localAnswers.liabilities || [];
                      const exists = current.find(l => l.type === type);
                      if (exists) {
                        update('liabilities', current.filter(l => l.type !== type));
                      } else {
                        update('liabilities', [...current, { type, amount: '' }]);
                      }
                    }}
                  >{type}</ChipButton>
                );
              })}
            </div>
            {/* Amount inputs */}
            {localAnswers.liabilities?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {localAnswers.liabilities.map((l, i) => (
                  <div key={l.type} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, width: 130, flexShrink: 0 }}>{l.type}</span>
                    <div style={{ flex: 1 }}>
                      <CurrencyInput
                        value={l.amount}
                        onChange={v => {
                          const updated = [...localAnswers.liabilities];
                          updated[i] = { ...updated[i], amount: v };
                          update('liabilities', updated);
                        }}
                        placeholder="Amount"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {errors.liabilities && <p style={errStyle}>{errors.liabilities}</p>}
          </div>
        </div>
      );

      case 'q9': return (
        <div>
          <h2 style={qTitle}>Do you currently have any investments?</h2>
          <p style={qSub}>Stocks, mutual funds, crypto, FDs, or anything else.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            <OptionButton selected={localAnswers.hasExistingInvestments === false} onClick={() => update('hasExistingInvestments', false)} accent="var(--accent-indigo)">No, I'm starting fresh</OptionButton>
            <OptionButton selected={localAnswers.hasExistingInvestments === true} onClick={() => update('hasExistingInvestments', true)} accent="var(--accent-emerald)">Yes, I have existing investments</OptionButton>
          </div>
          {errors.hasExistingInvestments && <p style={errStyle}>{errors.hasExistingInvestments}</p>}
        </div>
      );

      case 'q10': return (
        <InvestmentEntry
          investments={localAnswers.existingInvestments || []}
          onChange={v => update('existingInvestments', v)}
          error={errors.existingInvestments}
        />
      );

      case 'q11': return (
        <div>
          <h2 style={qTitle}>What is your primary investment goal?</h2>
          <p style={qSub}>Choose the goal that matters most to you right now.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {['Wealth growth', 'Saving for education', 'Retirement', 'Short-term gains', 'Buying a house', 'Passive income', 'Emergency security'].map(g => (
              <OptionButton key={g} selected={localAnswers.primaryGoal === g} onClick={() => update('primaryGoal', g)}>{g}</OptionButton>
            ))}
          </div>
          {errors.primaryGoal && <p style={errStyle}>{errors.primaryGoal}</p>}
        </div>
      );

      case 'q12': return (
        <div>
          <h2 style={qTitle}>What is your investment time horizon?</h2>
          <p style={qSub}>How long are you comfortable keeping your money invested?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {['Less than 1 year', '1–3 years', '3–5 years', '5+ years'].map(h => (
              <OptionButton key={h} selected={localAnswers.investmentHorizon === h} onClick={() => update('investmentHorizon', h)}>{h}</OptionButton>
            ))}
          </div>
          {errors.investmentHorizon && <p style={errStyle}>{errors.investmentHorizon}</p>}
        </div>
      );

      case 'q13': return (
        <div>
          <h2 style={qTitle}>Which investment types interest you?</h2>
          <p style={qSub}>Select all that appeal to you — this shapes your personalized recommendations.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
            {ASSET_TYPES.map(t => (
              <ChipButton key={t} active={localAnswers.preferredAssetTypes?.includes(t)}
                onClick={() => {
                  const cur = localAnswers.preferredAssetTypes || [];
                  update('preferredAssetTypes', cur.includes(t) ? cur.filter(x => x !== t) : [...cur, t]);
                }}
              >{t}</ChipButton>
            ))}
          </div>
          {errors.preferredAssetTypes && <p style={errStyle}>{errors.preferredAssetTypes}</p>}
        </div>
      );

      case 'q14': return (
        <div>
          <h2 style={qTitle}>If your portfolio dropped 20%, what would you do?</h2>
          <p style={qSub}>Be honest — this helps us calibrate your risk tolerance accurately.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {[
              { val: 'sell', label: 'Sell everything — I can\'t handle the loss', accent: 'var(--accent-rose)' },
              { val: 'wait', label: 'Wait and watch — I\'d hold my position', accent: 'var(--accent-amber)' },
              { val: 'buy', label: 'Buy more — I see it as an opportunity', accent: 'var(--accent-emerald)' },
            ].map(o => (
              <OptionButton key={o.val} selected={localAnswers.lossReaction === o.val} onClick={() => update('lossReaction', o.val)} accent={o.accent}>{o.label}</OptionButton>
            ))}
          </div>
          {errors.lossReaction && <p style={errStyle}>{errors.lossReaction}</p>}
        </div>
      );

      case 'q15': return (
        <div>
          <h2 style={qTitle}>What matters more to you?</h2>
          <p style={qSub}>This defines your core investment philosophy.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {[
              { val: 'safety', label: 'Safety of money above all else', accent: 'var(--accent-emerald)' },
              { val: 'balanced', label: 'Balanced growth — some risk is okay', accent: 'var(--accent-indigo)' },
              { val: 'returns', label: 'High returns — I accept higher risk', accent: 'var(--accent-rose)' },
            ].map(o => (
              <OptionButton key={o.val} selected={localAnswers.priority === o.val} onClick={() => update('priority', o.val)} accent={o.accent}>{o.label}</OptionButton>
            ))}
          </div>
          {errors.priority && <p style={errStyle}>{errors.priority}</p>}
        </div>
      );

      case 'q16': return (
        <div>
          <h2 style={qTitle}>How comfortable are you with market fluctuations?</h2>
          <p style={qSub}>Market movements are normal — how do they affect you emotionally?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {[
              { val: 'not', label: 'Not comfortable — I prefer stable returns', accent: 'var(--accent-rose)' },
              { val: 'somewhat', label: 'Somewhat comfortable — I can tolerate some swings', accent: 'var(--accent-amber)' },
              { val: 'very', label: 'Very comfortable — I understand volatility', accent: 'var(--accent-emerald)' },
            ].map(o => (
              <OptionButton key={o.val} selected={localAnswers.marketComfort === o.val} onClick={() => update('marketComfort', o.val)} accent={o.accent}>{o.label}</OptionButton>
            ))}
          </div>
          {errors.marketComfort && <p style={errStyle}>{errors.marketComfort}</p>}
        </div>
      );

      case 'q17': return (
        <div>
          <h2 style={qTitle}>What is your investment experience level?</h2>
          <p style={qSub}>Be honest — this affects the language and complexity of our recommendations.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {[
              { val: 'beginner', label: 'Beginner — I\'m just starting out', accent: 'var(--accent-emerald)' },
              { val: 'intermediate', label: 'Intermediate — I understand the basics', accent: 'var(--accent-amber)' },
              { val: 'advanced', label: 'Advanced — I actively track and manage investments', accent: 'var(--accent-indigo)' },
            ].map(o => (
              <OptionButton key={o.val} selected={localAnswers.experienceLevel === o.val} onClick={() => update('experienceLevel', o.val)} accent={o.accent}>{o.label}</OptionButton>
            ))}
          </div>
          {errors.experienceLevel && <p style={errStyle}>{errors.experienceLevel}</p>}
        </div>
      );

      case 'q18': return (
        <div>
          <h2 style={qTitle}>Have you invested before?</h2>
          <p style={qSub}>Any type of investment counts — FDs, stocks, mutual funds, etc.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            <OptionButton selected={localAnswers.hasInvestedBefore === false} onClick={() => update('hasInvestedBefore', false)} accent="var(--accent-indigo)">No, this is my first time</OptionButton>
            <OptionButton selected={localAnswers.hasInvestedBefore === true} onClick={() => update('hasInvestedBefore', true)} accent="var(--accent-emerald)">Yes, I have invested before</OptionButton>
          </div>
          {errors.hasInvestedBefore && <p style={errStyle}>{errors.hasInvestedBefore}</p>}
        </div>
      );

      case 'q19': return (
        <div>
          <h2 style={qTitle}>Where have you invested before?</h2>
          <p style={qSub}>Select all that apply.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
            {['Stocks', 'Crypto', 'Mutual Funds', 'ETFs', 'Bonds', 'Real Estate', 'Fixed Deposits'].map(t => (
              <ChipButton key={t}
                active={localAnswers.previousInvestments?.includes(t)}
                onClick={() => {
                  const cur = localAnswers.previousInvestments || [];
                  update('previousInvestments', cur.includes(t) ? cur.filter(x => x !== t) : [...cur, t]);
                }}
              >{t}</ChipButton>
            ))}
          </div>
          {errors.previousInvestments && <p style={errStyle}>{errors.previousInvestments}</p>}
        </div>
      );

      case 'q20': return (
        <div>
          <h2 style={qTitle}>How often do you track financial markets?</h2>
          <p style={qSub}>This affects the frequency of alerts and updates we send you.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {[
              { val: 'rarely', label: 'Rarely — monthly or less', accent: 'var(--accent-emerald)' },
              { val: 'sometimes', label: 'Sometimes — a few times a week', accent: 'var(--accent-amber)' },
              { val: 'daily', label: 'Daily — I check markets every day', accent: 'var(--accent-indigo)' },
            ].map(o => (
              <OptionButton key={o.val} selected={localAnswers.marketTrackingFrequency === o.val} onClick={() => update('marketTrackingFrequency', o.val)} accent={o.accent}>{o.label}</OptionButton>
            ))}
          </div>
          {errors.marketTrackingFrequency && <p style={errStyle}>{errors.marketTrackingFrequency}</p>}
        </div>
      );

      case 'q21': return (
        <div>
          <h2 style={qTitle}>Which of these do you understand?</h2>
          <p style={qSub}>Select all you're comfortable with — be honest, it only helps us help you.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
            {['Stocks', 'Mutual Funds', 'ETFs', 'Crypto', 'Bonds', 'SIPs', 'Index funds', 'REITs'].map(t => (
              <ChipButton key={t}
                active={localAnswers.understoodInstruments?.includes(t)}
                onClick={() => {
                  const cur = localAnswers.understoodInstruments || [];
                  update('understoodInstruments', cur.includes(t) ? cur.filter(x => x !== t) : [...cur, t]);
                }}
              >{t}</ChipButton>
            ))}
          </div>
          {errors.understoodInstruments && <p style={errStyle}>{errors.understoodInstruments}</p>}
        </div>
      );

      default: return null;
    }
  };

  const animStyle = {
    opacity: animating ? 0 : 1,
    transform: animating
      ? (direction === 'forward' ? 'translateX(24px)' : 'translateX(-24px)')
      : 'translateX(0)',
    transition: 'opacity 0.22s ease, transform 0.22s ease',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--gradient-hero)', padding: '24px 24px 48px' }}>
      {/* Glow orbs */}
      <div style={{ position: 'fixed', top: '5%', left: '3%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(99,102,241,0.07)', filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '5%', width: 260, height: 260, borderRadius: '50%', background: 'rgba(52,211,153,0.05)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      {/* ── Time-choice intro gate (new users only) ── */}
      {showIntro && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--gradient-hero)', padding: 24,
        }}>
          <div className="card animate-fade-in-up" style={{ width: '100%', maxWidth: 500, padding: 44, textAlign: 'center' }}>
            {/* Icon */}
            <div style={{ width: 68, height: 68, borderRadius: 20, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: 'var(--shadow-accent)' }}>
              <Zap size={30} color="white" />
            </div>

            {/* Heading */}
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif', marginBottom: 12, letterSpacing: '-0.02em' }}>
              Welcome to <span className="gradient-text">InvestIQ</span> 🎉
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 8 }}>
              To give you a <strong style={{ color: 'var(--text-primary)' }}>truly personalized</strong> AI investment experience — tailored recommendations, real portfolio insights, and a plan that fits your life — we need to learn a bit about you.
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32 }}>
              It takes about <strong style={{ color: 'var(--accent-indigo)' }}>10 minutes</strong> and you can save and resume anytime.
              Do you have time right now?
            </p>

            {/* What you get */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
              {[
                { icon: '📊', text: 'Personalized dashboard & portfolio values' },
                { icon: '🤖', text: 'AI insights tailored to your goals & risk level' },
                { icon: '🎯', text: 'Custom investment plan built for your life' },
                { icon: '📈', text: 'Real P&L tracking instead of demo data' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 8, textAlign: 'left', border: '1px solid var(--border-card)' }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => setShowIntro(false)}
                className="btn-primary"
                style={{ width: '100%', padding: '15px', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
              >
                <Brain size={18} /> Yes! Let's set up my profile
              </button>
              <button
                onClick={async () => {
                  setDeferring(true);
                  try { await defer(); } catch { /* ignore */ }
                  setDeferring(false);
                  navigate('/dashboard');
                }}
                disabled={deferring}
                style={{
                  width: '100%', padding: '13px', borderRadius: 10, cursor: 'pointer',
                  background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {deferring ? 'Loading…' : <><ArrowRight size={15} /> I'll do it later — take me to the dashboard</>}
              </button>
            </div>

            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 16 }}>
              You can always complete your profile from the dashboard.
            </p>
          </div>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-accent)' }}>
            <Zap size={17} color="white" />
          </div>
          <div>
            <span className="gradient-text" style={{ fontSize: 15, fontWeight: 800, fontFamily: 'Poppins, sans-serif' }}>InvestIQ</span>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Profile Setup</p>
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {React.createElement(section.icon, { size: 14, style: { color: 'var(--accent-indigo)' } })}
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-indigo)' }}>
                Section {section.id}: {section.label}
              </span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {qIndex + 1} / {flow.length}
            </span>
          </div>
          <div style={{ height: 5, borderRadius: 99, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99, background: 'var(--gradient-accent)',
              width: `${progress}%`, transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Question card */}
        <div className="card card-depth" style={{ padding: 32, marginBottom: 20 }}>
          <div style={animStyle}>
            {renderQ()}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 10 }}>
          {qIndex > 0 && (
            <button type="button" onClick={goBack} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 20px', fontSize: 14 }}>
              <ChevronLeft size={16} /> Back
            </button>
          )}
          <button
            type="button"
            onClick={goNext}
            className="btn-primary"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', fontSize: 15 }}
          >
            {isLast ? (
              <><CheckCircle size={17} /> Complete Profile</>
            ) : (
              <>Continue <ChevronRight size={16} /></>
            )}
          </button>
        </div>

        {/* Skip link */}
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', textDecoration: 'underline', fontSize: 12 }}
            onClick={() => navigate('/dashboard')}
          >
            Skip and go to dashboard →
          </button>
        </p>
      </div>
    </div>
  );
}

/* ─── Investment Entry Sub-Component ─────────────────────────────────────── */
function InvestmentEntry({ investments, onChange, error }) {
  const addEntry = () => onChange([...investments, { type: '', name: '', amountInvested: '', currentValue: '', profitLoss: '', notes: '' }]);
  const removeEntry = (i) => onChange(investments.filter((_, idx) => idx !== i));
  const updateEntry = (i, field, val) => {
    const updated = investments.map((inv, idx) => idx === i ? { ...inv, [field]: val } : inv);
    onChange(updated);
  };

  return (
    <div>
      <h2 style={qTitle}>Tell us about your current investments</h2>
      <p style={qSub}>Add each investment separately. You can add as many as you need.</p>

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {investments.map((inv, i) => (
          <div key={i} style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 16, border: '1px solid var(--border-card)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Investment {i + 1}</span>
              <button type="button" onClick={() => removeEntry(i)} style={{ background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.2)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--accent-rose)' }}>
                <Trash2 size={12} /> Remove
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={fieldLabel}>Type <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
                <select className="input-field" value={inv.type} onChange={e => updateEntry(i, 'type', e.target.value)}>
                  <option value="">Select type</option>
                  {INVESTMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={fieldLabel}>Name / ticker <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
                <input className="input-field" value={inv.name} onChange={e => updateEntry(i, 'name', e.target.value)} placeholder="e.g. RELIANCE, SBI MF" />
              </div>
              <div>
                <label style={fieldLabel}>Amount Invested (₹) <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={rupeeIcon}>₹</span>
                  <input className="input-field" type="number" value={inv.amountInvested} onChange={e => updateEntry(i, 'amountInvested', e.target.value)} placeholder="0" style={{ paddingLeft: 24 }} />
                </div>
              </div>
              <div>
                <label style={fieldLabel}>Current Value (₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={rupeeIcon}>₹</span>
                  <input className="input-field" type="number" value={inv.currentValue} onChange={e => updateEntry(i, 'currentValue', e.target.value)} placeholder="0" style={{ paddingLeft: 24 }} />
                </div>
              </div>
              <div>
                <label style={fieldLabel}>Profit / Loss (₹)</label>
                <input className="input-field" type="number" value={inv.profitLoss} onChange={e => updateEntry(i, 'profitLoss', e.target.value)} placeholder="Calculated if empty" />
              </div>
              <div>
                <label style={fieldLabel}>Notes (optional)</label>
                <input className="input-field" value={inv.notes} onChange={e => updateEntry(i, 'notes', e.target.value)} placeholder="Any notes…" />
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addEntry} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '12px', borderRadius: 12, border: '1.5px dashed var(--border-color)',
          background: 'transparent', cursor: 'pointer', fontSize: 14, color: 'var(--accent-indigo)',
          fontWeight: 600, transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Plus size={16} /> Add Investment
        </button>
        {error && <p style={errStyle}>{error}</p>}
      </div>
    </div>
  );
}

// Need React for createElement in section icon rendering
import React from 'react';

/* ─── Shared styles ──────────────────────────────────────────────────────── */
const qTitle = {
  fontSize: 22, fontWeight: 800, color: 'var(--text-primary)',
  fontFamily: 'Poppins, sans-serif', lineHeight: 1.3, margin: 0, marginBottom: 8,
};
const qSub = { fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 };
const errStyle = { fontSize: 12, color: 'var(--accent-rose)', marginTop: 8, fontWeight: 500 };
const fieldLabel = { fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 };
const rupeeIcon = { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' };
