import { Page, Progressbar } from "konsta/react";
import {
  DocumentTextIcon,
  Cog6ToothIcon,
  PlayCircleIcon,
  PauseCircleIcon,
  BackwardIcon,
  ForwardIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";
import { SessionSettings } from "../types/SessionSettings";
import { useEffect, useRef, useState } from "react";
import { useMachine } from "@xstate/react";
import { SandhyaPlayerMachine } from "../machines/SandhyaPlayerMachine";
import { formatTime } from "../utils/durationCalculator";
import SandhyaSessionSettings from "../components/SandhyaSessionSettings";
import LessonListModal from "../components/LessonListModal";

function SandhyaSession() {
  const location = useLocation();
  const sessionSettings = location.state?.sessionSettings as SessionSettings;
  const containerRef = useRef<HTMLDivElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [lessonListOpen, setLessonListOpen] = useState(false);

  console.log("SandhyaSession Instantiated!");

  // Initialize the machine with settings
  const [state, send] = useMachine(SandhyaPlayerMachine, {
    input: {
      sessionSettings: sessionSettings,
    },
  });

  // Send the session started event when the container is mounted
  useEffect(() => {
    if (containerRef.current) {
      send({ type: "SESSION_STARTED", container: containerRef.current });
    }
  }, [containerRef.current, send]);

  useEffect(() => {
    console.log("current satate value", state.value);
  }, [state, send]);

  // Helper function to determine if we're in playing state
  const isPlaying = state.matches("playingLesson");

  const handleSettingsClick = () => {
    send({ type: "PAUSE" }); // Pause the lesson
    setSettingsOpen(true);
  };

  const handleSettingsChange = (newSettings: SessionSettings) => {
    console.log("newSettings", newSettings);
    // Update the machine context
    // send({
    //   type: 'SETTINGS_UPDATED',
    //   settings: newSettings
    // });
  };

  return (
    <Page className="h-screen flex flex-col overflow-hidden">
      {/* Main container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Video container - 70% of remaining space */}
        <div
          ref={containerRef}
          className="h-[78%] bg-gray-900 overflow-hidden "
        ></div>

        {/* Controls container */}
        <div className="h-[22%] bg-white">
          {/* Row 1: Progress bar */}
          <div className="w-full h-1.5">
            {" "}
            {/* Increased height of the progress bar */}
            <Progressbar
              className="k-color-brand-red h-full" // Ensure the progress bar takes full height
              progress={0.45}
            />
          </div>
          {/* Row 2: Time information */}
          <div className="flex justify-between px-4 py-2 text-sm text-gray-600 pb-1">
            <span>{/*formatTime(state.context.timeElapsed)*/}</span>
            <span>{formatTime(state.context.sessionDuration)}</span>
          </div>
          {/* Row 3: Lesson Title and View More Lessons */}
          <div className="flex-1 flex justify-center items-center">
            <span className="text-xl font-medium">
              {state.context.lessons[state.context.currentLessonIndex]?.title ||
                "Loading..."}
            </span>
            <span className="mx-1" /> {/* This adds space between the spans */}
            <span className="text-sm text-gray-600">
              ({state.context.currentLessonIndex + 1}/
              {state.context.lessons.length})
            </span>
            <QueueListIcon
              className="w-5 h-5 text-gray-600 ml-2 cursor-pointer"
              onClick={() => setLessonListOpen(true)}
            />
          </div>
          {/* Row 4: Icons */}
          <div className="w-full flex justify-between items-center px-4 py-4">
            <DocumentTextIcon className="w-6 h-6 text-gray-600" />
            <BackwardIcon className="w-8 h-8 text-red-500" />
            {isPlaying ? (
              <PauseCircleIcon
                className="w-16 h-16 text-red-500 cursor-pointer"
                onClick={() => send({ type: "PAUSE" })}
              />
            ) : (
              <PlayCircleIcon
                className="w-16 h-16 text-red-500 cursor-pointer"
                onClick={() => send({ type: "RESUME" })}
              />
            )}
            <ForwardIcon className="w-8 h-8 text-red-500" />
            <Cog6ToothIcon
              className="w-6 h-6 text-gray-600 cursor-pointer"
              onClick={handleSettingsClick}
            />
          </div>
        </div>
      </div>

      <LessonListModal
        opened={lessonListOpen}
        onClose={() => setLessonListOpen(false)}
        lessons={state.context.lessons}
      />

      <SandhyaSessionSettings
        opened={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSettingsClick={() => send({ type: "RESUME" })}
        sessionSettings={sessionSettings}
        onSettingsChange={handleSettingsChange}
      />
    </Page>
  );
}

export default SandhyaSession;
