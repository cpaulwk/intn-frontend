import React, { useEffect, useCallback, useReducer } from 'react';
import IdeaCard from './IdeaCard';
import { ideaReducer, initialState } from '../reducers/ideaReducer';
import { useSocket } from '../hooks/useSocket';
import { Idea } from '../types';
import axios from 'axios';

const IdeaList: React.FC = () => {
  const [state, dispatch] = useReducer(ideaReducer, initialState);
  const { ideas, loading, error } = state;
  
  const socket = useSocket(process.env.NEXT_PUBLIC_API_URL as string);

  const fetchIdeas = useCallback(async () => {
    try {
      dispatch({ type: 'FETCH_IDEAS_START' });
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ideas`);
      dispatch({ type: 'FETCH_IDEAS_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_IDEAS_ERROR', payload: 'Error fetching ideas. Please try again later.' });
    }
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  useEffect(() => {
    if (!socket) return;

    const handleIdeaCreated = (createdIdea: Idea) => dispatch({ type: 'CREATE_IDEA', payload: createdIdea });
    const handleIdeaDeleted = (deletedIdeaId: string) => dispatch({ type: 'DELETE_IDEA', payload: deletedIdeaId });
    const handleIdeaUpdated = (updatedIdea: Idea) => dispatch({ type: 'UPDATE_IDEA', payload: updatedIdea });

    socket.on('ideaCreated', handleIdeaCreated);
    socket.on('ideaDeleted', handleIdeaDeleted);
    socket.on('ideaUpdated', handleIdeaUpdated);

    return () => {
      socket.off('ideaCreated', handleIdeaCreated);
      socket.off('ideaDeleted', handleIdeaDeleted);
      socket.off('ideaUpdated', handleIdeaUpdated);
    };
  }, [socket]);

  const handleUpvote = async (id: string) => {
    try {
      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/ideas/${id}/upvote`);
      dispatch({ type: 'UPDATE_IDEA', payload: data });
    } catch (error) {
      console.error('Error upvoting idea:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="idea-list">
      {ideas
        .sort((a, b) => b.upvotes - a.upvotes)
        .map((idea) => (
          <IdeaCard 
            key={typeof idea._id === 'string' ? idea._id : idea._id.toString()} 
            idea={idea} 
            onUpvote={handleUpvote} 
          />
        ))}
    </div>
  );
};

export default IdeaList;
