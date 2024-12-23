import { Block, Button, Dialog } from 'konsta/react';

interface PermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

function PermissionDialog({ isOpen, onClose, onAccept }: PermissionDialogProps) {
  return (
    <Dialog opened={isOpen} onBackdropClick={onClose}>
      <Block className="space-y-4">
        <h2 className="text-lg font-bold">App Permissions Required</h2>
        <p>This app needs the following permissions to provide the best experience:</p>
        <ul className="list-disc pl-5">
          <li>
            <strong>Location:</strong> To determine sunrise/sunset times for accurate Sandhya timing
          </li>
          <li>
            <strong>Notifications:</strong> To remind you about your daily Sandhya practice
          </li>
        </ul>
        <Block className="flex justify-end space-x-4">
          <Button onClick={onClose}>Not Now</Button>
          <Button onClick={onAccept}>Allow</Button>
        </Block>
      </Block>
    </Dialog>
  );
}

export default PermissionDialog;
