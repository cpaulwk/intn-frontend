import React from 'react';
import { useIdeaSubmission } from '../../hooks/useIdeaSubmission';
import { ArrowUp, Loader2 } from 'lucide-react';

const IdeaSubmissionForm: React.FC = () => {
  const { input, setInput, isLoading, error, isAuthenticated, handleSubmit } = useIdeaSubmission();

  return (
    <form onSubmit={handleSubmit} className="w-full h-full sm:px-6 lg:px-8">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Submit a product that you want to be built"
          className="w-full p-3 pl-4 pr-12 rounded-full focus:outline-none bg-[#ffffff] text-text-100 border border-[#5aa8ff]"
          disabled={isLoading || !isAuthenticated}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-bg-100 rounded-full p-2 ${
            isAuthenticated && input.trim() ? 'bg-primary-100 hover:bg-primary-200' : 'bg-bg-300 cursor-not-allowed'
          }`}
          disabled={isLoading || !input.trim() || !isAuthenticated}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ArrowUp className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && <p className="text-accent-100 mt-2 text-sm">{error}</p>}
      {!isAuthenticated && <p className="text-accent-100 mt-2 text-sm">Please log in to submit an idea.</p>}
    </form>
  );
};

export default IdeaSubmissionForm;