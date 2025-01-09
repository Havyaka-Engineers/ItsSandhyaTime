import { PlayerContext } from '../types/PlayerMachine.types';

export const isLastLesson = ({ context }: { context: PlayerContext }) => {
  return context.currentLessonIndex === context.lessons.length - 1;
};

export const isFirstLesson = ({ context }: { context: PlayerContext }) => {
  return context.currentLessonIndex === 0;
};

export const isNextStepInstruction = ({ context }: { context: PlayerContext }) => {
  const nextStepIndex = context.currentStepIndex + 1;

  // Check if we're at the last step
  if (nextStepIndex >= context.lessons[context.currentLessonIndex].steps.length) {
    return false;
  }

  // Get the next step and check if it's an instruction
  const nextStep = context.lessons[context.currentLessonIndex].steps[nextStepIndex];
  return nextStep.stepType === 'instruction';
};

export const isPerformMode = ({ context }: { context: PlayerContext }) => {
  return (
    context.currentStepIndex < context.lessons[context.currentLessonIndex].steps.length - 1 &&
    context.sessionSettings.learningMode === 'perform'
  );
};

export const isLearnMode = ({ context }: { context: PlayerContext }) => {
  return (
    context.currentStepIndex < context.lessons[context.currentLessonIndex].steps.length - 1 &&
    context.sessionSettings.learningMode === 'repeat'
  );
};
