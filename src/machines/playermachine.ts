import { assign, sendTo, setup, spawnChild } from 'xstate';
import { PlayerContext, PlayerEvents, PlayerInput } from '../types/PlayerMachine.types';
import { isLastLesson, isFirstLesson } from './guards';
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
  },
  actors: {
    vimeoPlayerActor: createVimeoPlayerActor(),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAUA2BDAnmATgWXQGMALASwDswA6Ad3VIBcKoAxAexwDVSBbMNgMJtyDepRwBiTgEk8AUQDyAfQEKAcgBUAgtLVyASkq2cdAGS0AhU3IDaABgC6iUAAc2sRqWHOQAD0QATACcdlQAzABsAQAsQQF20QAcifEA7NEANCCYiGHBVKlBRYl5EQCsQRGxZQC+NVloWLgEJBTUhDhg6EzkUNx8bI3YkjLyysjmAJoGKvpyWhpyACL2Tkggbh5M3uv+CIkAjIkF6UVREYmpdpdZOQh5QQVFQSUB5ZXVdQ0Ywy1klFQAGZgBitXqmOCwYQSawAZVh6iULDkGgEAAllqsfJtPDtQHsgmUwlQyjEXtEie8DmFbohqaFnmcUmVokkkl8QENmkR-tQXD9mBDYFDyDC5PDEXI1EtMY5se5ceQfHtDsdUqdKm9LtdUrT9gdwnYjUaAgciQcgpEOVz8Dy2lR+VhBZDoXCEWolFKZSsDmtXArtkrdohVSdYpqLlcbtk6YlQhFGWFomEymV1RE6vUQOQ2BA4D4bX82vKtl4g-jEABaCJ66tUY12SJXVIHOxxRvWn7csHUOieXrsLi8fhCERiXAlxXKxDRAJ6h5URLPONGiJmoIHTtNW09qgdLo9PrDwZdnCTwPThBlEoksLpFKm9UpGkx+75JdndUhMp2dJb352gCwKgv8UBCiK55lpeBwHFEVCRtU15ROSeoBHkVCMkEqQBGUVQVKy-7dryDoCuCLrlhsAZQcGCBRNEGEahUkTRG2L53IS9YRFxER2ExLJ5AEhE7sRYDkBAzCwpC1H+qWeJ+HSsEBPBlyIYkyGJJkr6HOEy7RKkYQvGuiS1JmQA */
  context: ({ input }) => ({
    container: document.createElement('div'), //dummy container,
    lessons: input.sessionSettings.lessons,
    currentLessonIndex: 0,
    timeElapsed: 0,
    sessionDuration: input.sessionSettings.duration,
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
          videoId: context.lessons[context.currentLessonIndex].videoId,
        })),
      ],
      on: {
        VIDEO_LOADED: {
          target: 'currentLesson',
        },
      },
    },
    currentLesson: {
      entry: [
        () => {
          console.log('entered state: currentLesson');
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
            }),
          },
        ],
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
