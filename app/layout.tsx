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
    default: 'Next.js X Tweet',
    template: '%s | Next.js X Tweet',
  },
  description:
    'Frontend clone of Twitter (X) built with Next.js App Router and TypeScript.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.className} antialiased`}>{children}</body>
    </html>
  );
}
