"use client";

import { useEffect, useState } from 'react';
import { Search, Filter, Plus, FileX2 } from 'lucide-react';
import Link from 'next/link';
import AssignmentCard from '@/components/assignments/AssignmentCard';
import { getAssignments, deleteAssignment } from '@/lib/api';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState<'latest' | 'due-soon' | 'a-z'>('latest');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAssignment(id);
      setAssignments(assignments.filter(a => a._id !== id));
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const filteredAndSortedAssignments = assignments
    .filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (filterOption === 'due-soon') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (filterOption === 'a-z') {
        return a.title.localeCompare(b.title);
      }
      // default: latest
      return new Date(b.assignedOn).getTime() - new Date(a.assignedOn).getTime();
    });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto h-full relative px-2">
      <div className="flex flex-col mb-8 gap-2">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <span className="w-3 h-3 bg-[#22C55E] rounded-full shadow-[0_0_0_4px_rgba(34,197,94,0.2)]"></span>
          Assignments
        </h1>
        <p className="text-[#8C8C8C] text-sm font-medium">Manage and create assignments for your classes.</p>
      </div>
      
      <div className="flex items-center justify-between w-full bg-white rounded-full px-5 py-3 mb-6 shadow-sm border border-border">
        <div className="relative">
          <button 
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center gap-2 text-[#8C8C8C] hover:text-text-primary transition-colors whitespace-nowrap text-[14px] font-semibold"
          >
            <Filter className="w-5 h-5" />
            Filter By {filterOption !== 'latest' && <span className="w-2 h-2 rounded-full bg-brand-primary"></span>}
          </button>

          {showFilterMenu && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-border rounded-[20px] shadow-lg py-2 z-50 overflow-hidden">
              <button 
                onClick={() => { setFilterOption('latest'); setShowFilterMenu(false); }}
                className={`w-full text-left px-5 py-2.5 text-sm font-bold hover:bg-[#F2F2F2] transition-colors ${filterOption === 'latest' ? 'text-brand-primary' : 'text-text-primary'}`}
              >
                Latest First
              </button>
              <button 
                onClick={() => { setFilterOption('due-soon'); setShowFilterMenu(false); }}
                className={`w-full text-left px-5 py-2.5 text-sm font-bold hover:bg-[#F2F2F2] transition-colors ${filterOption === 'due-soon' ? 'text-brand-primary' : 'text-text-primary'}`}
              >
                Due Soon
              </button>
              <button 
                onClick={() => { setFilterOption('a-z'); setShowFilterMenu(false); }}
                className={`w-full text-left px-5 py-2.5 text-sm font-bold hover:bg-[#F2F2F2] transition-colors ${filterOption === 'a-z' ? 'text-brand-primary' : 'text-text-primary'}`}
              >
                A-Z
              </button>
            </div>
          )}
        </div>
        
        <div className="relative w-64 md:w-80">
          <Search className="w-4 h-4 text-[#B3B3B3] absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search Assignment" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#E5E5E5] bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] transition-shadow"
          />
        </div>
      </div>

      {filteredAndSortedAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
          {filteredAndSortedAssignments.map(assignment => (
            <AssignmentCard 
              key={assignment._id} 
              assignment={assignment} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center relative">
          <div className="relative mb-6">
            <div className="w-48 h-48 rounded-full bg-white shadow-sm flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[#F2F2F2] rounded-full m-8"></div>
              {/* Simple CSS illustration of document with search and X */}
              <div className="w-20 h-28 bg-white border border-gray-200 rounded-lg shadow-sm z-10 flex flex-col items-center pt-4 gap-2">
                <div className="w-12 h-2 bg-gray-200 rounded-full"></div>
                <div className="w-12 h-2 bg-gray-200 rounded-full"></div>
                <div className="w-10 h-2 bg-gray-200 rounded-full self-start ml-4"></div>
              </div>
              <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/80 backdrop-blur-sm border-[4px] border-[#d4c3f5] rounded-full shadow-lg flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#EF4444] text-white flex items-center justify-center font-bold text-xl relative">
                   <div className="absolute w-6 h-1 bg-white rotate-45 rounded-full"></div>
                   <div className="absolute w-6 h-1 bg-white -rotate-45 rounded-full"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-12 h-4 bg-[#d4c3f5] rotate-45 rounded-full"></div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 -left-8 text-[#14234b]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12c4-4 8 4 16 0" /></svg>
            </div>
          </div>
          <h3 className="text-[22px] font-extrabold text-text-primary mb-2">No assignments yet</h3>
          <p className="text-text-secondary text-sm max-w-sm mb-8 leading-relaxed">
            Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
          </p>
          <Link href="/assignments/create">
            <button className="bg-[#1e1e1e] text-white rounded-full py-3.5 px-8 font-medium hover:bg-black transition-colors shadow-xl flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Assignment
            </button>
          </Link>
        </div>
      )}

      {/* Floating Action Button - only visible if there are assignments */}
      {assignments.length > 0 && (
        <Link href="/assignments/create" className="fixed bottom-8 left-[50%] -translate-x-1/2 z-40">
          <button className="bg-[#1e1e1e] text-white rounded-full py-3.5 px-8 font-medium hover:bg-black transition-transform hover:scale-105 shadow-2xl flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Assignment
          </button>
        </Link>
      )}
    </div>
  );
}
