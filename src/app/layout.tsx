import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@/components/layout/analytics";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AutoApply AI — Apply to 100 Jobs in 1 Click",
    template: "%s | AutoApply AI",
  },
  description:
    "AI-powered job application automation. Generate resumes, cover letters, and auto-apply to jobs on hh.ru and staff.am.",
  keywords: [
    "job application",
    "AI resume",
    "auto apply",
    "hh.ru",
    "staff.am",
    "cover letter generator",
    "job tracker",
    "career",
  ],
  authors: [{ name: "AutoApply AI" }],
  creator: "AutoApply AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://autoapply-ai-vert.vercel.app",
    siteName: "AutoApply AI",
    title: "AutoApply AI — Apply to 100 Jobs in 1 Click",
    description:
      "AI finds jobs, generates resumes & cover letters, and submits applications automatically. Optimized for hh.ru and staff.am.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AutoApply AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoApply AI — Apply to 100 Jobs in 1 Click",
    description:
      "AI finds jobs, generates resumes & cover letters, and submits applications automatically.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}` }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AutoApply AI",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "description": "AI-powered job application platform. Generate resumes, cover letters, and auto-apply to jobs on hh.ru and staff.am.",
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "2847" },
          "url": "https://autoapply-ai-vert.vercel.app"
        })}} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GoogleAnalytics />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
