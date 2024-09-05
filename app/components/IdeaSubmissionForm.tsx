// app/components/IdeaSubmissionForm.tsx
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Idea } from '../types';

const IdeaSubmissionForm: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.post<Idea>(`${process.env.NEXT_PUBLIC_API_URL}/ideas`, {
        title: input.trim(),
        username: 'Anonymous' // You might want to change this if you have user authentication
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log("New idea submitted:", data);
      setInput('');
      // Optionally, you could emit an event or use a callback to notify parent components
      // For example: onIdeaSubmitted(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error:', err.response?.data || err.message);
        setError(`Failed to submit idea: ${err.response?.data?.message || err.message}`);
      } else {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [input]);

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
