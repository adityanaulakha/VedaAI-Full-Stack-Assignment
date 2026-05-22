"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, BookOpen, Wrench } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Assignments', href: '/assignments', icon: FileText },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-brand-surface border-t border-border flex items-center justify-around px-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href) && item.href !== '/' || (item.href === '/' && pathname === '/');
        const Icon = item.icon;
        
        return (
          <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-brand-primary' : 'text-text-secondary'}`}>
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
