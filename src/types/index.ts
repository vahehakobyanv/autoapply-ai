export interface Profile {
  id: string;
  user_id: string;
  name: string;
  role: string;
  skills: string[];
  experience: string;
  languages: string[];
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  content: ResumeContent;
  language: 'en' | 'ru';
  template: 'modern' | 'simple' | 'executive' | 'creative' | 'minimal';
  created_at: string;
  updated_at: string;
}

export interface ResumeContent {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  languages: string[];
}

export interface WorkExperience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  url: string;
  source: 'hh.ru' | 'staff.am' | 'manual';
  salary?: string;
  location?: string;
  created_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  cover_letter: string;
  notes: string;
  applied_at: string;
  updated_at: string;
  job?: Job;
}

export type ApplicationStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'pro';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end?: string;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  credits_awarded: number;
  created_at: string;
}

export interface DashboardStats {
  totalApplications: number;
  responseRate: number;
  interviewCount: number;
  weeklyActivity: { date: string; count: number }[];
  statusBreakdown: Record<ApplicationStatus, number>;
}

// Portfolio Generator
export interface Portfolio {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  bio: string;
  theme: 'minimal' | 'modern' | 'bold' | 'elegant';
  sections: PortfolioSection[];
  published: boolean;
  custom_domain?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSection {
  type: 'hero' | 'about' | 'experience' | 'projects' | 'skills' | 'contact';
  visible: boolean;
  content: Record<string, unknown>;
}

// AI Job Search Agent
export interface JobAgent {
  id: string;
  user_id: string;
  name: string;
  keywords: string[];
  locations: string[];
  salary_min?: number;
  salary_max?: number;
  sources: string[];
  frequency: 'hourly' | 'daily' | 'weekly';
  active: boolean;
  last_run_at?: string;
  results_count: number;
  created_at: string;
}

export interface JobAgentResult {
  id: string;
  agent_id: string;
  job_title: string;
  company: string;
  url: string;
  salary?: string;
  location?: string;
  match_score: number;
  seen: boolean;
  created_at: string;
}

// Company Insights
export interface CompanyInsight {
  id: string;
  company_name: string;
  summary: string;
  culture: string;
  salary_range: string;
  interview_process: string;
  pros: string[];
  cons: string[];
  rating: number;
  employee_count?: string;
  industry?: string;
  headquarters?: string;
  created_at: string;
}

// Rejection Analysis
export interface RejectionAnalysis {
  id: string;
  user_id: string;
  job_id?: string;
  job_title: string;
  company: string;
  match_score: number;
  gaps: RejectionGap[];
  suggestions: string[];
  created_at: string;
}

export interface RejectionGap {
  category: 'skills' | 'experience' | 'education' | 'location' | 'seniority';
  description: string;
  severity: 'low' | 'medium' | 'high';
  action: string;
}

// Gamification
export interface UserGamification {
  id: string;
  user_id: string;
  xp: number;
  level: number;
  streak_days: number;
  longest_streak: number;
  last_active_date: string;
  achievements: string[];
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  condition: string;
}

// Team Mode
export interface Team {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan: 'team_free' | 'team_pro';
  max_members: number;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  profile?: Profile;
}

export interface TeamInvite {
  id: string;
  team_id: string;
  email: string;
  role: 'admin' | 'member';
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
}
