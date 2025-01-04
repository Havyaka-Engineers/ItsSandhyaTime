import { PlayerContext } from '../types/PlayerMachine.types';

export const isLastLesson = ({ context }: { context: PlayerContext }) => {
  return context.currentLessonIndex === context.lessons.length - 1;
};

export const isFirstLesson = ({ context }: { context: PlayerContext }) => {
  return context.currentLessonIndex === 0;
};
