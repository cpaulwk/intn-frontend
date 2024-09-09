import React, { useEffect, useCallback, useReducer } from 'react';
import IdeaCard from './IdeaCard';
import { ideaReducer, initialState } from '../reducers/ideaReducer';
import { Idea } from '../types';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setUpvotedIdeas } from '../features/auth/upvotedIdeasSlice';
import { io } from 'socket.io-client';
import { addUpvotedIdea, removeUpvotedIdea } from '../features/auth/upvotedIdeasSlice';
const IdeaList: React.FC = () => {
  const [state, dispatch] = useReducer(ideaReducer, initialState);
  const { ideas, loading, error } = state;
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const upvotedIdeas = useSelector((state: RootState) => state.upvotedIdeas.upvotedIdeas);
  const dispatchRedux = useDispatch();
  
  const socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
    withCredentials: true,
  });

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
      if (socket) {
        socket.off('ideaCreated', handleIdeaCreated);
        socket.off('ideaDeleted', handleIdeaDeleted);
        socket.off('ideaUpdated', handleIdeaUpdated);
      }
    };
  }, [socket, dispatch]);

  useEffect(() => {
    const fetchUpvotedIdeas = async () => {
      if (isAuthenticated) {
        try {
          const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/upvoted-ideas`, 
             {withCredentials: true }
          );
          dispatchRedux(setUpvotedIdeas(data));
        } catch (error) {
        }
      }
    };

    fetchUpvotedIdeas();
  }, [isAuthenticated, dispatchRedux]);

  const handleUpvote = async (ideaId: string, isUpvoted: boolean) => {
    if (!isAuthenticated) {
      console.log('User must be authenticated to upvote');
      return;
    }

    try {
      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/ideas/${ideaId}/toggle-upvote`, {}, { withCredentials: true });
      
      if (isUpvoted) {
        dispatchRedux(removeUpvotedIdea(ideaId));
      } else {
        dispatchRedux(addUpvotedIdea(ideaId));
      }

      dispatch({ type: 'UPDATE_IDEA', payload: data });
    } catch (error) {
      console.error('Error toggling upvote:', error);
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
            handleUpvote={handleUpvote}
            isAuthenticated={isAuthenticated}
            upvotedIdeas={upvotedIdeas}
          />
        ))}
    </div>
  );
};

export default IdeaList;
