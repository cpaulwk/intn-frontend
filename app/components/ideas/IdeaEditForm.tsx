import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Idea } from '../../types';
import { useIdeas } from '../../hooks/useIdeas';
import ConfirmationModal from '../common/modal/ConfirmationModal';
import { useAIEnhancement } from '../../hooks/useAIEnhancement';
import { Sparkles } from 'lucide-react';

interface IdeaEditFormProps {
  idea: Idea;
}

const IdeaEditForm: React.FC<IdeaEditFormProps> = ({ idea }) => {
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState(idea.description);
  const [isModified, setIsModified] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();
  const { updateIdea } = useIdeas();
  const { enhanceText, isEnhancing } = useAIEnhancement();

  useEffect(() => {
    setIsModified(title !== idea.title || description !== idea.description);
  }, [title, description, idea]);

  const handleSave = async () => {
    if (isModified) {
      try {
        await updateIdea(idea._id.toString(), { title, description });
      } catch (error) {
        console.error('Error updating idea:', error);
        // You might want to show an error message to the user here
        return;
      }
    }
    router.back();
  };

  const handleGoBack = () => {
    if (isModified) {
      setShowConfirmModal(true);
    } else {
      router.push('/my-submissions');
    }
  };

  const handleEnhanceTitle = async () => {
    const enhancedTitle = await enhanceText('title', title, description);
    if (enhancedTitle) {
      setTitle(enhancedTitle);
    }
  };

  const handleEnhanceDescription = async () => {
    const enhancedDescription = await enhanceText(
      'description',
      title,
      description
    );
    if (enhancedDescription) {
      setDescription(enhancedDescription);
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-xl bg-white p-6 shadow-md">
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-xl font-medium text-gray-700"
        >
          Title
        </label>
        <div className="flex items-center">
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 px-4 py-2 focus:outline-none"
          />
          <div className="group relative ml-2">
            <button
              onClick={handleEnhanceTitle}
              disabled={isEnhancing}
              className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              <Sparkles size={20} />
            </button>
            <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 group-hover:block">
              <div className="whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white">
                Enhance text with AI
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-xl font-medium text-gray-700"
        >
          Description
        </label>
        <div className="flex items-start">
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              e.target.style.height = '144px'; // 6 rows initial height
              e.target.style.height = `${Math.min(Math.max(e.target.scrollHeight, 144), 216)}px`;
            }}
            rows={6}
            className="mt-1 block w-full overflow-y-auto rounded-md border-gray-300 px-4 py-2 focus:outline-none"
            style={{ minHeight: '144px', maxHeight: '216px', resize: 'none' }}
          />
          <div className="group relative ml-2">
            <button
              onClick={handleEnhanceDescription}
              disabled={isEnhancing}
              className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              <Sparkles size={20} />
            </button>
            <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 group-hover:block">
              <div className="whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white">
                Enhance text with AI
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <button
          onClick={handleGoBack}
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          Go Back
        </button>
        <button
          onClick={handleSave}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => router.push('/my-submissions')}
        message="You have unsaved changes. Are you sure you want to go back without saving?"
      />
    </div>
  );
};

export default IdeaEditForm;
