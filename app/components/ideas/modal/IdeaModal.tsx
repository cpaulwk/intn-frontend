import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Modal from '../../common/modal/Modal';
import ConfirmationModal from '../../common/modal/ConfirmationModal';

interface IdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  position: { top: number; left: number } | null;
  triggerRef: React.RefObject<HTMLButtonElement> | undefined;
  ideaId: string;
}

const IdeaModal: React.FC<IdeaModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  onEdit,
  position,
  triggerRef,
  ideaId,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowConfirmation(false);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        position={position}
        triggerRef={triggerRef}
      >
        <div className="w-32 px-2 py-3">
          <button
            className="flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-[#0078e6]/20"
            onClick={() => {
              onEdit();
              onClose();
            }}
          >
            <Edit2 size={16} className="mr-2" />
            Edit
          </button>
          <button
            className="flex w-full items-center rounded-md px-4 py-2 text-sm text-red-600 hover:bg-[#0078e6]/20"
            onClick={handleDelete}
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </Modal>
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this idea? This action is permanent and cannot be undone."
      />
    </>
  );
};

export default IdeaModal;
