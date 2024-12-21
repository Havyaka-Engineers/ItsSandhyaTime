export interface Lesson {
  code: string;          // Unique identifier/primary key
  title: string;         // Title of the lesson
  videoId: number;        // Video ID
  description: string;   // Brief description
  steps: { startTime: number }[]; // Array of step objects, each with a startTime
  isLoopedLesson: boolean; // Whether the lesson is a looped lesson
  loopCount: number;    // Number of times to loop the lesson, defaults to 0
  duration: number;      // Duration of the lesson in seconds
}
