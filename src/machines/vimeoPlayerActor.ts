import { fromCallback } from 'xstate';
import Player from '@vimeo/player';
import { Lesson } from '../types/Lesson';

export const createVimeoPlayerActor = () => {
  return fromCallback(({ sendBack, receive, input }: { sendBack: any; receive: any; input: { container: HTMLElement } }) => {
    let player: Player | null = null;
    let isSeeked = false;

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
        lesson.steps.forEach((step, index) => {
          const stepEndTime = index < lesson.steps.length - 1 ? lesson.steps[index + 1].startTime : lesson.duration - 1;

          player!.addCuePoint(stepEndTime, {
            customKey: {
              stepIndex: index,
              stepType: step.stepType,
              stepStartTime: step.startTime,
              stepEndTime: stepEndTime,
            },
          });
        });

        // Handle cue point events
        player.on('cuepoint', (data) => {
          if (isSeeked) {
            isSeeked = false;
            return;
          } else {
            const step = data.data.customKey;
            sendBack({
              type: 'STEP_ENDED',
              step,
            });
          }
        });
      } else if (event.type === 'TOGGLE_PLAY') {
        player!.getPaused().then((paused) => {
          if (paused) {
            player!.play();
          } else {
            player!.pause();
          }
        });
      } else if (event.type === 'SEEK_TO') {
        console.log('seeking to', event.time);
        player!.setCurrentTime(event.time);
        isSeeked = true;
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
