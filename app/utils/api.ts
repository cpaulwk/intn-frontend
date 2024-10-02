import axios, { AxiosError } from 'axios';
import { Idea } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw new Error(
        `API error: ${axiosError.response.status} - ${axiosError.response.data}`
      );
    } else if (axiosError.request) {
      throw new Error('No response received from the server');
    } else {
      throw new Error(`Error setting up the request: ${axiosError.message}`);
    }
  } else {
    throw new Error('An unexpected error occurred');
  }
};

export const fetchAllDataAuthenticated = async (): Promise<{
  ideas: Idea[];
  recentlyViewed: Idea[];
  submittedIdeas: Idea[];
  upvotedIdeas: Idea[];
}> => {
  try {
    const response = await axios.get<{
      ideas: Idea[];
      recentlyViewed: Idea[];
      submittedIdeas: Idea[];
      upvotedIdeas: Idea[];
    }>(`${API_URL}/ideas/all-data-authenticated`, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const fetchAllDataUnauthenticated = async (): Promise<{
  ideas: Idea[];
}> => {
  try {
    const response = await axios.get<{
      ideas: Idea[];
    }>(`${API_URL}/ideas/all-data-unauthenticated`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const toggleUpvoteIdea = async (
  ideaId: string
): Promise<{ idea: Idea; isUpvoted: boolean }> => {
  try {
    const response = await axios.put<{ idea: Idea; isUpvoted: boolean }>(
      `${API_URL}/ideas/${ideaId}/toggle-upvote`,
      {},
      { withCredentials: true }
    );
    console.log('response.data: ', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const addViewedIdea = async (ideaId: string): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}/ideas/viewed`,
      { ideaId },
      { withCredentials: true }
    );
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const createIdea = async (
  title: string,
  username: string
): Promise<Idea> => {
  try {
    const response = await axios.post<Idea>(
      `${API_URL}/ideas`,
      { title, username },
      { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const removeRecentlyViewed = async (ideaId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/ideas/recently-viewed/${ideaId}`, {
      withCredentials: true,
    });
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const deleteIdea = async (ideaId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/ideas/${ideaId}`, {
      withCredentials: true,
    });
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const updateIdea = async (
  ideaId: string,
  updates: Partial<Idea>
): Promise<Idea> => {
  console.log('updates: ', updates);
  try {
    const response = await axios.put<Idea>(
      `${API_URL}/ideas/${ideaId}`,
      updates,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
