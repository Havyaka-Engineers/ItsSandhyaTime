import { Lesson } from './Lesson';
import { SessionSettings } from './SessionSettings';
import { Step } from './Step';

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

  currentStepIndex: number;
  /** Time elapsed in the current session (in seconds) */
  timeElapsed: number;

  sessionSettings: SessionSettings;
}

export interface PlayerInput {
  sessionSettings: SessionSettings;
}

export type PlayerEvents =
  // vimeo player events
  | { type: 'VIMEO_PLAYER_CREATED' }
  | { type: 'VIDEO_LOADED' }
  | { type: 'VIDEO_ENDED' }
  | { type: 'VIDEO_PLAY' }
  | { type: 'VIDEO_PAUSE' }
  | { type: 'VIDEO_BUFFER_START' }
  | { type: 'VIDEO_ERROR' }
  | { type: 'STEP_ENDED'; step: Step }

  // user interface events
  | { type: 'VIMEO_CONTAINER_AVAILABLE'; container: HTMLDivElement }
  | { type: 'TOGGLE_PLAY' };
