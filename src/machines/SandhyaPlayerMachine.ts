import { setup, assign, spawnChild, fromCallback, sendTo } from 'xstate';
import { Lesson } from '../types/Lesson';
import Player from '@vimeo/player';
import { SessionSettings } from '../types/SessionSettings';

export const SandhyaPlayerMachine = setup({
  types: {
    context: {} as {
      lessons: Lesson[];
      currentLessonIndex: number;
      container: HTMLDivElement;
      mode: 'repeat' | 'perform';
      currentStepIndex: number;
      currentStepPlayCount: number;
      // currentLessonLoopCount: number;
      chantingSpeed: SessionSettings['chantingSpeed'];
      sessionDuration: number;
      timeRemaining: number;
      timeElapsed: number;
    },
    input: {} as {
      sessionSettings: SessionSettings;
    },
    events: {} as
      | {
          type: 'SESSION_STARTED';
          container: HTMLDivElement;
        }
      | {
          type: 'VIDEO_PLAYER_READY';
        }
      | {
          type: 'LESSON_LOADED';
        }
      | {
          type: 'PAUSE';
        }
      | {
          type: 'RESUME';
        }
      | {
          type: 'NEXT_LESSON';
        }
      | {
          type: 'PREVIOUS_LESSON';
        }
      | {
          type: 'STEP_ENDED';
        }
      | {
          type: 'NEXT_STEP';
        }
      | {
          type: 'PREVIOUS_STEP';
        }
      | {
          type: 'LESSON_ENDED';
        }
      | {
          type: 'LOOP_ENDED';
        },
  },
  actors: {
    vimeoPlayerActor: fromCallback(
      ({ sendBack, receive, input }: { sendBack: any; receive: any; input: { container: HTMLDivElement } }) => {
        console.log('spawned vimeoPlayerActor player');
        let player: Player | null = null;
        let lastSeekTime: number | null = null;
        let isInitialPlay: boolean = true;

        // Send ready immediately since we don't need to wait for player initialization
        sendBack({ type: 'VIDEO_PLAYER_READY' });

        receive((event: any) => {
          if (event.type === 'LOAD_VIDEO') {
            console.log('Loading video:', event.videoId);

            // Cleanup existing player if any
            if (player) {
              player.destroy();
            }

            // Create new player with the actual video ID
            player = new Player(input.container, {
              id: event.videoId,
              autopause: false,
              autoplay: true,
              controls: false,
              playsinline: true,
              responsive: true,
              loop: false,
            });

            isInitialPlay = true;
            lastSeekTime = null;

            console.log('Created player instance:', player);

            // Set playback speed after player is loaded
            player.on('loaded', () => {
              console.log('Video loaded event from player');

              // Set the playback speed
              player!
                .setPlaybackRate(event.playbackSpeed)
                .then(() => {
                  console.log(`Set playback speed to ${event.playbackSpeed}`);
                })
                .catch(console.error);

              // Add cue points for each step
              event.steps.forEach((step: { startTime: number }) => {
                player!.addCuePoint(step.startTime, {});
                console.log(`Added cue point at ${step.startTime}`);
              });

              // Add cue point 1 second before end
              player!.getDuration().then((duration) => {
                player!.addCuePoint(duration - 1, {});
                console.log(`Added end warning cue point at ${duration - 1}`);
              });

              sendBack({ type: 'LESSON_LOADED' });
              // Start playing after video is loaded
              player!.play().catch(console.error);
            });

            player!.on('play', () => {
              console.log('Video started playing');
            });

            player!.on('pause', () => {
              console.log('ON_PAUSE');
            });

            player!.on('ended', () => {
              console.log('ON_ENDED');
              sendBack({ type: 'LESSON_ENDED' });
            });

            player!.on('cuepoint', (data) => {
              console.log('ON_CUEPOINT:', data.time);
              // Handle the cuepoint event, e.g., send an event to the state machine
              if (data.time !== lastSeekTime) {
                if (data.time === 0 && isInitialPlay) {
                  isInitialPlay = false;
                  console.log('Cuepoint ignored at 0 time');
                } else if (data.time === 0) {
                  sendBack({ type: 'LOOP_ENDED' });
                } else {
                  sendBack({ type: 'STEP_ENDED' });
                }
              } else {
                console.log('Cuepoint ignored');
              }
            });

            player!.on('error', (error) => {
              console.error('Player error:', error);
              sendBack({ type: 'ERROR', error });
            });
          } else if (event.type === 'PAUSE') {
            player!.pause();
          } else if (event.type === 'RESUME') {
            player!.play();
          } else if (event.type === 'SEEK_TO') {
            console.log('ON_SEEK_TO event received; seeking to:', event.time);
            player!.setCurrentTime(event.time);
            lastSeekTime = event.time;
          }
        });

        // Cleanup function
        return () => {
          if (player) {
            player.destroy();
          }
        };
      },
    ),
  },
  guards: {
    hasNextLesson: (context) => {
      return context.context.currentLessonIndex < context.context.lessons.length - 1;
    },
    hasPreviousLesson: (context) => {
      return context.context.currentLessonIndex > 0;
    },
    isInstructionStep: (context) => {
      return (
        context.context.lessons[context.context.currentLessonIndex].steps[context.context.currentStepIndex].stepType ===
        'instruction'
      );
    },
    isPerformMode: (context) => {
      return context.context.mode === 'perform';
    },
    isFirstRepeatPlay: (context) => {
      return (
        context.context.mode === 'repeat' &&
        // !context.context.lessons[context.context.currentLessonIndex].isLoopedLesson &&
        context.context.currentStepPlayCount + 1 < 2
      );
    },
    isSecondRepeatPlay: (context) => {
      return (
        context.context.mode === 'repeat' &&
        // !context.context.lessons[context.context.currentLessonIndex].isLoopedLesson &&
        context.context.currentStepPlayCount + 1 === 2
      );
    },
    hasNextStep: (context) => {
      const currentLesson = context.context.lessons[context.context.currentLessonIndex];
      return context.context.currentStepIndex < currentLesson.steps.length - 1;
    },
    hasPreviousStep: (context) => {
      return context.context.currentStepIndex > 0;
    },
    hasRemainingLoops: (context) => {
      console.log(context.context.lessons[context.context.currentLessonIndex]);
      return false;
      // return context.context.currentLessonLoopCount < context.context.lessons[context.context.currentLessonIndex].loopCount - 1;
    },
  },
  actions: {
    updateTimeRemaining: assign({
      timeElapsed: ({ context }) => {
        console.log('updateTimeRemaining action; context:', context);

        // Calculate duration of fully completed lessons
        const completedLessonsDuration = context.lessons.slice(0, context.currentLessonIndex).reduce((acc, lesson) => {
          // For looped lessons, multiply duration by loopCount
          // if (lesson.isLoopedLesson) {
          //   return acc + lesson.duration * lesson.loopCount;
          // }
          // // For regular lessons in repeat mode, multiply by 2 (each step is played twice)
          // else if (context.mode === 'repeat') {
          //   return acc + lesson.duration * 2;
          // }
          // // For regular lessons in perform mode, just add the duration
          // return acc + lesson.duration;
          console.log('lesson', lesson);
          console.log('acc', acc);
          return 0;
        }, 0);

        console.log('completedLessonsDuration:', completedLessonsDuration, context.currentLessonIndex);

        // Calculate progress in current lesson
        // const currentLesson = context.lessons[context.currentLessonIndex];
        // let currentLessonProgress = 0;

        // if (currentLesson) {
        //   if (currentLesson.isLoopedLesson) {
        //     // For looped lessons, count completed loops
        //     currentLessonProgress = currentLesson.duration * context.currentLessonLoopCount;
        //   } else if (context.mode === 'repeat') {
        //     // For repeat mode, account for steps being played twice
        //     if (context.currentStepIndex > 0) {
        //       // Get the duration of completed steps
        //       const completedStepsDuration = currentLesson.steps[context.currentStepIndex].startTime -
        //                                    currentLesson.steps[0].startTime;

        //       // Add current step progress if it's being repeated
        //       if (context.currentStepPlayCount > 0) {
        //         const currentStepDuration = context.currentStepIndex < currentLesson.steps.length - 1
        //           ? currentLesson.steps[context.currentStepIndex + 1].startTime - currentLesson.steps[context.currentStepIndex].startTime
        //           : currentLesson.duration - currentLesson.steps[context.currentStepIndex].startTime;

        //         currentLessonProgress = completedStepsDuration * 2 + currentStepDuration;
        //       } else {
        //         currentLessonProgress = completedStepsDuration * 2;
        //       }
        //     }
        //   } else {
        //     // For perform mode
        //     if (context.currentStepIndex > 0) {
        //       currentLessonProgress = currentLesson.steps[context.currentStepIndex].startTime -
        //                             currentLesson.steps[0].startTime;
        //     }
        //   }
        // }

        // console.log("currentLessonProgress:", currentLessonProgress, context.currentLessonIndex);
        const totalElapsed = completedLessonsDuration; // + currentLessonProgress;
        console.log('totalElapsed:', totalElapsed);
        return totalElapsed;
      },
      timeRemaining: ({ context }) => {
        console.log('timeMetrics:', context.sessionDuration, context.timeElapsed, context.timeRemaining);
        return context.sessionDuration - context.timeElapsed;
      },
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwIYDsIAsCeKAKANitmAE4CyKAxpgJZpgB0tEBYAxAMoCinnAkgHkAcgH1OAFQCCAJQncAIgG0ADAF1EoAA4B7WLQAutHWk0gAHogBMVgKyMAnADY7KgOwOAzG9tOAjE4ALAA0INiIfoF+jLY+KpF+Pt7uAL4poagYOPhEJBTUdAyMBDooEPRQAGosYDqExGTslfwK3IKieAAyUgCa3DKiMtxSCj2qGkgguvpGJmaWCAAcboGMTsu2tn4qDm42Vg6h4QgBq4EqF5GBbn7eflZOaRnoWLj1eZQ09EwlZRWdcFgJnYnV4nBEok6ghGinGZmmhmMpkmC22nicMXu608iz8DhUTl8R0Qni8jECDkSthxKk2O0e6RAmVeOQa+S+RS0uX+gOBeCkAFUeHDJgjZsjQAtAk4MW4NqSHIsnA4rOinMSEBTPIxPLYLstAp4VIFFibbE8mS9su8yJ9CkwucQebAgWgQWCIdxhK1lOp4XpEXMUYgDWsNlsdnsbIcwohAobGHjEudqfHvIaLczrblbQVvoxHdhna73XxPd7YX4JtoA+L5iGVmGfBHdvsY8cDotE1E3L2VYsrNdzYys28c+z7QXuWgoACXcDhNwABoSSEe4QimszJH1paN9bN7at6Ma3z2UnJvVbBx6hyZq1jtl2-OF4t8obNQRCtdljd+0W1juwZ7qsB6bEeUYHBqMoqIwKzJospLnLcw7PFkj4fHmnLTrOvJupI3B4KIXo+puUyAUGkqILYiwOIwNh6iaiyxJEiqnio2oeA4zjMb2iwcQE97oaymEcg6OFziWBFESRlbVuR26URY1FuNqfh6rSMqJIstGeBqOLRLY3Hceprj4m4QksjaE4vhJeFcPIMkVsoVjyWKQFUQgsRqRpvj+HKukanYdHnJc8Z7N4HgMmhVnjs+RRsPOaB4CgACusCQOwQycAK5DcGR7lKQsDGOC4eoeN4vinNB6kxBplIONc3EDpZ2ZPlhPx4Sl6WZYuK4-uCf5uRRErKQgJXOK4FU+P4QQavx2qUk4bhON4uzxrYVitRhuZicUXVpRlEDsHgH5CN+oK-gVI27hNZXuF4M3VbGSzcfRMoeNKxpGjpaSMmgOgQHAZijiJu32v6imjQsAC06ovXD21gzZRQsGwkOBtDcZWBqCSJhc8TppSlx3iOD7I-FPylOUM7VEDdTjhjdbAf40RanKSFbC4OMvfcXbbJcUbGg8kRI9ZlPFNTb6jYVWMnIOGIbDsuy9nStinrYZwBCs-G7Bcq1i3FHVTk6M6SUpsu7i4IWVRSOnLEk0GeNEBO0prtE3L9ZPCeLxuJa63VHUzHljYEPPHMsVj0fEpqeFYNweIkhvtXtYAYJAwdFRECuMEr3G9s2tJBc45La3sKh2LRMrDmkQA */
  entry: "inline:sandhyaPlayerMachine#entry[0]",
  context: ({ input }) => ({
    lessons: input.sessionSettings.lessons,
    container: document.createElement('div'), //dummy container
    currentLessonIndex: 0,
    mode: input.sessionSettings.learningMode,
    currentStepIndex: 0,
    currentStepPlayCount: 0,
    // currentLessonLoopCount: 0,
    chantingSpeed: input.sessionSettings.chantingSpeed,
    sessionDuration: input.sessionSettings.duration,
    timeRemaining: input.sessionSettings.duration || 0,
    timeElapsed: 0,
  }),
  /** @xstate-layout N4IgpgJg5mDOIC5SwIYDsIAsCeKAKANitmAE4B0AlhAWAMQDKAKgIIBKTA+gwKIMMBJAPIA5ANoAGALqJQABwD2sSgBdKCtLJAAPRAEYAbHvJ6AnOdMBWACwAmU3oDMEywA4ANCGz6DAdnKOtpYSeobWDqYSrgC+0Z6oGDj4RCQUBAooEJRoUHQAMnwMopx5QiwAIjzlkjJIIIrKahpaugjWfuS+rr7WrqZ2BpaOvlae3gh6vpbk1lGO1nrWQ8Ouk7Hx6Fi4hMRk5HIp2bl4LACqvDVaDarqmnWtpo7TfeYGvSE2emP6rhKdEgCJAYnjZfHpXI51iAEltkrsKAdiEd8oVijwRJVqtIrkobs17oh2v4uj0+gMhiNLN8JkF-hDHI89BJHHp7DE4tDNkkdql9occij+GiMVUxHpavJcU07qAHk9yC9TG9fnpPtTVgFARJbEDHgtrL4oTDuSk9nIUABXWCQOhsPinACyPEudWu0pa+iZz2GDPsvRZ1Kcxi1EjsrNmBkGsQ5aAUEDgWmN21NpBxjVuHoQAFoDNSc+QQ4WAYsjVzk-CqDQwGm8TKdITbIGOnZgrZHM5VkYWaXEuXeelMkca+6CQh5o5yG4eo9zD0JL5HLmvD5-C3te2ooYgz3YTyzfyoMOM6OVeQDBZz8NbAtQ03TORTEF1x2t92OUm4bzzVbIEf8bL9DbP5F2vedfGBRcqWXCYpnIWxDAMVxXHg7VLEsHcTQrMAMF-V0pWPACaWcAIDFA3xwPbQZ1WMWZiyvCFQnMaNoiAA */
  id: 'sandhyaPlayerMachine',
  initial: 'idle',
  states: {
    idle: {
      entry: "inline:sandhyaPlayerMachine.idle#entry[0]",
      on: {
        SESSION_STARTED: {
          target: 'loadingVideoPlayer',
          actions: "inline:sandhyaPlayerMachine.idle#SESSION_STARTED[-1]#transition[0]",
        },
      },
    },
    loadingVideoPlayer: {
      entry: [
        "inline:sandhyaPlayerMachine.loadingVideoPlayer#entry[0]",
        "inline:sandhyaPlayerMachine.loadingVideoPlayer#entry[1]",
      ],
      on: {
        VIDEO_PLAYER_READY: {
          target: 'loadingLesson',
        },
      },
    },
    loadingLesson: {
      entry: [
        "inline:sandhyaPlayerMachine.loadingLesson#entry[0]",
        "inline:sandhyaPlayerMachine.loadingLesson#entry[1]",
        "inline:sandhyaPlayerMachine.loadingLesson#entry[2]",
      ],
      on: {
        LESSON_LOADED: 'playingLesson',
      },
    },
    playingLesson: {
      entry: "inline:sandhyaPlayerMachine.playingLesson#entry[0]",
      on: {
        PAUSE: {
          target: 'lessonPaused',
          actions: [
            "inline:sandhyaPlayerMachine.playingLesson#PAUSE[-1]#transition[0]",
            "inline:sandhyaPlayerMachine.playingLesson#PAUSE[-1]#transition[1]",
          ],
        },
        LESSON_ENDED: [
          {
            target: 'loadingLesson',
            guard: 'hasNextLesson',
            actions: [
              "inline:sandhyaPlayerMachine.playingLesson#LESSON_ENDED[-1]#transition[0]",
              "inline:sandhyaPlayerMachine.playingLesson#LESSON_ENDED[-1]#transition[1]",
              { type: "updateTimeRemaining" },
            ],
          },
          {
            target: 'ended',
            actions: "inline:sandhyaPlayerMachine.playingLesson#LESSON_ENDED[-1]#transition[0]",
          },
        ],
        NEXT_LESSON: {
          target: 'loadingLesson',
          actions: [
            "inline:sandhyaPlayerMachine.playingLesson#NEXT_LESSON[-1]#transition[0]",
          ],
          guard: 'hasNextLesson',
        },
        PREVIOUS_LESSON: {
          target: 'loadingLesson',
          actions: [
            "inline:sandhyaPlayerMachine.playingLesson#PREVIOUS_LESSON[-1]#transition[0]",
          ],
          guard: 'hasPreviousLesson',
        },
        STEP_ENDED: [
          {
            // For perform mode, just increment current step index
            target: 'playingLesson',
            guard: 'isInstructionStep',
            actions: [
              "inline:sandhyaPlayerMachine.playingLesson#STEP_ENDED[-1]#transition[0]",
              "inline:sandhyaPlayerMachine.playingLesson#STEP_ENDED[-1]#transition[1]",
              { type: "updateTimeRemaining" },
            ],
          },
          {
            // For perform mode, just increment current step index
            target: 'playingLesson',
            guard: 'isPerformMode',
            actions: [
              "inline:sandhyaPlayerMachine.playingLesson#STEP_ENDED[-1]#transition[0]",
              "inline:sandhyaPlayerMachine.playingLesson#STEP_ENDED[-1]#transition[1]",
              { type: "updateTimeRemaining" },
            ],
          },
          {
            // For repeat mode, first play
            target: 'playingLesson',
            guard: 'isFirstRepeatPlay',
            actions: [
              "inline:sandhyaPlayerMachine.playingLesson#STEP_ENDED[-1]#transition[0]",
              "inline:sandhyaPlayerMachine.playingLesson#STEP_ENDED[-1]#transition[1]",
              "inline:sandhyaPlayerMachine.playingLesson#STEP_ENDED[-1]#transition[2]",
            ],
          },
          {
            // For repeat mode, second play completed
            target: 'playingLesson',
            guard: 'isSecondRepeatPlay',
            actions: [
              "inline:sandhyaPlayerMachine.playingLesson#STEP_ENDED[-1]#transition[0]",
              "inline:sandhyaPlayerMachine.playingLesson#STEP_ENDED[-1]#transition[1]",
            ],
          },
        ],
        NEXT_STEP: {
          target: 'playingLesson',
          guard: 'hasNextStep',
          actions: [
            "inline:sandhyaPlayerMachine.playingLesson#NEXT_STEP[-1]#transition[0]",
            "inline:sandhyaPlayerMachine.playingLesson#NEXT_STEP[-1]#transition[1]",
          ],
        },
        PREVIOUS_STEP: {
          target: 'playingLesson',
          guard: 'hasPreviousStep',
          actions: [
            "inline:sandhyaPlayerMachine.playingLesson#PREVIOUS_STEP[-1]#transition[0]",
            "inline:sandhyaPlayerMachine.playingLesson#PREVIOUS_STEP[-1]#transition[1]",
          ],
        },
        LOOP_ENDED: [
          {
            target: 'playingLesson',
            guard: 'hasRemainingLoops',
            actions: [
              "inline:sandhyaPlayerMachine.playingLesson#LOOP_ENDED[-1]#transition[0]",
              { type: "updateTimeRemaining" },
            ],
          },
          {
            target: 'loadingLesson',
            actions: [
              "inline:sandhyaPlayerMachine.playingLesson#LOOP_ENDED[-1]#transition[0]",
              "inline:sandhyaPlayerMachine.playingLesson#LOOP_ENDED[-1]#transition[1]",
            ],
          },
        ],
      },
    },
    lessonPaused: {
      entry: "inline:sandhyaPlayerMachine.lessonPaused#entry[0]",
      on: {
        RESUME: {
          target: 'playingLesson',
          actions: [
            "inline:sandhyaPlayerMachine.lessonPaused#RESUME[-1]#transition[0]",
            "inline:sandhyaPlayerMachine.lessonPaused#RESUME[-1]#transition[1]",
          ],
        },
        NEXT_LESSON: {
          target: 'loadingLesson',
          actions: "inline:sandhyaPlayerMachine.lessonPaused#NEXT_LESSON[-1]#transition[0]",
          guard: 'hasNextLesson',
        },
        PREVIOUS_LESSON: {
          target: 'loadingLesson',
          actions: "inline:sandhyaPlayerMachine.lessonPaused#PREVIOUS_LESSON[-1]#transition[0]",
          guard: 'hasPreviousLesson',
        },
        NEXT_STEP: {
          target: 'lessonPaused',
          guard: 'hasNextStep',
          actions: [
            "inline:sandhyaPlayerMachine.lessonPaused#NEXT_STEP[-1]#transition[0]",
            "inline:sandhyaPlayerMachine.lessonPaused#NEXT_STEP[-1]#transition[1]",
          ],
        },
        PREVIOUS_STEP: {
          target: 'lessonPaused',
          guard: 'hasPreviousStep',
          actions: [
            "inline:sandhyaPlayerMachine.lessonPaused#PREVIOUS_STEP[-1]#transition[0]",
            "inline:sandhyaPlayerMachine.lessonPaused#PREVIOUS_STEP[-1]#transition[1]",
          ],
        },
      },
    },
    ended: {
      entry: "inline:sandhyaPlayerMachine.ended#entry[0]",
      type: 'final',
    },
  },
});
