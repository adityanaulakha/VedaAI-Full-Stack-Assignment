"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, FileText, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { getAssignments } from '@/lib/api';
import AssignmentCard from '@/components/assignments/AssignmentCard';

export default function Home() {
  const [recentAssignments, setRecentAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getAssignments();
        // Sort by latest and take top 2
        const sorted = data.sort((a: any, b: any) => new Date(b.assignedOn).getTime() - new Date(a.assignedOn).getTime());
        setRecentAssignments(sorted.slice(0, 2));
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="max-w-6xl mx-auto h-full px-2 pb-24">
      {/* Header Section */}
      <div className="flex flex-col mb-10 pt-4">
        <h1 className="text-[32px] lg:text-[40px] font-extrabold text-text-primary tracking-tight leading-tight">
          Welcome back, <span className="text-brand-primary">Aditya!</span>
        </h1>
        <p className="text-[#8C8C8C] text-[16px] font-medium mt-2 max-w-2xl">
          Here's what's happening with your classes today. Generate new AI-powered assignments or review your recent materials.
        </p>
      </div>

      <div className="mb-12">
        {/* Quick Action Card */}
        <div className="bg-[#1a1a1a] rounded-[32px] p-8 lg:p-10 relative overflow-hidden text-white shadow-xl group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-[28px] font-extrabold mb-3 leading-tight">Create a new<br/>AI Assignment</h2>
              <p className="text-white/70 font-medium max-w-sm mb-8 text-[15px] leading-relaxed">
                Let VedaAI instantly generate comprehensive question papers, quizzes, and rubrics tailored to your curriculum.
              </p>
            </div>
            
            <Link href="/assignments/create" className="inline-block">
              <button className="bg-white text-[#1a1a1a] px-8 py-3.5 rounded-full font-extrabold text-[15px] hover:bg-gray-100 transition-colors flex items-center gap-2 w-fit shadow-md group-hover:scale-[1.02] duration-300">
                Start Generating <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-text-primary flex items-center gap-3">
            <Clock className="w-5 h-5 text-brand-primary" />
            Recent Assignments
          </h2>
          <Link href="/assignments" className="text-brand-primary font-bold text-sm hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            <div className="flex-1 h-48 bg-white rounded-[32px] animate-pulse border border-border shadow-sm"></div>
            <div className="flex-1 h-48 bg-white rounded-[32px] animate-pulse border border-border shadow-sm hidden lg:block"></div>
          </div>
        ) : recentAssignments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentAssignments.map((assignment) => (
              <AssignmentCard 
                key={assignment._id}
                assignment={assignment}
                onDelete={() => {}} // dummy for home page
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[32px] p-10 text-center border border-border shadow-sm">
            <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[#B3B3B3]" />
            </div>
            <h3 className="text-lg font-extrabold text-text-primary mb-2">No assignments yet</h3>
            <p className="text-[#8C8C8C] text-sm font-medium mb-6">Create your first assignment to see it here.</p>
            <Link href="/assignments/create">
              <button className="bg-[#1a1a1a] text-white px-6 py-2.5 rounded-full font-bold text-[14px] hover:bg-black transition-colors shadow-md">
                Create Assignment
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
