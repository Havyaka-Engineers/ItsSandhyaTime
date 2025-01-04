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
  /** @xstate-layout N4IgpgJg5mDOIC5QAUA2BDAnmATgWXQGMALASwDswA6Ad3VIBcKoAxAexwDVSBbMNgMJtyDepRwBiTgEk8AUQDyAfQEKAcgBUAgtLVyASkq2cdAGS0AhU3IDaABgC6iUAAc2sRqWHOQAD0QATACcdlQAzABsAQAsQQF20QAcifEA7NEANCCYiGHBVKlBRYl5EQCsQRGxZQC+NVloWLgEJBTUhDhg6EzkUNx8bI3YkjLyysjmAJoGKvpyWhpyACL2Tkggbh5M3uv+CIkAjIkF6UVREYmpdpdZOQh5QQVFQSUB5ZXVdQ0Ywy1klFQAGZgBitXqmOCwYQSawAZVh6iULDkGgEAAllqsfJtPDtQHsgmUwlQyjEXtEie8DmFbohqaFnmcUmVokkkl8QENmkR-tQXD9mBDYFDyDC5PDEXI1EtMY5se5ceQfHtDsdUqdKm9LtdUrT9gdwnYjUaAgciQcgpEOVz8Dy2lR+VhBZDoXCEWolFKZSsDmtXArtkrdohVSdYpqLlcbtk6YlQhFGWFomEymV1RFrT9uWC+QLwS7RXoABoaJRu9RY9Y4wPKkNHMNnLVR3UxhABMKhMKMo0Uq4RVIBTNNW05h15qBCkUSZBzThl8Xuyv+rZeIP4utqjXnbXRu4BONUOzPRIRcplErnsJ1eogchsCBwHw2v5teUrvF+RAAWgiep-Q9+O0AToTxenYLheH4IQRDEXA30VWsEGiAI9QeKhEmPY0IjNIIDgA7NeSoDouh6PpIMGLMcHgmtgwQS8STCdIUlNdUUhpVs0Iws51RCMo7HSfCR0I4FQX+CcC2o1dEIOA4oioSNqnPKJyT1dsAioRkggHMoqgqVlBJfAFHUwZ1hQ-aspNoqJog0jUKkiaIj3Yu5CUPU9TzseyWTyQcb2fIDqDAcgIGYWFIUs5cENomS5IUwklOCRJMlbQ5wmPaJUi7E8jlqa8gA */
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
        LESSON_FETCHED: {
          target: 'playingLesson',
        },
      },
    },
    playingLesson: {
      entry: [
        () => {
          console.log('entered state: playingLesson');
        },
      ],
      on: {
        LESSON_ENDED: [
          {
            target: 'endingSession',
            guard: {
              type: 'isLastLesson',
            },
          },
          {
            target: 'fetchingLesson',
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
