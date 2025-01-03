import { createMachine } from "xstate";
export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAUA2BDAnmATgWXQGMALASwDswA6AMVJ1gBcACAZUfUbAGJKAPRgG0ADAF1EoAA4B7WKUalp5CSD6IAjAHZhVAGzCAnACYD6gKwAWdeoDMZgwBoQmREZtUzmi0fUAOTWYAvsFO5NIQcCpoWLgEJBRgKjJyCkoqaggAtDa6VEbC3kZmtjYGlga+Ti5ZZmZU3p6+6kUhINHY+ERklLT0TGwcXEmy8orKSKoa6lSaZZpevrr6FmbCRlWuRh5ePv5BgU7tsV0JVKxghEoQA5yJE8mjaRMZJrma+l42+V7CXhsIRi2nm8fgCwWCQA */
    id: "PlayerMachine",
    initial: "First State",
    states: {
      "First State": {
        on: {
          next: [
            {
              target: "Second State",
              actions: [],
              meta: {},
            },
          ],
        },
      },
      "Second State": {},
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
