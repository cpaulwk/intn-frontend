// app/hooks/useAIEnhancement.ts
import { useState } from 'react';
import axios from 'axios';

export const useAIEnhancement = () => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const enhanceText = async (
    type: 'title' | 'description',
    title: string,
    description: string
  ): Promise<string | null> => {
    setIsEnhancing(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/ideas/enhance-text`,
        { type, title, description },
        { withCredentials: true }
      );
      setIsEnhancing(false);
      return response.data.enhancedText;
    } catch (error) {
      console.error('Error enhancing text:', error);
      setIsEnhancing(false);
      return null;
    }
  };

  return { enhanceText, isEnhancing };
};
