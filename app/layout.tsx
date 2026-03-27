import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { DEFAULT_USER_SETTINGS } from '@/app/config/preferences.config';
import { getSessionUser } from '@/app/shared/lib/auth';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Next X Tweet Demo',
    template: '%s | Next X Tweet Demo',
  },
  description:
    'A small X clone built with Next.js App Router, demo auth, public profiles, tweets, and SSR, SSG, ISR examples.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getSessionUser();
  const settings = currentUser?.settings ?? DEFAULT_USER_SETTINGS;

  return (
    <html lang={settings.language} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        data-theme={settings.theme}
        data-density={settings.density}
        className={`${geistSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
