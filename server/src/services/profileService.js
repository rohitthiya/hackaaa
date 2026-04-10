// src/services/profileService.js
import { createClient } from "@supabase/supabase-js";

// Create a user-scoped Supabase client using the user's JWT
const getUserClient = (userToken) =>
  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${userToken}` } },
  });

/**
 * Get or create a profile row for the given user.
 */
export const getProfile = async ({ userId, userToken }) => {
  const db = getUserClient(userToken);

  const { data, error } = await db
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw { statusCode: 500, message: error.message };

  if (!data) {
    // Auto-create on first fetch
    const { data: created, error: createErr } = await db
      .from("user_profiles")
      .insert({ user_id: userId, onboarding_status: "pending", onboarding_step: 0 })
      .select()
      .single();

    if (createErr) throw { statusCode: 500, message: createErr.message };
    return created;
  }

  return data;
};

/**
 * Save partial progress (called after every question advance).
 */
export const saveProgress = async ({ userId, userToken, step, status, answers }) => {
  const db = getUserClient(userToken);

  const patch = {
    onboarding_step: step,
    onboarding_status: status,
    updated_at: new Date().toISOString(),
    ...flattenAnswers(answers),
  };

  const { data, error } = await db
    .from("user_profiles")
    .upsert({ user_id: userId, ...patch }, { onConflict: "user_id" })
    .select()
    .single();

  if (error) throw { statusCode: 500, message: error.message };
  return data;
};

/**
 * Mark onboarding as completed and save all final answers.
 */
export const completeOnboarding = async ({ userId, userToken, answers }) => {
  const db = getUserClient(userToken);

  const patch = {
    onboarding_status: "completed",
    onboarding_step: 21,
    updated_at: new Date().toISOString(),
    ...flattenAnswers(answers),
  };

  const { data, error } = await db
    .from("user_profiles")
    .upsert({ user_id: userId, ...patch }, { onConflict: "user_id" })
    .select()
    .single();

  if (error) throw { statusCode: 500, message: error.message };
  return data;
};

/**
 * Set onboarding status to 'deferred' (user chose "I'll do it later").
 */
export const deferOnboarding = async ({ userId, userToken }) => {
  const db = getUserClient(userToken);

  const { data, error } = await db
    .from("user_profiles")
    .upsert(
      { user_id: userId, onboarding_status: "deferred", updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) throw { statusCode: 500, message: error.message };
  return data;
};

// ─── Answer → DB column mapping ──────────────────────────────────────────────
function flattenAnswers(a = {}) {
  const out = {};

  if (a.ageGroup !== undefined) out.age_group = a.ageGroup;
  if (a.monthlyIncome !== undefined) out.monthly_income = Number(a.monthlyIncome) || null;
  if (a.monthlySavings !== undefined) out.monthly_savings = Number(a.monthlySavings) || null;
  if (a.totalSavings !== undefined) out.total_savings = Number(a.totalSavings) || null;
  if (a.hasEmergencyFund !== undefined) out.has_emergency_fund = a.hasEmergencyFund;
  if (a.investmentAmount !== undefined) out.investment_amount = Number(a.investmentAmount) || null;
  if (a.hasLiabilities !== undefined) out.has_liabilities = a.hasLiabilities;
  if (a.liabilities !== undefined) out.liabilities = a.liabilities;
  if (a.hasExistingInvestments !== undefined) out.has_existing_investments = a.hasExistingInvestments;
  if (a.existingInvestments !== undefined) out.existing_investments = a.existingInvestments;

  if (a.primaryGoal !== undefined) out.primary_goal = a.primaryGoal;
  if (a.investmentHorizon !== undefined) out.investment_horizon = a.investmentHorizon;
  if (a.preferredAssetTypes !== undefined) out.preferred_asset_types = a.preferredAssetTypes;

  if (a.lossReaction !== undefined) out.loss_reaction = a.lossReaction;
  if (a.priority !== undefined) out.priority = a.priority;
  if (a.marketComfort !== undefined) out.market_comfort = a.marketComfort;

  if (a.experienceLevel !== undefined) out.experience_level = a.experienceLevel;
  if (a.hasInvestedBefore !== undefined) out.has_invested_before = a.hasInvestedBefore;
  if (a.previousInvestments !== undefined) out.previous_investments = a.previousInvestments;
  if (a.marketTrackingFrequency !== undefined) out.market_tracking_frequency = a.marketTrackingFrequency;
  if (a.understoodInstruments !== undefined) out.understood_instruments = a.understoodInstruments;

  return out;
}
