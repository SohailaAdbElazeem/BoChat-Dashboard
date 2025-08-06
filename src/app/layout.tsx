import './globals.css';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthGuard from './_components/AuthGuard';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
