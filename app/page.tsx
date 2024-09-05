// app/page.tsx
"use client"

import React, { useReducer, useCallback } from 'react';
import Header from './components/Header';
import IdeaList from './components/IdeaList';
import IdeaSubmissionForm from './components/IdeaSubmissionForm';
import { ideaReducer, initialState } from './reducers/ideaReducer';
import { Idea } from './types';

export default function Home() {
  const [state, dispatch] = useReducer(ideaReducer, initialState);

  const addIdea = useCallback((newIdea: Idea) => {
    dispatch({ type: 'CREATE_IDEA', payload: newIdea });
  }, []);

  const upvoteIdea = useCallback((id: string) => {
    dispatch({ type: 'UPDATE_IDEA', payload: { _id: id, upvotes: 1 } });
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Header />
      <IdeaList ideas={state.ideas} onUpvote={upvoteIdea} />
      <IdeaSubmissionForm onSubmit={addIdea} />
    </div>
  );
}
