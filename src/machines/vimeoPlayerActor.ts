import { fromCallback } from 'xstate';
import Player from '@vimeo/player';
import { Lesson } from '../types/Lesson';

export const createVimeoPlayerActor = () => {
  return fromCallback(({ sendBack, receive, input }: { sendBack: any; receive: any; input: { container: HTMLElement } }) => {
    let player: Player | null = null;

    // Send ready immediately since we don't need to wait for player initialization
    sendBack({ type: 'VIMEO_PLAYER_CREATED' });

    receive((event: any) => {
      if (event.type === 'LOAD_VIDEO') {
        const lesson: Lesson = event.lesson;

        // Cleanup existing player if any
        if (player) {
          player.destroy();
        }

        // Create new player with the video ID from the lesson
        player = new Player(input.container, {
          id: lesson.videoId,
          autopause: false,
          autoplay: true,
          controls: false,
          playsinline: true,
          responsive: true,
          loop: false,
        });

        // Send back the event when the video is loaded
        player.on('loaded', () => {
          //temporary hack
          player!.setPlaybackRate(2);

          sendBack({ type: 'VIDEO_LOADED' });
        });

        // Send back the event when the video is ended
        player.on('ended', () => {
          sendBack({ type: 'VIDEO_ENDED' });
        });

        // Send back the event when the video is played
        player.on('play', () => {
          sendBack({ type: 'VIDEO_PLAY' });
        });

        // Send back the event when the video is paused
        player.on('pause', () => {
          sendBack({ type: 'VIDEO_PAUSE' });
        });

        // Send back the event when the video is buffering
        player.on('bufferstart', () => {
          sendBack({ type: 'VIDEO_BUFFER_START' });
        });

        // Send back the event when the video is error
        player.on('error', () => {
          sendBack({ type: 'VIDEO_ERROR' });
        });

        // Set up cue points for each step
        lesson.steps.forEach((step) => {
          player!.addCuePoint(step.startTime, {
            customKey: step,
          });
        });

        // Handle cue point events
        player.on('cuepoint', (data) => {
          const step = data.data.customKey;
          sendBack({
            type: 'STEP_STARTED',
            step,
          });
        });
      }
    });

    // Clean up function
    return () => {
      if (player) {
        player.destroy();
      }
    };
  });
};
