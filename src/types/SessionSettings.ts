import { Lesson } from './Lesson';

export type SessionSettings = {
  sandhyaTime: 'pratah' | 'sayam';
  learningMode: 'repeat' | 'perform';
  chantingSpeed: 'slow' | 'regular' | 'fast';
  gayatriCount: number;
  ashtakshariCount: number;
  panchakshariCount: number;
  vocalPitch: 'deep' | 'sharp';
  language: 'english' | 'kannada';
  duration: number;
  lessons: Lesson[];
}; 