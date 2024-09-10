import axios from 'axios';
import { Idea } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchIdeas = async () => {
  const response = await axios.get<Idea[]>(`${API_URL}/ideas`);
  return response.data;
};

export const createIdea = async (title: string, username: string) => {
  const response = await axios.post<Idea>(
    `${API_URL}/ideas`,
    { title, username },
    { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
  );
  return response.data;
};

export const toggleUpvoteIdea = async (ideaId: string) => {
  const response = await axios.put<Idea>(
    `${API_URL}/ideas/${ideaId}/toggle-upvote`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const fetchUpvotedIdeas = async () => {
  const response = await axios.get<string[]>(`${API_URL}/users/upvoted-ideas`, { withCredentials: true });
  return response.data;
};