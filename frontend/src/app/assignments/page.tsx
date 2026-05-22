"use client";

import { useEffect, useState } from 'react';
import { Search, Filter, Plus, FileX2 } from 'lucide-react';
import Link from 'next/link';
import AssignmentCard from '@/components/assignments/AssignmentCard';
import { getAssignments, deleteAssignment } from '@/lib/api';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto h-full relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            Assignments
            <span className="w-2 h-2 bg-brand-success rounded-full block mt-1"></span>
          </h1>
          <p className="text-text-secondary text-sm mt-1">Manage and create assignments for your classes.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-brand-surface text-text-primary hover:bg-brand-bg transition-colors whitespace-nowrap font-medium">
            <Filter className="w-4 h-4" />
            Filter By
          </button>
          
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search Assignment" 
              className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-brand-surface text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-shadow"
            />
          </div>
        </div>
      </div>

      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map(assignment => (
            <AssignmentCard 
              key={assignment._id} 
              assignment={assignment} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-brand-surface rounded-2xl border border-border shadow-sm flex items-center justify-center">
              <FileX2 className="w-10 h-10 text-brand-primary" />
            </div>
            <div className="absolute -top-2 -right-2 text-xl">✨</div>
            <div className="absolute -bottom-2 -left-2 text-xl">✨</div>
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">No assignments yet</h3>
          <p className="text-text-secondary max-w-sm mb-8">
            You haven't created any assignments. Click the button below to generate your first AI-powered assignment.
          </p>
          <Link href="/assignments/create">
            <button className="bg-text-primary text-white rounded-full py-3 px-6 font-medium hover:bg-black transition-colors shadow-md">
              + Create Your First Assignment
            </button>
          </Link>
        </div>
      )}

      {/* Floating Action Button - only visible if there are assignments */}
      {assignments.length > 0 && (
        <Link href="/assignments/create" className="fixed bottom-24 md:bottom-8 left-1/2 md:left-[calc(50%+140px)] -translate-x-1/2 z-40">
          <button className="bg-text-primary text-white rounded-full py-3 px-6 font-medium hover:bg-black transition-transform hover:scale-105 shadow-xl flex items-center gap-2 border border-gray-800">
            <Plus className="w-4 h-4" />
            Create Assignment
          </button>
        </Link>
      )}
      
      {/* Mobile FAB */}
      {assignments.length > 0 && (
        <Link href="/assignments/create" className="md:hidden fixed bottom-20 right-4 z-40">
          <button className="w-14 h-14 bg-brand-primary text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-transform hover:scale-105 shadow-xl">
            <Plus className="w-6 h-6" />
          </button>
        </Link>
      )}
    </div>
  );
}
