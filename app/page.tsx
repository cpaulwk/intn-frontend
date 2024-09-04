// app/page.tsx
"use client"

import React, { useState } from 'react';
import Header from './components/Header';
import IdeaList from './components/IdeaList';
import IdeaSubmissionForm from './components/IdeaSubmissionForm';

interface Idea {
  id: number;
  title: string;
  description: string;
  votes: number;
}

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: 1,
      title: 'Eco-Friendly Packaging Solutions',
      description: 'Offers sustainable, biodegradable packaging alternatives for businesses...',
      votes: 0,
    },
    {
      id: 2,
      title: 'Personalized Virtual Wellness Coaching',
      description: 'Create a platform that connects individuals with virtual wellness...',
      votes: 0,
    },
    {
      id: 3,
      title: 'Urban Farming Kits for Small Spaces',
      description: 'Launch a business that sells DIY urban farming kits designed for...',
      votes: 0,
    },
  ]);

  const addIdea = (input: string) => {
    const newIdea = {
      id: ideas.length + 1,
      title: input,
      description: 'A brief description of the idea.',
      votes: 0,
    };
    setIdeas([newIdea, ...ideas]);
  };

  const upvoteIdea = (id: number) => {
    setIdeas(
      ideas.map((idea) =>
        idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Header />
      <IdeaList ideas={ideas} onUpvote={upvoteIdea} />
      <IdeaSubmissionForm onSubmit={addIdea} />
    </div>
  );
}
