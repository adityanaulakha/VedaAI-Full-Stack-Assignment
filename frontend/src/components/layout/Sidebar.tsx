"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, Users, FileText, Wrench, BookOpen, Settings, Sparkles } from 'lucide-react';
import { getAssignments } from '@/lib/api';

export default function Sidebar() {
  const pathname = usePathname();
  const [assignmentCount, setAssignmentCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data = await getAssignments();
        setAssignmentCount(data.length);
      } catch (error) {
        console.error('Failed to fetch assignment count:', error);
      }
    };
    fetchCount();
  }, []);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Assignments', href: '/assignments', icon: FileText, count: assignmentCount },
  ];

  return (
    <div className="hidden lg:flex flex-col w-[280px] h-[calc(100vh-32px)] m-4 rounded-[24px] bg-brand-surface fixed left-0 top-0 shadow-sm overflow-hidden z-20">
      {/* Logo */}
      <div className="p-6 pb-8 flex items-center">
        <Link href="/" className="cursor-pointer">
          <Image src="/Logo.png" alt="VedaAI Logo" width={140} height={40} className="h-8 w-auto object-contain" />
        </Link>
      </div>

      {/* Create Button */}
      <div className="px-5 pb-6">
        <Link href="/assignments/create">
          <button className="w-full bg-[#2a2a2a] border-2 border-brand-primary text-white rounded-full py-3 px-4 flex items-center justify-center gap-2 font-medium hover:bg-black transition-colors shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
            Create Assignment
          </button>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && item.href !== '/' || (item.href === '/' && pathname === '/');
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href} className={`flex items-center justify-between px-4 py-3.5 rounded-[16px] transition-colors ${isActive ? 'bg-[#F2F2F2] text-text-primary font-semibold' : 'text-text-secondary hover:bg-brand-bg hover:text-text-primary font-medium'}`}>
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-text-primary' : 'text-text-secondary'}`} />
                <span>{item.name}</span>
              </div>
              {item.count != null && item.count > 0 && (
                <span className="bg-brand-primary text-white text-[10px] py-0.5 px-2 rounded-full font-bold">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile */}
      <div className="p-4 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-[16px] bg-[#F2F2F2]">
          <div className="w-10 h-10 rounded-full bg-[#E8470A] text-white flex items-center justify-center font-bold text-[15px] flex-shrink-0 shadow-sm">
            DP
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-text-primary truncate">Delhi Public School</span>
            <span className="text-[11px] text-text-secondary truncate">Sector-45, Noida</span>
          </div>
        </div>
      </div>
    </div>
  );
}
