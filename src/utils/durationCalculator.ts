import { SessionSettings } from '../types/SessionSettings';
import { Lesson } from '../types/Lesson';

// Speed multipliers for different chanting speeds
const SPEED_MULTIPLIERS = {
  slow: 1,         // 1x playback = original duration
  regular: 0.67,   // 1.5x playback = 2/3 of original duration
  fast: 0.5        // 2x playback = half of original duration
};

// Mode multipliers
const MODE_MULTIPLIERS = {
  repeat: 2,       // Repeat mode takes longer as it includes instruction time
  perform: 1       // Perform mode is direct execution
};

export function calculateLessonDuration(lesson: Lesson, settings: SessionSettings): number {
  console.log(`\nCalculating duration for lesson: ${lesson.code}`);
  console.log(`Initial duration: ${lesson.duration} seconds`);
  
  let duration = lesson.duration;

  // Apply speed multiplier
  const speedMultiplier = SPEED_MULTIPLIERS[settings.chantingSpeed];
  duration *= speedMultiplier;
  console.log(`After speed multiplier (${settings.chantingSpeed}: ${speedMultiplier}x): ${duration} seconds`);

  // Apply mode multiplier if not a looped lesson
  if (!lesson.isLoopedLesson) {
    const modeMultiplier = MODE_MULTIPLIERS[settings.learningMode];
    duration *= modeMultiplier;
    console.log(`After mode multiplier (${settings.learningMode}: ${modeMultiplier}x): ${duration} seconds`);
  } else {
    console.log(`Lesson is looped, skipping mode multiplier`);
  }

  // Handle looped lessons
  if (lesson.isLoopedLesson) {
    console.log(`Looped lesson with count: ${lesson.loopCount}`);
    duration *= lesson.loopCount;
    console.log(`After applying loop count: ${duration} seconds`);
  }

  console.log(`Final duration: ${duration} seconds\n`);
  return duration;
}

export function calculateTotalDuration(settings: SessionSettings): number {
  console.log('Starting total duration calculation');
  console.log(`Number of lessons: ${settings.lessons.length}`);
  
  const total = settings.lessons.reduce((total, lesson) => {
    const lessonDuration = calculateLessonDuration(lesson, settings);
    console.log(`Lesson ${lesson.code} contributes ${lessonDuration} seconds to total`);
    return total + lessonDuration;
  }, 0);
  
  console.log(`Total duration: ${total} seconds (${formatTime(total)})`);
  return total;
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  return `${minutes}:${remainingSeconds}`;
} 