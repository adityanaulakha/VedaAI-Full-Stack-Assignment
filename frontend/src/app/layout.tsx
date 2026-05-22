import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VedaAI Assignment System',
  description: 'AI Assessment Creator for Indian schools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-brand-bg">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 lg:ml-[312px]">
            <TopBar />
            <main className="flex-1 p-4 lg:p-8 lg:pt-4 pb-[80px] lg:pb-8 overflow-x-hidden">
              {children}
            </main>
          </div>
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
