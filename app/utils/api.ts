import axios, { AxiosError } from 'axios';
import { Idea } from '../types';
import { store } from '../store';
import { addRecentlyViewed } from '../slices/recentlyViewedSlice';

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

export const fetchIdeas = async (): Promise<Idea[]> => {
  try {
    const response = await axios.get<Idea[]>(`${API_URL}/ideas`);
    return response.data;
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

export const toggleUpvoteIdea = async (
  ideaId: string
): Promise<{ idea: Idea; isUpvoted: boolean }> => {
  try {
    const response = await axios.put<{ idea: Idea; isUpvoted: boolean }>(
      `${API_URL}/ideas/${ideaId}/toggle-upvote`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const fetchUpvotedIdeas = async (): Promise<Idea[]> => {
  try {
    const response = await axios.get<Idea[]>(`${API_URL}/ideas/upvoted`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const addViewedIdea = async (idea: Idea): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}/ideas/viewed`,
      { ideaId: idea._id },
      { withCredentials: true }
    );
    store.dispatch(addRecentlyViewed(idea));
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const fetchViewedIdeas = async (): Promise<Idea[]> => {
  try {
    const response = await axios.get<Idea[]>(`${API_URL}/ideas/viewed`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
