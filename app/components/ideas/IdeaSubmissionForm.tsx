import React from 'react';
import { useIdeaSubmission } from '../../hooks/useIdeaSubmission';
import { ArrowUp, Loader2 } from 'lucide-react';
import { useSidebar } from '../../hooks/useSideBar';

const IdeaSubmissionForm: React.FC = () => {
  const { input, setInput, isLoading, error, isAuthenticated, handleSubmit } =
    useIdeaSubmission();
  const { isSidebarOpen } = useSidebar();

  return (
    <div
      className={`${isSidebarOpen ? 'px-10' : 'px-16'} flex flex-col items-center`}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-4xl">
        <div className="relative">
          <input
            id="idea-submission-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Submit a product that you want to be built"
            className="w-full rounded-full border border-[#5aa8ff] bg-[#ffffff] p-3 pl-4 pr-12 text-text-100 focus:outline-none"
            disabled={isLoading || !isAuthenticated}
          />
          <button
            type="submit"
            className={`absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full p-2 text-bg-100 ${
              isAuthenticated && input.trim()
                ? 'bg-primary-100 hover:bg-primary-200'
                : 'cursor-not-allowed bg-bg-300'
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
        {error && <p className="mt-2 text-sm text-accent-100">{error}</p>}
        {!isAuthenticated && (
          <p className="mt-2 text-sm text-accent-100">
            Please log in to submit an idea.
          </p>
        )}
      </form>
    </div>
  );
};

export default IdeaSubmissionForm;
