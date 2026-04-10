-- =====================================================
-- Run this in your Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Onboarding tracking
  onboarding_status text DEFAULT 'pending' CHECK (onboarding_status IN ('pending','deferred','in_progress','completed')),
  onboarding_step int DEFAULT 0,

  -- Section 1: Basic Profile
  age_group text,
  monthly_income numeric,
  monthly_savings numeric,
  total_savings numeric,
  has_emergency_fund boolean,
  investment_amount numeric,
  has_liabilities boolean,
  liabilities jsonb DEFAULT '[]'::jsonb,
  has_existing_investments boolean,
  existing_investments jsonb DEFAULT '[]'::jsonb,

  -- Section 2: Investment Goals
  primary_goal text,
  investment_horizon text,
  preferred_asset_types jsonb DEFAULT '[]'::jsonb,

  -- Section 3: Risk Tolerance
  loss_reaction text,
  priority text,
  market_comfort text,

  -- Section 4: Experience & Knowledge
  experience_level text,
  has_invested_before boolean,
  previous_investments jsonb DEFAULT '[]'::jsonb,
  market_tracking_frequency text,
  understood_instruments jsonb DEFAULT '[]'::jsonb,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;

-- Allow users to do everything with their own row
CREATE POLICY "Users can manage own profile"
  ON user_profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at on change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
