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
    'Учебный мини-клон X на Next.js App Router с твитами, профилями, демо-авторизацией и примерами SSR, SSG и ISR.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru' suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
