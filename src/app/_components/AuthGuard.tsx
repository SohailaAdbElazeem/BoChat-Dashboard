'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  getToken,
  isTokenExpired,
  secondsToExpiry,
  clearAuth,
} from '@/utils/auth';

const PUBLIC_ROUTES = ['/login'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const isPublic = PUBLIC_ROUTES.includes(pathname);
      const token = getToken();

      // 1) لا يوجد توكن
      if (!token) {
        if (!isPublic) {
          clearAuth();
          router.replace('/login');
          return;
        }
        // صفحة عامة بدون توكن (مثلاً /login)
        setReady(true);
        return;
      }

      // 2) يوجد توكن لكنه منتهي
      if (isTokenExpired(token)) {
        clearAuth();
        if (!isPublic) {
          router.replace('/login');
          return;
        }
        // لو انت في /login ومعاك توكن منتهي اعتبره مش موجود
        setReady(true);
        return;
      }

      // 3) يوجد توكن صالح
      // لو انت في صفحة عامة (login) ومعاك توكن صالح → روح للـ /home
      if (isPublic) {
        router.replace('/home');
        return;
      }

      // 5) جهّز تايمر لتجديد التوكن قبل الانتهاء بشوية (10 ثواني)
      if (!cancelled) setReady(true);
    }

    run();

    // خروجات نظيفة
    return () => {
      cancelled = true;
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [pathname, router]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        router.replace('/login');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [router]);

  if (!ready) return null;

  return <>{children}</>;
}
