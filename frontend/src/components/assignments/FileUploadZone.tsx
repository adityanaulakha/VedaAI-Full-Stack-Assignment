"use client";

import { useState, useRef } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { useAssignmentStore } from '@/store/assignmentStore';

export default function FileUploadZone() {
  const { file, setFile } = useAssignmentStore();
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
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="mb-8">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${
          isDragging ? 'border-brand-primary bg-orange-50' : 'border-border hover:border-text-secondary bg-brand-surface'
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
          <div className="flex items-center justify-between w-full max-w-sm bg-brand-bg p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3 overflow-hidden">
              <FileIcon className="w-8 h-8 text-brand-primary flex-shrink-0" />
              <div className="truncate">
                <p className="text-sm font-semibold text-text-primary truncate">{file.name}</p>
                <p className="text-xs text-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="p-1 text-text-secondary hover:text-brand-danger transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-text-secondary" />
            </div>
            <p className="text-text-primary font-semibold mb-1 text-center">Choose a file or drag & drop it here</p>
            <p className="text-text-secondary text-sm mb-4 text-center">JPEG, PNG, PDF upto 10MB</p>
            <button type="button" className="px-6 py-2 border border-border rounded-lg text-sm font-medium hover:bg-brand-bg transition-colors">
              Browse Files
            </button>
          </>
        )}
      </div>
      {!file && (
        <p className="text-text-secondary text-xs mt-2 text-center">
          Upload images of your preferred document/image (Optional)
        </p>
      )}
    </div>
  );
}
