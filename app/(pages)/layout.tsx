import { Metadata } from 'next';
import React from 'react';
import { AuthProvider } from '../contexts/useAuth';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'GORA',
  description: 'GORA guides your journey planning web app that provides route options, vehicle recommendations, and fare estimates to help users find the most efficient and affordable travel routes.'
};

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <AuthProvider>
      <React.Fragment>{children}</React.Fragment>
    </AuthProvider>
  );
}
