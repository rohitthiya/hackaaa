// src/context/OnboardingContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { fetchProfile, saveProgress, completeProfile, deferProfile } from '../api/profile';

const OnboardingContext = createContext(null);

const LS_KEY = 'iq_onboarding';

const INITIAL_ANSWERS = {
  // Section 1
  ageGroup: '',
  monthlyIncome: '',
  monthlySavings: '',
  totalSavings: '',
  hasEmergencyFund: null,
  investmentAmount: '',
  hasLiabilities: null,
  liabilities: [],
  hasExistingInvestments: null,
  existingInvestments: [],
  // Section 2
  primaryGoal: '',
  investmentHorizon: '',
  preferredAssetTypes: [],
  // Section 3
  lossReaction: '',
  priority: '',
  marketComfort: '',
  // Section 4
  experienceLevel: '',
  hasInvestedBefore: null,
  previousInvestments: [],
  marketTrackingFrequency: '',
  understoodInstruments: [],
};

export function OnboardingProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [status, setStatus] = useState('pending'); // pending|deferred|in_progress|completed
  const [step, setStep] = useState(0);             // which question index (0-based)
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const savedToBackend = useRef(false);

  // Load from localStorage first (instant), then backend (async)
  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }

    let localStatus = 'pending';
    let localStep = 0;

    // Load local cache immediately
    try {
      const cached = localStorage.getItem(LS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.answers) setAnswers(a => ({ ...a, ...parsed.answers }));
        if (parsed.step !== undefined) { setStep(parsed.step); localStep = parsed.step; }
        if (parsed.status) { setStatus(parsed.status); localStatus = parsed.status; }
      }
    } catch { /* ignore parse errors */ }

    // If already completed locally — no need to wait for backend to confirm
    if (localStatus === 'completed' || localStep >= 21) {
      setStatus('completed');
      setStep(s => Math.max(s, 21));
      setLoading(false);
      // Still sync to backend in background to persist, but don't overwrite local state
      fetchProfile()
        .then((res) => {
          const p = res.data;
          if (p) {
            setProfile(p);
            // Merge backend answers but keep status as 'completed'
            const backendAnswers = extractAnswersFromProfile(p);
            setAnswers(a => ({ ...a, ...backendAnswers }));
          }
        })
        .catch(() => { /* backend unavailable — already showing completed from cache */ });
      return;
    }

    // Sync with backend for non-completed states
    fetchProfile()
      .then((res) => {
        const p = res.data;
        if (!p) return;
        setProfile(p);

        // Backend 'completed' always wins. For other states, prefer backend status.
        if (p.onboarding_status === 'completed' || p.onboarding_step >= 21) {
          setStatus('completed');
          setStep(21);
        } else if (p.onboarding_status && p.onboarding_status !== 'pending') {
          setStatus(p.onboarding_status);
          if (p.onboarding_step > localStep) setStep(p.onboarding_step);
        }
        // Merge backend answers into state (backend is authoritative for content)
        const backendAnswers = extractAnswersFromProfile(p);
        setAnswers(a => ({ ...a, ...backendAnswers }));
        savedToBackend.current = true;
      })
      .catch(() => { /* backend unavailable — work offline */ })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  // Persist answers to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ answers, step, status }));
    } catch { /* quota error */ }
  }, [answers, step, status]);

  const updateAnswer = useCallback((key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateAnswers = useCallback((patch) => {
    setAnswers(prev => ({ ...prev, ...patch }));
  }, []);

  /**
   * Advance to next question, save progress every 3 steps and always on completion.
   */
  const advance = useCallback(async (newStep, newAnswers, autoSave = false) => {
    setStep(newStep);
    setStatus('in_progress');
    if (newAnswers) setAnswers(prev => ({ ...prev, ...newAnswers }));

    if (autoSave) {
      try {
        await saveProgress(newStep, { ...answers, ...newAnswers }, 'in_progress');
      } catch { /* fail silently */ }
    }
  }, [answers]);

  const defer = useCallback(async () => {
    setStatus('deferred');
    try { await deferProfile(); } catch { /* fail silently */ }
  }, []);

  const complete = useCallback(async (finalAnswers) => {
    const merged = { ...answers, ...finalAnswers };
    setAnswers(merged);
    setStatus('completed');
    setStep(21);
    // Eagerly write to localStorage so banner is gone immediately on redirect
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ answers: merged, step: 21, status: 'completed' }));
    } catch { /* quota error */ }
    // Persist to backend in background
    try {
      const res = await completeProfile(merged);
      setProfile(res.data);
    } catch { /* fail silently — localStorage already has completed state */ }
  }, [answers]);

  const openQuestionnaire = useCallback(() => {
    setStatus('in_progress');
  }, []);

  const isComplete = status === 'completed' || step >= 21;
  const isDeferred = status === 'deferred' && !isComplete;
  const showReminder = !isComplete && (status === 'deferred' || status === 'pending');

  // Derived personalized values (only meaningful when completed)
  const personalizedData = isComplete ? {
    investmentAmount: Number(answers.investmentAmount) || 0,
    totalSavings: Number(answers.totalSavings) || 0,
    monthlyIncome: Number(answers.monthlyIncome) || 0,
    monthlySavings: Number(answers.monthlySavings) || 0,
    totalCurrentValue: answers.existingInvestments?.reduce((s, inv) => s + (Number(inv.currentValue) || 0), 0) || 0,
    totalInvested: answers.existingInvestments?.reduce((s, inv) => s + (Number(inv.amountInvested) || 0), 0) || 0,
    totalPnL: answers.existingInvestments?.reduce((s, inv) => {
      const pnl = inv.profitLoss !== '' && inv.profitLoss !== undefined
        ? Number(inv.profitLoss)
        : (Number(inv.currentValue) || 0) - (Number(inv.amountInvested) || 0);
      return s + pnl;
    }, 0) || 0,
    totalLiabilities: answers.liabilities?.reduce((s, l) => s + (Number(l.amount) || 0), 0) || 0,
    primaryGoal: answers.primaryGoal,
    riskProfile: answers.priority,
    experienceLevel: answers.experienceLevel,
    preferredAssets: answers.preferredAssetTypes || [],
    existingInvestments: answers.existingInvestments || [],
    liabilities: answers.liabilities || [],
  } : null;

  return (
    <OnboardingContext.Provider value={{
      status, step, answers, loading, profile, isComplete, isDeferred, showReminder,
      personalizedData,
      updateAnswer, updateAnswers, advance, defer, complete, openQuestionnaire,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function extractAnswersFromProfile(p) {
  return {
    ageGroup: p.age_group || '',
    monthlyIncome: p.monthly_income || '',
    monthlySavings: p.monthly_savings || '',
    totalSavings: p.total_savings || '',
    hasEmergencyFund: p.has_emergency_fund ?? null,
    investmentAmount: p.investment_amount || '',
    hasLiabilities: p.has_liabilities ?? null,
    liabilities: p.liabilities || [],
    hasExistingInvestments: p.has_existing_investments ?? null,
    existingInvestments: p.existing_investments || [],
    primaryGoal: p.primary_goal || '',
    investmentHorizon: p.investment_horizon || '',
    preferredAssetTypes: p.preferred_asset_types || [],
    lossReaction: p.loss_reaction || '',
    priority: p.priority || '',
    marketComfort: p.market_comfort || '',
    experienceLevel: p.experience_level || '',
    hasInvestedBefore: p.has_invested_before ?? null,
    previousInvestments: p.previous_investments || [],
    marketTrackingFrequency: p.market_tracking_frequency || '',
    understoodInstruments: p.understood_instruments || [],
  };
}
