import { Lesson } from './Lesson';
import { LoopType } from './Step';

export type LoopSettings = Record<LoopType, number>;

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
