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
