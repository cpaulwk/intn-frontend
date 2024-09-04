// app/components/IdeaList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import IdeaCard from './IdeaCard';
import { Types } from 'mongoose';
import io, { Socket } from 'socket.io-client';

interface Idea {
  _id: Types.ObjectId;
  title: string;
  description: string;
  upvotes: number;
}

const IdeaList: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchIdeas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas`);
      if (!response.ok) {
        throw new Error('Failed to fetch ideas');
      }
      const data = await response.json();
      setIdeas(data);
    } catch (err) {
      setError('Error fetching ideas. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdeas();

    // Set up WebSocket connection
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL as string);
    newSocket.on('connect', () => {
      console.log('WebSocket connected');
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [fetchIdeas]);

  useEffect(() => {
    if (!socket) return;

    socket.on('newIdea', (newIdea: Idea) => {
      console.log('New idea received:', newIdea);
      setIdeas(prevIdeas => [...prevIdeas, newIdea]);
    });

    socket.on('ideaDeleted', (deletedIdeaId) => {
      setIdeas(prevIdeas => prevIdeas.filter(idea => idea._id !== deletedIdeaId));
    });

    socket.on('ideaUpdated', (updatedIdea: Idea) => {
      setIdeas(prevIdeas => prevIdeas.map(idea => 
        idea._id.toString() === updatedIdea._id.toString() ? updatedIdea : idea
      ));
      console.log('Idea updated:', updatedIdea);
      console.log('Ideas:', ideas);
    });

    return () => {
      socket.off('ideaAdded');
      socket.off('ideaDeleted');
      socket.off('ideaUpdated');
    };
  }, [socket]);

  useEffect(() => {
    console.log('Ideas state updated:', ideas);
  }, [ideas]);

  const handleUpvote = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas/${id}`);
      if (!response.ok) throw new Error('Failed to fetch idea');
      const idea = await response.json();

      const updatedIdea = { ...idea, upvotes: idea.upvotes + 1 };

      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas/${id}/upvote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedIdea),
      });
      if (!updateResponse.ok) throw new Error('Failed to update idea');

      setIdeas(prevIdeas => prevIdeas.map(i => i._id.toString() === id ? updatedIdea : i));
    } catch (error) {
      console.error('Error upvoting idea:', error);
      // Optionally set an error state here
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="idea-list">
      {ideas
        .sort((a, b) => b.upvotes - a.upvotes)
        .map((idea) => (
          <IdeaCard key={idea._id.toString()} idea={idea} onUpvote={handleUpvote} />
        ))}
    </div>
  );
};

export default IdeaList;
