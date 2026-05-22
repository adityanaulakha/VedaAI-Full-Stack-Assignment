interface DifficultyBadgeProps {
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
}

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const getStyles = () => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Moderate':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Challenging':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStyles()} tracking-wide ml-2 align-middle`}>
      {difficulty}
    </span>
  );
}
