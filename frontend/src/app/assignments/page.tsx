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
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center mb-6 px-2">
        <Link href="/">
          <button className="w-10 h-10 bg-[#e5e5e5] rounded-full flex items-center justify-center mr-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          </button>
        </Link>
        <h1 className="text-[16px] font-extrabold text-text-primary flex-1 text-center pr-14">
          Assignments
        </h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex flex-col mb-8 gap-2">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <span className="w-3 h-3 bg-[#22C55E] rounded-full shadow-[0_0_0_4px_rgba(34,197,94,0.2)]"></span>
          Assignments
        </h1>
        <p className="text-[#8C8C8C] text-sm font-medium">Manage and create assignments for your classes.</p>
      </div>
      
      <div className="flex lg:items-center flex-row w-full bg-white rounded-full px-5 py-3 mb-6 shadow-sm border border-border">
        <div className="relative border-r border-border pr-4 lg:pr-0 lg:border-r-0 flex-shrink-0 flex items-center justify-center min-w-[80px]">
          <button 
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center gap-2 text-[#8C8C8C] hover:text-text-primary transition-colors whitespace-nowrap text-[14px] font-semibold"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filter By</span>
            <span className="sm:hidden">Filter</span>
            {filterOption !== 'latest' && <span className="w-2 h-2 rounded-full bg-brand-primary"></span>}
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
        
        <div className="relative flex-1 pl-4 lg:pl-0 lg:w-80 lg:flex-none">
          <Search className="w-4 h-4 text-[#B3B3B3] absolute left-4 lg:left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search Name" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 lg:pl-11 pr-4 py-1 lg:py-2.5 bg-transparent text-sm font-medium focus:outline-none placeholder:text-[#B3B3B3]"
          />
        </div>
      </div>

      {filteredAndSortedAssignments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24">
          {filteredAndSortedAssignments.map(assignment => (
            <AssignmentCard 
              key={assignment._id} 
              assignment={assignment} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 lg:py-32 text-center relative">
          <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-white shadow-sm flex items-center justify-center relative mb-6">
            <div className="absolute inset-0 bg-[#F2F2F2] rounded-full m-6 lg:m-8"></div>
            <FileX2 className="w-12 h-12 lg:w-16 lg:h-16 text-[#B3B3B3] relative z-10" />
          </div>
          <h3 className="text-[18px] lg:text-[22px] font-extrabold text-text-primary mb-2">No assignments created yet</h3>
          <p className="text-text-secondary text-[13px] lg:text-sm max-w-sm mb-8 leading-relaxed px-4">
            You have not created any assignments yet. Use the + button to create a new assignment.
          </p>
          <Link href="/assignments/create" className="hidden lg:block">
            <button className="bg-[#1e1e1e] text-white rounded-full py-3.5 px-8 font-medium hover:bg-black transition-colors shadow-xl flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Assignment
            </button>
          </Link>
        </div>
      )}

      {/* Floating Action Button - visible on mobile ALWAYS */}
      <Link href="/assignments/create" className="lg:hidden fixed bottom-28 right-6 z-40">
        <button className="bg-white text-[#E8470A] rounded-full w-14 h-14 font-light text-3xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center">
          +
        </button>
      </Link>

      {/* Desktop Floating Action Button - only visible if there are assignments */}
      {assignments.length > 0 && (
        <Link href="/assignments/create" className="hidden lg:flex fixed bottom-8 left-[50%] -translate-x-1/2 z-40">
          <button className="bg-[#1e1e1e] text-white rounded-full py-3.5 px-8 font-medium hover:bg-black transition-transform hover:scale-105 shadow-2xl flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Assignment
          </button>
        </Link>
      )}
    </div>
  );
}
