import { Page } from 'konsta/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SessionSettings } from '../types/SessionSettings';
import { useEffect, useRef, useState } from 'react';
import { useMachine } from '@xstate/react';
import { playerMachine } from '../machines/PlayerMachine';
import PlayerTopBar from '../components/PlayerTopBar';
import PlayerBottomBar from '../components/PlayerBottomBar';
import SessionCompleted from '../components/SessionCompleted';

function Player() {
  const location = useLocation();
  const sessionSettings = location.state?.sessionSettings as SessionSettings;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSessionEnded, setIsSessionEnded] = useState(true);
  const navigate = useNavigate();

  // Initialize the machine with settings
  const [state, send] = useMachine(playerMachine, {
    input: {
      sessionSettings: sessionSettings,
    },
  });

  // Effect for handling vimeo container mounting
  useEffect(() => {
    if (containerRef.current) {
      send({ type: 'VIMEO_CONTAINER_AVAILABLE', container: containerRef.current });
    }
  }, [containerRef.current, send]);

  // Effect for tracking machine state changes
  useEffect(() => {
    console.log('current state', state.value);
    if (state.value === 'endingSession') {
      console.log('isSessionEnded', isSessionEnded);
      setIsSessionEnded(true);
    }
  }, [state]);

  // Handle tap on video container
  const handleVideoTap = () => {
    //todo: handle video tap
  };

  const handleSessionEndClose = () => {
    setIsSessionEnded(false);
    navigate('/dashboard');
  };

  const handleSessionFeedback = () => {
    // Implement feedback handling logic
  };

  return (
    <Page className="h-screen flex flex-col bg-gray-100">
      {isSessionEnded ? (
        <SessionCompleted onClose={handleSessionEndClose} onFeedback={handleSessionFeedback} />
      ) : (
        <>
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
        </>
      )}
    </Page>
  );
}

export default Player;
