"use client";

import Link from 'next/link';
import { MoreVertical, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';

interface AssignmentCardProps {
  assignment: {
    _id: string;
    title: string;
    assignedOn: string;
    dueDate: string;
    status: string;
  };
  onDelete: (id: string) => void;
}

export default function AssignmentCard({ assignment, onDelete }: AssignmentCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  };

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-transparent hover:border-border hover:shadow-md transition-all relative">
      <div className="flex justify-between items-start mb-16">
        <Link href={`/assignments/${assignment._id}`} className="hover:text-brand-primary transition-colors flex-1 pr-4">
          <h3 className="text-[22px] font-extrabold text-text-primary tracking-tight leading-tight">
            {assignment.title}
          </h3>
        </Link>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-[#b3b3b3] hover:text-text-primary hover:bg-brand-bg rounded-full transition-colors"
          >
            <MoreVertical className="w-6 h-6" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-[20px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-border py-2 z-10 overflow-hidden">
              <Link 
                href={`/assignments/${assignment._id}`}
                className="block px-5 py-3 text-[14px] font-bold text-text-primary hover:bg-[#F2F2F2] transition-colors"
              >
                View Assignment
              </Link>
              <button 
                onClick={() => {
                  setShowMenu(false);
                  onDelete(assignment._id);
                }}
                className="block w-full text-left px-5 py-3 text-[14px] font-bold text-[#EF4444] hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-[13px]">
        <div>
          <span className="font-extrabold text-text-primary">Assigned on : </span>
          <span className="font-semibold text-[#8C8C8C]">{formatDate(assignment.assignedOn)}</span>
        </div>
        <div>
          <span className="font-extrabold text-text-primary">Due : </span>
          <span className="font-semibold text-[#8C8C8C]">{formatDate(assignment.dueDate)}</span>
        </div>
      </div>
      
      {/* Optional: Add status badge */}
      {assignment.status === 'processing' && (
        <div className="mt-4 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
          Processing...
        </div>
      )}
      {assignment.status === 'failed' && (
        <div className="mt-4 inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
          Failed
        </div>
      )}
    </div>
  );
}
