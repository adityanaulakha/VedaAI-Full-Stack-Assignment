"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, Wrench, BookOpen, Settings, Sparkles } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'My Groups', href: '/groups', icon: Users },
    { name: 'Assignments', href: '/assignments', icon: FileText, count: 3 },
    { name: 'AI Teacher\'s Toolkit', href: '/toolkit', icon: Wrench },
    { name: 'My Library', href: '/library', icon: BookOpen },
  ];

  return (
    <div className="hidden md:flex flex-col w-[280px] h-screen bg-brand-surface border-r border-border fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-primary rounded flex items-center justify-center text-white font-bold">V</div>
        <span className="text-xl font-bold text-text-primary tracking-tight">VedaAI</span>
      </div>

      {/* Create Button */}
      <div className="px-6 pb-6">
        <Link href="/assignments/create">
          <button className="w-full bg-text-primary text-white rounded-full py-3 px-4 flex items-center justify-center gap-2 font-medium hover:bg-black transition-colors">
            <Sparkles className="w-4 h-4" />
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
            <Link key={item.name} href={item.href} className={`flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${isActive ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-text-secondary hover:bg-brand-bg'}`}>
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-primary' : 'text-text-secondary'}`} />
                <span>{item.name}</span>
              </div>
              {item.count && (
                <span className="bg-brand-primary text-white text-xs py-0.5 px-2 rounded-full font-medium">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile */}
      <div className="p-4 border-t border-border space-y-1">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-brand-bg transition-colors mb-2">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl border border-border bg-brand-surface shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            LS
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-text-primary">Delhi Public School</span>
            <span className="text-xs text-text-secondary">Bokaro Steel City</span>
          </div>
        </div>
      </div>
    </div>
  );
}
