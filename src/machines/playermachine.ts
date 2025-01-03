import { createMachine } from "xstate";
export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAUA2BDAnmATgWXQGMALASwDswA6QnMdAFzADVSBbMAezS1wGJmASQAiAUQDyAfWQAZAIIBNUQCVJy0XOEKA2gAYAuolAAHTrFINSnckZAAPRAEYArAGYqzgJzefv7wHYAGhBMJwAOACYAXyjgnmx8IjJKKgAzMAYSCigZOFhrPhlRAGVi8QA5SQAxUQAVAGEACVFhPUMkEFNzS2tbBwRXTyCQxFcANgAWGLiMBIIslONZ7NzYfPJCkrLK0XKxVsd2kzMLKxsO-sddVzCqMNcHx6eH4NCECednaZB43Hnk6hLLArPIFIqlCqSXb7Nq2LqnXoXRCeCbDN7jKaxH6zP5JCiA5bkHKgjblUQADVqknB21hHXhPXOoH6Y10zleo0m31+iQWBOBRNW6z4yHUzGpWwqdOO3TOfUQrI5Ay533InAgcFsPP++LhJ0Z8oQjgiSuN3JxvIBNDojBY7C4PL1ssRzKcY1cSs8unNvEt+LSGQWxLWLs6+rlSKN-nZIwQEX80Sx2rxi0JwfWToRTPsiAmERNsY+mJmvp1KTA5Ag2WKeQjMqzhquKKVzgmYxiMSAA */
    id: "PlayerMachine",
    initial: "createVimeoPlayer",
    states: {
      createVimeoPlayer: {
        on: {
          VIDEO_PLAYER_READY: {
            target: "fetchingLesson",
            actions: [],
            meta: {},
          }
        },
      },

      fetchingLesson: {
        on: {
          LESSON_FETCHED: "playingLesson"
        }
      },

      playingLesson: {
        on: {
          LESSON_ENDED: [{
            target: "endingSession",
            cond: "hasMoreLessons"
          }, "fetchingLesson"],

          NEXT_LESSON: {
            target: "fetchingLesson",
            cond: "hasMoreLessons"
          },

          PREV_LESSON: {
            target: "fetchingLesson",
            cond: "hasPrevLessons"
          }
        }
      },

      endingSession: {}
    },
    types: { events: {} as { type: "next" } },
  },
  {
    actions: {},
    actors: {},
    guards: {},
    delays: {},
  },
);
