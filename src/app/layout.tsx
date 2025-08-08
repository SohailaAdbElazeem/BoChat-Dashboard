'use client';
import './globals.css';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthGuard from './_components/AuthGuard';
import MainNavbar from './_components/MainNavbar';
import SideBar from './_components/SideBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {isLoginPage ? (
            children
          ) : (
            <AuthGuard>
              <MainNavbar />
              <SideBar />
              {children}
            </AuthGuard>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
