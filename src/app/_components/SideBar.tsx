'use client';
import './css/SideBar.css'

import { useState } from 'react';
import {
  Home,
  Users,
  MessageCircle,
  Mail,
  Bell,
  ThumbsUp,
  CreditCard,
  Search,
  UserX,
  Shield,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';
import GrowthReusable from '../home/_components/GrowthReusable';

const navItems = [
  { icon: <Home size={24} />, label: 'home' },
  { icon: <Users size={24} />, label: 'users' },
  { icon: <MessageCircle size={24} />, label: 'messages' },
  { icon: <Mail size={24} />, label: 'inbox' },
  { icon: <Bell size={24} />, label: 'notifications' },
  { icon: <ThumbsUp size={24} />, label: 'likes' },
  { icon: <CreditCard size={24} />, label: 'payments' },
  { icon: <Search size={24} />, label: 'search' },
  { icon: <UserX size={24} />, label: 'blocked' },
  { icon: <Shield size={24} />, label: 'security' },
  { icon: <CheckCircle size={24} />, label: 'verified' },
];

export default function SideBar() {
  const [active, setActive] = useState('home');

  const renderContent = () => {
    switch (active) {
      case 'users':
        return <GrowthReusable/>
      case 'messages':
        return <div>💬 Messages component</div>;
      case 'inbox':
        return <div>📥 Inbox component</div>;
      case 'likes':
        return <div>👍 Likes component</div>;
      case 'verified':
        return <div>✅ Verified component</div>;
      // ...
      default:
        return <div>🏠 Home component</div>;
    }
  };

  return (
    <div className="flex">
      <aside className="fixed top-25 left-0 h-[80vh] w-[65px] bg-[#D72229] flex flex-col items-center justify-between py-4 rounded-tr-[24px] rounded-br-[24px] z-50">
        <nav className="flex flex-col items-center gap-5 flex-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              className={`text-white  hover:opacity-100 w-[100%] transition-transform duration-200 ${
                active === item.label ? 'active dark:active-dark' : 'opacity-70'
              }`}
            >
              {item.icon}
            </button>
          ))}
        </nav>

        <div className="relative mb-2">
          <div className="bg-white p-1 rounded-full">
            <Image
              src="/imgs/avatar.png"
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        </div>
      </aside>

      <div className="ml-[70px] p-8 w-full">{renderContent()}</div>
    </div>
  );
}
