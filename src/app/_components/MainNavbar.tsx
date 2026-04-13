/* eslint-disable @next/next/no-img-element */
'use client';

import ThemeToggle from "../_components/ThemeToggle";
import './css/MainNavbar.css';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";

function MainNavbar(){
  const router = useRouter();

  const [isFixed, setIsFixed] = useState(false);
  const [blurBg, setBlurBg] = useState(false);
  const [navH, setNavH] = useState<number>(0);
  const prevY = useRef(0);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (navRef.current) setNavH(navRef.current.offsetHeight);

    const onScroll = () => {
      const y = window.scrollY;

      setBlurBg(y > 5);

      if (y > prevY.current && y > 80) {
        setIsFixed(true);
      } else if (y < prevY.current || y <= 80) {
        setIsFixed(false);
      }

      prevY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <>
      {isFixed && <div style={{ height: navH }} />}

      <nav
        ref={navRef}
        className={[
          isFixed ? 'fixed top-0 left-0 right-0 transition-all duration-400' : 'relative',
          blurBg
            ? 'backdrop-blur-md bg-white/70 dark:bg-slate-900/70 '
            : 'bg-transparent',
          'transition-all duration-400 py-[10px] z-[9999] flex justify-between items-center w-full'
        ].join(' ')}
      >
        <div className="flex gap-[20px]">
          <div className="bg-[#D72229] w-fit px-[15px] rounded-r-[20px] flex items-center justify-center">
            <img src="/logo.png" width={35} alt="Logo" />
          </div>
          <div className="user-info rounded-[25px] bg-[#D72229] w-75 py-[8px] px-[25px] relative" dir="rtl">
            <p className="text-[#fff] text-[18px]">اسم المستخدم</p>
            <p className="text-[#fff] text-[14px]">Abdallahsayed23@gmail.com</p>
            <img src="/imgs/avatar.png" className="absolute img-avatar" width={50} alt="" />
          </div>
          <div className="flex gap-3">
            <div className="flex items-center justify-center rounded-[23px] bg-[#D72229] py-[8px] px-[20px] relative">
              <a href={"/add-screen"}>
                <img src="/imgs/notification.svg" alt="not" srcSet="" />
              </a>
            </div>
            <div className="flex items-center justify-center rounded-[23px] bg-[#D72229] py-[8px] px-[18px] relative">
              <a href={"/add-notification"}>
                <img src="/imgs/screen.svg" alt="not" srcSet="" />
              </a>
            </div>
            <div className="flex items-center justify-center rounded-[23px] bg-[#D72229] py-[8px] px-[18px] relative">
              <a href={"/add-article"}>
                <img src="/imgs/Group 372.svg" alt="not" srcSet="" />
              </a>
            </div>
          </div>

        </div>

        <div className="px-10 flex gap-3 items-center">
          <button className="flex items-center gap-1 px-3 py-2 rounded-full bg-red-100 text-red-600 text-sm ">
            <span>AR</span>
          </button>

          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="bg-[#D72229] text-white px-4 py-2 rounded-[15px] hover:bg-red-700 transition"
          >
            تسجيل الخروج
          </button>
        </div>
      </nav>
    </>
  );
}

export default MainNavbar;
