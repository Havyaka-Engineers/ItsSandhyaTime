interface PlayerBottomBarProps {
  currentLessonIndex: number;
  totalLessons: number;
  lessonTitle: string;
}

function PlayerBottomBar({ currentLessonIndex, totalLessons, lessonTitle }: PlayerBottomBarProps) {
  console.log('currentLessonIndex', currentLessonIndex);
  console.log('totalLessons', totalLessons);
  console.log('lessonTitle', lessonTitle);
  return <div className="w-full h-[15vh] bg-white">{/* Bottom bar content will be added later */}</div>;
}

export default PlayerBottomBar;
