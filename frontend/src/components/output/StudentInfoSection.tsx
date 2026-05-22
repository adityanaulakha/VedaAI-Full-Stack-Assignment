interface StudentInfoSectionProps {
  className: string;
}

export default function StudentInfoSection({ className }: StudentInfoSectionProps) {
  return (
    <div className="border border-border rounded-xl p-4 md:p-6 mb-8 bg-brand-bg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Student Name</label>
          <div className="w-full border-b-2 border-text-secondary border-dashed h-6"></div>
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Roll Number</label>
          <div className="w-full border-b-2 border-text-secondary border-dashed h-6"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Class</label>
            <div className="w-full border-b-2 border-text-secondary border-dashed h-6 flex items-end pb-1 font-semibold">{className}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Section</label>
            <div className="w-full border-b-2 border-text-secondary border-dashed h-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
