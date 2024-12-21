export const PlayIcon = ({ className = "" }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const PauseIcon = ({ className = "" }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

export const NextStepIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4l10 8-10 8V4z"/>
    <line x1="19" y1="5" x2="19" y2="19"/>
  </svg>
);

export const PreviousStepIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 20L9 12l10-8v16z"/>
    <line x1="5" y1="19" x2="5" y2="5"/>
  </svg>
); 