import { Block, Button, Dialog } from 'konsta/react';

interface PermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

function PermissionDialog({ isOpen, onClose, onAccept }: PermissionDialogProps) {
  return (
    <Dialog opened={isOpen} onBackdropClick={onClose} colors={{ bgIos: 'bg-[#FFF8F1]', bgMaterial: 'bg-[#FFF8F1]' }}>
      <Block className="space-y-2">
        <h2 className="text-3xl font-bold text-center text-[#532C16]">Access</h2>
        <div className="border border-[#FFD4C4] p-2 rounded-xl">
          <h3 className="text-lg text-semibold  text-[#B43403] py-2">Push Notification</h3>
          <p className="text-gray-900">This will enable us to inform you when the Guided Sandhya Vandana sessions are available.</p>
          <Block className="flex justify-end space-x-4">
            {/* <Button onClick={onClose}>Not Now</Button> */}
            <Button onClick={onAccept} className="text-xl font-bold !bg-[#B43403] !text-white">
              Ok
            </Button>
          </Block>
        </div>
      </Block>
    </Dialog>
  );
}

export default PermissionDialog;
