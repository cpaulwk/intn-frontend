import React, { useRef, useEffect, useState } from 'react';
import { useIdeaSubmission } from '../../hooks/useIdeaSubmission';
import { ArrowUp, Loader2 } from 'lucide-react';
import { useSidebar } from '../../hooks/useSideBar';

const IdeaSubmissionForm: React.FC = () => {
  const { input, setInput, isLoading, error, isAuthenticated, handleSubmit } =
    useIdeaSubmission();
  const { isSidebarOpen } = useSidebar();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const LINE_HEIGHT = 24;
  const MAX_ROWS = 9;
  const MAX_HEIGHT = LINE_HEIGHT * MAX_ROWS;

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(MAX_HEIGHT, textarea.scrollHeight);
      textarea.style.height = `${newHeight}px`;
      setIsExpanded(newHeight > LINE_HEIGHT);
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div>
      <div
        className={`mx-auto max-w-4xl flex-1 flex-grow flex-col px-4 pb-8 transition-all duration-300`}
      >
        <div
          className={`flex w-full items-end rounded-3xl border border-[#5aa8ff] bg-[#ffffff] p-1.5`}
        >
          <textarea
            ref={textareaRef}
            id="idea-submission-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Submit a product that you want to be built"
            className="flex-grow resize-none overflow-y-auto bg-transparent px-4 py-1 text-text-100 focus:outline-none"
            disabled={isLoading || !isAuthenticated}
            rows={1}
            style={{
              minHeight: `${LINE_HEIGHT}px`,
              maxHeight: `${MAX_HEIGHT}px`,
              lineHeight: `${LINE_HEIGHT}px`,
            }}
          />
          <button
            onClick={onSubmit}
            className={`ml-2 flex-shrink-0 rounded-full p-2 text-bg-100 ${
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
      </div>
    </div>
  );
};

export default IdeaSubmissionForm;
