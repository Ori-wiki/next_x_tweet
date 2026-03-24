import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
