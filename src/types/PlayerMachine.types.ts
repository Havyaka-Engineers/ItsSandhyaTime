import { Lesson } from './Lesson';
import { SessionSettings } from './SessionSettings';

/**
 * Represents the context state of the player machine
 */
export interface PlayerContext {
  /** The HTML container element where the Vimeo player will be mounted */
  container: HTMLDivElement;
  /** Array of lessons in the current session */
  lessons: Lesson[];
  /** Index of the currently playing lesson */
  currentLessonIndex: number;
  /** Time elapsed in the current session (in seconds) */
  timeElapsed: number;
  /** Total duration of the session (in seconds) */
  sessionDuration: number;
}

export interface PlayerInput {
  sessionSettings: SessionSettings;
}

export type PlayerEvents =
  | { type: 'VIMEO_CONTAINER_AVAILABLE'; container: HTMLDivElement }
  | { type: 'VIMEO_PLAYER_CREATED' }
  | { type: 'LESSON_FETCHED' }
  | { type: 'LESSON_ENDED' }
  | { type: 'NEXT_LESSON' }
  | { type: 'PREV_LESSON' };
