import { Block, Button, Link, Navbar, Page } from 'konsta/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { SandhyaPlayerMachine } from '../machines/SandhyaPlayerMachine';
import { useMachine } from '@xstate/react';
import { SessionSettings } from '../types/SessionSettings';
import {
  PauseIcon,
  PlayIcon,
  // NextStepIcon,
  // PreviousStepIcon
} from '../components/Icons';
import { formatTime } from '../utils/durationCalculator';

function SandhyaPlayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionSettings = location.state?.sessionSettings as SessionSettings;
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  console.log('SandhyaPlayer Instantiated!');

  // Initialize the machine with settings
  const [state, send] = useMachine(SandhyaPlayerMachine, {
    input: {
      sessionSettings: sessionSettings,
    },
  });

  useEffect(() => {
    if (!sessionSettings) {
      navigate('/review-settings');
      return;
    }

    if (containerRef.current) {
      send({
        type: 'SESSION_STARTED',
        container: containerRef.current,
      });
    }
  }, [containerRef.current, send]);

  useEffect(() => {
    console.log('current satate value', state.value);
    // console.log("containerRef.current", containerRef.current);
  }, [state, send]);

  // Handle showing/hiding controls
  const handleContainerClick = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (state.matches('playingLesson')) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000); // Hide after 3 seconds
    }
  };

  // Set up controls timeout when playing starts/stops
  useEffect(() => {
    if (state.matches('playingLesson')) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [state.matches('playingLesson')]);

  return (
    <Page className="flex flex-col h-screen">
      <Navbar
        centerTitle
        title="Player"
        left={
          <Link navbar onClick={() => navigate('/dashboard')}>
            back
          </Link>
        }
      />

      {/* Video container with overlay - 70% height */}
      <div className="relative" style={{ height: '70%' }} onClick={handleContainerClick}>
        {/* Video container */}
        <div ref={containerRef} className="absolute inset-0 bg-black" />

        {/* Overlay Controls - only play/pause */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Button
            clear
            large
            onClick={(e) => {
              e.stopPropagation();
              if (state.matches('playingLesson')) {
                send({ type: 'PAUSE' });
              } else {
                send({ type: 'RESUME' });
              }
            }}
          >
            {state.matches('playingLesson') ? (
              <PauseIcon className="w-16 h-16 text-white" />
            ) : (
              <PlayIcon className="w-16 h-16 text-white" />
            )}
          </Button>
        </div>
      </div>

      {/* Bottom info section - 30% height */}
      <Block className="bg-white p-4 flex-none" style={{ height: '30%' }}>
        {/* Lesson Title */}
        <Block className="text-center mb-4 !p-0">
          <Block strong inset className="!m-0 text-lg">
            {state.context.lessons[state.context.currentLessonIndex]?.title || 'Loading...'} ({state.context.currentLessonIndex + 1}
            /{state.context.lessons.length})
          </Block>
        </Block>

        {/* Time Remaining Display */}
        <Block className="text-center !p-0">
          <Block strong inset className="!m-0">
            {formatTime(state.context.timeRemaining)} remaining
          </Block>
        </Block>
      </Block>
    </Page>
  );
}

export default SandhyaPlayer;
