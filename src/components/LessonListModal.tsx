import { Sheet, Block, Navbar } from 'konsta/react';
import { formatTime } from '../utils/durationCalculator';

interface LessonListModalProps {
  opened: boolean;
  onClose: () => void;
  lessons: { title: string; duration: number }[];
}

const LessonListModal: React.FC<LessonListModalProps> = ({ opened, onClose, lessons }) => {
  return (
    <Sheet
      className="pb-safe !w-[calc(100%-16px)] mx-2 rounded-t-xl"
      opened={opened}
      onBackdropClick={onClose}
    >
      <Navbar
        centerTitle
        title="Lesson List"
        subtitle="Your session lessons"
      />

      <Block className="space-y-2">
        {lessons.map((lesson, index) => (
          <div key={index} className="flex justify-between items-center p-4 border-b">
            <span className="text-lg">{lesson.title}</span>
            <span className="text-gray-600">{formatTime(lesson.duration)}</span>
          </div>
        ))}
      </Block>
    </Sheet>
  );
};

export default LessonListModal; 