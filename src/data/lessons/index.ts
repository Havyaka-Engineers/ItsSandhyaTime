import { VISHNU_SMARANA } from './VISHNU_SMARANA';
// import { ACHAMANAM } from './ACHAMANAM';
// import { BHASMADHARANAM } from './BHASMADHARANAM';
// import { SANKALPA_PRATAH } from './SANKALPA_PRATAH';
// import { MARJANAM1 } from './MARJANAM1';
// ... import other lessons

import { Lesson } from '../../types/Lesson';

// Create a record of all lessons
export const mockLessons: Record<string, Lesson> = {
  VISHNU_SMARANA,
  //ACHAMANAM,
  //BHASMADHARANAM,
  //SANKALPA_PRATAH,
  //MARJANAM1,
  // ... add other lessons
};

// Helper functions
export const getLessonByCode = (code: string): Lesson => {
  const lesson = mockLessons[code];
  if (!lesson) {
    throw new Error(`Lesson with code ${code} not found`);
  }
  return lesson;
};

export const getAllLessons = (): Lesson[] => {
  return Object.values(mockLessons);
};
