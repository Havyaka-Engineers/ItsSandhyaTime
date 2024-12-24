import { Page } from 'konsta/react';
import { useLocation } from 'react-router-dom';
import { SessionSettings } from '../types/SessionSettings';
import { useEffect, useRef } from 'react';
import { SandhyaPlayerMachine } from '../machines/SandhyaPlayerMachine';
import { useMachine } from '@xstate/react';
import PlayerTopBar from '../components/PlayerTopBar';
import PlayerBottomBar from '../components/PlayerBottomBar';

function Player() {
  const location = useLocation();
  const sessionSettings = location.state?.sessionSettings as SessionSettings;
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize the machine with settings
  const [state, send] = useMachine(SandhyaPlayerMachine, {
    input: {
      sessionSettings: sessionSettings,
    },
  });

  // Send the session started event when the container is mounted
  useEffect(() => {
    if (containerRef.current) {
      send({ type: 'SESSION_STARTED', container: containerRef.current });
    }
  }, [containerRef.current, send]);

  // Log the current state value
  useEffect(() => {
    console.log('current satate value', state.value);
  }, [state, send]);

  // check if we are in playing state
  const isPlaying = state.matches('playingLesson');

  // Handle tap on video container
  const handleVideoTap = () => {
    console.log('handleVideoTap triggered');
    console.log('Current playing state:', isPlaying);
    if (isPlaying) {
      console.log('Sending PAUSE event');
      send({ type: 'PAUSE' });
    } else {
      console.log('Sending RESUME event');
      send({ type: 'RESUME' });
    }
  };

  return (
    <Page className="h-screen flex flex-col bg-gray-100">
      <PlayerTopBar
        currentLessonIndex={state.context.currentLessonIndex}
        totalLessons={state.context.lessons.length}
        timeElapsed={state.context.timeElapsed}
        sessionDuration={state.context.sessionDuration}
        lessonTitle={state.context.lessons[state.context.currentLessonIndex]?.title || ''}
      />

      {/* Video Container - Using 9:16 aspect ratio */}
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="w-full relative" style={{ aspectRatio: '9/16' }}>
          {/* Vimeo container */}
          <div ref={containerRef} className="absolute inset-0 bg-black">
            {/* Vimeo player will be mounted here */}
          </div>

          {/* Transparent overlay for click handling */}
          <div className="absolute inset-0 z-10 cursor-pointer" onClick={handleVideoTap} />
        </div>
      </div>

      <PlayerBottomBar
        currentLessonIndex={state.context.currentLessonIndex}
        totalLessons={state.context.lessons.length}
        lessonTitle={state.context.lessons[state.context.currentLessonIndex]?.title || ''}
      />
    </Page>
  );
}

export default Player;
