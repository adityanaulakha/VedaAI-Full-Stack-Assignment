"use client";

import { usePathname } from 'next/navigation';
import { Bell, ChevronRight } from 'lucide-react';

export default function TopBar() {
  const pathname = usePathname();

  // Create breadcrumb from pathname
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumb = paths.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' > ') || 'Home';

  return (
    <div className="h-[72px] bg-brand-surface border-b border-border flex items-center justify-between px-6 md:ml-[280px]">
      <div className="flex items-center text-sm font-medium text-text-secondary">
        {breadcrumb}
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-text-secondary hover:bg-brand-bg rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-danger rounded-full border border-white"></span>
        </button>

        <div className="flex items-center gap-3 cursor-pointer pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
            LS
          </div>
          <div className="hidden md:block text-sm font-semibold text-text-primary">
            Lakshya Sharma
          </div>
          <ChevronRight className="w-4 h-4 text-text-secondary hidden md:block" />
        </div>
      </div>
    </div>
  );
}
