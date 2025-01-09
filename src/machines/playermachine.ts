import { assign, sendTo, setup, spawnChild } from 'xstate';
import { PlayerContext, PlayerEvents, PlayerInput } from '../types/PlayerMachine.types';
import { isLastLesson, isFirstLesson, isNextStepInstruction, isPerformMode, isLearnMode } from './guards';
import { createVimeoPlayerActor } from './vimeoPlayerActor';
export const playerMachine = setup({
  types: {
    context: {} as PlayerContext,
    input: {} as PlayerInput,
    events: {} as PlayerEvents,
  },
  guards: {
    isLastLesson,
    isFirstLesson,
    isNextStepInstruction,
    isPerformMode,
    isLearnMode,
  },
  actors: {
    vimeoPlayerActor: createVimeoPlayerActor(),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAUA2BDAnmATgWXQGMALASwDswA6Ad3VIBcKoAxAexwDVSBbMNgMJtyDepRwBiTgEk8AUQDyAfQEKAcgBUAgtLVyASkq2cdAGS0AhU3IDaABgC6iUAAc2sRqWHOQAD0QATACcdlQAzABsAQCsdgFh0QCMABwALMlhADQgmIjJiVQA7IWxiRGpqXFlEREAvrXZaFi4BCQU1IQ4YOhM5FDcfGxN2JIy8srI5gCaBir6cloacgAi9k5IIG4eTN4b-ggBUVTxJWFBNREJEYXZuQhl0clU5Ulhdsl27wEBhfWNGCNWmRKFQAGZgBhtPqmOCwYRSaTLRRKUwKLRI1aOHxbTy7UD7KK3RCJWIBKhBIKvSI-NKpOoNEDDFpEYHUVCw4RaQhMABuYARSOUcjUGLW2PcuPIPgJdkKVGSsSqhzCyQ+WRyiEKlSodlSisiZTCRtSf0ZAOZULZHPIXN5-JkgqUwtFiXWrglOyle0QEVl8sVAUSytVdnVd0KySCRT1dgiiXej1JpqZ+BZ7So7NgcJt3NIfIFyMmWimYo2OM90sQQRuGoQJWiOpjlU+xUS6WT5tTloz1tteftiMLWgAqgBlWxYsserxe-FVmt3RJhOlUVKUsp2aKpAKpRIRjvNLusntZzm5-MO5EWYcsFizUfafQaUvu7YzysIatE+6JIKpeXrsUUSFDEJQHoCaYgpm2Z9heg5Cvo+gKPoL6bNOeJ+PO36JEuEThOu5T5HubZhOBFrHtBZ52lQPKkBA-DDMwEgaAoADirHWEoRYlpOr6Sh+qSRFQW4UskgZ-gEVTfrE-47oqURiRkPxkUe6aUTm1G0fRQzoAArrAkDMWxHFyFx0yoeW77eggCShNSqRamEMTlAEyTYTEYSruuyRxoUvoKsk9QMuQbD0fAGwpkC7Tim+GH7AAtBE36JSpUUgnQnh9OwXC8PwQgiGIuAxfx1nbt++ThJ8nx6tEwRJLKqWQR0XQ9MwAwMZ2xUVtZ0QLsSURksuSQxNWQaBtEjXduCkLAlAMKnrOaGxYt+yqnK1axNEISHPG7zYXSeEROurmFEEYmCaRDKRU1J4weeYBdVZc4IGu35hIUoRtmu5y+iBQb0v8h5pVaC2wdQWn8KYbDoPRECPXFWG1kdeFbrEaqnb1E1XZ2wO3VR-Y0XRHVYMw8MrcS1Y6iUVXXCE7yJNJPnCX+Z3lGuikA2aQM3epYOE9pjF9FQFCwAwOC6bmGGWQjBwVbKiqxqdnz5N+1yeZG327T8p2Bdj3Pdrz9388TmDMFQhDCAwYAiGTH5yVTCu08rDNI+c+FrrElx2EEv6XYDEEG72RsQ0MAJmxbIjWwwPboDg5B4KFD1TstdtBJ58s00r9PfhGnlHR7SQZMkH0mnrAcUUHmlE6HJNCxHVsiDHccJ-RVBsAARgZOB8qOVsuLb1nLgUGefE72e1sXoQUh71aRGJZSTRXoPB9XgtQObltR038eJ1QLi4KCHA8L3YD98nJXPUP4TF7EWrXPkCbfkEwReZ7gZhDh7OL2plcEyHa8b0jo3feOBD44B4C3JOfFuqXxwg7TOdMVa1njHucklIqglGfhrb+UFf58mNjpfSkAB7PUOP+S4JRvjxkEpJWM2EEjqz1NUZcbx8i-DLuRH+y8q7aQsLpUE4IcCk3PjAzCNkYjhCiA5Gh0QXJuWQb+f8FJaqHC3KdOkOCQZ3R4fwOQOAcAcBIWIw4ZJvibSDLqSMcRsK4VfkGXc0QDT7g4apEE1sIDMFHLCJ6S0L5iJCEo-6JIjrBA-tEHOZRoyxDeCqUMrkAhBVqEAA */
  context: ({ input }) => ({
    container: document.createElement('div'), //dummy container,
    lessons: input.sessionSettings.lessons,
    currentLessonIndex: 0,
    currentStepIndex: 0,
    timeElapsed: 0,
    sessionSettings: input.sessionSettings,
  }),
  id: 'PlayerMachine',
  initial: 'waitingForVimeoContainer',
  meta: {
    gitHubUrl:
      'https://github.com/HavyaKanvas/ItsSandhyaTime/blob/57342203abd5f33aafacd82bd605b7ef326fedf1/src/machines/playermachine.ts',
  },
  states: {
    waitingForVimeoContainer: {
      entry: [
        () => {
          console.log('entered state: waitingForVimeoContainer');
        },
      ],
      on: {
        VIMEO_CONTAINER_AVAILABLE: {
          target: 'creatingVimeoPlayer',
          actions: assign({
            container: ({ event }) => event.container,
          }),
        },
      },
    },
    creatingVimeoPlayer: {
      entry: [
        () => {
          console.log('entered state: creatingVimeoPlayer');
        },
        spawnChild('vimeoPlayerActor', {
          id: 'vimeoPlayerActor',
          input: ({ context }) => ({ container: context.container }),
        }),
      ],
      on: {
        VIMEO_PLAYER_CREATED: {
          target: 'fetchingLesson',
        },
      },
    },
    fetchingLesson: {
      entry: [
        () => {
          console.log('entered state: fetchingLesson');
        },
        sendTo('vimeoPlayerActor', ({ context }) => ({
          type: 'LOAD_VIDEO',
          lesson: context.lessons[context.currentLessonIndex],
        })),
      ],
      on: {
        VIDEO_LOADED: {
          target: 'lessonActive',
        },
      },
    },
    lessonActive: {
      initial: 'videoLoaded',
      entry: [
        () => {
          console.log('entered state: lessonActive');
        },
      ],
      on: {
        VIDEO_ENDED: [
          {
            target: 'endingSession',
            guard: {
              type: 'isLastLesson',
            },
          },
          {
            target: 'fetchingLesson',
            actions: assign({
              currentLessonIndex: ({ context }) => context.currentLessonIndex + 1,
              currentStepIndex: 0,
            }),
          },
        ],
        VIDEO_PLAY: {
          target: '.videoPlaying',
        },
        VIDEO_PAUSE: {
          target: '.videoPaused',
        },
        VIDEO_BUFFER_START: {
          target: '.videoBuffering',
        },
        VIDEO_ERROR: {
          target: '.videoError',
        },
      },
      states: {
        videoLoaded: {},
        videoPlaying: {
          initial: 'instruction',
          on: {
            TOGGLE_PLAY: {
              actions: sendTo('vimeoPlayerActor', { type: 'TOGGLE_PLAY' }),
            },
            STEP_ENDED: [
              {
                guard: {
                  type: 'isNextStepInstruction',
                },
                target: '.instruction',
                actions: assign({
                  currentStepIndex: ({ context }) => context.currentStepIndex + 1,
                }),
              },
              {
                guard: {
                  type: 'isPerformMode',
                },
                target: '.content.performMode',
                actions: assign({
                  currentStepIndex: ({ context }) => context.currentStepIndex + 1,
                }),
              },
              {
                guard: {
                  type: 'isLearnMode',
                },
                target: '.content.learnMode',
                actions: assign({
                  currentStepIndex: ({ context }) => context.currentStepIndex + 1,
                }),
              },
            ],
          },
          states: {
            instruction: {},
            content: {
              initial: 'performMode',
              states: {
                learnMode: {
                  initial: 'observeStep',
                  states: {
                    observeStep: {
                      on: {
                        STEP_ENDED: {
                          target: 'performStep',
                          actions: sendTo('vimeoPlayerActor', ({ context }) => ({
                            type: 'SEEK_TO',
                            time: context.lessons[context.currentLessonIndex].steps[context.currentStepIndex].startTime,
                          })),
                        },
                      },
                    },
                    performStep: {},
                  },
                },
                performMode: {},
              },
            },
          },
        },
        videoPaused: {
          on: {
            TOGGLE_PLAY: {
              actions: sendTo('vimeoPlayerActor', { type: 'TOGGLE_PLAY' }),
            },
          },
        },
        videoBuffering: {},
        videoError: {},
      },
    },
    endingSession: {
      entry: [
        () => {
          console.log('entered state: endingSession');
        },
      ],
    },
  },
});
