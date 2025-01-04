import { Button, Link } from 'konsta/react';
import CheckIcon from '../icons/CheckIcon'; // You'll need to create/import this
import backgroundImage from '../assets/background-pattern2.svg';

interface SessionCompletedProps {
  // Add any props you might need
  onClose?: () => void;
  onFeedback?: () => void;
}

function SessionCompleted({ onClose, onFeedback }: SessionCompletedProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#532C16] bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(83, 44, 22, 0.8),rgba(83, 44, 22, 0.8)),url(${backgroundImage})` }}
    >
      <div className="flex flex-col justify-center items-center h-full w-full">
        {/* Circle with check icon */}
        <div className="rounded-full bg-white p-4 mb-4">
          <CheckIcon className="w-6 h-6 text-brown-900" />
        </div>

        {/* Title text */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-1 text-white">Sandhya time</h2>
          <p className="text-lg mb-8 text-white">Completed</p>
        </div>

        {/* Ok button */}
        <Button className="w-32 mb-8" onClick={onClose}>
          Ok
        </Button>

        {/* Feedback link */}
        <Link className="text-blue-500" onClick={onFeedback}>
          Do you have any feedback?
        </Link>
      </div>
    </div>
  );
}

export default SessionCompleted;
