import { Step } from './Step';

export interface Lesson {
  code: string; // Unique identifier/primary key
  title: string; // Title of the lesson
  videoId: number; // Video ID
  description: string; // Brief description
  duration: number; // Duration of the lesson in seconds
  steps: Step[]; // Array of steps with their properties
}
