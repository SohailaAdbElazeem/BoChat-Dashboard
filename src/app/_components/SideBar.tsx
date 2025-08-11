'use client';
import './css/SideBar.css';

import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Users,
  MessageCircle,
  Mail,
  Bell,
  ThumbsUp,
  Search,
  UserX,
  Shield,
  CheckCircle,
  ClipboardType,
} from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { icon: <Home size={24} />, label: 'home', route: '/' },
  { icon: <Users size={24} />, label: 'users', route: '/users' },
  { icon: <MessageCircle size={24} />, label: 'comments', route: '/comments' },
  { icon: <Mail size={24} />, label: 'messages', route: '/messages' },
  { icon: <Bell size={24} />, label: 'notifications', route: '/notifications' },
  { icon: <ThumbsUp size={24} />, label: 'likes', route: '/likes' },
  { icon: <ClipboardType size={24} />, label: 'posts', route: '/posts' },
  { icon: <Search size={24} />, label: 'search', route: '/search' },
  { icon: <UserX size={24} />, label: 'blocked', route: '/blocked' },
  { icon: <Shield size={24} />, label: 'security', route: '/security' },
  { icon: <CheckCircle size={24} />, label: 'verified', route: '/verified' },
];

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex">
      <aside className="fixed top-25 left-0 h-[85vh] w-[65px] bg-[#D72229] flex flex-col items-center justify-between py-4 rounded-tr-[24px] rounded-br-[24px] z-50">
        <nav className="flex flex-col items-center gap-5 flex-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.route)}
              className={`text-white hover:opacity-100 w-[100%] transition-transform duration-200 ${
                pathname === item.route ? 'active dark:active-dark' : 'opacity-70'
              }`}
            >
              {item.icon}
            </button>
          ))}
        </nav>

        <div className="relative mb-2">
          <div className="active">
            <Image
              src="/imgs/avatar.png"
              alt="User Avatar"
              width={30}
              height={30}
              className="rounded-full"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
