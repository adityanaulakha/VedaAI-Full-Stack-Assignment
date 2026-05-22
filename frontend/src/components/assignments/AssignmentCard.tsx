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
    <div className="bg-brand-surface rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex justify-between items-start mb-4">
        <Link href={`/assignments/${assignment._id}`} className="hover:text-brand-primary transition-colors">
          <h3 className="text-lg font-bold text-text-primary underline decoration-border hover:decoration-brand-primary underline-offset-4">
            {assignment.title}
          </h3>
        </Link>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-text-secondary hover:bg-brand-bg rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-1 z-10">
              <Link 
                href={`/assignments/${assignment._id}`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-brand-bg transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Assignment
              </Link>
              <button 
                onClick={() => {
                  setShowMenu(false);
                  onDelete(assignment._id);
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-brand-danger hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="font-medium">Assigned on:</span> {formatDate(assignment.assignedOn)}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Due:</span> {formatDate(assignment.dueDate)}
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
