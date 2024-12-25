import { Lesson } from '../types/Lesson';

export const GAYATRI_JAPA: Lesson = {
  code: 'GAYATRI_JAPA',
  title: 'Gayatri Japa',
  videoId: 123456,
  description: 'Gayatri Mantra Japa',
  duration: 180,
  steps: [
    {
      startTime: 0,
      stepType: 'instruction',
      isLoopStart: false,
      isLoopEnd: false,
    },
    {
      startTime: 10,
      stepType: 'chantOnly',
      isLoopStart: true,
      isLoopEnd: false,
      loopName: 'gayatri',
    },
    {
      startTime: 30,
      stepType: 'chantAndPerform',
      isLoopStart: false,
      isLoopEnd: true,
      loopName: 'gayatri',
    },
  ],
};
