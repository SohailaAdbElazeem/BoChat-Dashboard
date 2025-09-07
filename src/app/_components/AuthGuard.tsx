'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';

const PUBLIC_ROUTES = ['/login'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // لو لسه ما تحققناش، منرجّعش أي UI
  const [checked, setChecked] = useState(false);
  // لو عملنا redirect بالفعل، متعرضش حاجة برضو لحد ما الروت يتغير
  const redirected = useRef(false);

  useLayoutEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (!token && !isPublic) {
      redirected.current = true;
      router.replace('/login');
      return;
    }

    if (token && isPublic) {
      redirected.current = true;
      router.replace('/home');
      return;
    }

    setChecked(true);
  }, [pathname, router]);

  if (!checked || redirected.current) return null;

  return <>{children}</>;
}
