import { useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useIdeaScroll = () => {
  const ideaRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const router = useRouter();

  const registerIdeaRef = useCallback(
    (id: string, element: HTMLDivElement | null) => {
      console.log('Registering idea ref:', id, element);
      ideaRefs.current[id] = element;
    },
    []
  );

  const scrollToIdea = useCallback(
    (id: string) => {
      console.log('Scrolling to idea:', id);
      const element = ideaRefs.current[id];
      if (element) {
        const scrollContainer = element.closest('.overflow-y-auto');
        if (scrollContainer) {
          const elementRect = element.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();
          const scrollTop =
            scrollContainer.scrollTop +
            elementRect.top -
            containerRect.top -
            containerRect.height / 2 +
            elementRect.height / 2;
          scrollContainer.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }
        element.classList.add('highlight');
        setTimeout(() => {
          element.classList.remove('highlight');
          console.log('Highlight removed');
        }, 2000);
      } else {
        console.log('Element not found, redirecting...');
        router.push(`/?scrollTo=${id}`);
      }
    },
    [router]
  );

  return { registerIdeaRef, scrollToIdea };
};
