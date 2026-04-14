-- AutoApply AI Database Schema

-- Profiles table
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  experience TEXT NOT NULL DEFAULT '',
  languages TEXT[] DEFAULT '{}',
  location TEXT NOT NULL DEFAULT '',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resumes table
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Resume',
  content JSONB NOT NULL DEFAULT '{}',
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ru')),
  template TEXT NOT NULL DEFAULT 'modern' CHECK (template IN ('modern', 'simple')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  requirements TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('hh.ru', 'staff.am', 'manual')),
  salary TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'interview', 'offer', 'rejected')),
  cover_letter TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  credits_awarded INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own resumes" ON resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resumes" ON resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON resumes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own jobs" ON jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jobs" ON jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own jobs" ON jobs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON applications FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscription" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users can insert referrals" ON referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id) VALUES (NEW.id);
  INSERT INTO public.subscriptions (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER resumes_updated_at BEFORE UPDATE ON resumes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- NEW FEATURE TABLES
-- ============================================================

-- Portfolios table
CREATE TABLE portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  theme TEXT NOT NULL DEFAULT 'modern' CHECK (theme IN ('minimal', 'modern', 'bold', 'elegant')),
  sections JSONB NOT NULL DEFAULT '[]',
  published BOOLEAN DEFAULT FALSE,
  custom_domain TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own portfolios" ON portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own portfolios" ON portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own portfolios" ON portfolios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own portfolios" ON portfolios FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public can view published portfolios" ON portfolios FOR SELECT USING (published = TRUE);
CREATE TRIGGER portfolios_updated_at BEFORE UPDATE ON portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Job Agents table
CREATE TABLE job_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Agent',
  keywords TEXT[] DEFAULT '{}',
  locations TEXT[] DEFAULT '{}',
  salary_min INTEGER,
  salary_max INTEGER,
  sources TEXT[] DEFAULT '{"hh.ru", "staff.am"}',
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('hourly', 'daily', 'weekly')),
  active BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMPTZ,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE job_agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own agents" ON job_agents FOR ALL USING (auth.uid() = user_id);

-- Job Agent Results table
CREATE TABLE job_agent_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES job_agents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  salary TEXT,
  location TEXT,
  match_score INTEGER NOT NULL DEFAULT 0,
  seen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE job_agent_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own agent results" ON job_agent_results FOR ALL USING (auth.uid() = user_id);

-- Company Insights cache table
CREATE TABLE company_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL DEFAULT '',
  culture TEXT NOT NULL DEFAULT '',
  salary_range TEXT NOT NULL DEFAULT '',
  interview_process TEXT NOT NULL DEFAULT '',
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  rating NUMERIC(2,1) DEFAULT 0,
  employee_count TEXT,
  industry TEXT,
  headquarters TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE company_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view insights" ON company_insights FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated can insert insights" ON company_insights FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Rejection Analysis table
CREATE TABLE rejection_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  job_title TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  match_score INTEGER NOT NULL DEFAULT 0,
  gaps JSONB NOT NULL DEFAULT '[]',
  suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rejection_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own analyses" ON rejection_analyses FOR ALL USING (auth.uid() = user_id);

-- Gamification table
CREATE TABLE user_gamification (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own gamification" ON user_gamification FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gamification" ON user_gamification FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gamification" ON user_gamification FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER gamification_updated_at BEFORE UPDATE ON user_gamification FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Teams table
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'team_free' CHECK (plan IN ('team_free', 'team_pro')),
  max_members INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team members can view team" ON teams FOR SELECT USING (
  id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
);
CREATE POLICY "Owner can update team" ON teams FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Authenticated can create team" ON teams FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Team Members table
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team members can view members" ON team_members FOR SELECT USING (
  team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage members" ON team_members FOR ALL USING (
  team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
);

-- Team Invites table
CREATE TABLE team_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team admins can manage invites" ON team_invites FOR ALL USING (
  team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
);

-- Contacts/CRM table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  linkedin_url TEXT,
  phone TEXT,
  notes TEXT NOT NULL DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  last_contacted TIMESTAMPTZ,
  next_follow_up TIMESTAMPTZ,
  source TEXT NOT NULL DEFAULT 'other' CHECK (source IN ('linkedin', 'referral', 'recruiter', 'networking', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own contacts" ON contacts FOR ALL USING (auth.uid() = user_id);
CREATE TRIGGER contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'other' CHECK (type IN ('offer_letter', 'contract', 'certificate', 'reference', 'other')),
  file_url TEXT NOT NULL DEFAULT '',
  file_size INTEGER DEFAULT 0,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own documents" ON documents FOR ALL USING (auth.uid() = user_id);

-- Job Offers (for comparison)
CREATE TABLE IF NOT EXISTS job_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  company TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  salary NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  bonus NUMERIC,
  equity TEXT,
  benefits TEXT[] DEFAULT '{}',
  remote_policy TEXT DEFAULT 'onsite' CHECK (remote_policy IN ('remote', 'hybrid', 'onsite')),
  pto_days INTEGER,
  commute_time INTEGER,
  start_date DATE,
  deadline DATE,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own offers" ON job_offers FOR ALL USING (auth.uid() = user_id);

-- Calendar Events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'custom' CHECK (event_type IN ('interview', 'deadline', 'follow_up', 'custom')),
  notes TEXT NOT NULL DEFAULT '',
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own events" ON calendar_events FOR ALL USING (auth.uid() = user_id);

-- Interview Notes table
CREATE TABLE IF NOT EXISTS interview_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  company TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  interview_date DATE NOT NULL DEFAULT CURRENT_DATE,
  interview_type TEXT NOT NULL DEFAULT 'video' CHECK (interview_type IN ('phone', 'video', 'onsite', 'technical', 'behavioral', 'panel')),
  interviewer_name TEXT NOT NULL DEFAULT '',
  questions_asked TEXT[] DEFAULT '{}',
  my_answers TEXT NOT NULL DEFAULT '',
  overall_feeling TEXT NOT NULL DEFAULT 'neutral' CHECK (overall_feeling IN ('positive', 'neutral', 'negative')),
  next_steps TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE interview_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own interview notes" ON interview_notes FOR ALL USING (auth.uid() = user_id);

-- Add tags and deadline columns to applications
ALTER TABLE applications ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS deadline DATE;

-- Auto-create gamification on signup (update existing function)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id) VALUES (NEW.id);
  INSERT INTO public.subscriptions (user_id) VALUES (NEW.id);
  INSERT INTO public.user_gamification (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
