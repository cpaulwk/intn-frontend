import React from 'react';
import { Idea } from '../../../types';
import { useIdeas } from '../../../hooks/useIdeas';
import { useRouter } from 'next/navigation';

interface IdeaActionButtonProps {
  type: 'Edit' | 'Delete';
  idea: Idea;
}

const IdeaActionButton: React.FC<IdeaActionButtonProps> = ({ type, idea }) => {
  const { handleEdit, handleDelete } = useIdeas();
  const router = useRouter();

  const onClick = async () => {
    if (type === 'Edit') {
      try {
        const redirectUrl = await handleEdit(idea);
        router.push(redirectUrl);
      } catch (error) {
        console.error('Error editing idea:', error);
        // Handle error (e.g., show error message to user)
      }
    } else if (type === 'Delete') {
      try {
        await handleDelete(idea);
        // Optionally, you can add some feedback here, like showing a success message
      } catch (error) {
        console.error('Error deleting idea:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-full px-6 py-2 text-sm font-medium shadow-md transition-all duration-300 ease-in-out hover:shadow-lg ${
        type === 'Edit'
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-red-500 text-white hover:bg-red-600'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        type === 'Edit' ? 'focus:ring-blue-400' : 'focus:ring-red-400'
      } `}
    >
      {type}
    </button>
  );
};

export default IdeaActionButton;
