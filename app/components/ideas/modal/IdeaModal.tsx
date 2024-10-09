import { Edit2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useIdeas } from '../../../hooks/useIdeas';
import { Idea } from '../../../types';
import ConfirmationModal from '../../common/modal/ConfirmationModal';
import Modal from '../../common/modal/Modal';

interface IdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: Idea;
  position: { top: number; left: number } | null;
  triggerRef: React.RefObject<HTMLButtonElement> | undefined;
}

const IdeaModal: React.FC<IdeaModalProps> = ({
  isOpen,
  onClose,
  idea,
  position,
  triggerRef,
}) => {
  const { handleDelete, handleEdit } = useIdeas();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      await handleDelete(idea);
      setShowConfirmation(false);
      onClose();
    } catch (error) {
      console.error('Error deleting idea:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const onEdit = async () => {
    try {
      const redirectUrl = await handleEdit(idea);
      router.push(redirectUrl);
    } catch (error) {
      console.error('Error navigating to edit page:', error);
      // Handle error (e.g., show error message to user)
    }
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
            onClick={onEdit}
          >
            <Edit2 size={16} className="mr-2" />
            Edit
          </button>
          <button
            className="flex w-full items-center rounded-md px-4 py-2 text-sm text-red-600 hover:bg-[#0078e6]/20"
            onClick={onDelete}
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </Modal>
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={onDelete}
        message="Are you sure you want to delete this idea? This action is permanent and cannot be undone."
      />
    </>
  );
};

export default IdeaModal;
