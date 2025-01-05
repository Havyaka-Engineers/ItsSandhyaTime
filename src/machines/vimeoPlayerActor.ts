import { fromCallback } from 'xstate';
import Player from '@vimeo/player';

export const createVimeoPlayerActor = () => {
  return fromCallback(({ sendBack, receive, input }: { sendBack: any; receive: any; input: { container: HTMLElement } }) => {
    let player: Player | null = null;

    // Send ready immediately since we don't need to wait for player initialization
    sendBack({ type: 'VIMEO_PLAYER_CREATED' });

    receive((event: any) => {
      if (event.type === 'LOAD_VIDEO') {
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

        // Send back the event when the video is loaded
        player.on('loaded', () => {
          sendBack({ type: 'VIDEO_LOADED' });
        });

        // Send back the event when the video is ended
        player.on('ended', () => {
          sendBack({ type: 'VIDEO_ENDED' });
        });
      }
    });

    // Create the Vimeo player instance
    // const player = new Player(input.container, {
    //   // Add any Vimeo player options here
    //   responsive: true,
    // });

    // Clean up function
    return () => {
      if (player) {
        player.destroy();
      }
    };
  });
};
