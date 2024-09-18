import { ChevronDown } from 'lucide-react';

interface ExpandToggleProps {
  isExpanded: boolean;
  toggleExpand: () => void;
  showOnMobile?: boolean;
}

const ExpandToggle: React.FC<ExpandToggleProps> = ({
  isExpanded,
  toggleExpand,
  showOnMobile,
}) => {
  return (
    <button
      onClick={toggleExpand}
      className={`group mt-1 flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors duration-200 hover:bg-[#0085ff]/20 ${showOnMobile ? 'sm:hidden' : 'max-sm:hidden'}`}
      aria-expanded={isExpanded}
      aria-label={isExpanded ? 'Show less' : 'Show more'}
    >
      <ChevronDown
        className={`h-5 w-5 text-[#0085ff] transition-transform duration-300 group-hover:text-[#0066cc] ${
          isExpanded ? 'rotate-180' : ''
        }`}
      />
    </button>
  );
};

export default ExpandToggle;
