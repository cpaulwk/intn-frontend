import React, { useState, useEffect, useCallback, useReducer } from 'react';
import IdeaCard from './IdeaCard';
import { Types } from 'mongoose';
import { ideaReducer, initialState, IdeaAction } from '../reducers/ideaReducer';
import { useSocket } from '../hooks/useSocket';

interface Idea {
  _id: Types.ObjectId | string;
  title: string;
  description: string;
  upvotes: number;
}

const IdeaList: React.FC = () => {
  const [state, dispatch] = useReducer(ideaReducer, initialState);
  const { ideas, loading, error } = state;
  
  const socket = useSocket(process.env.NEXT_PUBLIC_API_URL as string);

  const fetchIdeas = useCallback(async () => {
    try {
      dispatch({ type: 'FETCH_IDEAS_START' });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas`);
      if (!response.ok) {
        throw new Error('Failed to fetch ideas');
      }
      const data = await response.json();
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

    const handleIdeaAdded = (newIdea: Idea) => {
      console.log('New idea received:', newIdea);
      dispatch({ type: 'ADD_IDEA', payload: newIdea });
    };

    const handleIdeaDeleted = (deletedIdeaId: string) => {
      dispatch({ type: 'DELETE_IDEA', payload: deletedIdeaId });
    };

    const handleIdeaUpdated = (updatedIdea: Idea) => {
      dispatch({ type: 'UPDATE_IDEA', payload: updatedIdea });
    };

    socket.on('ideaAdded', handleIdeaAdded);
    socket.on('ideaDeleted', handleIdeaDeleted);
    socket.on('ideaUpdated', handleIdeaUpdated);

    return () => {
      socket.off('ideaAdded', handleIdeaAdded);
      socket.off('ideaDeleted', handleIdeaDeleted);
      socket.off('ideaUpdated', handleIdeaUpdated);
    };
  }, [socket]);

  const handleUpvote = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas/${id}/upvote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to upvote idea');
      const updatedIdea = await response.json();
      dispatch({ type: 'UPDATE_IDEA', payload: updatedIdea });
    } catch (error) {
      console.error('Error upvoting idea:', error);
      // Optionally dispatch an error action here
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
            key={idea._id instanceof Types.ObjectId ? idea._id.toString() : idea._id} 
            idea={idea} 
            onUpvote={handleUpvote} 
          />
        ))}
    </div>
  );
};

export default IdeaList;
