'use client';

import { AuthProvider } from '@/context/auth-context';
import { RequestProvider } from '@/context/request-context';
import { LanguageProvider } from '@/context/language-context';
import MainNav from '@/components/main-nav';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <RequestProvider>
          <LanguageProvider>
            <div className="relative flex min-h-screen flex-col">
              <MainNav />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </LanguageProvider>
        </RequestProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
