import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import SupabaseProvider from '@lib/supabase-provider';

export const metadata: Metadata = {
  title: 'Stock News AI',
  description: 'Live stock headlines and AI signals',
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}


