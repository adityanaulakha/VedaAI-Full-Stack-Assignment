"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, BookOpen, Wrench, Sparkles } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Assignments', href: '/assignments', icon: FileText },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 z-50">
      <div className="bg-[#1a1a1a] rounded-[32px] h-[72px] flex items-center justify-around px-2 shadow-xl">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && item.href !== '/' || (item.href === '/' && pathname === '/');
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-white' : 'text-[#8C8C8C] hover:text-white transition-colors'}`}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
