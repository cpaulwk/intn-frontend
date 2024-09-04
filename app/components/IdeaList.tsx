// app/components/IdeaList.tsx
import React, { useState, useEffect } from 'react';
import IdeaCard from './IdeaCard';
import { Types } from 'mongoose';

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

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas`); // Replace with your API endpoint
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
  };

  const handleUpvote = async (id: string) => {
    try {
      // Fetch the current idea
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas/${id}`);
      if (!response.ok) throw new Error('Failed to fetch idea');
      const idea = await response.json();

      // Increment upvotes
      const updatedIdea = { ...idea, upvotes: idea.upvotes + 1 };

      // Update the idea on the server
      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas/${id}/upvote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedIdea),
      });
      if (!updateResponse.ok) throw new Error('Failed to update idea');

      // Update local state
      setIdeas(ideas.map(i => i._id.toString() === id ? updatedIdea : i));
    } catch (error) {
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
