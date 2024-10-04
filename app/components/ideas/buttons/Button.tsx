import React from 'react';
import { Idea } from '../../../types';
import { useIdeas } from '../../../hooks/useIdeas';
import { useRouter } from 'next/navigation';

interface ButtonProps {
  type: 'Edit' | 'Delete';
  idea: Idea;
}

const Button: React.FC<ButtonProps> = ({ type, idea }) => {
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
      className={`rounded-md px-4 py-2 text-white transition-colors duration-200 ${
        type === 'Edit'
          ? 'bg-blue-500 hover:bg-blue-600'
          : 'bg-red-500 hover:bg-red-600'
      }`}
    >
      {type}
    </button>
  );
};

export default Button;
