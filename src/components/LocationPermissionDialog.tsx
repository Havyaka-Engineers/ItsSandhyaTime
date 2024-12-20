import { Sheet, Block, Button, Link } from "konsta/react";
import { useState } from "react";
import { locationService } from "../services/locationService";
import { useNavigate } from "react-router-dom";

interface LocationPermissionDialogProps {
  opened: boolean;
  onClose: () => void;
  onPermissionGranted: (coordinates: {
    latitude: number;
    longitude: number;
  }) => void;
}

/**
 * Component to request location permission from user
 */
function LocationPermissionDialog({
  opened,
  onClose,
  onPermissionGranted,
}: LocationPermissionDialogProps): JSX.Element {
  const [error, setError] = useState<string>("");
  const [requesting, setRequesting] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const navigate = useNavigate();

  const handlePermissionRequest = async () => {
    setRequesting(true);
    setError("");
    setShowRetry(false);

    try {
      const coordinates = await locationService.getCurrentPosition();
      onPermissionGranted(coordinates);
      onClose();
      navigate("/sun-timings");
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "Location permission denied"
      ) {
        setShowRetry(true);
        setError("Location access is needed for accurate prayer timings");
      } else {
        setError(err instanceof Error ? err.message : "Failed to get location");
      }
    } finally {
      setRequesting(false);
    }
  };

  return (
    <Sheet
      className="pb-safe h-[400px] w-full max-w-lg rounded-t-xl mx-auto"
      opened={opened}
      onBackdropClick={onClose}
    //   containerClassName="!absolute"
    >
      <Block className="space-y-4 p-4">
        <div className="text-center">
          <img
            src="/logo.svg"
            alt="Sandhya Time"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Enable Location Access</h2>
          <p className="text-gray-600 text-sm mb-2">
            Sandhya prayers are traditionally performed at specific times around
            sunrise and sunset.
          </p>
          <p className="text-gray-600 text-sm font-medium">
            Click "Allow" in the browser prompt to get the most accurate timings
            for your location.
          </p>
        </div>

        {error && (
          <Block className="text-red-500 text-sm text-center">
            {error}
            {showRetry && (
              <div className="mt-2 text-gray-600">
                <p className="mb-2">
                  Please enable location in browser settings and try again
                </p>
                <Link
                  className="block mt-2 text-primary"
                  onClick={handlePermissionRequest}
                >
                  Try Again
                </Link>
              </div>
            )}
          </Block>
        )}

        <Block className="flex gap-2">
          <Button
            large
            colors={{
              fillBgIos: "bg-gray-200",
              fillTextIos: "text-black",
            }}
            className="flex-1"
            onClick={() => {
              onClose();
              navigate("/sun-timings");
            }}
            touchRipple={false}
          >
            Skip
          </Button>
          <Button
            large
            colors={{
              fillBgIos: "bg-primary",
              fillTextIos: "text-white",
            }}
            className="flex-1"
            onClick={handlePermissionRequest}
            disabled={requesting}
            touchRipple={false}
          >
            {requesting ? "Requesting..." : showRetry ? "Try Again" : "Allow"}
          </Button>
        </Block>
      </Block>
    </Sheet>
  );
}

export default LocationPermissionDialog;
