/* eslint-disable @next/next/no-img-element */
'use client';

import { useTheme } from '../contexts/ThemeContext';
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center rounded-[50] ${theme == 'light'?"bg-[#D7222926] transition ":"dark:bg-[#fff] transition "}  text-gray-800 dark:text-white w-[35] h-[35]`}
    >
      {theme === 'light' ? <img src={'/darkMode.png'} alt='toggle' width={22} height={22} /> :<img src={'/darkMode.png'} alt='toggle' width={22} height={22} /> }
    </button>
  );
}
