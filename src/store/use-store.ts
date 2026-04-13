import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile, Application, Job, Subscription } from '@/types';
import type { Locale } from '@/lib/i18n';

interface AppState {
  profile: Profile | null;
  applications: Application[];
  jobs: Job[];
  subscription: Subscription | null;
  locale: Locale;
  setProfile: (profile: Profile | null) => void;
  setApplications: (applications: Application[]) => void;
  setJobs: (jobs: Job[]) => void;
  setSubscription: (subscription: Subscription | null) => void;
  setLocale: (locale: Locale) => void;
  addApplication: (application: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  addJob: (job: Job) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'autoapply-store',
      partialize: (state) => ({ locale: state.locale }),
    }
  )
);
