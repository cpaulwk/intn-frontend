import React from 'react';
import { useIdeaSubmission } from '../../hooks/useIdeaSubmission';

const IdeaSubmissionForm: React.FC = () => {
  const { input, setInput, isLoading, error, isAuthenticated, handleSubmit } = useIdeaSubmission();

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Submit a product that you want to be built"
        className="p-3 pl-4 pr-12 rounded-full w-full focus:outline-none"
        disabled={isLoading || !isAuthenticated}
      />
      <button
        type="submit"
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-white rounded-full p-2 ${
          isAuthenticated && input.trim() ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={isLoading || !input.trim() || !isAuthenticated}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {!isAuthenticated && <p className="text-yellow-500 mt-2">Please log in to submit an idea.</p>}
    </form>
  );
};

export default IdeaSubmissionForm;