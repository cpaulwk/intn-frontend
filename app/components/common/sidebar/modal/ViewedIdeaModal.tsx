import React from 'react';
import { Rocket, Trash2 } from 'lucide-react';
import Modal from '../../modal/Modal';

interface ViewedIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleUpvote: (ideaId: string) => Promise<void>;
  onDelete: () => void;
  position: { top: number; left: number } | null;
  triggerRef: React.RefObject<HTMLButtonElement> | undefined;
  ideaId: string;
}

const ViewedIdeaModal: React.FC<ViewedIdeaModalProps> = ({
  isOpen,
  onClose,
  handleUpvote,
  onDelete,
  position,
  triggerRef,
  ideaId,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      position={position}
      triggerRef={triggerRef}
    >
      <div className="w-32 px-2 py-3">
        <button
          className="flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-[#0078e6]/20"
          onClick={async () => {
            await handleUpvote(ideaId);
            onClose();
          }}
        >
          <Rocket size={16} className="mr-2" />
          Upvote
        </button>
        <button
          className="flex w-full items-center rounded-md px-4 py-2 text-sm text-red-600 hover:bg-[#0078e6]/20"
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          <Trash2 size={16} className="mr-2" />
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default ViewedIdeaModal;
