"use client";

import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, ArrowLeft, Grid } from 'lucide-react';
import Image from 'next/image';

export default function TopBar() {
  const pathname = usePathname();

  // Create breadcrumb from pathname
  let breadcrumb = 'Home';
  if (pathname.includes('/assignments/create') || pathname.match(/\/assignments\/[a-zA-Z0-9]+$/)) {
    breadcrumb = 'Create New';
  } else if (pathname.includes('/assignments')) {
    breadcrumb = 'Assignment';
  } else if (pathname.includes('/groups')) {
    breadcrumb = 'Groups';
  }

  return (
    <div className="h-[72px] flex items-center justify-between px-6 pt-4 bg-transparent z-10 relative">
      <div className="flex items-center gap-3">
        <button className="text-text-primary hover:bg-black/5 p-1 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-[15px] font-semibold text-[#8C8C8C]">
          <Grid className="w-4 h-4 text-[#B3B3B3]" />
          <span>{breadcrumb}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-text-primary hover:bg-black/5 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full border border-white"></span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-full shadow-sm">
          <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
            AN
          </div>
          <div className="hidden md:block text-[13px] font-bold text-text-primary pl-1 pr-1">
            Aditya Naulakha
          </div>
          <ChevronDown className="w-4 h-4 text-text-secondary hidden md:block" />
        </div>
      </div>
    </div>
  );
}
