import Link from 'next/link';
import { Zap } from 'lucide-react';

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <nav className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold">AutoApply AI</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-sm text-slate-600 dark:text-slate-400">
          <p><strong>Last updated:</strong> April 2026</p>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p>We collect information you provide directly: name, email, location, skills, work experience, and job preferences. We also collect usage data to improve the service.</p>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">2. How We Use Your Information</h2>
          <p>Your information is used to: generate resumes and cover letters, submit job applications on your behalf, track application status, and send notifications.</p>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">3. AI Processing</h2>
          <p>Your profile data and job descriptions are sent to AI providers (Groq) to generate content. This data is processed in real-time and not stored by the AI provider.</p>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">4. Data Storage</h2>
          <p>Your data is stored securely on Supabase (PostgreSQL) with row-level security. All data is encrypted in transit and at rest.</p>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">5. Data Sharing</h2>
          <p>We do not sell or share your personal data with third parties. Data is only shared with job platforms when you explicitly initiate an application.</p>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">6. Telegram Notifications</h2>
          <p>If you connect Telegram, we store your chat ID to send notifications. You can disconnect at any time from Settings.</p>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">7. Cookies</h2>
          <p>We use essential cookies for authentication and session management. No tracking cookies are used.</p>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">8. Your Rights</h2>
          <p>You can access, update, or delete your data at any time from Settings. To delete your account entirely, contact support.</p>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">9. Contact</h2>
          <p>For privacy-related questions, contact us at privacy@autoapply.ai</p>
        </div>
      </main>
    </div>
  );
}
