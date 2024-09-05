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
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Submit a product that you want to be built"
        className="p-3 pl-4 pr-12 rounded-full w-full focus:outline-none"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white rounded-full p-2 hover:bg-green-600 disabled:bg-gray-400"
        disabled={isLoading || !input.trim()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default IdeaSubmissionForm;
