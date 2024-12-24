import { Progressbar } from 'konsta/react';

interface PlayerTopBarProps {
  currentLessonIndex: number;
  totalLessons: number;
}

function PlayerTopBar({ currentLessonIndex, totalLessons }: PlayerTopBarProps) {
  const calculateProgress = () => {
    if (totalLessons === 0) return 0;
    return currentLessonIndex / totalLessons;
  };

  return (
    <div className="w-full h-[15vh] bg-white flex flex-col">
      {/* Progress bar container */}
      <div className="w-full h-1.5">
        <Progressbar className="k-color-brand-red h-full" progress={calculateProgress()} />
      </div>

      {/* Remaining top area content */}
      <div className="flex-1">{/* Other top bar content will go here */}</div>
    </div>
  );
}

export default PlayerTopBar;
