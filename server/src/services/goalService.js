import { createClient } from "@supabase/supabase-js";
import { calculateSIP, getRateByRisk } from "../utils/financialCalc.js";
import { generateAIPlan } from "./aiService.js";

export const createGoalPlan = async ({ targetAmount, years, months, riskLevel, userId, userToken }) => {
  const totalMonths = years ? years * 12 : months;
  const expectedReturn = getRateByRisk(riskLevel);
  const monthlyInvestment = calculateSIP(targetAmount, totalMonths, expectedReturn);

  const aiPlan = await generateAIPlan({
    targetAmount,
    months: totalMonths,
    riskLevel,
    monthlyInvestment,
    expectedReturn,
  });

  // User-scoped Supabase client using their JWT
  const userSupabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${userToken}` } } }
  );

  const { data, error } = await userSupabase.from("goals").insert([
    {
      user_id: userId,
      target_amount: targetAmount,
      time_period_months: totalMonths,
      risk_level: riskLevel,
      monthly_investment: monthlyInvestment,
      expected_return: expectedReturn,
      ai_plan: aiPlan,
    },
  ]).select().single();

  if (error) throw { statusCode: 500, message: error.message };

  return { monthlyInvestment, expectedReturn, aiPlan, goal: data };
};

export const getUserGoals = async (userId) => {
  const { createClient: _ } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw { statusCode: 500, message: error.message };
  return data;
};