# AutoApply AI

AI-powered job application platform optimized for Russia (hh.ru) and Armenia (staff.am).

## Features

- **AI Resume Builder** — Generate professional resumes in English and Russian with multiple templates
- **Job Import & Search** — Import from URL (hh.ru, staff.am) or search with keywords
- **AI Cover Letters** — Personalized cover letters from your profile + job description
- **Auto-Apply Bot** — Playwright-based automation for hh.ru and staff.am
- **Kanban Tracker** — Drag-and-drop application tracking (Saved / Applied / Interview / Offer / Rejected)
- **Dashboard Analytics** — Total applications, response rate, interviews, weekly activity
- **Stripe Payments** — Free (5/month) and Pro (unlimited) plans
- **Multi-Language** — English and Russian support
- **Referral System** — Invite friends for free credits
- **Telegram Notifications** — Application sent, new job found, interview reminders
- **Chrome Extension** (HIGH IMPACT) — Apply to jobs directly from any job board without leaving the page
- **Portfolio Generator** (UNDERRATED) — Auto-generate a personal portfolio site from your profile and projects
- **AI Job Search Agent** (NEXT LEVEL) — Autonomous agent that finds, filters, and recommends jobs matching your profile 24/7
- **Company Insights** — AI-powered research on companies: culture, salary ranges, interview process, employee reviews
- **"Why You Got Rejected" AI** — Analyze job descriptions vs your profile to identify gaps and get actionable improvement tips
- **Gamification** (Retention Booster) — XP, streaks, achievements, and leaderboards to keep users engaged in their job search
- **Team Mode** (B2B Opportunity) — Shared workspace for recruiters, career coaches, and bootcamps to manage multiple candidates
- **AI CV Import** (SUPER USEFUL) — Upload any existing CV/resume (PDF, DOCX) and auto-parse it into your profile

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + Auth + RLS)
- **AI**: OpenAI API (GPT-4o-mini)
- **Payments**: Stripe
- **Automation**: Playwright
- **State**: Zustand
- **Charts**: Recharts
- **DnD**: @dnd-kit

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd autoapply-ai
npm install
```

### 2. Environment variables

Copy `.env.local` and fill in your keys:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRO_PRICE_ID=your_stripe_price_id
TELEGRAM_BOT_TOKEN=your_telegram_bot_token (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database setup

1. Create a Supabase project at supabase.com
2. Go to SQL Editor and run the contents of `supabase/schema.sql`
3. Enable Google OAuth in Authentication > Providers (optional)

### 4. Stripe setup

1. Create products/prices in Stripe Dashboard
2. Set the price ID as `STRIPE_PRO_PRICE_ID`
3. Set up webhook endpoint: `your-domain/api/payments/webhook`
4. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 5. Run

```bash
npm run dev
```

Open http://localhost:3000

### 6. Playwright (for auto-apply bot)

```bash
npx playwright install chromium
```

## Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add all environment variables
4. Deploy

## Project Structure

```
src/
  app/
    (auth)/          Login, Register pages
    (dashboard)/     Dashboard, Resume, Jobs, Tracker, Settings, Payments
    api/             API routes
    page.tsx         Landing page
  components/
    layout/          Sidebar
    ui/              Shadcn UI components
  hooks/             useUser hook
  lib/
    bot/             Playwright bots (hh.ru, staff.am)
    supabase/        Client, server, middleware
    openai.ts        AI generation
    stripe.ts        Stripe config
    i18n.ts          Translations
  store/             Zustand store
  types/             TypeScript types
```
