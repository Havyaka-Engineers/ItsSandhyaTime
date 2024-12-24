import { Progressbar } from 'konsta/react';
import { formatTime } from '../utils/durationCalculator';

interface PlayerTopBarProps {
  currentLessonIndex: number;
  totalLessons: number;
  timeElapsed: number;
  sessionDuration: number;
  lessonTitle: string;
}

function PlayerTopBar({ currentLessonIndex, totalLessons, timeElapsed, sessionDuration, lessonTitle }: PlayerTopBarProps) {
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

      {/* Time information */}
      <div className="flex justify-center items-center py-2 text-sm text-gray-600">
        <span>{formatTime(timeElapsed)}</span>
        <span className="mx-1">/</span>
        <span>{formatTime(sessionDuration)}</span>
      </div>

      {/* Lesson title */}
      <div className="flex-1 flex items-end justify-center pb-3">
        <span className="text-lg font-bold">{lessonTitle || 'Loading...'}</span>
      </div>
    </div>
  );
}

export default PlayerTopBar;
