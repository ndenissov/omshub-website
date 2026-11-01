import React from 'react';
import { Metadata, Viewport } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity';
import { ColorSchemeScript } from '@mantine/core';
import { OrganizationSchema, WebsiteSchema } from '@/components/StructuredData';
import Providers from '@/components/providers/Providers';
import { inter } from './fonts';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import './globals.css';

const siteUrl =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://omshub.xyz';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'OMSHub - Georgia Tech OMS Course Reviews',
    template: '%s | OMSHub',
  },
  description:
    'Community-driven course reviews for Georgia Tech Online Master\'s programs. Read honest student reviews, ratings, and workload estimates for OMSCS, OMSA, and OMSCyber courses.',
  keywords: [
    'Georgia Tech',
    'OMSCS',
    'OMSA',
    'OMSCyber',
    'online masters',
    'course reviews',
    'computer science',
    'analytics',
    'cybersecurity',
    'GT OMS',
    'student reviews',
    'course ratings',
    'workload',
    'difficulty',
  ],
  authors: [{ name: 'OMSHub Community' }],
  creator: 'OMSHub',
  publisher: 'OMSHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'OMSHub',
    title: 'OMSHub - Georgia Tech OMS Course Reviews',
    description:
      'Community-driven course reviews for Georgia Tech Online Master\'s programs. Read honest student reviews for OMSCS, OMSA, and OMSCyber.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OMSHub - Georgia Tech OMS Course Reviews',
    description:
      'Community-driven course reviews for Georgia Tech Online Master\'s programs.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1b1e' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Alternate Markdown formats for AI Agents */}
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="Markdown overview for AI agents" />
        <link rel="alternate" type="text/markdown" href="/courses.md" title="Course catalog in Markdown" />
        <link rel="alternate" type="text/markdown" href="/schedule.md" title="Course schedule in Markdown" />
        <ColorSchemeScript defaultColorScheme="auto" />
        {/* WCAG-compliant dimmed color override */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root, [data-mantine-color-scheme="light"] { --mantine-color-dimmed: #636c76 !important; }
          [data-mantine-color-scheme="dark"] { --mantine-color-dimmed: #a6a7ab !important; }
        `}} />

        {/* Schema.org Structured Data for SEO */}
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body suppressHydrationWarning>
        {/* Microsoft Clarity - beforeInteractive for session recording */}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <MicrosoftClarity projectId={process.env.NEXT_PUBLIC_CLARITY_ID} />
        )}
        <Providers>{children}</Providers>
        {process.env.VERCEL && <Analytics />}
        {process.env.VERCEL && <SpeedInsights />}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
