import { Metadata } from 'next';
import React from 'react';
import { AuthProvider } from '../contexts/useAuth';
import { env } from '../config';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'GORA - Commute Smarter',
  description:
    'GORA guides your journey planning web app that provides route options, vehicle recommendations, and fare estimates to help users find the most efficient and affordable travel routes.',
  openGraph: {
    title: 'GORA — Commute Smarter',
    description: 'Plan routes, see suggested rides, and estimated fares.',
    url: env.url,
    siteName: 'GORA',
    type: 'website',
    images: [
      {
        url: `${env.url}/images/og/cover.png`,
        width: 1200,
        height: 630,
        alt: 'GORA cover'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GORA — Commute Smarter',
    description: 'Plan routes, see suggested rides, and estimated fares.',
    images: [`${env.url}/images/og/cover.png`]
  }
};

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <AuthProvider>
      <React.Fragment>{children}</React.Fragment>
    </AuthProvider>
  );
}
