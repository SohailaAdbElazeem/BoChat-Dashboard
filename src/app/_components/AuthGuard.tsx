'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoginPage = pathname === '/login';

    if (!token && !isLoginPage) {
      router.replace('/login');
    } else if (token && isLoginPage) {
      router.replace('/home');
    }

    setLoading(false);
  }, [pathname, router]);

  if (loading) return null;

  return <>{children}</>;
}
