import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import ClientLayout from './client-layout';

export const metadata: Metadata = {
  title: 'RoktoProbaho - Real-Time Blood Donation',
  description: 'A real-time blood donation networking system for the people.',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Poppins:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning={true}
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
