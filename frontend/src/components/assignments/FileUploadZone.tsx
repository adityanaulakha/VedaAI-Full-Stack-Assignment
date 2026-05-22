"use client";

import { useState, useRef } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { useAssignmentStore } from '@/store/assignmentStore';

export default function FileUploadZone() {
  const { file, setField } = useAssignmentStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setField('file', e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setField('file', e.target.files[0]);
    }
  };

  return (
    <div className="mb-8">
      <div 
        className={`border-2 border-dashed rounded-[24px] p-10 flex flex-col items-center justify-center transition-colors cursor-pointer ${
          isDragging ? 'border-[#1a1a1a] bg-gray-50' : 'border-[#CCCCCC] hover:border-text-secondary bg-white'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
          accept=".jpeg,.jpg,.png,.pdf"
        />
        
        {file ? (
          <div className="flex items-center justify-between w-full max-w-sm bg-brand-bg p-4 rounded-xl border border-border">
            <div className="flex items-center gap-3 overflow-hidden">
              <FileIcon className="w-8 h-8 text-brand-primary flex-shrink-0" />
              <div className="truncate">
                <p className="text-sm font-semibold text-text-primary truncate">{file.name}</p>
                <p className="text-xs text-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); setField('file', null); }}
              className="p-1 text-text-secondary hover:text-brand-danger transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <UploadCloud className="w-12 h-12 text-[#999999]" />
            </div>
            <p className="text-[#1A1A1A] font-extrabold text-lg mb-1 text-center">Choose a file or drag & drop it here</p>
            <p className="text-[#8C8C8C] text-[13px] mb-6 text-center">JPEG, PNG, upto 10MB</p>
            <button type="button" className="px-6 py-2.5 border-none bg-[#F2F2F2] rounded-full text-[13px] font-bold text-text-primary hover:bg-[#e6e6e6] transition-colors">
              Browse Files
            </button>
          </>
        )}
      </div>
      {!file && (
        <p className="text-[#8C8C8C] text-[13px] mt-3 text-center">
          Upload images of your preferred document/image (Optional)
        </p>
      )}
    </div>
  );
}
