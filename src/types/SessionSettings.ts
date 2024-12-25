import { Lesson } from './Lesson';

export interface LoopSettings {
  gayatriCount: number;
  ashtakshariCount: number;
  panchakshariCount: number;
  pranayamaCount: number;
}

export interface SessionSettings {
  sandhyaTime: 'pratah' | 'sayam';
  learningMode: 'repeat' | 'perform';
  chantingSpeed: 'slow' | 'regular' | 'fast';
  vocalPitch: 'deep' | 'sharp';
  language: 'english' | 'kannada';
  duration: number;
  lessons: Lesson[];
  loops: LoopSettings;
}
