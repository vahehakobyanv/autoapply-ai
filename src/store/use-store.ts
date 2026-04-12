import { create } from 'zustand';
import type { Profile, Application, Job, Subscription } from '@/types';

interface AppState {
  profile: Profile | null;
  applications: Application[];
  jobs: Job[];
  subscription: Subscription | null;
  locale: 'en' | 'ru';
  setProfile: (profile: Profile | null) => void;
  setApplications: (applications: Application[]) => void;
  setJobs: (jobs: Job[]) => void;
  setSubscription: (subscription: Subscription | null) => void;
  setLocale: (locale: 'en' | 'ru') => void;
  addApplication: (application: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  addJob: (job: Job) => void;
}

export const useStore = create<AppState>((set) => ({
  profile: null,
  applications: [],
  jobs: [],
  subscription: null,
  locale: 'en',
  setProfile: (profile) => set({ profile }),
  setApplications: (applications) => set({ applications }),
  setJobs: (jobs) => set({ jobs }),
  setSubscription: (subscription) => set({ subscription }),
  setLocale: (locale) => set({ locale }),
  addApplication: (application) =>
    set((state) => ({ applications: [application, ...state.applications] })),
  updateApplication: (id, updates) =>
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),
  addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
}));
