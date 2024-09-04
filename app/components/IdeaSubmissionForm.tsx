// app/components/IdeaSubmissionForm.tsx
import React, { useState, useCallback } from 'react';
import axios from 'axios';

interface IdeaSubmissionFormProps {
  onSubmit: (input: string) => void;
  onIdeaAdded: () => void;
}

const IdeaSubmissionForm: React.FC<IdeaSubmissionFormProps> = ({ onSubmit, onIdeaAdded }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ideas`, {
        title: input.trim(),
        username: 'Anonymous'
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      onSubmit(input);
      setInput('');
      onIdeaAdded();
    } catch (err) {
      setError('Failed to submit idea. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [input, onSubmit, onIdeaAdded]);

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Submit a product that you want to be built"
        className="border p-2 rounded w-full"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default IdeaSubmissionForm;
